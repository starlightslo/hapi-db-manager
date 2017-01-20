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

describe('Database', () => {

    before((done) => {

        done();

    });

    it('sqlite database test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.equal('Database Manager API');
                done();

            });

        });

    });

    it('pg database test', (done) => {

        Helper.createServer({
            databaseConfigList: [PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.equal('Database Manager API');
                done();

            });

        });

    });

    it('list empty database test', (done) => {

        Helper.createServer({
            databaseConfigList: []
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/database' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.equal([]);
                done();

            });

        });

    });

    it('list all database test', (done) => {

        Helper.createServer({
            databaseConfigList: [SQLiteDBConfig, PGDBConfig]
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api/database' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result.code).to.equal(200);
                expect(response.result.data).to.equal([SQLiteDBConfig.name, PGDBConfig.name]);
                done();

            });

        });

    });

    after((done) => {

        done();

    });

});
