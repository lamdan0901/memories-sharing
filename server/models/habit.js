import mongoose from "mongoose";

const habitSchema = mongoose.Schema({
  title: { type: String, unique: true, required: true },
  description: String,
  reminderTime: String,
  reminderDays: [Number],
  performances: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "Performance",
    default: [],
  },
  createdAt: {
    type: Date,
    immutable: true,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;
