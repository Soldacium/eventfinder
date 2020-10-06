const mongoose = require('mongoose');

//makin schemas with mongoose
const messageSchema = mongoose.Schema({
    senderID: {type: String, required: true},
    message: {type: String, required: true},
    date: {type: String, required: true},


});

module.exports = mongoose.model('Message', messageSchema)
