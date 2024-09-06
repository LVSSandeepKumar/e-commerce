import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostsByHashtag,
  upVotePost,
} from "../controllers/post.controller.js";

const router = Router();

router.post("/create", createPost);
router.get("/", getAllPosts);
router.get("/:hashtagName", getPostsByHashtag);
router.post("/upvote/:id", upVotePost);

export default router;
