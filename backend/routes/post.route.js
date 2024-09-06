import { Router } from "express";
import {
  createPost,
  downVotePost,
  getAllPosts,
  getPostsByHashtag,
  upVotePost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create", createPost);
router.get("/", getAllPosts);
router.get("/:hashtagName", getPostsByHashtag);
router.post("/upvote/:id", upVotePost);
router.post("/downvote/:id", downVotePost);

export default router;
