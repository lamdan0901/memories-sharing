import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const logIn = async (req, res) => {
  const { email, password } = req.body;

  // of course we should return the same message for both wrong email and password, we do this for dev purpose
  try {
    const currentUser = await User.findOne({ email });
    if (!currentUser)
      return res.status(404).json({ message: "User not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      currentUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credential" });

    const token = jwt.sign(
      { email: currentUser.email, id: currentUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ currentUser, token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signUp = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  const userExisted = await User.findOne({ email });
  if (userExisted)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 12);

  try {
    const result = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
    res.status(201).json({ message: "User created", result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err._message });
  }
};
