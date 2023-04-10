const mongoose = require("mongoose");

const userCommentPostSchema = mongoose.Schema(
  {
    content: String,
    creator: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "User2",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User2CommentPost", userCommentPostSchema);
