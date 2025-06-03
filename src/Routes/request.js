const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");

requestRouter.post(
  "/sendConnectionRequest/:status/:userId",
  userAuth,
  async (req, res) => {
    const user = req.user;
    const toUserId = req.params.userId;
    const fromUserId = user._id;

    try {
      const existingRequest = await ConnectionRequestModel.findOne({
        fromUserId,
        toUserId,
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Request already sent" });
      }
      const newRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status: req.params.status,
      }).save();
      res.send({
        message: "Connection request sent successfully",
        request: newRequest,
      });
    } catch (error) {
      console.error("Error sending connection request:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
);

module.exports = requestRouter;
