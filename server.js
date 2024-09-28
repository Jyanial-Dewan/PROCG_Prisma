const express = require("express");
const http = require('http');
const socketIo = require('socket.io');
const cors = require("cors");
const app = express();
const prisma = require('./DB/db.config');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server, {
  cors: {
      origin: "*",
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


//Socket
let users = {};

// Temporary store for offline messages
let offlineMessages = {};

io.use((socket, next) => {
  const key = socket.handshake.query.key;

  if(key) {
      socket.join(key);
      console.log(`User ${socket.id} joined room ${key}`);
      if (!users[key]) {
        users[key] = [];
      }
      users[key].push(socket.id);

      if(offlineMessages[key]) {
        offlineMessages[key].forEach((msg) => {
          console.log("offline", msg)
          socket.emit("message", msg)
        });
        offlineMessages[key] = [];
      }
      next();
  }
})

io.on("connection", (socket) => {
  socket.on('sendMessage', async ({id, sender, recivers, subject, body, date, status, parentid, involvedusers}) => {
    await prisma.messages.create({
      data: {
        id: id,
        sender: sender,
        recivers: recivers,
        subject: subject,
        body: body,
        date: date,
        status: status,
        parentid: parentid,
        involvedusers: involvedusers
      },
    });  

    recivers.forEach((reciver) => {
      io.to(reciver).emit('message', {id, sender, recivers, subject, body, date, status, parentid, involvedusers});

      if(!offlineMessages[reciver]) {
        offlineMessages[reciver] = [];
      }

      offlineMessages[reciver].push({id, sender, recivers, subject, body, date, status, parentid, involvedusers});

      // const onlineUsers = io.sockets.adapter.rooms.get(reciver) || [];

      // if (users[reciver]?.length !== onlineUsers.size) {
      //   offlineMessages[reciver].push({id, sender, recivers, subject, body, date, status, parentid, involvedusers});
      // }
      });
      
  });

  socket.on("read", ({id, user}) => {
    io.to(user).emit("sync", id)
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    // Remove user from the room tracking (optional for simplicity)
    for (const room in users) {
      users[room] = users[room].filter((id) => id !== socket.id);
    }
  });
});  

  
server.listen(PORT, () => console.log(`Server is running ${PORT}.`));
