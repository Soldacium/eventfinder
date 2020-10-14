const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../models/user');

const UserFeed = require('../models/user-feed');

const checkAuth = require('../middleware/check-auth');
const { db } = require('../models/user');

const multer = require('multer');

const MIME_TYPE = {
    'image/png' : 'png',
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE[file.mimetype]
        let error = new Error('invalid mime type')
        if (isValid){
            error = null;
        }
        cb(error, 'backend/images-users-feed');
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null,name + Date.now() + '.' + ext)
    }
});



//for users
router.post('', (req, res, next) => {
    const userFeed = new UserFeed({
        posts: []
    })

    userFeed.save().then(data => {
        res.status(200).json({
            ID: data._id
        })
    })
})

//adding saved post
router.post('/:id',multer({storage: storage}).single('image'), (req,res,next) => {

    console.log(req.body)

    const url = req.protocol + '://' + req.get('host');
    const image =  url + '/images-users-feed/' + req.file.filename;
    
    const post = req.body;
    post.image = image;

    console.log(post)
    
    UserFeed.findOneAndUpdate({_id: req.params.id},
        {$push: {posts: post}}).then(post => {
            res.status(200).json({
                addedPost: post
            })
        })  
    
    

})

//removing saved post
router.patch('/:id', (req,res,next) => {
    const postID = req.body.eventID;
    UserData.updateOne({_id: req.params.id},
        {$pull: {saved: {id: postID}}}).then(save => {
            res.status(200).json({
                data: save
            })
        })
})

router.put('/:id', (req,res,next) => {
    const user = req.body;
    console.log(user)
    UserData.updateOne({_id: req.params.id}, user).then(result => {
        res.status(200).json({ message: "Update successful!" });
      });
})

router.get('/:id',(req,res,next) => {
    //get from database n shit
    UserFeed.findOne({_id: req.params.id}).then((userFeed) => {
        res.status(200).json({
            userFeed: userFeed
        });
    });

});




module.exports = router;
