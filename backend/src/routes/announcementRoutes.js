// src/routes/announcementRoutes.js
import express from "express";
import { protect, adminOrSuperadmin, superadmin } from "../middleware/authMiddleware.js";
import {
  createAnnouncement,
  getAllAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  publishAnnouncement,
  archiveAnnouncement,
  deleteAnnouncement,
  getUserAnnouncements,
  markAsRead,
} from "../controllers/announcementController.js";

const router = express.Router();

// User routes
router.get("/announcements", protect, getUserAnnouncements);
router.post("/announcements/:id/read", protect, markAsRead);

// Admin routes
router.get("/admin/announcements", protect, adminOrSuperadmin, getAllAnnouncements);
router.get("/admin/announcements/:id", protect, adminOrSuperadmin, getAnnouncementById);
router.post("/admin/announcements", protect, adminOrSuperadmin, createAnnouncement);
router.put("/admin/announcements/:id", protect, adminOrSuperadmin, updateAnnouncement);
router.post("/admin/announcements/:id/publish", protect, adminOrSuperadmin, publishAnnouncement);
router.post("/admin/announcements/:id/archive", protect, adminOrSuperadmin, archiveAnnouncement);
router.delete("/admin/announcements/:id", protect, superadmin, deleteAnnouncement);

export default router;