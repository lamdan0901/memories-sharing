import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  const { page, search, tags } = req.query;
  const LIMIT = 8;
  const title = new RegExp(search?.trim() || "", "i"); // 'flag = i' means ignore case

  let posts,
    filters = null;

  try {
    if (search && tags) {
      filters = {
        $and: [{ title }, { tags: { $in: tags.trim().split(/[ .,]/) } }],
      };
    } else if (search) {
      filters = {
        $and: [{ title }],
      };
    } else if (tags) {
      filters = {
        $and: [{ tags: { $in: tags.trim().split(/[ .,]/) } }],
      };
    }

    const startIndex = (+page - 1) * LIMIT;
    const total = await PostMessage.countDocuments({});

    posts = await PostMessage.find(filters)
      .sort({ createdAt: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    res.status(200).json({
      posts,
      currentPage: +page,
      numOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const getOnePost = async (req, res) => {
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
};

export const createPost = async (req, res) => {
  const post = req.body;

  try {
    const newPost = new PostMessage(post);
    await newPost.save();

    // the 2 lines above is equal to this: const newPost = await PostMessage.create(post);

    res.status(201).json(newPost);
  } catch (err) {
    res.status(409).json({ message: err.message });
  }
};

export const commentPost = async (req, res) => {
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
};

export const likePost = async (req, res) => {
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
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Post not found");

  const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {
    new: true, // return the object after update was applied.
  });
  res.status(200).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Post not found");

  await PostMessage.findByIdAndRemove(id);
  res.status(200).json();
};
