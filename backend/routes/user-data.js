const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../models/user');

const UserData = require('../models/user-data');

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
        cb(error, 'backend/images-users');
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null,name + Date.now() + '.' + ext)
    }
});



//for users
router.post('', (req, res, next) => {
    const userData = new UserData({
        email: req.body.email,

        username: req.body.username,
        phone: '',
        adress: '',
        website1: '',
        website2: '',
        linkedin: '',
        facebook: '',
        instagram: '',
        twitter: '',
        desc: '',
    
        image: '',
        backgroundImage: '',
    
        statsTypes: '',
        statsTime: '',    
        saved: [],

        activities: [],

        companionRequests: {
            type: {to: [],from: []},
            required: false
        }
    })

    userData.save().then(data => {
        res.status(200).json({
            ID: data._id
        })
    })
})

//adding saved post
router.post('/:id',multer({storage: storage}).single('image'), (req,res,next) => {
    if(req.body.mode === 'save'){
        const postID = req.body.eventID;
        //User.saved.push(postID)
        UserData.updateOne({_id: req.params.id},
            {$push: {saved: {id: postID}}}).then(save => {
                res.status(200).json({
                    data: save
                })
            })        
    }

    if(req.body.mode === 'image'){
        const url = req.protocol + '://' + req.get('host');
        console.log(req.params.id)
        const iconImg =  url + '/images-users/' +req.file.filename;
        UserData.updateOne({_id: req.params.id},
            {image: iconImg}).then(img => {
                res.status(200).json({
                    imageUrl: iconImg
                })
            })  
    }

    if(req.body.mode === 'background-image'){
        const url = req.protocol + '://' + req.get('host');
        console.log(req.params.id)
        const bgImg =  url + '/images-users/' +req.file.filename;
        UserData.updateOne({_id: req.params.id},
            {backgroundImage: bgImg}).then(img => {
                res.status(200).json({
                    imageUrl: bgImg
                })
            })  
    }

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
    if(req.params.mode === 'full'){
        UserData.findOne({_id: req.params.id}).then((userData) => {
            res.status(200).json({
                message: 'user gotten',
                userData: userData
            });
        });        
    }

    if(req.params.mode === 'basic'){
        UserData.findOne({_id: req.params.id}).then((userData) => {
            res.status(200).json({
                message: 'user gotten',
                userData: userData
            });
        });        
    }


});




module.exports = router;
