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



    const userCompanion = req.body.data;
    if(req.body.mode === 'add-fromInvite'){
        const userCompanion = req.body.data;
        //User.saved.push(postID)
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$push: {'companionRequests.from' : userCompanion}}).then(save => {
                res.status(200).json({
                    data: save
                })
            })        
    }

    if(req.body.mode === 'add-toInvite'){
        //User.saved.push(postID)
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$push: {'companionRequests.to' : userCompanion}}).then(save => {
                res.status(200).json({
                    data: save
                })
            })        
    }

})

//removing saved post
router.patch('/:id', (req,res,next) => {

    const inviteID = req.body.inviteID;


    if(req.body.mode === 'accept-toInvite'){
        const dbRef = UserCompanions.findOne({_id: req.params.id})
        dbRef.update({$pull: {'companionRequests.to': {_id: inviteID}}}).then(companion => {
            dbRef.update({$push: {companions: companion}}).then(res => {
                res.status(200).json({
                    companion: companion
                })
            })
        })
    }
    if(req.body.mode === 'accept-fromInvite'){
        const dbRef = UserCompanions.findOne({_id: req.params.id})
        dbRef.update({$pull: {'companionRequests.from': {_id: inviteID}}}).then(companion => {
            dbRef.update({$push: {companions: companion}}).then(res => {
                res.status(200).json({
                    companion: companion
                })
            })
        })
    }
})

router.delete('/:id', (req,res,next) => {
    if(req.params.mode = 'delete-fromInvite'){
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$pull: {'companionRequests.from': {userID: req.params.inviterID}}}).then(companion => {
                res.status(200).json({
                    companion: companion
                })
            })       
    }

    if(req.params.mode = 'delete-toInvite'){
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$pull: {'companionRequests.to': {userID: req.params.invitedID}}}).then(companion => {
                res.status(200).json({
                    companion: companion
                })
            })       
    }

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
    if(req.params.mode === 'all'){
        UserCompanions.findOne({_id: req.params.id}).then((userCompanions) => {
            res.status(200).json({
                message: 'user gotten',
                userCompanions: userCompanions
            });
        });        
    }

    if(req.params.mode === 'single'){
        UserCompanions.find({userID: req.params.userID},
            {_id: req.params.id, companions: {$elemMatch: {userID: req.params.userID}}}).then(user => {
                res.status(200).json({
                    user: user
                })
            })
    }

    if(req.params.mode === 'invites'){
        UserCompanions.findOne({_id: req.params.id}).then((userCompanions) => {
            res.status(200).json({
                userInvites: userCompanions.companionRequests
            });
        });   
    }

    


});




module.exports = router;
