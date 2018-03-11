'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope','RequestFactory',function($scope, RequestFactory) {

    $scope.problems = [0,1,2,3,4,5,6,7,8,9,10,11,12];

    $scope.urgency = function(urgency) {
        console.log("yes I am working thank you very much");
        RequestFactory.makeRequest('/problem/fetchProblems', {filter: urgency, type: 'urgency'}, function(response){
            if(response.error){
                console.log("ERROR");
            }else{
                $scope.problems = response.response;
                $scope.apply();
            }
        });
    }

    $scope.seemore = function(seemore){
        console.log("blobworkingblob");
        $dialog.dialog({}).open('modalContent.html');
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