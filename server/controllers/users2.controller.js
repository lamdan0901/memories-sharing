const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User2 = require("../models/user2");

module.exports = {
  logIn: async (req, res) => {
    const { username, password } = req.body;

    try {
      const currentUser = await User2.findOne({ username });
      if (!currentUser)
        return res.status(400).json({ message: "Invalid credential" });

      const isPasswordCorrect = await bcrypt.compare(
        password,
        currentUser.password
      );
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credential" });

      const accessToken = jwt.sign(
        { email: currentUser.email, id: currentUser._id },
        process.env.SECRET_KEY,
        { expiresIn: "7d" }
      );

      res.status(200).json({ currentUser, accessToken });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Unexpected error occurred" });
    }
  },

  signUp: async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;

    const userExisted = await User2.findOne({ username, email });
    if (userExisted)
      return res.status(400).json({ message: "User already exists" });

    try {
      const hashedPassword = await bcrypt.hash(password, 12);

      const result = await User2.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username,
      });

      res.status(201).json({ result });
    } catch (err) {
      console.log(err);
      res.status(400).json({ message: "Unexpected error occurred" });
    }
  },
};
