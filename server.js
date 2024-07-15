// import express from "express";
// const routes = require('./Routes/index')
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const dotenv = require("dotenv");
dotenv.config;
const PORT = process.env.PORT || 3000;
const crypto = require("crypto");

const saltLength = 16;
const iterations = 1000;
const keyLength = 64;
const digest = "sha256";
// Hash password
function hashPassword(password) {
  const salt = crypto.randomBytes(saltLength).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, digest)
    .toString("hex");
  return `${salt}:${hash}`;
}

const allowedOrigins = [
  "http://129.146.85.244:3001",
  "http://localhost:3001",
  "http://129.146.85.244:3000",
];
const options = {
  origin: allowedOrigins,
};

app.use(express.json());
app.use(cors(options));

app.use(require("./Routes/index"));

// app.get("/", (req, res) => {
//   res.send("Welcom to PROCG Testing server.");
// });
/***
 *
 * frontend starts
 *
 */

app.use(express.static(path.join(__dirname, "./dist")));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./dist/index.html"));
});
// app.use(express.static("dist"));
/***
 *
 * frontend ends
 */

//---------------------------------
app.post("/encrypt", (req, res) => {
  const { data } = req.body;
  const encryptedData = hashPassword(data);

  res.json({ encryptedData });
});

// Example route for decryption
app.post("/decrypt", (req, res) => {
  const { data } = req.body;

  const decryptedData = verifyPassword(data);
  res.json({ decryptedData });
});
//
//------------------------------

app.listen(PORT, () => console.log(`Server is running ${PORT}.`));
