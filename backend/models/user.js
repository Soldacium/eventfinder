const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//makin schemas with mongoose
const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique:  true},
    password: {type: String, required: true},

    name: {type: String, required: true},
    phone: {type: String, required: false},
    adress: {type: String, required: false},
    website1: {type: String, required: false},
    website2: {type: String, required: false},
    linkedin: {type: String, required: false},
    facebook: {type: String, required: false},
    instagram: {type: String, required: false},
    desc: {type: String, required: false},

    image: {type: String, required: false},

    statsTypes: {type: Array, required: false},
    statsTime: {type: Array, required: false},    
    saved: {type: [{id: String}], required: false}
    


});

userSchema.plugin(uniqueValidator)



module.exports = mongoose.model('User', userSchema)