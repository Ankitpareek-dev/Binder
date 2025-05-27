const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

const User = require("./models/user");
const connectDB = require("./config/database");

app.post("/signup", async (req, res) => {
  const user = new User({
    firstName: "Ankit",
    lastName: "Pareek",
    emailId: "ankit@pareek.com",
    password: "xyz",
    age: 12,
    gender: "male",
  });

  // error handling
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error saving user:", error);
    return res.status(500).send("Error creating user");
  }
});

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
