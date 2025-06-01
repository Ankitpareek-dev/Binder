const express = require("express");
const app = express();
const { hashPassword } = require("./utils/passHashing");
const cookieParser = require("cookie-parser");
const User = require("./models/user");
const connectDB = require("./config/database");
const { model } = require("mongoose");
const jwt = require("jsonwebtoken");
// const { userAuth } = require("./middlewares/auth");

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./Routes/auth");
const profileRouter = require("./Routes/profile");
const requestRouter = require("./Routes/resquest");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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

//   // GET api to fetch all users
// app.get("/feed", async (req, res) => {
//   const allUser = await User.find({});
//   res.send(allUser);
// });

// // GET api to fetch a specific user by email
// app.get("/user", async (req, res) => {
//   const userEmail = req.body.emailId;
//   // console.log(userEmail);

//   try {
//     res.send(await User.find({ emailId: userEmail }));
//   } catch (err) {
//     console.error("Error fetching user:", err);
//     return res.status(500).send("Error fetching user");
//   }
// });

// //patch api to change user details
// app.patch("/user/:userId", async (req, res) => {
//   const userId = req.params.userId;
//   const data = req.body;

//   console.log(data);
//   if (req.body.skills > 10) {
//     return res.status(400).send("Skills array cannot exceed 10 items");
//   }

//   const allowedUpdates = ["photoUrl", "bio", "gender", "age"];
//   const isUpdateALlowed = Object.keys(data).every((key) =>
//     allowedUpdates.includes(key)
//   );
//   if (!isUpdateALlowed) {
//     return res.status(400).send("Invalid update fields");
//   }
//   try {
//     await User.findByIdAndUpdate(userId, data, {
//       runValidators: true, // Validate the update against the schema
//     });

//     res.send("User updated successfully");
//   } catch (err) {
//     console.error("Error updating user:", err);
//     return res.status(500).send("Error updating user");
//   }
// });
