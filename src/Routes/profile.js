const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user; // The user is set in the userAuth middleware
    res.send("welcome " + user.firstName);
  } catch (err) {
    return res.status(500).send("Error fetching profile");
  }
});

module.exports = profileRouter;
