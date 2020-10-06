const express = require('express');

const router = express.Router()
const Event = require('../models/event');
const Comment = require('../models/comment')

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


//for posting
router.post('',multer({storage: storage}).single('image'),(req,res,next) => {
    //create new object with mongoose schema
    const url = req.protocol + '://' + req.get('host')
    const event = new Event({
        title: req.body.title,
        desc: req.body.desc,
        //imagePath: url + '/images/' + req.file.filename,

        title: req.body.title,
        organisator: req.body.organisator,
        time: req.body.time, //{start, end}
        address: req.body.address,
        coords: req.body.coords,
        iconImg: url + '/images/' + req.file.filename,
        type: req.body.type,
        tags: req.body.tags,
        price: req.body.price,
        additional: req.body.additional,
        desc: req.body.desc,
        plan: req.body.plan,
        votes: req.body.votes,

        userID: req.body.userID
    });
    event.save().then(createdPost => {
        res.status(201).json({
            message: 'post added successfully',
            post: {
                createdPost
            }
        })        
    })

});

router.post('/:id', (req, res, next) => {
    if(req.body.mode === 'comment'){
        const newComment = new Comment(req.body.newComment);  
        const eventID = req.params.id;

        Event.updateOne({_id: eventID},
            {$push: {comments: newComment}}).then(comment => {
                res.status(200).json({
                    data: newComment
                })
            })  
        
    }else if(req.body.mode === 'response'){
        const newResponse = new Comment(req.body.newResponse);
        const commentID = req.body.commentID;
        const eventID = req.params.id;
        
        console.log(req.body.mode)
//"comments._id": commentID
        Event
        .findOneAndUpdate({_id: eventID, "comments": { "$exists": true }}, 
        {$push : {"comments.$[commentID].responses" : newResponse}},{
            "arrayFilters": [
              {"commentID._id" : commentID},
            ]
        })
        .then(response => {
            res.status(200).json({
                data: newResponse
            })
        })
        
    }
    

})

// editing 
router.put("/:id"), (req, res, next) => {
    const event = new Event({
        _id: req.body.id,
        title: req.body.title,
        desc: req.body.desc,
        imagePath: url + '/images/' + req.file.filename,

        title: req.body.title,
        ogranisator: req.body.ogranisator,
        time: req.body.time, //{start, end}
        address: req.body.address,
        coords: req.body.coords,
        iconImg: url + '/images/' + req.file.iconImg,
        type: req.body.type,
        tags: req.body.tags,
        price: req.body.price,
        additional: req.body.additional,
        desc: req.body.desc,
        plan: req.body.plan,
        comments: [],

        totalSaved: 0,
        totalComments: 0,

        userID: req.userData.userId
    });
      Event.updateOne({_id: req.params.id, userID: req.userData.userId }, event).then(result => {
        res.status(200).json({ message: "Update successful!" });
      });
    
}


//app.get, app.delete etc. 

//for getting
//path to filter, only use this shit if website is api/posts
router.get('',(req,res,next) => {
    //get from database n shit
    Event.find().then((documents) => {
        res.status(200).json({
            events: documents
        });
    });

});

//deleting, :id refers to custom id of document
router.delete('/:id',(req,res,next) => { //refers back to service
    Event.deleteOne({_id: req.params.id}).then(result => { //, userID: req.userData.userId 
        res.status(200).json({ message: 'post deleted'});
    }) //refer to :id, or w/e you choose
    
})

module.exports = router;

