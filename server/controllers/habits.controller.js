import mongoose from "mongoose";
import Habit from "../models/habit.js";
import Performance from "../models/performance.js";

export const getAllHabits = async (req, res) => {
  try {
    const data = await Habit.find().populate("performances");
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const createHabit = async (req, res) => {
  const habit = req.body;

  try {
    const data = await Habit.create(habit);
    res.status(201).json({ data });
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const updateHabit = async (req, res) => {
  const habit = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ message: "Habit not found" });

  try {
    const data = await Habit.findByIdAndUpdate(id, habit, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ message: "Habit not found" });
    }

    res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const deleteHabit = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ message: "Habit not found" });

  try {
    const habit = await Habit.findByIdAndRemove(id);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }

    await Performance.deleteMany({ habitId: { $eq: habit.id } });

    res.status(200).json();
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const createInspection = async (req, res) => {
  const performance = req.body;

  try {
    const newPerformance = await Performance.create(performance);

    const habit = await Habit.findById(performance.habitId);
    if (!habit) {
      return res.status(404).json({ message: "Habit not found" });
    }
    habit.performances.push(newPerformance.id);
    await habit.save();

    res.status(201).json({ data: newPerformance });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateInspection = async (req, res) => {
  const performance = req.body;
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send({ message: "Inspection not found" });

  try {
    const data = await Performance.findByIdAndUpdate(id, performance, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({ message: "Inspection not found" });
    }

    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
