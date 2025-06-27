const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const User = require("./models/user");
const connectDB = require("./config/database");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// const { userAuth } = require("./middlewares/auth");

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Adjust this to your frontend URL
    credentials: true, // Allow cookies to be sent with requests
  })
);
app.use(cookieParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/request");
const userRouter = require("./Routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

//connecting to the database and starting the server
connectDB()
  .then(() => {
    console.log("database connected successfully");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });
