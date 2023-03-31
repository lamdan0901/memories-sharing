const mongoose = require("mongoose");
const PostMessage = require("../models/postMessage");

module.exports = {
  getPosts: async (req, res) => {
    const { page, search, tags, isMine } = req.query;

    const LIMIT = 8;
    const startIndex = (+page - 1) * LIMIT;
    const filters = { $and: [{ isPrivate: false }] };

    if (search) {
      filters.$and.push({ title: { $regex: search?.trim(), $options: "i" } });
    }

    if (tags) {
      filters.$and.push({ tags: { $in: tags?.trim()?.split(/[ .,]/) } });
    }

    if (isMine === "true") {
      filters.$and.push({ creator: req.userId });

      const i = filters.$and.findIndex((condition) => !condition.isPrivate);
      filters.$and.splice(i, 1);
    }

    try {
      const total = await PostMessage.countDocuments(filters);

      const posts = await PostMessage.find(filters)
        .populate("creator")
        .sort({ createdAt: -1 })
        .limit(LIMIT)
        .skip(startIndex);

      res.status(200).json({
        posts,
        currentPage: +page,
        numOfPages: Math.ceil(total / LIMIT),
      });
    } catch (err) {
      console.log("err: ", err);
      res.status(404).json({ message: err.message });
    }
  },

  getOnePost: async (req, res) => {
    const { id } = req.params;

    try {
      const post = await PostMessage.findById(id);
      const recommendedPosts = await PostMessage.find({
        $and: [{ tags: { $in: post.tags } }, { _id: { $ne: post._id } }],
      })
        .sort({ createdAt: 1 })
        .limit(4);

      // another way to query with conditions
      // await PostMessage.where("title")
      //   .equals("title")
      //   .where("creator")
      //   .equals("creator")
      //   .select("title, creator")
      //   .populate("likes");

      res.status(200).json({ post, recommendedPosts });
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },

  createPost: async (req, res) => {
    const post = req.body;

    try {
      const newPost = new PostMessage({ ...post, creator: req.userId });
      await newPost.save();

      // the 2 lines above is equal to this: const newPost = await PostMessage.create(post);

      res.status(201).json(newPost);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  },

  commentPost: async (req, res) => {
    const { id: _id } = req.params;
    const { comment } = req.body;

    try {
      const post = await PostMessage.findById(_id);
      if (!post) return res.status(404).send("Post not found");

      const updatedPost = await PostMessage.findByIdAndUpdate(
        _id,
        { ...post, comments: post.comments.push(comment) },
        {
          new: true,
        }
      );
      res.status(200).json(updatedPost);
    } catch (err) {
      res.status(409).json({ message: err.message });
    }
  },

  likePost: async (req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("Post not found");

    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const post = await PostMessage.findById(_id);
    if (!post) return res.status(404).send("Post not found");

    const index = post.likes.findIndex((userId) => userId === req.userId);
    if (index === -1) {
      post.likes.push(req.userId); // like
    } else {
      post.likes.splice(index, 1); // dislike
    }

    const likedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true,
    });
    res.status(200).json(likedPost);
  },

  updatePost: async (req, res) => {
    const { id: _id } = req.params;
    const post = req.body;

    if (!mongoose.Types.ObjectId.isValid(_id))
      return res.status(404).send("Post not found");

    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
      new: true, // return the object after update was applied.
    });
    res.status(200).json(updatedPost);
  },

  deletePost: async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id))
      return res.status(404).send("Post not found");

    await PostMessage.findByIdAndRemove(id);
    res.status(200).json();
  },
};
