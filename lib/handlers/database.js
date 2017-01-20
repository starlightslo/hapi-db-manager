'use strict';

exports.listDatabases = (request, reply) => {

    // Get database list
    let databaseList = [];
    databaseList = Object.keys(request.server.app.db);

    reply({
        code: 200,
        result: 'OK',
        data: databaseList
    });

};
