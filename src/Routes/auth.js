const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { hashPassword } = require("../utils/passHashing");
const { model } = require("mongoose");

// POST api to create a new user
authRouter.post("/signup", async (req, res) => {
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
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await model("User").findOne({ emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      // Creating a JWT Token
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$790", {
        expiresIn: "1d",
      });
      // Setting the token in cookies
      res.cookie("token", token, {
        httpOnly: true, // can't be accessed from JS
        secure: isProd, // true if on HTTPS (Render), false for localhost
        sameSite: "none", // allow cross-site cookie setting
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      res.send({
        message: "Login successful",
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailId: user.emailId,
          age: user.age,
          gender: user.gender,
          photoId: user.photoId,
          about: user.about,
          skills: user.skills,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
        token,
      });
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    return res.status(400).send(err.message);
  }
});

authRouter.post("/logout", async (req, res) => {
  res
    .cookie("token", null, {
      expires: new Date(Date.now()),
    })
    .send("Logged out successfully");
});

module.exports = authRouter;
