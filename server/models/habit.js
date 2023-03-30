const mongoose = require("mongoose");

const habitSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    reminderTime: String,
    reminderDays: [Number],
    performances: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "Performance",
      default: [],
    },
    user: {
      type: [mongoose.SchemaTypes.ObjectId],
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// unique constraint between user and habit
habitSchema.index({ title: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Habit", habitSchema);
