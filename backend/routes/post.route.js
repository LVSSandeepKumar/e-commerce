import { Router } from "express";
import { createPost } from "../controllers/post.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = Router();

router.post("/create",protectRoute, createPost);

export default router;