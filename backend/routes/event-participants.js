const express = require('express');

const router = express.Router()
const Event = require('../models/event');
const EventParticipants = require('../models/event-participants')
const Comment = require('../models/comment');

router.get('/:id',(req,res,next) => {
    EventParticipants.findOne({_id: req.params.id}).then((EP) => {
        res.status(200).json({
            
            participants: EP
        });
    });
});

router.post('',(req,res,next) => {

    const EP = new EventParticipants({
        idd: '',
        participants: [],
    });

    EP.save().then(EP => {
        res.status(200).json({
            message: 'event participants added',
            data: EP
        });      
    });
});

router.post('/:id',(req,res,next) => {
    const participant = { //a.k.a PP
        userID: req.body.userID,
        userImg: req.body.userImg,
        username: req.body.username,
        email: req.body.email,
    }
    console.log(participant)

    
    EventParticipants.updateOne({_id: req.params.id},
        {$push: {participants: participant}}).then(PP => {
            res.status(200).json({
                data: PP
            })
        }) 
})

router.patch('/:id',(req,res,next) => {
    const userID = req.body.userID;

    EventParticipants.updateOne({_id: req.params.id},
        {$pull: {participants: {userID: userID}}}).then(save => {
            res.status(200).json({
                data: save
            })
        })
        
})

module.exports = router;


