const express = require("express");

const { logIn, signUp } = require("../controllers/users2.controller");

const usersRoutes = express.Router();

usersRoutes.post("/login-post", logIn);
usersRoutes.post("/signup-post", signUp);

module.exports = usersRoutes;
