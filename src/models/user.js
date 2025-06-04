const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      // unique: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is not valid");
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "other"], //you can directly use enum
      validate(value) {
        //  or use custom validation function
        if (!["male", "female", "other"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoId: {
      type: String,
      default: "https://www.w3schools.com/howto/img_avatar.png",
    },
    about: {
      type: String,
      default: "This is a default bio",
      maxlength: 100,
    },
    skills: {
      type: [String],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

userSchema.index({ firstName: "text", lastName: "text" });
module.exports = mongoose.model("User", userSchema);
