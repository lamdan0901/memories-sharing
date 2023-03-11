import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, lowercase: true, required: true },
  password: { type: String, required: true, minLength: 3 },
  avatar: String,
  createdAt: {
    type: Date,
    immutable: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: () => Date.now(),
  },
});

const User = mongoose.model("User", userSchema);
export default User;

// we can have a validate function like this:
// validate: {
//  validator: value=>value.length>3,
//  message: props=> `${props.value} is not a valid password`
// }
