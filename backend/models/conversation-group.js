const mongoose = require('mongoose');


//makin schemas with mongoose
const conversationSchema = mongoose.Schema({
    conversationName: {type: String, required: true},
    

    messages: {type: [{
        senderID: {type: String, required: true},
        message: {type: String, required: true},
        date: {type: String, required: true},
    }], required: true},

    users: {type: [{
        userID: String,
        userImg: String,
        userName: String
    }], required: true},

    color1: {type: String, required: false},
    color2: {type: String, required: false},


});

module.exports = mongoose.model('Conversation', conversationSchema)
