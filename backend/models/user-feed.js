const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//makin schemas with mongoose
const userSchema = mongoose.Schema({
    posts: {type: [{
        image: String,
        
        content: String,
        title: String,
        relatedActivities: [String],
        relatedPlace: String,
        relatedPlaceCoords: Object,
        relatedEventID: String,
        relatedTags: [String],
        relatedCompanions: [],
        images: [String],

        comments: [{        
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
        }],

        date: String,
        
    }], required: true},




});

userSchema.plugin(uniqueValidator)



module.exports = mongoose.model('UserFeed', userSchema)