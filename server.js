// import express from "express";
// const routes = require('./Routes/index')
const express = require('express');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 2333;

app.use(express.json());
app.use(cors());

app.use(require('./Routes/index'));

app.get("/", (req, res) => {
  res.send("Welcom to PROCG Testing server.");
});
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
