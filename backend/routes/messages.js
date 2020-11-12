const express = require('express');

const router = express.Router()
const Conversation = require('../models/conversation')
const Message = require('../models/message')

const checkAuth = require('../middleware/check-auth');
const conversation = require('../models/conversation');


router.post('', (req,res,next) => {
    const conversation = new Conversation(req.body)
    console.log(conversation)

    conversation.save().then(response => {
        res.status(200).json({
            message: response,
        })
    })
})


router.post('/:id',  (req,res,next) => { 
    
    const message = new Message({
        senderID: req.body.senderID,
        message: req.body.message,
        date: req.body.date,
    })
    Conversation.updateOne({_id: req.params.id},
        {$push: {messages: message}}).then(save => {
            res.status(200).json({
                data: save
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })

});



router.get('', (req,res,next) => {
    const userID = req.query.userID;

    if(req.query.mode === 'user'){
        Conversation
        .find({$or : [{userID1: userID}, {userID2: userID}]})
        .then(userConversations => {
            res.status(200).json({
                userConversations
            });
        });
    }
    if(req.query.mode === 'check-user') {
        Conversation
        .find({userID1: req.query.ID1, userID2: req.query.ID2})
        .then(convo => {
            res.status(200).json({
                conversation: convo
            })
        })
    }
    if(req.query.mode === 'check-event') {
        Conversation
        .find({userID: req.query.userID, eventID: req.query.eventID})
        .then(convo => {
            res.status(200).json({
                conversation: convo
            })
        })
    }
    

});


router.get('/:id',(req,res,next) => {
    Conversation
    .find({_id: req.params.id})
    .then((conversation) => {
        res.status(200).json({
            conversation
        });
    });
});

//deleting, :id refers to custom id of document
router.delete('/:id',
    checkAuth,(req,res,next) => {
    Conversation
    .deleteOne({_id: req.params.id})
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'conversation deleted',
            result: result
        });
    });
});

module.exports = router;