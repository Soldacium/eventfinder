const mongoose = require('mongoose');

//makin schemas with mongoose
const commentSchema = mongoose.Schema({
    userID: {type: String, required: true},
    userImg: {type: String, required: true},
    comment: {type: String, required: true},
    username: {type: String, required: true},
    date: {type: String, required: true},
    responses: {type: [{
        userID: String,
        userImg: String,
        comment: String,
        username: String,
        date: String,
    }], required: true}
    

});

module.exports = mongoose.model('Comment', commentSchema)