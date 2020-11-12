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





router.post('',multer({storage: storage}).single('image'),(req,res,next) => {
    const url = req.protocol + '://' + req.get('host')
    const event = new Event({
        title: req.body.title,
        desc: req.body.desc,

        organisator: req.body.organisator,
        time: req.body.time, //{start, end}
        address: req.body.address,
        coords: req.body.coords,
        iconImg: url + '/images/' + req.file.filename,
        type: req.body.type,
        tags: req.body.tags,
        price: req.body.price,
        additional: req.body.additional,
        plan: req.body.plan,

        ticketsLink: req.body.ticketsLink || '',

        website1: req.body.website1 || '',
        website2: req.body.website2 || '',
        phone: req.body.phone || '',
        email: req.body.email || '',

        commentsID: req.body.commentsID,
        participantsID: req.body.participantsID,

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




router.get('',(req,res,next) => {
    Event.find().then((documents) => {
        res.status(200).json({
            events: documents
        });
    });
});


router.delete('/:id',(req,res,next) => { 
    Event.deleteOne({_id: req.params.id}).then(result => { 
        res.status(200).json({ message: 'post deleted'});
    }) 
})

module.exports = router;

