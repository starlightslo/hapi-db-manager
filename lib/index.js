'use strict'

const Hoek = require('hoek')
const Joi = require('joi')
const Path = require('path')

const Pack = require('../package.json')
const Defaults = require('../lib/defaults')

const routes = require('./routes')

// schema for plug-in properties
const schema = Joi.object({
    debug: Joi.boolean(),
    managerPath: Joi.string(),
    auth: Joi.alternatives().try(Joi.boolean(), Joi.string(), Joi.object()),
    databaseConfigList: Joi.array().items(Joi.object({
        name: Joi.string().required(),
        client: Joi.string().valid('sqlite3', 'pg', 'mysql').required(),
        connection: Joi.object({
            database: Joi.string().required(),
            user: Joi.string().required(),
            password: Joi.string().required()
        })
    }))
}).unknown()


/**
 * register the plug-in with the Hapi framework
 *
 * @param  {Object} server
 * @param  {Object} options
 * @param  {Function} next
 */
exports.register = function (server, options, next) {
    let settings = Hoek.applyToDefaults(Defaults, options, true)
    const publicDirPath = Path.resolve(__dirname, '..', 'public')
    const managerDirPath = Path.join(publicDirPath, 'managerui')

    // Setup the database connection with knex (http://knexjs.org/).
    server.app.db = {}
    settings.databaseConfigList.forEach(databaseConfig => {
        server.app.db[databaseConfig.name] = require('knex')({
            client: databaseConfig.client,
            connection: databaseConfig.connection,
            pool: databaseConfig.pool
        })
    })

    // Checking is the table with the `id` column
    Object.keys(server.app.db).forEach(name => {
        checkingIdColumn(server.app.db, name)
    })
    
    // make sure we have other plug-in dependencies
    server.dependency(['inert', 'vision'], (serverWithDependencies, nextWithDependencies) => {

        // add routing for db manager static assets /managerui/
        serverWithDependencies.views({
            engines: {
                html: require('ejs')
            },
            path: managerDirPath
        })

        // add db manager page
        serverWithDependencies.route([{
            method: 'GET',
            path: settings.managerPath,
            config: {
                auth: settings.auth
            },
            handler: (request, reply) => {
                reply.view('index.html', {})
            }
        }])

        // add manager ui
        serverWithDependencies.route([{
            method: 'GET',
            path: settings.managerPath + '/{param*}',
            config: {
                auth: settings.auth
            },
            handler: {
                directory: {
                    path: managerDirPath + Path.sep,
                    index: false
                }
            }
        }])

        // add db manager api routes
        serverWithDependencies.route(routes(settings.managerPath))

        appendDataContext(serverWithDependencies, settings);

        nextWithDependencies()

    })

    next()
}


/**
 * attributes for plug-in uses 'name' and 'version' from package.json files
 */
exports.register.attributes = {
    name: Pack.name,
    version: Pack.version,
    once: true,
    multiple: false
}


/**
 * appends settings data in template context
 *
 * @param  {Object} server
 * @param  {Object} settings
 * @return {Object}
 */
const appendDataContext = (server, settings) => {
    server.ext('onPostHandler', (request, reply) => {
        let response = request.response

        // if the reply is a view add settings data into template system
        if (response.variety === 'view') {
            const prefixedSettings = Hoek.clone(settings)
            response.source.context.dbManager = prefixedSettings
        }
        
        return reply.continue()
    })
}

/**
 * List all tables for checking is that with `id` column or not.
 * This function will auto create `id` column if the `id` column is not existing in the table.
 *
 * @param  {Object} db
 * @param  {String} name
 * @return
 */
const checkingIdColumn = (db, name) => {
    let tableList = []

    // List all tables
    db[name].select().from('information_schema.tables').where('table_schema', 'public')
    .then(results => {
        if (results) {
            // Get table name
            let promiseList = []
            results.forEach(result => {
                tableList.push(result.table_name)
                promiseList.push(db[name].schema.hasColumn(result.table_name, 'id'))
            })

            // Checking the `id` column is existing
            return Promise.all(promiseList)
        }
    })
    .then(results => {
        if (results) {
            let promiseList = []
            for (let i = 0 ; i < results.length ; i++) {
                // Auto create `id` column if not existing
                if (results[i] === false) {
                    promiseList.push(db[name].schema.table(tableList[i], (table) => {
                        table.increments('id')
                    }))
                    console.log('Creating `id` column for ' + tableList[i] + ' table.')
                }
            }
            return Promise.all(promiseList)
        }
    })
    .then(results => {
        
    })
    .catch(err => {
        console.error(err)
    })
}