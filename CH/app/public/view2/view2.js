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
        MapProblems();
        console.log("yes I am working thank you very much");
        RequestFactory.makeRequest('/problem/fetchProblems', {filter: urgency, type: 'urgency'}, function (response) {
            if (response.error) {
                console.log("ERROR");
            } else {
                $scope.problems = response.response;

                $scope.apply();
            }
        });
    };

    function addMarkerMethod(){

    }

    function MapProblems() {
        var map = new google.maps.Map(document.getElementById('map'), {
            zoom: 17,
            center: {lat: 50.9357155, lng: -1.3964423}
        });
        for(var i = 0; i < Problems.length; i++ ) {
            var position = new google.maps.LatLng(Problems[i][1].lat, Problems[i][1].lng);
            var marker = new google.maps.Marker({
                position: position,
                title: Problems[i][2],
                map: map,
                animation: google.maps.Animation.DROP
            });
            console.log(marker);
        }
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