//this is node js server app, but made easier with express
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser');
//mongoose for connecting to database
const mongoose = require('mongoose')

//import routes
const eventsRoutes = require('./routes/events');
const eventCommentsRoutes = require('./routes/event-comments');
const eventParticipantsRoutes = require('./routes/event-participants');
const messagesRoutes = require('./routes/messages')
const messagesGroupRoutes = require('./routes/messages-group')
const authRoutes = require('./routes/auth')

const userCompanionsRoutes= require('./routes/user-companions');
const userDataRoutes= require('./routes/user-data');
const userFeedRoutes= require('./routes/user-feed');

const app = express();






mongoose.connect('mongodb+srv://CoolNewUser:VPpkY6t5lUnSqqAG@eventfinder.chq9z.mongodb.net/EventFinder?retryWrites=true&w=majority', { useNewUrlParser: true , useUnifiedTopology: true}) //if not working remowe retrywrites
    .then(() => {
        console.log('connected')
    })
    .catch(() =>{
        console.log('nope')
    })
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({extended: false}));





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


app.use("/images", express.static(path.join('backend/images')));
app.use("/images-users", express.static(path.join('backend/images-users')));
app.use("/images-users-feed", express.static(path.join('backend/images-users-feed')));

app.use('/api/events',eventsRoutes);
app.use('/api/event-comments',eventCommentsRoutes);
app.use('/api/event-participants',eventParticipantsRoutes);

app.use('/api/auth',authRoutes);
app.use('/api/user-data', userDataRoutes);
app.use('/api/user-feed', userFeedRoutes);
app.use('/api/user-companions', userCompanionsRoutes);

app.use('/api/messages',messagesRoutes);
app.use('/api/messages-group',messagesGroupRoutes);

//export to server
module.exports = app;