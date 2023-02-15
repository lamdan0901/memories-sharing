import express from "express";
import { logIn, signUp } from "../controllers/users.js";

const router = express.Router();

router.post("/log-in", logIn);
router.post("/sign-up", signUp);

export default router;
