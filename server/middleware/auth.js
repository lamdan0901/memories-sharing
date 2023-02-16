import jwt from "jsonwebtoken";

export default async function auth(req, res, next) {
  try {
    const token = req.headers.authorization;

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);
    req.userId = decodedData?.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token expired or invalid" });
  }
}
