import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroupsByHashtag,
  getGroupsByPopularity,
  joinGroup,
} from "../controllers/group.controller.js";

const router = Router();

router.get("/", getAllGroups);
router.get("/popular", getGroupsByPopularity);
router.get("/hashtag/:hashtag", getGroupsByHashtag);
router.post("/create", createGroup);
router.post("/join/:id", joinGroup);

export default router;
