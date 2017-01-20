'use strict';

// Update with your config settings.
module.exports = {

    development: {
        client: 'sqlite3',
        connection: {
            filename: './test.sqlite3'
        },
        useNullAsDefault: true
    },
    staging: {
        client: 'pg',
        connection: {
            database: 'hapi_db_manager_testing',
            user: 'postgres',
            password: ''
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: 'knex_migrations'
        }
    }
};
