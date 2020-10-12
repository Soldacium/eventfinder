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
    additional: {type: Array, required: false},
    desc: {type: String, required: true},
    plan: {type: Array, required: true},

    ticketsLink: {type: String, required: false},

    website1: {type: String, required: false},
    website2: {type: String, required: false},
    phone: {type: String, required: false},
    email: {type: String, required: false},

    userID: {type: mongoose.Schema.Types.ObjectId,ref: 'User', required: true},
    commentsID: {type: String, required: true},
    participantsID: {type: String, required: true}
    

});

module.exports = mongoose.model('Event', eventSchema)
