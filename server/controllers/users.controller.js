import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const logIn = async (req, res) => {
  const { username, password } = req.body;

  try {
    const currentUser = await User.findOne({ username });
    if (!currentUser)
      return res.status(404).json({ message: "User not exist" });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      currentUser.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credential" });

    const accessToken = jwt.sign(
      { email: currentUser.email, id: currentUser._id },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { email: currentUser.email },
      process.env.SECRET_KEY,
      { expiresIn: "7d" }
    );

    res.status(200).json({ currentUser, accessToken, refreshToken });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const signUp = async (req, res) => {
  const { email, password, username, firstName, lastName } = req.body;

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
      username,
    });
    res.status(201).json({ result });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err._message });
  }
};
