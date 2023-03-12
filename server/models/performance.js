import mongoose from "mongoose";

const performanceSchema = mongoose.Schema({
  time: String,
  isChecked: Boolean,
  habitId: { type: mongoose.SchemaTypes.ObjectId, ref: "Habit" },
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

const Performance = mongoose.model("Performance", performanceSchema);
export default Performance;
