import express from "express";
import { getNotificationsHandler, markAsReadHandler } from "../shared/controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

// Get user notifications
router.get("/", getNotificationsHandler);

// Mark specific notification as read
router.patch("/:notificationId/read", markAsReadHandler);

// Mark all as read
router.patch("/read-all", markAsReadHandler);

export default router;
