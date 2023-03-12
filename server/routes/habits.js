import express from "express";
import {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  createInspection,
  updateInspection,
} from "../controllers/habits.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAllHabits);
router.post("/", auth, createHabit);
router.post("/inspection", auth, createInspection);
router.patch("/:id", auth, updateHabit);
router.patch("/inspection/:id", auth, updateInspection);
router.delete("/:id", auth, deleteHabit);

export default router;
