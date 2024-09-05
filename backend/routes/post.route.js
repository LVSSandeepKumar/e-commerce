import { Router } from "express";
import { createPost, getAllPosts, getPostsByHashtag } from "../controllers/post.controller.js";

const router = Router();

router.post("/create", createPost);
router.get("/", getAllPosts);
router.get("/:hashtagName", getPostsByHashtag);

export default router;