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
        console.log("yes I am working thank you very much");
        RequestFactory.makeRequest('/problem/fetchProblems', {filter: urgency}, (response) => {
            if (response.error) {
                console.log("ERROR");
            } else {
                $scope.problems = response.response;
                MapProblems();
                // $scope.$apply();
            }
        });
    };

    function MapProblems() {
        let map = new google.maps.Map(document.getElementById('map'), {
            zoom: 17,
            center: {lat: 50.9357155, lng: -1.3964423}
        });
        for(let i = 0; i < $scope.problems.length; i++ ) {
            let position = new google.maps.LatLng({lat: $scope.problems[i].location.lat, lng: $scope.problems[i].location.long});
            let marker = new google.maps.Marker({
                position: position,
                title: $scope.problems[i].title,
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