//database connection logic using Mongoose.

const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://ankitpareekdev:aEEPV2AyF3B8zBK4@hellodb.tim6dob.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
