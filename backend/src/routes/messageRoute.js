import express from "express";

import {
  sendDirectMessage,
  sendGroupMessage,
  uploadMessageImage,
  uploadMessageFile,
} from "../controllers/messageController.js";
import {
  checkFriendship,
  checkGroupMembership,
} from "../middlewares/friendMiddleware.js";
import { upload } from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post("/direct", checkFriendship, sendDirectMessage);
router.post("/group", checkGroupMembership, sendGroupMessage);
router.post("/upload", upload.single("file"), uploadMessageImage);
router.post("/upload-file", upload.single("file"), uploadMessageFile);

export default router;