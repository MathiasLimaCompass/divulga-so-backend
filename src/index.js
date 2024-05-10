const express = require("express");
const router = require("./Utils/router");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const mongodbUrl = process.env.MONGO_URI;

mongoose
  .connect(mongodbUrl)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors());
app.use("/files", express.static("src/uploads"));
app.use(express.json());
app.use(router);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server is running on port 3000");
});
