const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const router = express.Router()
const User = require('../models/user');

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
        cb(error, 'backend/images');
    },
    filename: (req,file,cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE[file.mimetype];
        cb(null,name + Date.now() + '.' + ext)
    }
});



//for users
router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10,)
    .then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
            name: req.body.name
        })     
        user
        .save()
        .then(result => {
            res.status(201).json({
                message: 'User signed',
                result: result
            })
        }) 
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
    })
})

//adding saved post
router.post('/signup/:id',multer({storage: storage}).single('image'), (req,res,next) => {
    if(req.body.mode === 'save'){
        const postID = req.body.eventID;
        //User.saved.push(postID)
        User.updateOne({_id: req.params.id},
            {$push: {saved: {id: postID}}}).then(save => {
                res.status(200).json({
                    data: save
                })
            })        
    }

    if(req.body.mode === 'image'){
        const url = req.protocol + '://' + req.get('host');
        const iconImg =  url + '/images/' + req.file.filename;
        User.updateOne({_id: req.params.id},
            {image: iconImg}).then(img => {
                res.status(200).json({
                    imageUrl: iconImg
                })
            })  
    }

})

//removing saved post
router.patch('/signup/:id', (req,res,next) => {
    const postID = req.body.eventID;
    User.updateOne({_id: req.params.id},
        {$pull: {saved: {id: postID}}}).then(save => {
            res.status(200).json({
                data: save
            })
        })
})

router.put('/signup/:id', (req,res,next) => {
    const user = req.body;
    console.log(user)
    User.updateOne({_id: req.params.id}, user).then(result => {
        res.status(200).json({ message: "Update successful!" });
      });
})

router.get('/login/:id',(req,res,next) => {
    //get from database n shit
    User.findOne({_id: req.params.id}).then((user) => {
        res.status(200).json({
            message: 'user gotten',
            userData: user
        });
    });

});

//for logging
router.post('/login', (req,res,next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
    .then(user => {
        if (!user) {
            return res.status(401).json({
                message: "non-exiting user"
            })
        }
        // descrypt password and compare
        fetchedUser = user;
        bcrypt.compare(req.body.password, user.password)
        .then(result => {
            if(!result) {
                return res.status(401).json({
                    message: 'wrong password'
                })
            }
            const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id}, 
                'placeholder_secret_hash_longer', 
                { expiresIn: '1h',});
            
            res.status(200).json({
                token: token,
                userID: fetchedUser._id,
                userData: user
            })
        })
        .catch(err => {
            return res.status(401).json({
                message: "non-exiting user"
            })
        })
    })
})


module.exports = router;
