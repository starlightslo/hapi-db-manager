var dbManagerApp = angular.module('dbManagerApp')
dbManagerApp.controller('MainController', ($rootScope, $scope, $http, DBService) => {
    const DEBUG = true

    // Variables
    $scope.selectedDB = ''
    $scope.selectedTable = ''
    $scope.page = 1
    $scope.totalPage = 1
    $scope.totalPageArray = []
    $scope.displayRows = 30

    /**
     * Init function
     */
    $scope.init = (basePath) => {
        $scope.basePath = basePath

        // getting all database
        $scope.getDatabaseList()
    }

    /**
     * Change page
     */
    $scope.changePage = (page) => {
        if ($scope.page !== page) {
            if (DEBUG) console.log('Change the page to: ' + page)
            $scope.page = page

            // getting tables from selected database
            $scope.getDataList()
        }
    }

    /**
     * Change selecte database
     */
    $scope.changeDB = (db) => {
        if ($scope.selectedDB !== db) {
            if (DEBUG) console.log('Change the database to: ' + db)
            $scope.selectedDB = db

            // getting tables from selected database
            $scope.getTableList()
        }
    }

    /**
     * Change select table
     */
    $scope.changeTable = (table) => {
        if ($scope.selectedTable !== table) {
            if (DEBUG) console.log('Change the table to: ' + table)
            $scope.selectedTable = table
            
            // getting columns from selected table
            $scope.getColumnList()
            
            // getting total count from selected table
            $scope.getTotalCount()

            // getting data from selected table
            $scope.getDataList()
        }
    }

    /**
     * Click new table
     */
    $scope.newTable = () => {
        if (DEBUG) console.log('Click the new table.')
    }

    /**
     * Click edit table
     */
    $scope.editTable = () => {
        if (DEBUG) console.log('Click the edit table.')
    }

    /**
     * Click delete table
     */
    $scope.deleteTable = () => {
        if (DEBUG) console.log('Click the delete data.')
    }

    /**
     * Click new data
     */
    $scope.newData = () => {
        if (DEBUG) console.log('Click the new data.')
    }

    /**
     * Click delete data
     */
    $scope.deleteData = () => {
        if (DEBUG) console.log('Click the delete data.')
    }

    /**
     * Request all database
     */
    $scope.getDatabaseList = () => {
        $http({
            method: 'GET',
            url: $scope.basePath + '/api/database'
        })
        .then(response => {
            if (DEBUG) console.log(response)
            if (response.status === 200) {
                const data = response.data
                if (data.code === 200) {
                    DBService.setDBList(data.data)
                    $scope.dbList = DBService.getDBList()

                    // Set the first data to default database
                    if ($scope.dbList.length > 0) {
                        $scope.selectedDB = $scope.dbList[0]

                        // getting tables from selected database
                        $scope.getTableList()
                    }
                } else {
                    // Display error
                    // ----- TODO -----
                }
            } else {
                // Display error
                // ----- TODO -----
            }
        })
        .catch(err => {
            if (DEBUG) console.error(err)
        })
    }

    /**
     * Request all tables
     */
    $scope.getTableList = () => {
        $http({
            method: 'GET',
            url: $scope.basePath + '/api/' + $scope.selectedDB + '/table'
        })
        .then(response => {
            if (DEBUG) console.log(response)
            if (response.status === 200) {
                const data = response.data
                if (data.code === 200) {
                    DBService.setTableList(data.data)
                    $scope.tableList = DBService.getTableList()

                    // Set the first data to default table
                    if ($scope.dbList.length > 0) {
                        $scope.selectedTable = $scope.tableList[0]

                        // getting columns from selected table
                        $scope.getColumnList()

                        // getting total count from selected table
                        $scope.getTotalCount()

                        // getting data from selected table
                        $scope.getDataList()
                    }
                } else {
                    // Display error
                    // ----- TODO -----
                }
            } else {
                // Display error
                // ----- TODO -----
            }
        })
        .catch(err => {
            if (DEBUG) console.error(err)
        })
    }

    /**
     * Request column
     */
    $scope.getColumnList = () => {
        $http({
            method: 'GET',
            url: $scope.basePath + '/api/' + $scope.selectedDB + '/' + $scope.selectedTable + '/column'
        })
        .then(response => {
            if (DEBUG) console.log(response)
            if (response.status === 200) {
                const data = response.data
                if (data.code === 200) {
                    DBService.setColumnList(Object.keys(data.data))
                    $scope.columnList = DBService.getColumnList()
                } else {
                    // Display error
                    // ----- TODO -----
                }
            } else {
                // Display error
                // ----- TODO -----
            }
        })
        .catch(err => {
            if (DEBUG) console.error(err)
        })
    }

    /**
     * Request all data
     */
    $scope.getDataList = () => {
        $http({
            method: 'GET',
            url: $scope.basePath + '/api/' + $scope.selectedDB + '/' + $scope.selectedTable + '/data',
            params: {
                page: $scope.page,
                rows: $scope.displayRows
            }
        })
        .then(response => {
            if (DEBUG) console.log(response)
            if (response.status === 200) {
                const data = response.data
                if (data.code === 200) {
                    DBService.setDataList(data.data)
                    $scope.dataList = DBService.getDataList()
                } else {
                    // Display error
                    // ----- TODO -----
                }
            } else {
                // Display error
                // ----- TODO -----
            }
        })
        .catch(err => {
            if (DEBUG) console.error(err)
        })
    }

    /**
     * Request total counts
     */
    $scope.getTotalCount = () => {
        $http({
            method: 'GET',
            url: $scope.basePath + '/api/' + $scope.selectedDB + '/' + $scope.selectedTable + '/data/count'
        })
        .then(response => {
            if (DEBUG) console.log(response)
            if (response.status === 200) {
                const data = response.data
                if (data.code === 200) {
                    DBService.setTotalCount(data.data)
                    $scope.totalCount = DBService.getTotalCount()

                    // Set up total page
                    $scope.totalPage = Math.ceil($scope.totalCount / $scope.displayRows)
                    $scope.totalPageArray = []
                    for (var i = 1 ; i <= $scope.totalPage ; i++) {
                        $scope.totalPageArray.push(i)
                    }
                } else {
                    // Display error
                    // ----- TODO -----
                }
            } else {
                // Display error
                // ----- TODO -----
            }
        })
        .catch(err => {
            if (DEBUG) console.error(err)
        })
    }
})