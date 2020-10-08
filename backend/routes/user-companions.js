const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router()
const User = require('../models/user');

const UserCompanions = require('../models/user-companions');

const checkAuth = require('../middleware/check-auth');





//for users
router.post('', (req, res, next) => {
    const userCompanions = new UserCompanions({
        companions: []
    })

    userCompanions.save().then(data => {
        res.status(200).json({
            ID: data._id
        })
    })
})

//adding saved post
router.post('/:id', (req,res,next) => {
    if(req.body.mode === 'save'){
        const postID = req.body.eventID;

        const userCompanion = {
            userID: req.body.userID,
            userImg: req.body.userImg,
            username: req.body.username,
            email: req.body.email,
        }

        //User.saved.push(postID)
        UserCompanions.updateOne({_id: req.params.id},
            {$push: {companions: userCompanion}}).then(save => {
                res.status(200).json({
                    data: save
                })
            })        
    }

    if(req.body.mode === 'image'){
        
        const iconImg =  req.body.userImg
        User.updateOne({_id: req.params.id},
            {image: iconImg}).then(img => {
                res.status(200).json({
                    imageUrl: iconImg
                })
            })  
    }

})

//removing saved post
router.patch('/:id', (req,res,next) => {
    const companionID = req.body.companionID;
    UserCompanions.updateOne({_id: req.params.id},
        {$pull: {companions: {_id: companionID}}}).then(save => {
            res.status(200).json({
                data: save
            })
        })
})

router.put('/:id', (req,res,next) => {
    const user = req.body;
    console.log(user)
    UserCompanions.updateOne({_id: req.params.id}, user).then(result => {
        res.status(200).json({ message: "Update successful!" });
      });
})

router.get('/:id',(req,res,next) => {
    //get from database n shit
    UserCompanions.findOne({_id: req.params.id}).then((userData) => {
        res.status(200).json({
            message: 'user gotten',
            userData: userData
        });
    });

});




module.exports = router;
