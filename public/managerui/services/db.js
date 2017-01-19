var dbManagerApp = angular.module('dbManagerApp')

dbManagerApp.factory('DBService', ($rootScope, $http) => {
    var dbList = []
    var tableList = []
    var columnList = []
    var columnInfoList = []
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
            columnInfoList = data
            columnList = Object.keys(data)
        },
        getColumnList: () => {
            return columnList
        },
        getColumnInfoList: () => {
            return columnInfoList
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