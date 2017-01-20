'use strict';

exports.up = (knex, Promise) => {

    return Promise.all([
        knex.schema.createTable('test1', (table) => {

            table.increments('id').primary();

        })
        .then(() => {

        }),
        knex.schema.createTable('test2', (table) => {

            table.string('col1');

        })
        .then(() => {

        })
    ]);

};

exports.down = (knex, Promise) => {

    return Promise.all([
        knex.schema.dropTable('test1'),
        knex.schema.dropTable('test2')
    ]);

};
