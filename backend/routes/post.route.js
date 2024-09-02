import { Router } from "express";
import { createPost, getAllPosts } from "../controllers/post.controller.js";

const router = Router();

router.post("/create", createPost);
router.get("/", getAllPosts);

export default router;