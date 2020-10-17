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
        ID: String,
        companionsID: String,
        dataID: String
    }], required: true},


});

module.exports = mongoose.model('UserCompanions', userCompanionsSchema)
