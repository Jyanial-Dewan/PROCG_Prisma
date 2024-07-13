// import express from "express";
// const routes = require('./Routes/index')
const express = require("express");
const cors = require("cors");
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const PORT = process.env.PORT || 2333;
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

app.use(express.json());
app.use(cors());

app.use(require("./Routes/index"));

app.get("/", (req, res) => {
  res.send("Welcom to PROCG Testing server.");
});

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
