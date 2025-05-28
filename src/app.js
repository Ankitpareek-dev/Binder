const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

const User = require("./models/user");
const connectDB = require("./config/database");
const { model } = require("mongoose");

// Middleware to parse JSON request bodies
app.use(express.json());

// GET api to fetch all users
app.get("/feed", async (req, res) => {
  const allUser = await User.find({});
  res.send(allUser);
});

// GET api to fetch a specific user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  // console.log(userEmail);

  try {
    res.send(await User.find({ emailId: userEmail }));
  } catch (err) {
    console.error("Error fetching user:", err);
    return res.status(500).send("Error fetching user");
  }
});

// POST api to create a new user
app.post("/signup", async (req, res) => {
  // Extracting user data from request body
  const user = new User(req.body);

  console.log(user.firstName);

  // saving user info with error handling
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error saving user:", err);
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
