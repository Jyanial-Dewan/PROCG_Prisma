const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { Redis } = require("ioredis");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT;
const server = http.createServer(app);

const io = socketIo(server, {
  path: "/socket.io/",
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://129.146.53.68:5000",
  "http://129.146.53.68:3000",
  "http://129.146.53.68:8000",
  "https://procg.viscorp.app",
];

const options = {
  origin: allowedOrigins,
};
app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));

//Socket
let users = {};
const url = process.env.VALKEY_URI;

const pub = new Redis(url);
const sub = new Redis(url);

io.use((socket, next) => {
  const key = socket.handshake.query.key;

  if (!key) {
    return;
  } else {
    socket.join(key);
    console.log(`User ${socket.id} joined room ${key}`);
    if (!users[key]) {
      users[key] = [];
    }
    users[key].push(socket.id);
    sub.subscribe("NOTIFICATION-MESSAGES");
    next();
  }
});

io.on("connection", (socket) => {
  socket.on("sendMessage", async (data) => {
    await pub.publish("NOTIFICATION-MESSAGES", JSON.stringify(data));
    // { id, sender, recivers, subject,  body, date,  status, parentid, involvedusers, readers, }
    console.log("sendMessage2");
    sub.on("message", (channel, message) => {
      if (channel === "NOTIFICATION-MESSAGES") {
        const newMessage = JSON.parse(message);
        console.log(newMessage, "message 3");
        newMessage.recivers.forEach((reciver) => {
          console.log("first message 4");
          io.to(reciver).emit("receivedMessage", newMessage);
        });
      }
    });
    io.to(data.sender).emit("sentMessage", JSON.stringify(data));
  });

  // socket.on("sendMessage", async (data) => {
  //   io.to(data.sender).emit("sentMessage", data);
  // });

  socket.on("sendDraft", (data) => {
    io.to(data.sender).emit("draftMessage", data);
  });

  socket.on("read", async ({ id, user }) => {
    io.to(user).emit("sync", id);
  });
  socket.on("countSyncSocketMsg", async ({ id, user }) => {
    io.to(user).emit("removeMsgFromSocketMessages", id);
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

//id, sender, recivers,  subject,  body, date,   status,  parentid,   involvedusers,  readers,
