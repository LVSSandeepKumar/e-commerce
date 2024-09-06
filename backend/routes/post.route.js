import { Router } from "express";
import {
  createPost,
  downVotePost,
  getAllPosts,
  getPostsByHashtag,
  getSavedPosts,
  savePost,
  upVotePost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create", createPost);
router.get("/", getAllPosts);
router.get("/saved", getSavedPosts);
router.get("/:hashtagName", getPostsByHashtag);
router.post("/upvote/:id", upVotePost);
router.post("/downvote/:id", downVotePost);
router.post("/save/:id", savePost);

export default router;
