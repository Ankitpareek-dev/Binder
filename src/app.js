const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");
const app = express();
const { hashPassword } = require("./utils/passHashing");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const User = require("./models/user");
const connectDB = require("./config/database");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

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

  // Hashing the password before saving
  user.password = await hashPassword(user.password);

  // saving user info with error handling
  try {
    await user.save();
    res.send("User created successfully");
  } catch (err) {
    console.error("Error saving user:", err);
    return res.status(500).send("Error creating user");
  }
});

//post api to sign in a user
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await model("User").findOne({ emailId });
    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Creating a JWT Token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790");
      // Setting the token in cookies
      res.cookie("token", token);
      res.send("Login successful");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    console.error("Error during login:", err);
    return res.status(500).send("Error during login");
  }
});

app.get("/profile", async (req, res) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    if (!token) {
      throw new Error("No user found");
    }

    const decodedMessage = jwt.verify(token, "DEV@Tinder$790");
    const user = await User.findById(decodedMessage._id);
    console.log(user);
    res.send("welcome " + user.firstName);
  } catch (err) {
    return res.status(500).send("Error fetching profile");
  }
});
//patch api to change user details
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params.userId;
  const data = req.body;

  console.log(data);
  if (req.body.skills > 10) {
    return res.status(400).send("Skills array cannot exceed 10 items");
  }

  const allowedUpdates = ["photoUrl", "bio", "gender", "age"];
  const isUpdateALlowed = Object.keys(data).every((key) =>
    allowedUpdates.includes(key)
  );
  if (!isUpdateALlowed) {
    return res.status(400).send("Invalid update fields");
  }
  try {
    await User.findByIdAndUpdate(userId, data, {
      runValidators: true, // Validate the update against the schema
    });

    res.send("User updated successfully");
  } catch (err) {
    console.error("Error updating user:", err);
    return res.status(500).send("Error updating user");
  }
});

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
