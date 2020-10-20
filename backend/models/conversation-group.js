const mongoose = require('mongoose');


//makin schemas with mongoose
const conversationGroupSchema = mongoose.Schema({
    conversationName: {type: String, required: false},
    

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

    makerID: {type: String, required: true},
    eventID: {type: String, required: false},
    image: {type: String, required: false},
    type: {type: String, required: true},


});

module.exports = mongoose.model('ConversationGroup', conversationGroupSchema)
