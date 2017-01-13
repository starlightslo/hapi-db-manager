'use strict'

// Handlers
const DatabaseHandler = require('./handlers/database')
const TableHandler = require('./handlers/table')
const ColumnHandler = require('./handlers/column')
const DataHandler = require('./handlers/data')

// Data model
const CreateTableModel = require('./models/CreateTableModel')
const UpdateTableModel = require('./models/UpdateTableModel')
const InsertDataModel = require('./models/InsertDataModel')
const UpdateDataModel = require('./models/UpdateDataModel')
const DeleteDataModel = require('./models/DeleteDataModel')


module.exports = (basePath) => {
    return [
        {
            method: 'GET',
            path: basePath + '/api',
            handler: (request, reply) => {
                reply('Database Manager API')
            }
        },{
            method: 'GET',
            path: basePath + '/api/database',
            config: {
                description: 'List all databases.'
            },
            handler: DatabaseHandler.listDatabases
        },{
            method: 'GET',
            path: basePath + '/api/{database}/table',
            config: {
                description: 'List all tables.'
            },
            handler: TableHandler.listTables
        },{
            method: 'POST',
            path: basePath + '/api/{database}/{table}',
            config: {
                description: 'Create new table.',
                validate: CreateTableModel.getRequestValidate(),
                response: CreateTableModel.getResponseValidate()
            },
            handler: TableHandler.createTable
        },{
            method: 'PUT',
            path: basePath + '/api/{database}/{table}',
            config: {
                description: 'Update the table.',
                validate: UpdateTableModel.getRequestValidate(),
                response: UpdateTableModel.getResponseValidate()
            },
            handler: TableHandler.updateTable
        },{
            method: 'DELETE',
            path: basePath + '/api/{database}/{table}',
            config: {
                description: 'Delete the table.'
            },
            handler: TableHandler.deleteTable
        },{
            method: 'GET',
            path: basePath + '/api/{database}/{table}/column',
            config: {
                description: 'List all columns.'
            },
            handler: ColumnHandler.listColumns
        },{
            method: 'GET',
            path: basePath + '/api/{database}/{table}/data',
            config: {
                description: 'List all data.'
            },
            handler: DataHandler.listData
        },{
            method: 'POST',
            path: basePath + '/api/{database}/{table}/data',
            config: {
                description: 'Insert data.',
                validate: InsertDataModel.getRequestValidate(),
                response: InsertDataModel.getResponseValidate()
            },
            handler: DataHandler.insertData
        },{
            method: 'PUT',
            path: basePath + '/api/{database}/{table}/data/{id}',
            config: {
                description: 'Update data.',
                validate: UpdateDataModel.getRequestValidate(),
                response: UpdateDataModel.getResponseValidate()
            },
            handler: DataHandler.updateData
        },{
            method: 'DELETE',
            path: basePath + '/api/{database}/{table}/data',
            config: {
                description: 'Delete data.',
                validate: DeleteDataModel.getRequestValidate(),
                response: DeleteDataModel.getResponseValidate()
            },
            handler: DataHandler.deleteData
        }
    ]
}