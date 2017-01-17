var dbManagerApp = angular.module('dbManagerApp')

dbManagerApp.factory('DBService', ($rootScope, $http) => {
    var dbList = []
    var tableList = []
    var columnList = []
    var dataList = []
    var totalCount = 0
    return {
        setDBList: (data) => {
            dbList = data
        },
        getDBList: () => {
            return dbList
        },
        setTableList: (data) => {
            tableList = data
        },
        getTableList: () => {
            return tableList
        },
        setColumnList: (data) => {
            columnList = data
        },
        getColumnList: () => {
            return columnList
        },
        setDataList: (data) => {
            dataList = data
        },
        getDataList: () => {
            return dataList
        },
        setTotalCount: (count) => {
            totalCount = count
        },
        getTotalCount: () => {
            return totalCount
        }
    }
})