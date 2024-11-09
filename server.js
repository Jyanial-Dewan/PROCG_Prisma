const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const { Redis } = require("ioredis");
const app = express();

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = socketIo(server, {
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
  "https://129.146.53.68:8000",
  "https://procg.viscorp.app",
  "http://192.168.0.106:3000",
  "http://192.168.0.106:8000",
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
    }) => {
      await pub.publish(
        "NOTIFICATION-MESSAGES",
        JSON.stringify({ id, sender, subject, date, parentid, recivers })
      );

      sub.on("message", (channel, message) => {
        if (channel === "NOTIFICATION-MESSAGES") {
          const newMessage = JSON.parse(message);
          console.log(newMessage);
          newMessage.recivers.forEach((reciver) => {
            io.to(reciver).emit("receivedMessage", newMessage);
          });
        }
      });
      // recivers.forEach((reciver) => {
      //   io.to(reciver).emit("message", {
      //     id,
      //     sender,
      //     recivers,
      //     subject,
      //     body,
      //     date,
      //     status,
      //     parentid,
      //     involvedusers,
      //     readers,
      //   });
      // });

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
      });
    }
  );

  socket.on(
    "sendDraft",
    ({
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
    }) => {
      io.to(sender).emit("draftMessage", {
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
      });
    }
  );

  socket.on("read", async ({ id, user }) => {
    io.to(user).emit("sync", id);
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
