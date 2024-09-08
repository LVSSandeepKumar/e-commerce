import { Router } from "express";
import { createGroup } from "../controllers/group.controller.js";

const router = Router();

router.post("/create",createGroup);

export default router;