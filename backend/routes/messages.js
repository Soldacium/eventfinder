const express = require('express');

const router = express.Router()
const Conversation = require('../models/conversation')
const Message = require('../models/message')

const checkAuth = require('../middleware/check-auth')


router.post('', (req,res,next) => {
    console.log(req.body)
    const conversation = new Conversation({
        conversationName: req.body.conversationName,
        userID1: req.body.userID1,
        userName1: req.body.userName1,
        userImg1: req.body.userImg1,
        userID2: req.body.userID2,
        userName2: req.body.userName2,
        userImg2: req.body.userImg2,
        type: 'event',
        messages: []
    })

    conversation.save().then(response => {
        res.status(200).json({
            message: response,
        })
    })
})

//post single message
router.post('/:id',  (req,res,next) => { //create new object with mongoose schema
    
    const message = new Message({
        senderID: req.body.senderID,
        message: req.body.message,
        date: req.body.date,
    })
    console.log(req.body, message)
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


// gets all conversations where ethier user is current user
router.get('', (req,res,next) => {
    const userID = req.param('userID');
    /*
    Conversation.find().then((documents) => {
        res.status(200).json({
            events: documents
        });
    });
    */
    if(req.param('mode') === 'user'){
        console.log(userID)
        Conversation
        .find({$or : [{userID1: userID}, {userID2: userID}]})
        .then(userConversations => {
            console.log(userConversations)
            res.status(200).json({
                userConversations
            });
        });
    }else {
        
    }
    

});

//get one conversation with id
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