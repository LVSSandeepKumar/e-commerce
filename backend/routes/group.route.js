import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroupsByHashtag,
  getGroupsByPopularity,
} from "../controllers/group.controller.js";

const router = Router();

router.get("/", getAllGroups);
router.get("/popular", getGroupsByPopularity);
router.get("/hashtag/:hashtag", getGroupsByHashtag);
router.post("/create", createGroup);

export default router;
