let express = require('express');
let router = express.Router();
let problemModel = require('../models/problemModel');

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

    uploadToGcs(body.imageBlob).then((imageUrl) => {
        let problemSchema = new problemModel({
            location: {
                lat: body.latitude,
                long: body.longitude
            },
            title: body.title,
            description: body.description,
            urgency: body.urgency,
            category: body.category,
            image: imageUrl
        });
        problemSchema.save(function(err, body){
            if(err) res.json({"response": false});
            else{
                res.json({"response": true})
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
    let request = req.body;
    // fetch for problems based of urgency there can be a filter and use aggregation to solve it
    problemModel.
});

module.exports = router;