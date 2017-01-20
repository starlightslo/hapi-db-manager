'use strict';

exports.listColumns = (request, reply) => {

    // Get params
    const database = request.params.database;
    const table = request.params.table;

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    };

    // Get column list
    if (request.server.app.db[database]) {
        // Checking table is exists or not
        request.server.app.db[database].schema.hasTable(table)
        .then((exists) => {

            // Handling
            if (!exists) {
                resp = {
                    code: 400,
                    result: table + ' is not exists.'
                };
                return false;
            }

            // Get all columns information
            return request.server.app.db[database](table).columnInfo();

        })
        .then((info) => {

            if (info) {
                resp.data = info;
            }
            reply(resp);

        });
    }
    else {
        reply({
            code: 404,
            result: 'Not found database'
        });
    }

};
