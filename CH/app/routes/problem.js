let express = require('express');
let router = express.Router();
let problemModel = require('../models/problemModel');
let firebase = require('firebase');

const config = {
    apiKey: "AIzaSyAbCQvs-zNMzaSVdptdxF7S_yYLT5-sXyI",
    authDomain: "storyofbones.firebaseapp.com",
    databaseURL: "https://storyofbones.firebaseio.com",
    projectId: "storyofbones",
    storageBucket: "storyofbones.appspot.com",
    messagingSenderId: "768080163378"
};

firebase.initializeApp(config);

router.post('/uploadProblem', function(req, res){
    let body = req.body;
    console.log('mad it to API upload problem');
    uploadToGcs(body.imageBlob).then((imageUrl) => {
        let problemSchema = new problemModel({
            location: {
                lat: body.lat,
                long: body.long
            },
            title: body.title,
            description: body.description,
            urgency: body.urgency,
            category: body.category,
            image: imageUrl,
            building: body.building
        });
        problemSchema.save(function(err, body){
            if(err) res.json({res: false, error: err});
            else{
                res.json({res: true})
            }
        })
    }).catch((error) => {
        res(error);
    });
});

function uploadToGcs(singularImage) {
    return new Promise((resolve, reject) => {
        let contentofarticle = this.uploadobjects;
        let userid = this.userid;
        return new Promise(function(resolve, reject) {

            let imagearticleblob = contentofarticle[imageind].inputobj.blob;
            console.log(imagearticleblob);
            let meta = {
                contentType: "image"
            };
            const storage = firebase.storage();
            const timestamp = new Date().getTime();
            const storageref = storage.ref().child(timestamp).put(imagearticleblob, meta);
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
                    resolve(storageref.snapshot.downloadURL);
                })
        });
    });
}

router.post('/fetchProblems', function(req, res){
    let filter = req.body.filter;
    let type = req.body.type;
    let completed = {};
    switch(type){
        case 'urgency':
            completed = {};
            break;
        case 'Completed':
            completed = {completed: true};
            break;
    }
    // fetch for problems based of urgency there can be a filter and use aggregation to solve it
    problemModel.aggregate([
        {$match: {urgency: filter}, completed},
    ]).sort({createdAt: -1}).
        exec(function(err, problems){
            if(err) res.json({response: err, error: true});
            else{
                res.json({response: problems, error: false});
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