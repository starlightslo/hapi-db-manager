'use strict'

// Data model
const CreateTableModel = require('../models/CreateTableModel')
const UpdateTableModel = require('../models/UpdateTableModel')

// Enums
const ColumnType = require('../enums/ColumnType')


exports.listTables = (request, reply) => {
    // Get params
    const database = request.params.database

    // Get table list
    let tableList = []
    if (request.server.app.db && request.server.app.db[database]) {
        request.server.app.db[database].select().from('information_schema.tables')
        .where('table_schema', 'public')
        .then(results => {
            // Get table name
            results.forEach(result => {
                tableList.push(result.table_name)
            })

            reply({
                code: 200,
                result: 'OK',
                data: tableList
            })
        })
    }
}

exports.createTable = (request, reply) => {
    // Data model
    const createTableModel = new CreateTableModel(request)

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    }

    // Checking table is exists or not
    if (request.server.app.db && request.server.app.db[createTableModel.getDatabase()]) {
        request.server.app.db[createTableModel.getDatabase()].schema.hasTable(createTableModel.getTable())
        .then(exists => {
            // Handling
            if (exists) {
                resp = {
                    code: 400,
                    result: createTableModel.getTable() + ' is already exists.'
                }
                return
            } else {
                // Start to create table
                return request.server.app.db[createTableModel.getDatabase()].schema.createTable(createTableModel.getTable(), (table) => {
                    // Default add increments
                    table.increments()

                    // Handling create columns
                    createTableModel.getColumnList().forEach(column => {
                        createColumn(table, column.name, column.type)
                    })
                })
            }
        })
        .then(result => {
            if (result) {
                // List all tables
                return request.server.app.db[createTableModel.getDatabase()].select().from('information_schema.tables').where('table_schema', 'public')
            } else {
                return
            }
        })
        .then(results => {
            if (results) {
                // Get table name
                let tableList = []
                results.forEach(result => {
                    tableList.push(result.table_name)
                })
                resp['data'] = tableList
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

exports.updateTable = (request, reply) => {
    // Data model
    const updateTableModel = new UpdateTableModel(request)

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    }

    // Update table
    if (request.server.app.db && request.server.app.db[updateTableModel.getDatabase()]) {
        // Checking table is exists or not
        request.server.app.db[updateTableModel.getDatabase()].schema.hasTable(updateTableModel.getTable())
        .then(exists => {
            // Handling
            if (!exists) {
                resp = {
                    code: 400,
                    result: updateTableModel.getTable() + ' is not exists.'
                }
                return false
            } else {
                // Get all columns information
                return request.server.app.db[updateTableModel.getDatabase()](updateTableModel.getNewTableName()).columnInfo()
            }
        })
        .then(columns => {
            if (columns) {
                // Checking not in the addColumnList
                updateTableModel.getAddColumnList().forEach(column => {
                    if (column.name in columns) {
                        resp = {
                            code: 400,
                            result: column.name + ' is exists.'
                        }
                        return
                    }
                })
                if (resp.code !== 200) return false

                // Checking the column is in the deleteColumnList
                updateTableModel.getDeleteColumnList().forEach(column => {
                    if (!(column in columns)) {
                        resp = {
                            code: 400,
                            result: column + ' is not exists.'
                        }
                        return
                    }
                })
                if (resp.code !== 200) return false

                // Checking the column is in the modifyColumnList
                updateTableModel.getModifyColumnList().forEach(column => {
                    if (!(column.from in columns)) {
                        resp = {
                            code: 400,
                            result: column.from + ' is not exists.'
                        }
                        return
                    }
                    if (column.to in columns) {
                        resp = {
                            code: 400,
                            result: column.to + ' is exists.'
                        }
                        return
                    }
                })
                if (resp.code !== 200) return false
                
                // Start to rename table
                if (updateTableModel.getTable() !== updateTableModel.getNewTableName()) {
                    return request.server.app.db[updateTableModel.getDatabase()].schema.renameTable(updateTableModel.getTable(), updateTableModel.getNewTableName())
                } else {
                    return true
                }
            }
        })
        .then(results => {
            if (results) {
                // Update columns
                return request.server.app.db[updateTableModel.getDatabase()].schema.table(updateTableModel.getNewTableName(), table => {
                    // Create new columns
                    updateTableModel.getAddColumnList().forEach(column => {
                        createColumn(table, column.name, column.type)
                    })

                    // Delete columns
                    if (updateTableModel.getDeleteColumnList().length > 0) {
                        table.dropColumns(updateTableModel.getDeleteColumnList())
                    }
                    
                    // Rename columns
                    updateTableModel.getModifyColumnList().forEach(column => {
                        renameColumn(table, column.from, column.to)
                    })
                })
            }
        })
        .then(result => {
            if (result) {
                // List all tables
                return request.server.app.db[updateTableModel.getDatabase()].select().from('information_schema.tables').where('table_schema', 'public')
            }
        })
        .then(results => {
            if (results) {
                // Get table name
                let tableList = []
                results.forEach(result => {
                    tableList.push(result.table_name)
                })
                resp['data'] = tableList
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

exports.dropTable = (request, reply) => {
    // Get params
    const database = request.params.database
    const table = request.params.table

    // Drop table
    if (request.server.app.db && request.server.app.db[database]) {
        request.server.app.db[database].schema.dropTableIfExists(table)
        .then(result => {
            // List all tables
            return request.server.app.db[database].select().from('information_schema.tables').where('table_schema', 'public')
        })
        .then(results => {
            // Get table name
            let tableList = []
            results.forEach(result => {
                tableList.push(result.table_name)
            })

            reply({
                code: 200,
                result: 'OK',
                data: tableList
            })
        })
        .catch(err => {
            reply({
                code: 500,
                result: err
            })
        })
    }
}


const createColumn = ((table, columnName, columnType) => {
    switch(columnType) {
        case ColumnType.Integer:
            table.integer(columnName)
            break
        case ColumnType.String:
            table.string(columnName)
            break
        case ColumnType.Increments:
            table.increments(columnName)
            break
        case ColumnType.Text:
            table.text(columnName)
            break
        case ColumnType.BigInteger:
            table.bigInteger(columnName)
            break
        case ColumnType.Float:
            table.float(columnName)
            break
        case ColumnType.Boolean:
            table.boolean(columnName)
            break
        case ColumnType.Date:
            table.date(columnName)
            break
        case ColumnType.DateTime:
            table.dateTime(columnName)
            break
        case ColumnType.Time:
            table.time(columnName)
            break
        case ColumnType.Timestamp:
            table.timestamp(columnName)
            break
        default:
    }
})


const renameColumn = ((table, columnName, newColumnName) => {
    table.renameColumn(columnName, newColumnName)
})