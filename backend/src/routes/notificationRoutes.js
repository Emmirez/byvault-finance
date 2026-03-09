import express from "express";
import {
  protect,
  admin,
  adminOrSuperadmin,
} from "../middleware/authMiddleware.js";
import {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
  getUnreadCount,
  createAdminNotification,
  broadcastNotification,
  getMenuNotificationCounts,
} from "../controllers/notificationsController.js";

const router = express.Router();

// USER ROUTES
router.get("/notifications", protect, getUserNotifications);
router.get("/notifications/unread-count", protect, getUnreadCount);
router.put("/notifications/:id/read", protect, markAsRead);
router.put("/notifications/read-all", protect, markAllAsRead);

router.delete("/notifications/clear-all", protect, clearAllNotifications);
router.get("/notifications/menu-counts", protect, getMenuNotificationCounts);
router.delete("/notifications/:id", protect, deleteNotification);

//  ADMIN ROUTES
router.post(
  "/admin/notifications",
  protect,
  adminOrSuperadmin,
  createAdminNotification,
);
router.post(
  "/admin/notifications/broadcast",
  protect,
  adminOrSuperadmin,
  broadcastNotification,
);

export default router;
