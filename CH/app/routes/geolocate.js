let express = require('express');
let router = express.Router();


router.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDuG9ronXAG3Rt3WpbcO1nBRHAMPidadjI&language=en&', function(res){
    console.log(res);
});


module.exports = router;
