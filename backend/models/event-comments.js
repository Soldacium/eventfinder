const mongoose = require('mongoose');

//makin schemas with mongoose
const eventCommentsSchema = mongoose.Schema({


    comments: {type: [{
        userID: String,
        userImg: String,
        comment: String,
        username: String,
        date: String,
        responses: [{
            userID: String,
            userImg: String,
            comment: String,
            username: String,
            date: String,
        }]
    }], required: true},


});

module.exports = mongoose.model('EventComments', eventCommentsSchema)
