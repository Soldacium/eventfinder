const mongoose = require('mongoose');

//makin schemas with mongoose
const eventSchema = mongoose.Schema({
    title: {type: String, required: true},
    organisator: {type: String, required: true},
    time: {type: Object, required: true}, //{start, end}
    address: {type: String, required: true},
    coords: {type: Object, required: true},
    iconImg: {type: String, required: true},
    type: {type: String, required: true},
    tags: {type: Array, required: true},
    price: {type: String, required: true},
    additional: {type: Array, required: true},
    desc: {type: String, required: true},
    plan: {type: Array, required: true},
    comments: {type: [{
        userID: String,
        userImg: String,
        comment: String,
        username: String,
        date: String,
        responses: [{
            userID: String,
            userImg: String,
            comment: String,
            username: String,
            date: String,
        }]
    }], required: true},

    totalSaved: {type: Number, required: true},
    totalComments: {type: Number, required: true},

    userID: {type: mongoose.Schema.Types.ObjectId,ref: 'User', required: true}
    

});

module.exports = mongoose.model('Event', eventSchema)
