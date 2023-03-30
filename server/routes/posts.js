const express = require("express");

const {
  getPosts,
  getOnePost,
  commentPost,
  createPost,
  likePost,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");
const auth = require("../middleware/auth");

const postsRoutes = express.Router();

postsRoutes.get("/", getPosts);
postsRoutes.get("/:id", getOnePost);
postsRoutes.post("/", auth, createPost);
postsRoutes.patch("/:id-likePost", auth, likePost);
postsRoutes.patch("/:id-commentPost", auth, commentPost);
postsRoutes.patch("/:id", auth, updatePost);
postsRoutes.delete("/:id", auth, deletePost);

module.exports = postsRoutes;
