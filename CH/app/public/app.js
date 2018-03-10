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

// Lazy loading of Google Map API
app.service('loadGoogleMapAPI', ['$window', '$q',
    function ( $window, $q ) {

        var deferred = $q.defer();

        // Load Google map API script
        function loadScript() {
            // Use global document since Angular's $document is weak
            var script = document.createElement('script');
            script.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyDuG9ronXAG3Rt3WpbcO1nBRHAMPidadjI&language=en&callback=initMap';

            document.body.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.initMap = function () {
            deferred.resolve();
        }

        loadScript();

        return deferred.promise;
    }]);

// Google Map
app.directive('googleMap', ['$rootScope', 'loadGoogleMapAPI',
    function( $rootScope, loadGoogleMapAPI ) {

        return {
            restrict: 'C', // restrict by class name
            scope: {
                mapId: '@id', // map ID
                lat: '@',     // latitude
                long: '@'     // longitude
            },
            link: function( $scope, elem, attrs ) {

                // Check if latitude and longitude are specified
                if ( angular.isDefined($scope.lat) && angular.isDefined($scope.long) ) {

                    // Initialize the map
                    $scope.initialize = function() {
                        $scope.location = new google.maps.LatLng($scope.lat, $scope.long);

                        $scope.mapOptions = {
                            zoom: 12,
                            center: $scope.location
                        };

                        $scope.map = new google.maps.Map(document.getElementById($scope.mapId), $scope.mapOptions);

                        new google.maps.Marker({
                            position: $scope.location,
                            map: $scope.map,
                        });
                    }

                    // Loads google map script
                    loadGoogleMapAPI.then(function () {
                        // Promised resolved
                        $scope.initialize();
                    }, function () {
                        // Promise rejected
                    });
                }
            }
        };
    }]);
