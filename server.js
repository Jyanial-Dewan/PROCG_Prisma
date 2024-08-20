const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
      origin:"http://192.168.0.106:8000",
      methods: ["GET", "POST"]
  }
})
const allowedOrigins = [
    "http://localhost:5173",
    "http://192.168.0.106:3000",
    "http://192.168.0.106:8000"
  ];
  const options = {
    origin: allowedOrigins,
  };
app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));


// Store online users in an object
const onlineUsers = {};

// Store offline users in an object
const offlineUsers = {};

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("register", (username) => {
    onlineUsers[username] = socket.id;
    console.log('user registered', username);

    if (offlineUsers[username]) {
      offlineUsers[username].forEach(msg => {
          socket.emit('message', msg);
      });
      delete offlineUsers[username];
  }
  });

  socket.on('sendMessage', ({id, sender, recivers, subject, body, date, status}) => {
    recivers.forEach((reciver) => {
      const recipientSocketId = onlineUsers[reciver];
      if(recipientSocketId){
          io.to(recipientSocketId).emit('message', {
              id, sender, recivers, subject, body, date, status
          })
      }
      else {
        if(!offlineUsers[reciver]) {
          offlineUsers[reciver] = [];
        }

        offlineUsers[reciver].push({id, sender, recivers, subject, body, date, status})
      }
    })
    
    console.log(id, sender, recivers, subject, body, date, status)
  });

  socket.on("disconnect", () => {
    console.log('disconncted', socket.id)
  })

});




server.listen(PORT, () => console.log(`Server is running ${PORT}.`));
