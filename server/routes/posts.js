const express = require("express");

const {
  getPosts,
  getPostsLikes,
  getOnePost,
  getPostComments,
  commentPost,
  createPost,
  likePost,
  updatePost,
  deletePost,
} = require("../controllers/posts.controller");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");

const postsRoutes = express.Router();

postsRoutes.get("/", optionalAuth, getPosts);
postsRoutes.get("/likes", optionalAuth, getPostsLikes);
postsRoutes.get("/:id", optionalAuth, getOnePost);
postsRoutes.get("/:id/comments", optionalAuth, getPostComments);
postsRoutes.post("/", auth, createPost);
postsRoutes.patch("/:id-likePost", auth, likePost);
postsRoutes.patch("/:id-commentPost", auth, commentPost);
postsRoutes.patch("/:id", auth, updatePost);
postsRoutes.delete("/:id", auth, deletePost);

module.exports = postsRoutes;
