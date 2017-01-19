'use strict'

exports.listColumns = (request, reply) => {
    // Get params
    const database = request.params.database
    const table = request.params.table

    // Get column list
    if (request.server.app.db && request.server.app.db[database]) {
        request.server.app.db[database](table).columnInfo()
        .then(info => {
            reply({
                code: 200,
                result: 'OK',
                data: info
            })
        })
        .catch(err => {
            reply({
                code: 500,
                result: err.message
            })
        })
    }
}