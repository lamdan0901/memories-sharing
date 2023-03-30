const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { sendVerificationEmail } = require("../services/sendMail");
const { generateVerificationCode } = require("../utils/genVerificationCode");

module.exports = {
  logIn: async (req, res) => {
    const { username, password } = req.body;

    try {
      const currentUser = await User.findOne({ username });
      if (!currentUser)
        return res.status(400).json({ message: "Invalid credential" });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        currentUser.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credential" });

      if (!currentUser.isVerified)
        return res.status(400).json({ message: "Email not verified" });

      const accessToken = jwt.sign(
        { email: currentUser.email, id: currentUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      const refreshToken = jwt.sign(
        { email: currentUser.email, id: currentUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.status(200).json({ currentUser, accessToken, refreshToken });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  signUp: async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    const userExisted = await User.findOne({ email });
    if (userExisted)
      return res.status(400).json({ message: "User already exists" });

    try {
      const code = generateVerificationCode();
      await sendVerificationEmail(code, email);

      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await User.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
        verificationCode: code,
      });
      res.status(201).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },

  verifyEmail: async (req, res) => {
    const { email, verificationCode } = req.body;

    const user = await User.findOne({ email, verificationCode });
    if (user) {
      const expirationTime = 10 * 60 * 1000;
      const currentTime = new Date();
      const createdAtTime = new Date(user.updatedAt);

      if (currentTime - createdAtTime <= expirationTime) {
        user.isVerified = true;
        await user.save();
        ``;

        return res.status(200).send({ message: "Account verified" });
      }

      return res.status(400).send({ message: "Verification code expired" });
    }

    res
      .status(400)
      .send({ message: "Invalid verification code or email not exist" });
  },

  resendCode: async (req, res) => {
    const { email } = req.body;

    try {
      const code = generateVerificationCode();
      await sendVerificationEmail(code, email);

      await User.findOneAndUpdate({ email }, { verificationCode: code });

      res
        .status(201)
        .json({ message: "New verification code's been resent to your email" });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: err.message });
    }
  },
};
