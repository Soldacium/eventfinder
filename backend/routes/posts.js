const express = require('express');

const router = express.Router()
const Post = require('../models/post')

const multer = require('multer')

const checkAuth = require('../middleware/check-auth')

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
router.post('',
    checkAuth,multer({storage: storage}).single('image'),(req,res,next) => {
    //create new object with mongoose schema
    const url = req.protocol + '://' + req.get('host')
    const post = new Post({
        title: req.body.title,
        desc: req.body.desc,
        imagePath: url + '/images/' + req.file.filename,
    });
    console.log(post);
    post.save().then(createdPost => {
        res.status(201).json({
            message: 'post added successfully',
            post: {
                id: createdPost._id,
                title: createdPost.title,
                desc: createdPost.desc,
                imagePath: createdPost.imagePath
            }
        })        
    })

});

// editing 
router.put("/:id",
    checkAuth, (req, res, next) => {
    console.log(req,res)
    const post = new Post({
        _id: req.body.id,
        title: req.body.title,
        content: req.body.desc
      });
      Post.updateOne({ _id: req.params.id }, post).then(result => {
        res.status(200).json({ message: "Update successful!" });
      });
    
});


//app.get, app.delete etc. 

//for getting
//path to filter, only use this shit if website is api/posts
router.get(':id',(req,res,next) => {
    //get from database n shit
    Post.find().then((documents) => {
        console.log(documents)
        res.status(200).json({
            message: 'hey',
            posts: documents
        });
    });

});

//deleting, :id refers to custom id of document
router.delete('/:id',
    checkAuth,(req,res,next) => { //refers back to service
    Post.deleteOne({_id: req.params.id}).then(result => {
        console.log(result);
        res.status(200).json({ message: 'post deleted'});
    }) //refer to :id, or w/e you choose
    
})

module.exports = router;