const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//makin schemas with mongoose
const userSchema = mongoose.Schema({
    posts: {type: [{
        date: String,
        content: String,
        images: [String],
        
    }], required: true},




});

userSchema.plugin(uniqueValidator)



module.exports = mongoose.model('UserFeed', userSchema)