const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

const connectDB = require("./config/database");

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
