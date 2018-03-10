let express = require('express');
let router = express.Router();
let problemModel = require('../models/problemModel');

router.post('/uploadProblem', function(req, res){
    let body = req.body;
    let problemSchema = new problemModel({
        location: {
            lat: body.latitude,
            long: body.longitude
        },
        title: body.title,
        description: body.description,
        urgency: body.urgency,

    })
});

module.exports = router;