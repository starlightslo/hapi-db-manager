'use strict';

// Modules
const Joi = require('joi');

// Eunums
const ColumnType = require('../enums/ColumnType');


module.exports = class UpdateTableModel {

    constructor(request) {
        // Params
        this.database = request.params.database;
        this.table = request.params.table;

        // Payload
        this.newTableName = request.payload.newTableName;
        this.addColumnList = request.payload.addColumnList;
        this.deleteColumnList = request.payload.deleteColumnList;
        this.modifyColumnList = request.payload.modifyColumnList;
    }

    static getRequestValidate() {

        return {
            params: {
                database: Joi.string().required(),
                table: Joi.string().required()
            },
            payload: Joi.object({
                newTableName: Joi.string().required(),
                addColumnList: Joi.array().items(Joi.object({
                    name: Joi.string().required(),
                    type: Joi.string().valid(ColumnType.All).required()
                })).optional(),
                deleteColumnList: Joi.array().items(Joi.string()).optional(),
                modifyColumnList: Joi.array().items(Joi.object({
                    from: Joi.string().required(),
                    to: Joi.string().required()
                })).optional()
            }).required()
        };

    }

    static getResponseValidate() {

        return {
            status: {
                200: Joi.object({
                    code: Joi.number().default(200).allow([200, 400]).required(),
                    result: Joi.string().default('OK').required(),
                    data: Joi.array().optional()
                }),
                400: Joi.string(),
                500: Joi.string()
            }
        };

    }

    getDatabase() {

        return this.database;

    }

    getTable() {

        return this.table;

    }

    getNewTableName() {

        return this.newTableName;

    }

    getAddColumnList() {

        return this.addColumnList;

    }

    getDeleteColumnList() {

        return this.deleteColumnList;

    }

    getModifyColumnList() {

        return this.modifyColumnList;

    }

};
