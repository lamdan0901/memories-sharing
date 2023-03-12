import express from "express";
import { logIn, signUp } from "../controllers/users.controller.js";
import { refreshToken } from "../controllers/token.controller.js";

const router = express.Router();

router.post("/login", logIn);
router.post("/signup", signUp);
router.post("/refresh-token", refreshToken);

export default router;
