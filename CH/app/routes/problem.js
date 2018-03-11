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
    // let type = req.body.type;
    // let completed = {};
    // switch(type){
    //     case 'urgency':
    //         completed = {};
    //         break;
    //     case 'Completed':
    //         completed = {completed: true};
    //         break;
    // }
    // fetch for problems based of urgency there can be a filter and use aggregation to solve it
    // problemModel.aggregate([
    //     {$match: {urgency: filter}, completed},
    // ]).sort({createdAt: -1}).
    //     exec(function(err, problems){
    //         if(err) res.json({response: err, error: true});
    //         else{
    //             res.json({response: problems, error: false});
    //         }
    // });
    problemModel.find({urgency: filter}, function(err, problems) {
        if(err) res.json({response: err});
        else{
            res.json({response: problems});
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