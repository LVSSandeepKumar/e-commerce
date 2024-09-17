import { Router } from "express";
import {
  acceptRequest,
  changeGroupPrivacy,
  createGroup,
  deleteGroup,
  deleteRequest,
  getAllGroups,
  getGroupDetails,
  getGroupsByHashtag,
  getGroupsByPopularity,
  joinGroup,
  removePerson,
  sendMessage,
  updateGroupDetails,
} from "../controllers/group.controller.js";
import {adminRoute} from "../middleware/adminRoute.js";

const router = Router();

router.get("/", getAllGroups);
router.get("/popular", getGroupsByPopularity);
router.get("/hashtag/:hashtag", getGroupsByHashtag);
router.get("/:groupId", getGroupDetails);
router.post("/create", createGroup);
router.post("/:groupId/join", joinGroup);
router.post("/:groupId/acceptRequest/:id",adminRoute, acceptRequest);
router.post("/:groupId/deleteRequest/:id",adminRoute, deleteRequest);
router.post("/:groupId/remove/:id", adminRoute, removePerson);
router.post("/:groupId/changePrivacy", adminRoute, changeGroupPrivacy);
router.post("/:groupId/update", updateGroupDetails);
router.post("/:groupId/delete", deleteGroup);
router.post("/:groupId/message/send", sendMessage);

export default router;
