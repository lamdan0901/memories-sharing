import mongoose from "mongoose";
import PostMessage from "../models/postMessage.js";

export const getPosts = async (req, res) => {
  try {
    const postMessages = await PostMessage.find();

    res.status(200).json(postMessages);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

export const createPost = async (req, res) => {
  const post = req.body;

  try {
    const newPost = new PostMessage(post);
    await newPost.save();

    res.status(201).json(newPost);
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
  console.log("req.userId: ", typeof req.userId);
  console.log("post.likes: ", post.likes);

  const likedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true,
    }
  );
  res.status(200).json(likedPost);
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;
  console.log("post: ", post);

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).send("Post not found");

  const updatedPost = await PostMessage.findByIdAndUpdate(
    _id,
    { ...post, _id },
    {
      new: true, // return the object after update was applied.
    }
  );
  res.status(200).json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("Post not found");

  await PostMessage.findByIdAndRemove(id);
  res.status(200).json();
};
