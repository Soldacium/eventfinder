//this is node js server app, but made easier with express
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
//mongoose for connecting to database
const mongoose = require('mongoose')

//import routes
const eventsRoutes = require('./routes/events');
const messagesRoutes = require('./routes/messages')
const authRoutes = require('./routes/auth')

// multer for images
//const multer = require('multer');

const app = express();






mongoose.connect('mongodb+srv://Wojtemon:22moko22@eventfinder.chq9z.mongodb.net/EventFinder?retryWrites=true&w=majority') //if not working remowe retrywrites
    .then(() => {
        console.log('connected')
    })
    .catch(() =>{
        console.log('nope')
    })
app.use(bodyParser.json()); //can also do html
app.use(bodyParser.urlencoded({extended: false}));



// sth sth middleware, needed to comunicate with other IPs

app.use((req,res,next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      'Access-Control-Allow-Credentials', 'true'
    )
    next();
})


app.use("/images", express.static(path.join('backend/images')))

app.use('/api/events',eventsRoutes)
app.use('/api/auth',authRoutes)
app.use('/api/messages',messagesRoutes)

//export to server
module.exports = app;