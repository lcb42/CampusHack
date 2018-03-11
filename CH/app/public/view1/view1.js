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
    let imagetype = "";

    // getLocation();

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
        loadXHR(url).then(function(blob) {
            // here the image is a blob
            uploadToGcs(blob, imagetype).then((imageUrl) => {
                let k = document.getElementById("building");
                let e = document.getElementById("category");

                let body = {
                    title: $scope.title,
                    description: $scope.description,
                    location: {
                        lat: 50.9375087,
                        lng: -1.3984173
                    },
                    building: k.value,
                    category: e.value,
                    imageBlob: imageUrl,
                    priority: $scope.priority
                };

                RequestFactory.makeRequest('/problem/uploadProblem', body, (response) => {
                    if(response.res){
                        // finished upload show something.
                        window.Alert('true');
                    }else{
                        window.Alert(response.error)
                    }
                })
            });
        });
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

    function validFileType(file) {
        for (let i = 0; i < fileTypes.length; i++) {
            if (file.type === fileTypes[i]) {
                imagetype = file.type;
                console.log(imagetype);
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
    ];

    function loadXHR(url) {

        return new Promise(function(resolve, reject) {
            try {
                let xhr = new XMLHttpRequest();
                xhr.open("GET", url);
                xhr.responseType = "blob";
                xhr.onerror = function() {reject("Network error.")};
                xhr.onload = function() {
                    if (xhr.status === 200) {resolve(xhr.response)}
                    else {reject("Loading error:" + xhr.statusText)}
                };
                xhr.send();
            }
            catch(err) {reject(err.message)}
        });
    }

    function uploadToGcs(singularImage, type) {
        return new Promise((resolve, reject) => {
            console.log(singularImage);
            let meta = {
                contentType: type
            };
            const storage = firebase.storage();
            const timestamp = new Date().getSeconds();
            const storageref = storage.ref().child(`${timestamp}`).put(singularImage, meta);
            storageref.on(firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
                function (snapshot) {
                    switch (snapshot.state) {
                        case firebase.storage.TaskState.PAUSED: // or 'paused'
                            console.log('Upload is paused');
                            break;
                        case firebase.storage.TaskState.RUNNING: // or 'running'
                            console.log('Upload is running');
                            break;
                    }
                }, function (error) {
                    switch (error.code) {
                        case 'storage/unauthorized':
                            reject(error);
                            // User doesn't have permission to access the object
                            break;

                        case 'storage/canceled':
                            // User canceled the upload
                            reject(error);
                            break;
                        case 'storage/unknown':
                            reject(error);
                            // Unknown error occurred, inspect error.serverResponse
                            break;
                    }
                }, function () {
                    // grab the object and use it here to publish to the authors profile. You wont need to fetch the data again as
                    // you can just store it locally then load on dashboard as this is
                    console.log(storageref.snapshot.downloadURL);
                    resolve(storageref.snapshot.downloadURL);
                })
        });
    }
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