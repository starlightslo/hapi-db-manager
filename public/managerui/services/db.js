'use strict';

const dbManagerApp = angular.module('dbManagerApp');

dbManagerApp.factory('DBService', ($rootScope, $http) => {

    let dbList = [];
    let tableList = [];
    let columnList = [];
    let columnInfoList = [];
    let dataList = [];
    let totalCount = 0;
    return {
        setDBList: (data) => {

            dbList = data;

        },
        getDBList: () => {

            return dbList;

        },
        setTableList: (data) => {

            tableList = data;

        },
        getTableList: () => {

            return tableList;

        },
        setColumnList: (data) => {

            columnInfoList = data;
            columnList = Object.keys(data);

        },
        getColumnList: () => {

            return columnList;

        },
        getColumnInfoList: () => {

            return columnInfoList;

        },
        setDataList: (data) => {

            dataList = data;

        },
        getDataList: () => {

            return dataList;

        },
        getData: (id) => {

            let result = {};
            dataList.forEach((data) => {

                if (data.id === id) {
                    result = JSON.parse(JSON.stringify(data));
                }

            });
            return result;

        },
        setTotalCount: (count) => {

            totalCount = count;

        },
        getTotalCount: () => {

            return totalCount;

        }
    };
});
