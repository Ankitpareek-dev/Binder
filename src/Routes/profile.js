const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");

profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user; // The user is set in the userAuth middleware
    res.send(user);
  } catch (err) {
    return res.status(500).send("Error fetching profile");
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid fields in request");
    }
    const loggedInUser = req.user;
    const updateData = req.body;
    await User.findByIdAndUpdate(loggedInUser._id, updateData);
    res.send("edit successful"); // The user is set in the userAuth middleware
  } catch (err) {
    return res.status(500).send("Error updating profile");
  }
});

profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const { oldPassword, newPassword } = req.body;

    const hashedOldPassword = loggedInUser.password;
    console.log(hashedOldPassword);
    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      hashedOldPassword
    );
    if (isPasswordValid) {
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      await User.findByIdAndUpdate(loggedInUser._id, {
        password: hashedNewPassword,
      });
    } else {
      return res.status(400).send("Old password is incorrect");
    }
    // console.log(isPasswordValid);
    res.send("Password update successful");
  } catch (err) {
    return res.status(500).send("Error updating password");
  }
});

module.exports = profileRouter;
