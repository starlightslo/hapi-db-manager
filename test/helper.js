'use strict';

const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiDBManager = require('../lib/index.js');

const helper = module.exports = {};

/**
 * creates a Hapi server
 *
 * @param  {Object} dbManagerOptions
 * @param  {Function} callback
 **/
helper.createServer = function (dbManagerOptions, callback) {

    const server = new Hapi.Server();
    server.connection({});
    server.register([
        Inert,
        Vision,
        {
            register: HapiDBManager,
            options: dbManagerOptions
        }
    ], (err) => {

        if (err) {
            return callback(err, null);
        }

        server.start((err) => {

            if (err) {
                callback(err, null);
            }
            else {
                callback(null, server);
            }

        });

    });

};
