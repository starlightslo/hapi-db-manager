var dbManagerApp = angular.module('dbManagerApp', [])

// Directives
dbManagerApp.directive('ngCheckCreateTable', [
    function () {
        return {
            link: function (scope, element, attrs, ctrl) {
                var createTableButtonComponent = '#createTableButton'
                
                var checking = () => {
                    // Define
                    var isPass = true
                    var regularExpression = /^[a-zA-Z0-9_-]{1,64}$/

                    // Checking the table's name
                    if (!regularExpression.test(scope.newTable.name)) {
                        isPass = false
                    }

                    // Checking the column's name
                    scope.newTable.columnList.forEach(column => {
                        if (!regularExpression.test(column.name)) {
                            isPass = false
                        }
                    })

                    // Active the create table button if validate successed
                    if (isPass) {
                        $(createTableButtonComponent).removeAttr("disabled")
                    } else {
                        $(createTableButtonComponent).attr("disabled", "disabled")
                    }
                }

                // Checking when the column is updated
                scope.$on('updateColumn', (event, data) => {
                    checking()
                })

                // Checking when the value is updated
                element.on('keyup', () => {
                    scope.$apply(() => {
                        checking()
                    })
                })
            }
        }
    }
])