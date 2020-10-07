const mongoose = require('mongoose');

//makin schemas with mongoose
const eventParticipantsSchema = mongoose.Schema({

    participants: {type: [{
        userID: String,
        userImg: String,
        username: String,
        email: String,
    }], required: true},


});

module.exports = mongoose.model('EventParticipants', eventParticipantsSchema)
