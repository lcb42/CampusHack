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
        $scope.collapsibleElements = [{
            icon: 'mdi-image-filter-drama',
            title: 'First',
            content: 'Lorem ipsum dolor sit amet.'
        },{
            icon: 'mdi-maps-place',
            title: 'Second',
            content: 'Lorem ipsum dolor sit amet.'
        },{
            icon: 'mdi-social-whatshot',
            title: 'Third',
            content: 'Lorem ipsum dolor sit amet.'
        }
        ];
    }
}]);

app.controller('SampleController', ["$scope", "ModalService", function($scope, ModalService) {

    $scope.showAModal = function(seemore) {

        // Just provide a template url, a controller and call 'showModal'.
        ModalService.showModal({
            templateUrl: "yesno/yesno.html",
            controller: "YesNoController"
        }).then(function(modal) {
            // The modal object has the element built, if this is a bootstrap modal
            // you can call 'modal' to show it, if it's a custom modal just show or hide
            // it as you need to.
            modal.element.modal();
            modal.close.then(function(result) {
                $scope.message = result ? "You said Yes" : "You said No";
            });
        });

    };

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