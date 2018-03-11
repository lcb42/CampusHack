// 'use strict';
let express = require('express');
let router = express.Router();
let problemModel = require('../models/problemModel');
// let firebase = require('firebase');

router.post('/uploadProblem', function(req, res){
    let body = req.body;
    console.log('mad it to API upload problem');
    let problemSchema = new problemModel({
        location: {
            lat: body.location.lat,
            long: body.location.lng
        },
        title: body.title,
        description: body.description,
        urgency: body.priority,
        category: body.category,
        imageBlob: body.imageBlob,
        building: body.building
    });
    problemSchema.save(function(err, body){
        if(err) res.json({res: false, error: err});
        else{
            res.json({res: true})
        }
    })
});


router.post('/fetchProblems', function(req, res){
    console.log("made it to api");
    let filter = req.body.filter;
    problemModel.find({urgency: filter}, function(err, problems) {
        if(err) res.json({response: err});
        else{
            res.json({response: problems});
        }
    })
});

router.post('/epicFilter', function(req, res) {
    let filter = req.body.filter;
    console.log(filter.urgency, filter.completed, filter.order, filter.limit);
    problemModel.find(
        {urgency: filter.urgency, completed: filter.completed}).
        limit(filter.limit).
        sort({createdAt: filter.order}).
        exec((err, problems) => {
            if(err) console.log(err);
            else{
                res.json({response: problems})
            }
        })
});

router.post('/problemCompleted', function(req, res){
    let problemId = req.body.id;
    problemModel.findOneAndUpdate({_id: problemId}, {$set:{completed: true}}, function(err){
        if(err) res.json({response: err, error: true});
        else{
            res.json({response: true, error: false})
        }
    })
});

module.exports = router;