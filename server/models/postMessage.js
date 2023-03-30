const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
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
  },
  { timestamps: true }
);

// this will be call before the 'save' or whatever function exec
postSchema.pre("findByIdAndUpdate", function (next) {
  console.log("pre is called");
  this.updatedAt = Date.now();
  next(); // move on to the next one
});

// this will be call after the 'save' or whatever function exec
postSchema.post("findByIdAndUpdate", function (doc, next) {
  doc.sayHi(); //doc is just the saved object
  next();
});

// this is like a property of the schema, but not saved in db
postSchema.virtual("titleAndCreator").get(function () {
  return `${this.name}: ${this.creator}`;
});

postSchema.methods.sayHi = function () {
  console.log("Say hi ", this.title);
};

// this will be treated like a query function
postSchema.statics.findByTitle = function (name) {
  return this.where({ title: new RegExp(name, "i") });
};

// this will be treated like a part of the chain query function
postSchema.query.byCreator = function (creator) {
  return this.where({ creator: new RegExp(creator, "i") });
};

// ex: User.where().byCreator("creatorName")
//     User.findByTitle("title")
//   const user = User.find({...}); user.sayHi(); user.titleAndCreator;

module.exports = mongoose.model("PostMessage", postSchema);
