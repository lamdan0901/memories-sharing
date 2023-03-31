const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decodedData?.id;
  } catch (err) {}
  next();
};
