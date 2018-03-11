'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view2', {
    templateUrl: 'view2/view2.html',
    controller: 'View2Ctrl'
  });
}])

.controller('View2Ctrl', ['$scope','RequestFactory',function($scope, RequestFactory) {

    $scope.datasetOverride = [{ yAxisID: 'y-axis-1' }, { yAxisID: 'y-axis-2' }];
    $scope.data = [0,1,2,3,4,5];
    $scope.options = {
        scales: {
            yAxes: [
                {
                    id: 'y-axis-1',
                    type: 'linear',
                    display: true,
                    position: 'left'
                }
            ]
        }
    };
    $scope.problems = [];
    let urgen = 0;

    RequestFactory.makeRequest('/problem/fetchProblems', {filter: 0}, (response) => {
        if (response.error) {
            console.log("ERROR");
        } else {
            $scope.problems = response.response;
            MapProblems();
            // $scope.$apply();
        }
    });

    $scope.urgency = function(urgency) {
        urgen = urgency;
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

    $scope.completed = function(id){
        console.log("completed task ID sent");
        RequestFactory.makeRequest('/problem/problemCompleted',{id: id}, function (completed){
            Materialize.toast('Task has been completed', 3000);
            $scope.urgency(urgen);
        })
    };

    $scope.applyFilter = function() {
        let sort_number = 0;
        let range_value = document.getElementById("limit").value;
        let completeOrNot = document.getElementById('completeornot').checked;
        if(document.getElementById('order').checked){
            sort_number = 1;
        }else{
            sort_number = -1;
        }
        console.log(range_value, completeOrNot, sort_number);
        RequestFactory.makeRequest('/problem/epicFilter', {filter: {
                urgency: urgen,
                order: sort_number,
                completed: completeOrNot,
                limit: Number(range_value)
                }
            }, (response) => {
            if (response.error) {
                console.log("ERROR");
            } else {
                $scope.problems = response.response;
                MapProblems();
                // $scope.$apply();
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