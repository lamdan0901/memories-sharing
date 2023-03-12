import jwt from "jsonwebtoken";

export const refreshToken = (req, res) => {
  const { refreshToken } = req.body;

  try {
    const verifiedToken = jwt.verify(refreshToken, process.env.SECRET_KEY);

    if (!verifiedToken.email) {
      throw new Error();
    }

    const accessToken = jwt.sign(
      { email: verifiedToken.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Refresh token expired or invalid" });
  }
};
