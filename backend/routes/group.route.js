import { Router } from "express";
import {
  acceptRequest,
  createGroup,
  getAllGroups,
  getGroupDetails,
  getGroupsByHashtag,
  getGroupsByPopularity,
  joinGroup,
  removePerson,
} from "../controllers/group.controller.js";
import {adminRoute} from "../middleware/adminRoute.js";

const router = Router();

router.get("/", getAllGroups);
router.get("/popular", getGroupsByPopularity);
router.get("/hashtag/:hashtag", getGroupsByHashtag);
router.get("/:groupId", getGroupDetails);
router.post("/create", createGroup);
router.post("/join/:groupId", joinGroup);
router.post("/:groupId/acceptRequest/:id",adminRoute, acceptRequest);
router.post("/:groupId/remove/:id", adminRoute, removePerson);

export default router;
