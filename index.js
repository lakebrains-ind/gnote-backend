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

app.get("/openai", (req, res) => {
  let question = req.query.question;
  try {
    const configuration = new Configuration({
      apiKey: process.env.API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const completion = openai.createCompletion({
      model: "text-davinci-003",
      prompt: question,
      max_tokens: 1000,
    });

    completion.then((r) => {
      res.status(200).json({
        question: question,
        answer: r.data.choices[0].text,
      });
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(PORT, () => {
  console.log(`app is listen at port ${PORT}`);
});
