const mongoose = require('mongoose');

//makin schemas with mongoose
const userCompanionsSchema = mongoose.Schema({

    userID: {type: String, required: true},
    companions: {type: [{
        userID: String,
        userImg: String,
        username: String,
        email: String,
    }], required: true},


});

module.exports = mongoose.model('EventParticipants', userCompanionsSchema)
