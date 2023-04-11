const mongoose = require("mongoose");
const Habit = require("../models/habit");
const Performance = require("../models/performance");

module.exports = {
  getAllHabits: async (req, res) => {
    const { page = 1, search, viewTodayHabits } = req.query;
    const LIMIT = 8;
    const filters = { $and: [{ user: req.userId }] };

    if (search) {
      filters.$and.push({ title: { $regex: search?.trim(), $options: "i" } });
    }

    if (viewTodayHabits === "true") {
      filters.$and.push({
        reminderDays: new Date().getDay(),
      });
    }

    const startIndex = (+page - 1) * LIMIT;
    const total = await Habit.countDocuments(filters);

    try {
      const data = await Habit.find(filters)
        .populate("performances")
        .sort({ reminderTime: "asc" })
        .limit(LIMIT)
        .skip(startIndex);

      res.status(200).json({
        data,
        currentPage: +page,
        numOfPages: Math.ceil(total / LIMIT),
      });
    } catch (err) {
      console.log("err: ", err);
      res.status(400).json({ message: "Unexpected error occurred" });
    }
  },

  createHabit: async (req, res) => {
    const habit = req.body;

    try {
      const data = await Habit.create({ ...habit, user: req.userId });
      res.status(201).json({ data });
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  },

  updateHabit: async (req, res) => {
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
  },

  deleteHabit: async (req, res) => {
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
  },

  createInspection: async (req, res) => {
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
  },

  updateInspection: async (req, res) => {
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
  },
};
