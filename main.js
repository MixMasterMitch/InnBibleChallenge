var startDate = function() {
    return moment('2014-10-15');
}
var endDate = function() {
    return moment('2014-10-27');
}

angular.module('InnBibleChallenge', ['ngRoute', 'ngAnimate'])
    .config(function($routeProvider) {
        $routeProvider
            .when('/devotional/:date', {
                templateUrl : function(route) {
                    return 'devotionals/' + route.date + '.html';
                }
            })
            .when('/404', {
                redirectTo : function() {
                    return '/devotional/' + endDate().format('YYYY-MM-DD');
                }
                // templateUrl : '404.html'
            })
            .when('/introduction', {
                templateUrl : 'introduction.html'
            })
            .otherwise({
                redirectTo : function() {
                    return '/devotional/' + moment().format('YYYY-MM-DD');
                }
            });
    })
    .controller('HeadingController', function($scope, $routeParams, $location) {
        $scope.startDate = startDate();
        $scope.endDate = endDate();
        $scope.$watch(function() { return $routeParams.date }, function() {
            $scope.date = $routeParams.date && moment($routeParams.date);
        });
        $scope.$watch(function() { return $routeParams.date }, function() {
            $scope.introduction = $location.url() === '/introduction';
        });

        $scope.next = function() {
            if ($scope.date && $scope.date.isSame($scope.endDate)) { return; }
            $location.path('/devotional/' + $scope.date.add(1, 'd').format('YYYY-MM-DD'));
        };

        $scope.back = function() {
            if ($scope.date && $scope.date.isSame($scope.startDate)) { return; }
            $location.path('/devotional/' + $scope.date.subtract(1, 'd').format('YYYY-MM-DD'));
        };

        $scope.backToDevotional = function() {
            $location.path('/devotional/' + moment().format('YYYY-MM-DD'));
        };

        $scope.goToIntroduction = function() {
            $location.path('/introduction');
        }
    })
    .directive('scripture', function(scriptureVersion) {
        return {
            templateUrl : 'directiveTemplates/scripture.html',
            controller : function($scope) {
                $scope.niv = function() {
                    scriptureVersion.active = 'niv';
                };
                $scope.theMessage = function() {
                    scriptureVersion.active = 'theMessage';
                };
                $scope.updateActive = function() {
                    if (scriptureVersion.active === 'niv') {
                        $scope.scriptureUrl = 'scripture/niv/' + $scope.scripture + '.html';
                    } else {
                        $scope.scriptureUrl = 'scripture/theMessage/' + $scope.scripture + '.html';
                    }
                    $scope.active = scriptureVersion.active;
                };
            },
            scope : {},
            link : function(scope, element, attrs) {
                scope.scripture = attrs.scripture;
                scope.title = attrs.title;
                scope.more = false;
                scope.$watch(function() { return scriptureVersion.active; }, scope.updateActive);
                scope.updateActive();
            }
        }
    })
    .factory('scriptureVersion', function() {
        return {
            active : 'niv'
        };
    })
    .run(['$rootScope', '$location', function($rootScope, $location) {
        $rootScope.$on('$routeChangeError', function(event, current, previous, error) {
            if(error.status === 404) {
                $location.replace();
                $location.path('/404');
            }
        });
    }]);