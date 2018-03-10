// 'use strict';

// Declare app level module which depends on views, and components
const app = angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version'
]);

app.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
  $routeProvider.otherwise({redirectTo: '/view2'});

  // $routeProvider
  //     .when('/', homeConfig)

}]);


app.service('RequestFactory', ['$http', function ($http) {
    this.makeRequest = function (url, body, cb) {
        $http({
            method: 'POST',
            url: url,
            data: body
        }).then(function successCallback(response) {
            console.log("Got response");
            console.log(response.data);
            cb(response.data);
        }, function errorCallback(response) {
            console.log("Error making request to server")
        });
    }
}]);

