require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRouter = require('./routes/authRouter')
const friendRouter = require('./routes/friendRoutes')

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter)
app.use("/api/users", friendRouter)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`DB connected & Server started at ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });
