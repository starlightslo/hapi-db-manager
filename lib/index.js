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

        // add db manager api routes
        serverWithDependencies.route(routes(settings.managerPath))

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