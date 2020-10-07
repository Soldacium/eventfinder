const express = require('express');

const router = express.Router()
const Event = require('../models/event');
const EventComments = require('../models/event-comments')
const Comment = require('../models/comment');

router.post('', (req,res,next) => {
    const eventComments = new EventComments({
        comments: []
    })

    eventComments.save().then(comments => {
        res.status(200).json({
            message: 'event comments added',
            data: comments
        })
    })
})


router.post('/:id', (req, res, next) => {
    console.log(req.body.mode)
    if(req.body.mode === 'comment'){
        const newComment = new Comment(req.body.newComment);  
        

        EventComments.updateOne({_id: req.params.id},
            {$push: {comments: newComment}}).then(comment => {
                res.status(200).json({
                    data: newComment
                })
            })  
        
    }else if(req.body.mode === 'response'){
        const newResponse = new Comment(req.body.newComment);
        const commentID = req.body.commentID;
        const commentsID = req.params.id;

        console.log(commentID, commentsID)
        
        EventComments.findOneAndUpdate({_id: commentsID, "comments": { "$exists": true }}, 
        {$push : {"comments.$[commentID].responses" : newResponse}},{
            "arrayFilters": [
              {"commentID._id" : commentID},
            ]
        })
        .then(response => {
            res.status(200).json({
                data: newResponse
            });
        });
    }
})

router.get('/:id',(req,res,next) => {
    EventComments.findOne({_id: req.params.id})
    .then(comments => {
        res.status(200).json({
            comments: comments
        })
    })
})

module.exports = router;