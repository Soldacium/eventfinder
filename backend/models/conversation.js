const mongoose = require('mongoose');

//makin schemas with mongoose
const conversationSchema = mongoose.Schema({
    conversationName: {type: String, required: true},
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

    color1: {type: String, required: false},
    color2: {type: String, required: false},
    type: {type: String, required: true}



});

module.exports = mongoose.model('Conversation', conversationSchema)
