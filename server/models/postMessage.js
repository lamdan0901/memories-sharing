import mongoose from "mongoose";

const postSchema = mongoose.Schema({
  title: String,
  message: String,
  creator: String,
  creatorId: String,
  tags: [String],
  selectedFile: String,
  comments: { type: [String], default: [] },
  likes: {
    type: [mongoose.SchemaTypes.ObjectId],
    ref: "User",
    default: [],
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

postSchema.methods.sayHi = function () {
  console.log("Say hi ", this.title);
};

postSchema.statics.findByTitle = function (name) {
  return this.where({ title: new RegExp(name, "i") });
};

const PostMessage = mongoose.model("PostMessage", postSchema);
export default PostMessage;
