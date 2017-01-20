'use strict';

// Modules
const Joi = require('joi');


module.exports = class UpdateDataModel {

    constructor(request) {

        // Default value
        this.rows = 30;
        this.page = 1;

        // Params
        this.database = request.params.database;
        this.table = request.params.table;
        this.id = request.params.id;

        // Get querys
        if (!isNaN(request.query.rows) && parseInt(request.query.rows, 10) > 0) {
            this.rows = request.query.rows;
        }
        if (!isNaN(request.query.page) && parseInt(request.query.page, 10) > 0) {
            this.page = request.query.page;
        }

        // Payload
        this.columnList = Object.keys(request.payload);
        this.data = request.payload;

    }

    static getRequestValidate() {

        return {
            params: {
                database: Joi.string().required(),
                table: Joi.string().required(),
                id: Joi.number().required()
            },
            payload: Joi.object().required()
        };

    }

    static getResponseValidate() {

        return {
            status: {
                200: Joi.object({
                    code: Joi.number().default(200).allow([200, 400]).required(),
                    result: Joi.string().default('OK').required(),
                    data: Joi.array().items(Joi.object()).optional()
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

    getColumnList() {

        return this.columnList;

    }

    getData() {

        return this.data;

    }

    getRows() {

        return this.rows;

    }

    getPage() {

        return this.page;

    }

    getId() {

        return this.id;

    }

};
