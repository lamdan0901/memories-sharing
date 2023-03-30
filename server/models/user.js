const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    verificationCode: { type: String },
    isVerified: { type: Boolean, required: true, default: false },
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

module.exports = mongoose.model("User", userSchema);

// we can have a validate function like this:
// validate: {
//  validator: value=>value.length>3,
//  message: props=> `${props.value} is not a valid password`
// }
