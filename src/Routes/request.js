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
      // checking if request already exists
      const existingRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });
      if (existingRequest) {
        return res.status(400).json({ message: "Request already sent" });
      }
      //cheacking if the toUserId exists
      const toUser = await ConnectionRequestModel.findById(toUserId);
      if (!toUser) {
        res.send("User not found");
      }
      // checking if user is trying to send request to themselves
      if (fromUserId.toString() === toUserId.toString()) {
        return res
          .status(400)
          .json({ message: "You cannot send a request to yourself" });
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
