const express = require('express');
const bcrypt = require('bcrypt');


const router = express.Router()
const User = require('../models/user');

const UserCompanions = require('../models/user-companions');

const checkAuth = require('../middleware/check-auth');
const { db } = require('../models/user');





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
       const companion =  req.body.companion;
       // or update
       dbRef.findOneAndUpdate({_id: req.params.id, 'companionRequests.to': { $elemMatch: companion} }, 
       { $pull: { 'companionRequests.to': companion }, 
       $addToSet: { 'companions': companion} }).then(response => {
           res.status(200).json({
               response: response
           })
       })
    }
    if(req.body.mode === 'accept-fromInvite'){
        const dbRef = UserCompanions.findOne({_id: req.params.id})
        const companion =  req.body.companion;
            
        dbRef.findOneAndUpdate({_id: req.params.id, 'companionRequests.from': { $elemMatch: companion} }, 
            { $pull: { 'companionRequests.from': companion }, 
            $addToSet: { 'companions': companion} }).then(response => {
                res.status(200).json({
                    response: response
                })
            })
    }
})

router.delete('/:id', (req,res,next) => {
    
    if(req.query.mode === 'delete-fromInvite'){
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$pull: {'companionRequests.from': {ID: req.query.inviterID}}}).then(delCompanion => {   
                res.status(200).json({
                    companion: delCompanion
                })   
            })       
    }

    if(req.query.mode === 'delete-toInvite'){
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$pull: {'companionRequests.to': {ID: req.query.invitedID}}}).then(delCompanion => {
                res.status(200).json({
                    companion: delCompanion
                })  
            })       
    }

    if(req.query.mode === 'delete-companion'){
        UserCompanions.findOneAndUpdate({_id: req.params.id},
            {$pull: {'companions': {ID: req.query.userID}}}).then(delCompanion => {
                res.status(200).json({
                    companion: delCompanion
                })
            })
    }

})

router.put('/:id', (req,res,next) => {
    const user = req.body;

    UserCompanions.updateOne({_id: req.params.id}, user).then(result => {
        res.status(200).json({ message: "Update successful!" });
      });
})


router.get('/:id',(req,res,next) => {
    if(req.query.mode === 'all'){
        UserCompanions.findOne({_id: req.params.id}).then((userCompanions) => {
            res.status(200).json({
                message: 'user gotten',
                userCompanions: userCompanions
            });
        });        
    }

    if(req.query.mode === 'single'){
        console.log(req.query.userID, req.params.id)
        UserCompanions.findOne({_id: req.params.id},
            {'companions.$': {$elemMatch: {ID: req.query.userID}}}).then(user => {
                console.log(user)
                res.status(200).json({
                    user: user
                })
            })
    }

    if(req.query.mode === 'invites'){
        UserCompanions.findOne({_id: req.params.id}).then((userCompanions) => {
            res.status(200).json({
                userInvites: userCompanions.companionRequests
            });
        });   
    }

    


});




module.exports = router;
