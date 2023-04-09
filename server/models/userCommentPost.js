const mongoose = require("mongoose");

const userCommentPostSchema = mongoose.Schema(
  {
    content: String,
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserCommentPost", userCommentPostSchema);
