const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const problemSchema = new Schema({
    location: {
        lat: {type: Number},
        long: {type: Number}
    },
    title: {type: String},
    description: {type: String},
    urgency: {type: Number},
    image: {type: String},
    category: {type:String}
},{
    timestamps: true
});

module.exports = mongoose.model('problem', problemSchema);