const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();

const userRouter = require("./routes/user-routes")
app.use(express.json());

//routing
app.use('/users', userRouter)

// Mongoose connection ----------
const databaseURL = process.env.DATABASE_URL;
const port = process.env.PORT || 4000;
mongoose.connect(
  databaseURL
).then(() =>
  app.listen(port, () => {
    console.log(`connected on ${port}`)
  })
).catch((err) => {
  console.log("mongoose error:", err);
})