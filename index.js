const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const PORT = 8080;
const authRoutes = require("./routes/users.routes");
const { Configuration, OpenAIApi } = require("openai");
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

app.get("/", (req, res) => {
  res.send("Api is working");
});

app.use("/", authRoutes);



app.listen(PORT, () => {
  console.log(`app is listen at port ${PORT}`);
});
