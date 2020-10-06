const mongoose = require('mongoose');

const Message = require('../models/message')

//makin schemas with mongoose
const conversationSchema = mongoose.Schema({
    eventName: {type: String, required: true},
    userID1: {type: String, required: true},
    userImg1: {type: String, required: true},
    userName1: {type: String, required: true},
    userID2: {type: String, required: true},
    userImg2: {type: String, required: true},
    userName2: {type: String, required: true},

    messages: {type: [{
        senderID: {type: String, required: true},
        message: {type: String, required: true},
        date: {type: String, required: true},
    }], required: true},



});

module.exports = mongoose.model('Conversation', conversationSchema)
