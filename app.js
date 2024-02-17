const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config();
const app = express();
const cors = require('cors');

const userRouter = require("./routes/user-routes");
const propertyRouter = require("./routes/property-routes");
const roomRouter = require("./routes/room-routes");

app.use(express.json());

// Allow all origins temporarily
app.use(cors());

// Use the CORS handler --------
// const allowedOrigins = ['*'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// }

//routing
app.use('/users', userRouter);
app.use('/property', propertyRouter);
app.use('/room', roomRouter)

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

// handle CORS
// app.options('*', cors());