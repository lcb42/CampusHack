'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope','RequestFactory',function($scope, RequestFactory) {

    $scope.problems = [];

    $scope.urgency = function(urgency) {
        console.log("yes I am working thank you very much")
        RequestFactory.makeRequest('/problem/fetchProblems', {filter: urgency, type: 'urgency'}, function(response){
            if(response.error){
                console.log("ERROR");
            }else{
                $scope.problems = response.response;
                $scope.apply();
            }
        });
    }
}]);

angular
    .module('sidenavDemo2', ['ngMaterial'])
    .controller('AppCtrl', function ($scope, $timeout, $mdSidenav) {
        $scope.toggleLeft = buildToggler('left');
        $scope.toggleRight = buildToggler('right');

        function buildToggler(componentId) {
            return function() {
                $mdSidenav(componentId).toggle();
            };
        }
    });