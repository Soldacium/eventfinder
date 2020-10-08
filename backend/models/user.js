const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//makin schemas with mongoose
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique:  true},
    password: {type: String, required: true},
    username: {type: String, required: true},

    userCompanionsID: {type: String, required: true},
    userFeedID: {type: String, required: true},
    userDataID: {type: String, required: true},

    privacyOptions: {type: [{        
        profileVisible: Boolean,
        savedEventsVisible: Boolean,
        companionsVisible: Boolean,
        madeEventsVisible: Boolean,
        feedVisible: Boolean,
        emailSpecsVisible: Boolean,
        userHashCodeAllow: Boolean  }], required: true}



});

userSchema.plugin(uniqueValidator)



module.exports = mongoose.model('User', userSchema)