'use strict'

// Data model
const InsertDataModel = require('../models/InsertDataModel')
const UpdateDataModel = require('../models/UpdateDataModel')
const DeleteDataModel = require('../models/DeleteDataModel')


exports.listData = (request, reply) => {
    // Default value
    let rows = 30
    let page = 1

    // Get params
    const database = request.params.database
    const table = request.params.table

    // Get querys
    if (!isNaN(request.query.rows) && parseInt(request.query.rows, 10) > 0) {
        rows = request.query.rows
    }
    if (!isNaN(request.query.page) && parseInt(request.query.page, 10) > 0) {
        page = request.query.page
    }

    // Get data
    if (request.server.app.db && request.server.app.db[database]) {
        request.server.app.db[database].select().from(table).limit(rows).offset((page - 1) * rows)
        .then(datas => {
            reply({
                code: 200,
                result: 'OK',
                data: datas
            })
        })
        .catch(err => {
            reply({
                code: 500,
                result: 'Error',
                data: err
            })
        })
    }
}

exports.getTotalCount = (request, reply) => {
    // Get params
    const database = request.params.database
    const table = request.params.table

    // Get data
    if (request.server.app.db && request.server.app.db[database]) {
        request.server.app.db[database](table).count('id')
        .then(data => {
            reply({
                code: 200,
                result: 'OK',
                data: parseInt(data[0].count)
            })
        })
        .catch(err => {
            reply({
                code: 500,
                result: 'Error',
                data: err
            })
        })
    }
}

exports.insertData = (request, reply) => {
    // Data model
    const insertDataModel = new InsertDataModel(request)

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    }

    // Insert data
    if (request.server.app.db && request.server.app.db[insertDataModel.getDatabase()]) {
        // Checking table is exists or not
        request.server.app.db[insertDataModel.getDatabase()].schema.hasTable(insertDataModel.getTable())
        .then(exists => {
            // Handling
            if (!exists) {
                resp = {
                    code: 400,
                    result: insertDataModel.getTable() + ' is not exists.'
                }
                return false
            } else {
                // Get all columns information
                return request.server.app.db[insertDataModel.getDatabase()](insertDataModel.getTable()).columnInfo()
            }
        })
        .then(columns => {
            if (columns) {
                // Checking the data of column are in the table
                insertDataModel.getColumnList().forEach(column => {
                    if (!(column in columns)) {
                        resp = {
                            code: 400,
                            result: column + ' is not exists.'
                        }
                        return
                    }
                })
                if (resp.code !== 200) return false
                
                // Start to insert data
                return request.server.app.db[insertDataModel.getDatabase()](insertDataModel.getTable()).insert(insertDataModel.getData()).returning('id')
            }
        })
        .then(results => {
            // Get data if there is no error
            if (resp.code === 200) {
                return request.server.app.db[insertDataModel.getDatabase()].select().from(insertDataModel.getTable()).limit(insertDataModel.getRows()).offset((insertDataModel.getPage() - 1) * insertDataModel.getRows())
            }
        })
        .then(datas => {
            if (datas) {
                resp['data'] = datas
            }

            reply(resp)
        })
        .catch(err => {
            reply({
                code: 500,
                result: err
            })
        })
    }
}

exports.updateData = (request, reply) => {
    // Data model
    const updateDataModel = new UpdateDataModel(request)

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    }

    // Update data
    if (request.server.app.db && request.server.app.db[updateDataModel.getDatabase()]) {
        // Checking table is exists or not
        request.server.app.db[updateDataModel.getDatabase()].schema.hasTable(updateDataModel.getTable())
        .then(exists => {
            // Handling
            if (!exists) {
                resp = {
                    code: 400,
                    result: updateDataModel.getTable() + ' is not exists.'
                }
                return false
            } else {
                // Get all columns information
                return request.server.app.db[updateDataModel.getDatabase()](updateDataModel.getTable()).columnInfo()
            }
        })
        .then(columns => {
            if (columns) {
                // Checking the data of column are in the table
                updateDataModel.getColumnList().forEach(column => {
                    if (!(column in columns)) {
                        resp = {
                            code: 400,
                            result: column + ' is not exists.'
                        }
                        return
                    }
                })
                if (resp.code !== 200) return false
                
                // Start to update the data
                return request.server.app.db[updateDataModel.getDatabase()](updateDataModel.getTable()).where('id', updateDataModel.getId()).update(updateDataModel.getData()).returning('id')
            }
        })
        .then(results => {
            // Get data if there is no error
            if (resp.code === 200) {
                return request.server.app.db[updateDataModel.getDatabase()].select().from(updateDataModel.getTable()).limit(updateDataModel.getRows()).offset((updateDataModel.getPage() - 1) * updateDataModel.getRows())
            }
        })
        .then(datas => {
            if (datas) {
                resp['data'] = datas
            }

            reply(resp)
        })
        .catch(err => {
            reply({
                code: 500,
                result: err
            })
        })
    }
}

exports.deleteData = (request, reply) => {
    // Data model
    const deleteDataModel = new DeleteDataModel(request)

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    }

    // Delete data
    if (request.server.app.db && request.server.app.db[deleteDataModel.getDatabase()]) {
        // Checking table is exists or not
        request.server.app.db[deleteDataModel.getDatabase()].schema.hasTable(deleteDataModel.getTable())
        .then(exists => {
            // Handling
            if (!exists) {
                resp = {
                    code: 400,
                    result: deleteDataModel.getTable() + ' is not exists.'
                }
                return false
            } else {
                // Delete data
                return request.server.app.db[deleteDataModel.getDatabase()](deleteDataModel.getTable()).whereIn('id', deleteDataModel.getDeleteIdList()).del()
            }
        })
        .then(results => {
            // Get data if there is no error
            if (resp.code === 200) {
                return request.server.app.db[deleteDataModel.getDatabase()].select().from(deleteDataModel.getTable()).limit(deleteDataModel.getRows()).offset((deleteDataModel.getPage() - 1) * deleteDataModel.getRows())
            }
        })
        .then(datas => {
            if (datas) {
                resp['data'] = datas
            }

            reply(resp)
        })
        .catch(err => {
            reply({
                code: 500,
                result: err
            })
        })
    }
}