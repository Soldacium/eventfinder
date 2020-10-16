const mongoose = require('mongoose');

//makin schemas with mongoose
const userCompanionsSchema = mongoose.Schema({
    companionRequests: {type: {
            to: [],
            from: []
        },
        required: false
    },
    companions: {type: [{
        userID: String,
        userImg: String,
        username: String,
        email: String,
    }], required: true},


});

module.exports = mongoose.model('UserCompanions', userCompanionsSchema)
