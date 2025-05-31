// const adminAuth = (req, res, next) => {
//   const token = "xyz";
//   const validToken = token === "xyz";
//   if (validToken) {
//     next();
//   } else {
//     res.status(401).send("Unauthorized");
//   }
// };

const jwt = require("jsonwebtoken");
const User = require("../models/user");
const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("Unauthorized access");
    }

    const decodedMessage = await jwt.verify(token, "DEV@Tinder$790");

    const { _id } = decodedMessage;
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(400).send("Unauthorized access");
  }
};

module.exports = {
  userAuth,
};
// This code defines two middleware functions for authentication in an Express.js application.
