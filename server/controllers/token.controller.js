const jwt = require("jsonwebtoken");

module.exports = {
  refreshToken: (req, res) => {
    const { refreshToken } = req.body;

    try {
      const verifiedToken = jwt.verify(refreshToken, process.env.SECRET_KEY);

      if (!verifiedToken.email) {
        return res.status(400).json({ message: "Invalid token" });
      }

      const accessToken = jwt.sign(
        { email: verifiedToken.email, id: verifiedToken.id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.status(200).json({ accessToken });
    } catch (err) {
      return res
        .status(401)
        .json({ message: "Refresh token expired or invalid" });
    }
  },
};
