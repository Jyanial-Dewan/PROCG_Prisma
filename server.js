const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
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
  credentials: true,
};

app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Import and initialize socket.io handlers
require("./Services/Socket/socket")(io);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
