const express = require("express");

const {
  logIn,
  signUp,
  verifyEmail,
  resendCode,
} = require("../controllers/users.controller");
const { refreshToken } = require("../controllers/token.controller");

const usersRoutes = express.Router();

usersRoutes.post("/login", logIn);
usersRoutes.post("/signup", signUp);
usersRoutes.post("/verify-email", verifyEmail);
usersRoutes.post("/resend-code", resendCode);
usersRoutes.post("/refresh-token", refreshToken);

module.exports = usersRoutes;
