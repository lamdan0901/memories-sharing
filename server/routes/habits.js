const express = require("express");
const {
  getAllHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  createInspection,
  updateInspection,
} = require("../controllers/habits.controller");
const auth = require("../middleware/auth");

const habitsRoutes = express.Router();

habitsRoutes.get("/", auth, getAllHabits);
habitsRoutes.post("/", auth, createHabit);
habitsRoutes.post("/inspection", auth, createInspection);
habitsRoutes.patch("/:id", auth, updateHabit);
habitsRoutes.patch("/inspection/:id", auth, updateInspection);
habitsRoutes.delete("/:id", auth, deleteHabit);

module.exports = habitsRoutes;
