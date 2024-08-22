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
      origin: "http://localhost:5173",
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

io.on("connection", (socket) => {
  console.log("connected", socket.id);

  socket.on("register", (username) => {
    users[username] = socket.id;
    console.log('user registered', username);

    if (offlineMessages[username]) {
      console.log(offlineMessages[username]);
      socket.emit("offlineMessage", offlineMessages[username])
      delete offlineMessages[username];
    }
  });  

  socket.on('sendMessage', async ({id, sender, recivers, subject, body, date, status}) => {
    await prisma.messages.create({
      data: {
        id: id,
        sender: sender,
        recivers: recivers,
        subject: subject,
        body: body,
        date: date,
        status: status
      },
    });  

    recivers.forEach((reciver) => {
      const recipientSocketId = users[reciver];
      if(recipientSocketId){
          io.to(recipientSocketId).emit('message', { id, sender, recivers, subject, body, date, status})
      }

      if(!offlineMessages[reciver]) {
        offlineMessages[reciver] = [];
      }

      offlineMessages[reciver].push({id, sender, recivers, subject, body, date, status})
      });

    console.log(id, sender, recivers, subject, body, date, status)
  });

  socket.on('disconnect', () => {
    console.log('User disconnected', socket.id);
    delete users[socket.id];
  });
});


server.listen(PORT, () => console.log(`Server is running ${PORT}.`));
