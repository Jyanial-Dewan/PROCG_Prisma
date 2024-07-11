import express from "express";
import routes from "./Routes/index.js";
const app = express();
const PORT = process.env.PORT || 2333;

app.use(express.json());

app.use(routes);

app.get("/", (req, res) => {
  res.send("Welcom to PROCG Testing server.");
});
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));
