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

describe('Data', () => {

    before((done) => {

        // Create table for testing
        const payload = {
            columnList: [
                { name: 'col1', type: 'integer' },
                { name: 'col2', type: 'string' }
            ]
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig, PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);

                // Create table for pg
                server.inject({ method: 'POST', url: '/dbadmin/api/' + PGDBConfig.name + '/data_table', payload }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.code).to.equal(200);
                    expect(response2.result.data).to.be.instanceof(Array);
                    done();

                });

            });

        });

    });

    it('sqlite list all data with non-existing database test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/null/data_table/data' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite list all data with non-existing table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null/data' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite list all data test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list all data with page test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?page=1' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list all data with rows test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?rows=10' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list all data with page and rows test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?page=1&rows=10' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list all data with minus page and rows test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?page=-1&rows=-10' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list all data with non-number page and rows test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?page=aaa&rows=bbb' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite list total count with non-existing database test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/null/data_table/data/count' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite list total count with non-existing table test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null/data/count' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite list total count test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data/count' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.equal(0);
                done();

            });

        });

    });

    it('sqlite add new data with non-existing database test', (done) => {

        const payload = {
            col1: 111,
            col2: 'bbb'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/null/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite add new data with non-existing table test', (done) => {

        const payload = {
            col1: 111,
            col2: 'bbb'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite add new data with non-existing column test', (done) => {

        const payload = {
            zzz: 'aaa'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite add new data test', (done) => {

        const payload = {
            col1: 111,
            col2: 'bbb'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite add new data with page and rows test', (done) => {

        const payload = {
            col1: 111,
            col2: 'bbb'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?page=1&rows=10', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite edit data with non-existing database test', (done) => {

        const payload = {
            col1: 222,
            col2: 'yyy'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/null/data_table/data/1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite edit data with non-existing table test', (done) => {

        const payload = {
            col1: 222,
            col2: 'yyy'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null/data/1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite edit data with non-existing column test', (done) => {

        const payload = {
            zzz: 'zzz'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data/1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite edit data test', (done) => {

        const payload = {
            col1: 222,
            col2: 'yyy'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data/1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite edit data with page and rows test', (done) => {

        const payload = {
            col1: 222,
            col2: 'yyy'
        };
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data/2?page=1&rows=10', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite delete data with non-existing database test', (done) => {

        const payload = [1];
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/null/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(404);
                done();

            });

        });

    });

    it('sqlite delete data with non-existing table test', (done) => {

        const payload = [1];
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/null/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(400);
                done();

            });

        });

    });

    it('sqlite delete data test', (done) => {

        const payload = [1];
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite delete data with page and rows test', (done) => {

        const payload = [2];
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data?page=1&rows=10', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('sqlite delete data with non-exisint id test', (done) => {

        const payload = [999];
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('pg add new data with wrong data type test', (done) => {

        const payload = {
            col1: 'aaa',
            col2: 'bbb'
        };
        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + PGDBConfig.name + '/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(500);
                done();

            });

        });

    });

    it('pg add new data test', (done) => {

        const payload = {
            col1: 111,
            col2: 'bbb'
        };
        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'POST', url: '/dbadmin/api/' + PGDBConfig.name + '/data_table/data', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                done();

            });

        });

    });

    it('pg edit data with wrong data type test', (done) => {

        const payload = {
            col1: 'zzz',
            col2: 'yyy'
        };
        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'PUT', url: '/dbadmin/api/' + PGDBConfig.name + '/data_table/data/1', payload }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(500);
                done();

            });

        });

    });

    after((done) => {

        // Drop another testing table
        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig, PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'DELETE', url: '/dbadmin/api/' + SQLiteDBConfig.name + '/data_table' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.be.instanceof(Array);
                server.inject({ method: 'DELETE', url: '/dbadmin/api/' + PGDBConfig.name + '/data_table' }, (response2) => {

                    expect(response2.statusCode).to.equal(200);
                    expect(response2.result.code).to.equal(200);
                    expect(response2.result.data).to.be.instanceof(Array);
                    done();

                });

            });

        });

    });

});
