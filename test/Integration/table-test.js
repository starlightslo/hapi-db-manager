'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();

const Helper = require('../helper.js');

// To make lab look like BDD:
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

const DBPath = './test.sqlite3';
const SQLiteDBConfig = {
    name: 'sqlite',
    client: 'sqlite3',
    connection: {
        filename: DBPath
    },
    useNullAsDefault: true
};
const PGDBConfig = {
    name: 'pg',
    client: 'pg',
    connection: {
        database: 'hapi_db_manager_testing',
        user: 'postgres',
        password: ''
    },
    pool: {
        min: 2,
        max: 10
    }
};

describe('Table', () => {

    before((done) => {

        done();
    });

    it('list empty table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/null/table' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite list all table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/table' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('pg list all table test', (done) => {

        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + PGDBConfig.name + '/table' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite create a table with non-existing database test', (done) => {

        const payload = {
            columnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/null/test1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite create a existing table test', (done) => {

        const payload = {
            columnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite create a table with special characters test', (done) => {

        const payload = {
            columnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/...', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(500);
                done();

            });

        });

    });

    it('sqlite create a table test', (done) => {

        const payload = {
            columnList: [
                { name: 'col1', type: 'integer' },
                { name: 'col2', type: 'string' },
                { name: 'col3', type: 'text' },
                { name: 'col4', type: 'bigInteger' },
                { name: 'col5', type: 'float' },
                { name: 'col6', type: 'boolean' },
                { name: 'col7', type: 'date' },
                { name: 'col8', type: 'dateTime' },
                { name: 'col9', type: 'time' },
                { name: 'col10', type: 'timestamp' }
            ]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite create a table with id column test', (done) => {

        const payload = {
            columnList: [
                { name: 'id', type: 'integer' },
                { name: 'col1', type: 'string' }
            ]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test4', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('pg create a table test', (done) => {

        const payload = {
            columnList: []
        };
        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + PGDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list all column with non-existing database test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/null/test3/column' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite list all column with non-existing table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null/column' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite list all column test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3/column' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Object);
                done();

            });

        });

    });

    it('sqlite edit the table with non-existing database test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [{
                name: 'new_col1',
                type: 'string'
            }],
            deleteColumnList: ['col1'],
            modifyColumnList: [{
                from: 'col2',
                to: 'new_col2'
            }]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/null/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite edit non-existing table test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite edit table with special characters test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/...', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite the new table name of rename is already existing test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test4', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite rename table test', (done) => {

        const payload = {
            newTableName: 'new_test4',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test4', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite add column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [{
                name: 'new_col1',
                type: 'string'
            }],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite delete column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: ['col9'],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                // There is an issue on knex and waiting for fix on sqlite: https://github.com/tgriesser/knex/issues/602
                //expect(response.statusCode).to.equal(200);
                //expect(response.result.code).to.equal(200);
                //expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite modify column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: [{
                from: 'col3',
                to: 'new_col3'
            }]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite add existing column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [{
                name: 'col5',
                type: 'string'
            }],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite delete non-existing column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: ['null'],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite modify non-existing column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: [{
                from: 'null',
                to: 'yes'
            }]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite modify the column with same name test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: [{
                from: 'col5',
                to: 'col5'
            }]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite modify the name of column to the existing name of column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: [],
            modifyColumnList: [{
                from: 'col5',
                to: 'col6'
            }]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('pg add column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [{
                name: 'col1',
                type: 'string'
            }],
            deleteColumnList: [],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + PGDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('pg delete column test', (done) => {

        const payload = {
            newTableName: 'test3',
            addColumnList: [],
            deleteColumnList: ['col1'],
            modifyColumnList: []
        };
        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + PGDBConfig.name + '/test3', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite drop a table with non-existing database test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/null/null' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite drop non-existing table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite drop the table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/test3' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite drop the table with sepcial characters test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/...' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(500);
                done();

            });

        });

    });

    it('pg drop the table test', (done) => {

        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + PGDBConfig.name + '/test3' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    after((done) => {

        // Drop another testing table
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/new_test4' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

});
