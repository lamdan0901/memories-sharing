import express from "express";
import {
  getPosts,
  getOnePost,
  commentPost,
  createPost,
  likePost,
  updatePost,
  deletePost,
} from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", getPosts);
router.get("/:id", getOnePost);
router.post("/", auth, createPost);
router.patch("/:id-likePost", auth, likePost);
router.patch("/:id-commentPost", auth, commentPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);

export default router;
