const mongoose = require("mongoose");

const user2Schema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minLength: [5, "Password length is at lest 5 characters"],
    },
    avatar: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User2", user2Schema);
