import { Router } from "express";
import {
  createGroup,
  getAllGroups,
  getGroupsByPopularity,
} from "../controllers/group.controller.js";

const router = Router();

router.get("/", getAllGroups);
router.get("/popular", getGroupsByPopularity);
router.post("/create", createGroup);

export default router;
