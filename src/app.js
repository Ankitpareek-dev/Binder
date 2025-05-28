const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();

const User = require("./models/user");
const connectDB = require("./config/database");

// Middleware to parse JSON request bodies
app.use(express.json());

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
