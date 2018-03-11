'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope','RequestFactory',function($scope, RequestFactory) {

    let problemObject = {};
    let url = "";
    let lat = 0;
    let long = 0;
    $scope.title = "";
    $scope.description = "";
    $scope.priority = 0;
    $scope.building = 0;
    $scope.category = 0;

    getLocation();

    $scope.chosenImage = "";
    $scope.uploadFile = function() {
        let input = document.getElementById('exampleInputFile');
        let curFiles = input.files;
        for(let i = 0; i<input.files.length; i++){
            if (validFileType(curFiles[i])) {
                url = window.URL.createObjectURL(curFiles[i]);
            }
        }
    };

    $scope.changeValue = function(value) {
        $scope.building = value;
        console.log("change building")
    };

    $scope.categoryValue = function(value) {
        $scope.category = value;
        console.log("change category")

    };

    $scope.submitProblem = function() {
        let body = {
            title: $scope.title,
            description: $scope.description,
            location: {
                lat: lat,
                long: long
            },
            building: $scope.building,
            category: $scope.category,
            imageBlob: url,
            priority: $scope.priority
        };
        console.log(body);
        // RequestFactory.makeRequest('/problem/uploadproblem', body, (response) => {
        //     if(response.res){
        //         // finished upload show something.
        //         window.Alert('true');
        //     }else{
        //         window.Alert(response.error)
        //     }
        // })
    };

    function getLocation() {
        if (navigator.geolocation) {
            console.log("entered geolocation");
            let options = {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            };
            navigator.geolocation.getCurrentPosition(function(position) {
                lat = position.coords.latitude;
                long = position.coords.longitude;
                console.log(lat, long);
            }, function(error) {
                window.alert('failed')
            }, options);
        } else {
            window.alert("Geolocation is not supported by this browser");
        }
    }

    function showPosition(position) {
    }

    function validFileType(file) {
        for (let i = 0; i < fileTypes.length; i++) {
            if (file.type === fileTypes[i]) {
                return true;
            }
        }
        console.log('false');
        return false;
    }

    let fileTypes = [
        'image/jpeg',
        'image/pjpeg',
        'image/png'
    ]

}]);

app.directive('customOnChange', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            console.log('change occurred');
            let onChangeHandler = scope.$eval(attrs.customOnChange);
            element.on('change', onChangeHandler);
            element.on('$destroy', function () {
                element.off();
            });
        }
    };
});