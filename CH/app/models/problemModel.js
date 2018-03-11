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
    category: {type: Number},
    completed: {type: Boolean, default: false},
    building: {type: Number}
},{
    timestamps: true
});

module.exports = mongoose.model('problem', problemSchema);