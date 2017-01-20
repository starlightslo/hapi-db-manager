# hapi-db-manager
This is a database manager plug-in for [HAPI](http://hapijs.com/), it can easy to manage your database with a fantastic web interface.

[![build status](https://img.shields.io/travis/starlightslo/hapi-db-manager.svg?style=flat-square)](http://travis-ci.org/starlightslo/hapi-db-manager)
[![Coverage Status](https://coveralls.io/repos/github/starlightslo/hapi-db-manager/badge.svg?branch=master)](https://coveralls.io/github/starlightslo/hapi-db-manager)
[![npm downloads](https://img.shields.io/npm/dm/hapi-db-manager.svg?style=flat-square)](https://www.npmjs.com/package/hapi-db-manager)

# Install

You can add the module to your HAPI using npm:

    $ npm install hapi-db-manager --save


You also need to install the `inert` and `vision` plugs-ins which support templates and static content serving.

    $ npm install inert vision --save


This plug-in is base on the [Knex.js](http://knexjs.org/) to developed, you also need to install the `knex` library on your project.

    $ npm install knex --save


According to [Knex.js](http://knexjs.org/), you also need to install the appropriate database library: [pg](https://www.npmjs.com/package/pg) for PostgreSQL, [mysql](https://www.npmjs.com/package/mysql) for MySQL or MariaDB, [sqlite3](https://www.npmjs.com/package/sqlite3) for SQLite3.

# Quick start

In your HAPI apps main JavaScript file add the following code to created a HAPI `server` object.

```Javascript
const Hapi = require('hapi');
const Inert = require('inert');
const Vision = require('vision');
const HapiDBManager = require('hapi-db-manager');
const Pack = require('./package');

const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});

const options = {
    managerPath: '/db',
    databaseConfigList: [{
        name: 'PG DB',
        client: 'pg',
        connection: {
            database: 'linerobot',
            user: 'linerobot',
            password: 'line1234robot'
        },
        pool: {
            min: 2,
            max: 10
        }
    },{
        name: 'SQLite DB',
        client: 'sqlite3',
        connection: {
            filename: './test.sqlite3'
        },
        useNullAsDefault: true
    }]
};

server.register([
    Inert,
    Vision,
    {
        'register': HapiDBManager,
        'options': options
    }], (err) => {
        server.start((err) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Server running at:', server.info.uri);
            }
        });
    }
);
```

# Plugin Options

* `managerPath`: (string) The route path for database manager web. - default: `/dbadmin`
* `databaseConfigList`:
  * `name`: (string) The name of database for display.
  * `client`: (string) Client adapter. [`sqlite3`, `pg`, `mysql`]
  * `connection`: (Object) Reference [Knex](http://knexjs.org/#Installation-client).
  * `pool`: (string) Reference [Knex](http://knexjs.org/#Installation-client).
  * `useNullAsDefault`: (boolean) If you are using sqlite3, please set `True`.
* `debug`: (boolean) Not supported yet.
* `auth`: () Not supported yet.
