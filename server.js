const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();
const multer = require("multer");
const serviceAccount = require("./Services/Google-Services/procg-a924f-firebase-adminsdk-fbsvc-4a429b1195.json");
const admin = require("firebase-admin");

const PORT = process.env.PORT;
const server = http.createServer(app);
const userTokens = {};
console.log(userTokens);

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

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(express.json());
app.use(cors(options));
app.use(require("./Routes/index"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(500).json({ error: "An unexpected error occurred." });
  }
  next();
});

// Register device tokens with usernames
app.post("/register-token", (req, res) => {
  const { token, username } = req.body;

  if (!username || !token) {
    return res.status(400).send("Username and token are required");
  }

  // Add the token to the user's list of tokens
  if (!userTokens[username]) {
    userTokens[username] = new Set();
  }
  userTokens[username].add(token);

  console.log(`Registered token: ${token} for user: ${username}`);
  res.send("Token registered successfully");
});

app.post("/send-notification", async (req, res) => {
  const { sender, recivers, subject, body } = req.body;

  if (!sender || !recivers || !subject || !body) {
    return res
      .status(400)
      .send("sender, recivers, subject, and body are required");
  }

  let allTokens = new Set();
  recivers.forEach((username) => {
    if (userTokens[username]) {
      userTokens[username].forEach((token) => allTokens.add(token));
    }
  });

  if (allTokens.size === 0) {
    return res.status(404).send("No tokens found for the specified users");
  }

  const tokensArray = Array.from(allTokens);

  tokensArray.forEach(async (token) => {
    try {
      await admin.messaging().send({
        notification: {
          title: `${sender}: ${subject}`,
          body: body,
        },
        token: token,
      });
      return res
        .status(201)
        .json({ message: "notification sent to the users" });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  });
});

// Import and initialize socket.io handlers
require("./Services/Socket/socket")(io);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}.`));
