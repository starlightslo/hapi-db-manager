'use strict';

const Code = require('code');
const Lab = require('lab');
const lab = exports.lab = Lab.script();
const Vision = require('vision');
const Inert = require('inert');

const Hapi = require('hapi');
const Helper = require('../helper.js');
const HapiDBManager = require('../../lib/index.js');

// To make lab look like BDD:
const describe = lab.describe;
const it = lab.it;
const before = lab.before;
const after = lab.after;
const expect = Code.expect;

describe('Plugin', () => {

    before((done) => {

        done();

    });

    it('plug-in register no vision dependency', (done) => {

        try {
            const server = new Hapi.Server();
            server.connection();
            server.register([
                Inert,
                HapiDBManager
            ], (err) => {

                expect(err).to.equal(undefined);
                server.start((err) => {

                    expect(err).to.exist();
                    done();

                });

            });

        }
        catch (err) {
            expect(err.message).to.equal('Missing vision plug-in registation');
            done();
        }

    });

    it('plug-in register no inert dependency', (done) => {

        try {
            const server = new Hapi.Server();
            server.connection();
            server.register([
                Vision,
                HapiDBManager
            ], (err) => {

                expect(err).to.equal(undefined);
                server.start((err) => {

                    expect(err).to.exist();
                    done();

                });

            });

        }
        catch (err) {

            expect(err.message).to.equal('Missing inert plug-in registation');
            done();

        }

    });

    it('plug-in register no options', (done) => {

        const server = new Hapi.Server();
        server.connection();
        server.register([
            Inert,
            Vision,
            HapiDBManager
        ], (err) => {

            expect(err).to.equal(undefined);
            server.start((err) => {

                expect(err).to.equal(undefined);
                done();

            });

        });

    });

    it('default manager path test', (done) => {

        Helper.createServer({}, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/dbadmin/api' }, (response) => {

                expect(response.statusCode).to.equal(200);
                expect(response.result).to.equal('Database Manager API');
                done();

            });

        });

    });

    it('db manager path test', (done) => {

        Helper.createServer({
            managerPath: '/db'
        }, (err, server) => {

            expect(err).to.equal(null);
            server.inject({ method: 'GET', url: '/db' }, (response) => {

                expect(response.statusCode).to.equal(200);
                done();

            });

        });

    });

    after((done) => {

        done();

    });

});
