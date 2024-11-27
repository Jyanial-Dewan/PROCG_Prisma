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

const options = {
  origin: JSON.parse(process.env.ALLOWED_ORIGINS),
};
app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));

//Socket
let users = {};
const url = process.env.VALKEY_URI;

const pub = new Redis(url);
const sub = new Redis(url);

sub.subscribe("NOTIFICATION-MESSAGES");
sub.on("message", (channel, message) => {
  if (channel === "NOTIFICATION-MESSAGES") {
    const newMessage = JSON.parse(message);
    newMessage.recivers.forEach((reciver) => {
      io.to(reciver).emit("receivedMessage", newMessage);
    });
  }
});

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
    next();
  }
});

io.on("connection", (socket) => {
  socket.on(
    "sendMessage",
    async ({
      id,
      sender,
      recivers,
      subject,
      body,
      date,
      status,
      parentid,
      involvedusers,
      readers,
      holders,
      recyclebin,
    }) => {
      await pub.publish(
        "NOTIFICATION-MESSAGES",
        JSON.stringify({ id, sender, subject, date, parentid, recivers })
      );

      io.to(sender).emit("sentMessage", {
        id,
        sender,
        recivers,
        subject,
        body,
        date,
        status,
        parentid,
        involvedusers,
        readers,
        holders,
        recyclebin,
      });
    }
  );

  socket.on("sendDraft", (data) => {
    io.to(data.sender).emit("draftMessage", data);
  });

  socket.on("draftMsgId", ({ id, user }) => {
    io.to(user).emit("draftMessageId", id);
  });

  socket.on("read", async ({ id, user }) => {
    io.to(user).emit("sync", id);
  });

  socket.on("countSyncSocketMsg", ({ id, user }) => {
    io.to(user).emit("removeMsgFromSocketMessages", id);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    for (const key in users) {
      users[key] = users[key].filter((id) => id !== socket.id);
      if (users[key].length === 0) {
        delete users[key];
      }
    }
  });
});

server.listen(PORT, () => console.log(`Server is running ${PORT}.`));

//id, sender, recivers,  subject,  body, date,   status,  parentid,   involvedusers,  readers,
