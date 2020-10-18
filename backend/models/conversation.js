const mongoose = require('mongoose');

//makin schemas with mongoose
const conversationSchema = mongoose.Schema({
    conversationName: {type: String, required: true},
    userID1: {type: String, required: true},
    userDataID1: {type: String, requred: true},

    userID2: {type: String, required: true},
    userDataID2: {type: String, requred: true},

    messages: {type: [{
        senderID: {type: String, required: true},
        message: {type: String, required: true},
        date: {type: String, required: true},
    }], required: true},

    color1: {type: String, required: false},
    color2: {type: String, required: false},
    type: {type: String, required: true},
    eventID: {type: String, required: false},



});

module.exports = mongoose.model('Conversation', conversationSchema)
