import express from "express";
import { getNotifications, markNotificationAsRead } from "../controllers/notificationController.js";
import userAuth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", userAuth, getNotifications);
router.patch("/:notificationId/read", userAuth, markNotificationAsRead);

export default router;