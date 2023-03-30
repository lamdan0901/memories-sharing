const mongoose = require("mongoose");

const performanceSchema = mongoose.Schema(
  {
    time: String,
    isChecked: Boolean,
    habitId: { type: mongoose.SchemaTypes.ObjectId, ref: "Habit" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Performance", performanceSchema);
