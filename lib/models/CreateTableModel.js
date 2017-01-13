'use strict'

// Modules
const Joi = require('Joi')

// Eunums
const ColumnType = require('../enums/ColumnType')


module.exports = class CreateTableModel {

    constructor(request) {
        // Params
        this.database = request.params.database
        this.table = request.params.table

        // Payload
        this.columnList = request.payload.columnList
    }

    static getRequestValidate() {
        return {
            params: {
                database: Joi.string().required(),
                table: Joi.string().required()
            },
			payload: Joi.object({
				columnList: Joi.array().items(Joi.object({
                    name: Joi.string().required(),
                    type: Joi.string().valid(ColumnType.All).required()
                })).optional()
			}).required()
		}
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
		}
    }

    getDatabase() {
        return this.database
    }

    getTable() {
        return this.table
    }

    getColumnList() {
        return this.columnList
    }
}