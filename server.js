//import in node: require
const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

const server = http.createServer(app);
const io = require('socket.io')(server, { transport : ['websocket'] })



const normalizePort = val => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

const port = normalizePort(process.env.PORT || "3000");

app.set("port", port);

//server.on("error", onError);
//server.on("listening", onListening);






server.listen(port, () => {
  console.log("Listening on port " + port);
});

io.on('connection', (socket) => {

  socket.on('new message', (data, room) => {
    // we tell the client to execute 'new message'
    // broadcast = all sockets but you, 
    socket.to(room).emit('new message', {
      message: data,
      room: room
    });
    //console.log(data)
  });

  socket.on('join room', (room) => {
    socket.join(room)
  });

  socket.on('leave room', (room) => {
    socket.leave(room)
  });
})


//server.listen(port, ()=> {console.log('listening')});
