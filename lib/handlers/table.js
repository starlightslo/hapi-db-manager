'use strict';

// Data model
const CreateTableModel = require('../models/CreateTableModel');
const UpdateTableModel = require('../models/UpdateTableModel');

// Enums
const ColumnType = require('../enums/ColumnType');

// Ignore system tables
const SystemTableList = ['sqlite_sequence', 'knex_migrations_lock'];

// Defines
const SQLITE3 = 'sqlite3';


exports.listTables = (request, reply) => {

    // Get params
    const database = request.params.database;

    // Get table list
    const tableList = [];
    if (request.server.app.db[database]) {

        // Prepare the table, column, and value parameters
        let _table = 'information_schema.tables';
        let _column = 'table_schema';
        let _value = 'public';
        if (request.server.app.db[database].client.config.client === SQLITE3) {
            // Change the value for sqlite3
            _table = 'sqlite_master';
            _column = 'type';
            _value = 'table';
        }

        // List all tables
        request.server.app.db[database].select().from(_table).where(_column, _value)
        .then((results) => {

            results.forEach((result) => {

                // handling the result of sqlite3
                let tableName = result.table_name;
                if (!tableName) {
                    tableName = result.name;
                }

                // Ignore system tables
                if (SystemTableList.indexOf(tableName) < 0) {
                    // Push to table list
                    tableList.push(tableName);
                }

            });

            reply({
                code: 200,
                result: 'OK',
                data: tableList
            });

        });
    }
    else {
        reply({
            code: 404,
            result: 'Not found database'
        });
    }
};

exports.createTable = (request, reply) => {

    // Data model
    const createTableModel = new CreateTableModel(request);

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    };

    // Checking table is exists or not
    if (request.server.app.db[createTableModel.getDatabase()]) {
        request.server.app.db[createTableModel.getDatabase()].schema.hasTable(createTableModel.getTable())
        .then((exists) => {
            // Handling
            if (exists) {
                resp = {
                    code: 400,
                    result: createTableModel.getTable() + ' is already exists.'
                };
                return;
            }

            // Start to create table
            return request.server.app.db[createTableModel.getDatabase()].schema.createTable(createTableModel.getTable(), (table) => {

                // Default add increments
                table.increments('id');

                // Handling create columns
                createTableModel.getColumnList().forEach((column) => {

                    // Ignore the `id` column
                    if (column.name !== 'id') {
                        createColumn(table, column.name, column.type);
                    }

                });

            });

        })
        .then((result) => {

            if (result) {
                // Prepare the table, column, and value parameters
                let _table = 'information_schema.tables';
                let _column = 'table_schema';
                let _value = 'public';
                if (request.server.app.db[createTableModel.getDatabase()].client.config.client === SQLITE3) {
                    // Change the value for sqlite3
                    _table = 'sqlite_master';
                    _column = 'type';
                    _value = 'table';
                }

                // List all tables
                return request.server.app.db[createTableModel.getDatabase()].select().from(_table).where(_column, _value);
            }
            return;

        })
        .then((results) => {

            if (results) {
                const tableList = [];
                results.forEach((result) => {

                    // handling the result of sqlite3
                    let tableName = result.table_name;
                    if (!tableName) {
                        tableName = result.name;
                    }

                    // Ignore system tables
                    if (SystemTableList.indexOf(tableName) < 0) {
                        // Push to table list
                        tableList.push(tableName);
                    }

                });
                resp.data = tableList;
            }

            reply(resp);

        })
        .catch((err) => {

            reply({
                code: 500,
                result: err.message
            });

        });

    }
    else {
        reply({
            code: 404,
            result: 'Not found database'
        });
    }

};

exports.updateTable = (request, reply) => {

    // Data model
    const updateTableModel = new UpdateTableModel(request);

    // Set default response
    let resp = {
        code: 200,
        result: 'OK'
    };

    // Update table
    if (request.server.app.db[updateTableModel.getDatabase()]) {
        // Checking table is exists or not
        request.server.app.db[updateTableModel.getDatabase()].schema.hasTable(updateTableModel.getTable())
        .then((exists) => {

            // Handling
            if (!exists) {
                resp = {
                    code: 400,
                    result: updateTableModel.getTable() + ' is not exists.'
                };
            }

            // Checking should rename table or not
            if (updateTableModel.getTable() !== updateTableModel.getNewTableName()) {
                // Checking the new table is existing or Not
                return request.server.app.db[updateTableModel.getDatabase()].schema.hasTable(updateTableModel.getNewTableName());
            }
            return false;

        })
        .then((exists) => {

            if (resp.code === 200) {
                // Handling
                if (exists) {
                    resp = {
                        code: 400,
                        result: updateTableModel.getNewTableName() + ' is already existing.'
                    };
                    return false;
                }

                // Get all columns information
                return request.server.app.db[updateTableModel.getDatabase()](updateTableModel.getTable()).columnInfo();
            }

        })
        .then((columns) => {

            if (columns) {
                // Checking not in the addColumnList
                updateTableModel.getAddColumnList().forEach((column) => {

                    if (column.name in columns) {
                        resp = {
                            code: 400,
                            result: column.name + ' is exists.'
                        };
                        return;
                    }

                });
                if (resp.code !== 200) {
                    return false;
                }

                // Checking the column is in the deleteColumnList
                updateTableModel.getDeleteColumnList().forEach((column) => {

                    if (!(column in columns)) {
                        resp = {
                            code: 400,
                            result: column + ' is not exists.'
                        };
                        return;
                    }

                });
                if (resp.code !== 200) {
                    return false;
                }

                // Checking the column is in the modifyColumnList
                updateTableModel.getModifyColumnList().forEach((column) => {

                    if (!(column.from in columns)) {
                        resp = {
                            code: 400,
                            result: column.from + ' is not exists.'
                        };
                        return;
                    }
                    if (column.to in columns) {
                        resp = {
                            code: 400,
                            result: column.to + ' is exists.'
                        };
                        return;
                    }

                });
                if (resp.code !== 200) {
                    return false;
                }

                // Start to rename table
                if (updateTableModel.getTable() !== updateTableModel.getNewTableName()) {
                    return request.server.app.db[updateTableModel.getDatabase()].schema.renameTable(updateTableModel.getTable(), updateTableModel.getNewTableName());
                }
                return true;

            }

        })
        .then((results) => {

            if (results) {
                // Update columns
                return request.server.app.db[updateTableModel.getDatabase()].schema.table(updateTableModel.getNewTableName(), (table) => {

                    // Create new columns
                    updateTableModel.getAddColumnList().forEach((column) => {

                        createColumn(table, column.name, column.type);

                    });

                    // Delete columns
                    if (updateTableModel.getDeleteColumnList().length > 0) {
                        table.dropColumns(updateTableModel.getDeleteColumnList());
                    }

                    // Rename columns
                    updateTableModel.getModifyColumnList().forEach((column) => {

                        renameColumn(table, column.from, column.to);

                    });

                });
            }

        })
        .then((result) => {

            if (result) {
                // Prepare the table, column, and value parameters
                let _table = 'information_schema.tables';
                let _column = 'table_schema';
                let _value = 'public';
                if (request.server.app.db[updateTableModel.getDatabase()].client.config.client === SQLITE3) {
                    // Change the value for sqlite3
                    _table = 'sqlite_master';
                    _column = 'type';
                    _value = 'table';
                }

                // List all tables
                return request.server.app.db[updateTableModel.getDatabase()].select().from(_table).where(_column, _value);
            }

        })
        .then((results) => {

            if (results) {
                const tableList = [];
                results.forEach((result) => {
                    // handling the result of sqlite3
                    let tableName = result.table_name;
                    if (!tableName) {
                        tableName = result.name;
                    }

                    // Ignore system tables
                    if (SystemTableList.indexOf(tableName) < 0) {
                        // Push to table list
                        tableList.push(tableName);
                    }
                });
                resp.data = tableList;
            }

            reply(resp);

        })
        .catch((err) => {

            reply({
                code: 500,
                result: err.message
            });

        });

    }
    else {
        reply({
            code: 404,
            result: 'Not found database'
        });
    }

};

exports.dropTable = (request, reply) => {

    // Get params
    const database = request.params.database;
    const table = request.params.table;

    // Drop table
    if (request.server.app.db[database]) {
        request.server.app.db[database].schema.dropTableIfExists(table)
        .then((result) => {

            // Prepare the table, column, and value parameters
            let _table = 'information_schema.tables';
            let _column = 'table_schema';
            let _value = 'public';
            if (request.server.app.db[database].client.config.client === SQLITE3) {
                // Change the value for sqlite3
                _table = 'sqlite_master';
                _column = 'type';
                _value = 'table';
            }

            // List all tables
            return request.server.app.db[database].select().from(_table).where(_column, _value);

        })
        .then((results) => {

            // Get table name
            const tableList = [];
            results.forEach((result) => {

                // handling the result of sqlite3
                let tableName = result.table_name;
                if (!tableName) {
                    tableName = result.name;
                }

                // Ignore system tables
                if (SystemTableList.indexOf(tableName) < 0) {
                    // Push to table list
                    tableList.push(tableName);
                }

            });

            reply({
                code: 200,
                result: 'OK',
                data: tableList
            });

        })
        .catch((err) => {

            reply({
                code: 500,
                result: err.message
            });

        });

    }
    else {
        reply({
            code: 404,
            result: 'Not found database'
        });
    }

};


const createColumn = ((table, columnName, columnType) => {

    switch (columnType) {
        case ColumnType.Integer:;
            table.integer(columnName);
            break;
        case ColumnType.String:
            table.string(columnName);
            break;
        case ColumnType.Text:
            table.text(columnName);
            break;
        case ColumnType.BigInteger:
            table.bigInteger(columnName);
            break;
        case ColumnType.Float:
            table.float(columnName);
            break;
        case ColumnType.Boolean:
            table.boolean(columnName);
            break;
        case ColumnType.Date:
            table.date(columnName);
            break;
        case ColumnType.DateTime:
            table.dateTime(columnName);
            break;
        case ColumnType.Time:
            table.time(columnName);
            break;
        case ColumnType.Timestamp:
            table.timestamp(columnName);
            break;
        default:
    }

});

const renameColumn = ((table, columnName, newColumnName) => {

    table.renameColumn(columnName, newColumnName);

});
