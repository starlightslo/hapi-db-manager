'use strict'

const Hoek = require('hoek')
const Joi = require('joi')
const Path = require('path')

const Pack = require('../package.json')
const Defaults = require('../lib/defaults')


// schema for plug-in properties
const schema = Joi.object({
    debug: Joi.boolean(),
    managerPath: Joi.string(),
    auth: Joi.alternatives().try(Joi.boolean(), Joi.string(), Joi.object()),
}).unknown()


/**
 * register the plug-in with the Hapi framework
 *
 * @param  {Object} plugin
 * @param  {Object} options
 * @param  {Function} next
 */
exports.register = function (plugin, options, next) {
    let settings = Hoek.applyToDefaults(Defaults, options, true)
    const publicDirPath = Path.resolve(__dirname, '..', 'public')
    const managerDirPath = Path.join(publicDirPath, 'managerui')

    
    // make sure we have other plug-in dependencies
    plugin.dependency(['inert', 'vision'], (pluginWithDependencies, nextWithDependencies) => {

        // add routing for db manager static assets /managerui/
        pluginWithDependencies.views({
            engines: {
                html: require('ejs')
            },
            path: managerDirPath
        })

        // add db manager page
        pluginWithDependencies.route([{
            method: 'GET',
            path: settings.managerPath,
            config: {
                auth: settings.auth
            },
            handler: (request, reply) => {
                reply.view('index.html', {})
            }
        }])

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