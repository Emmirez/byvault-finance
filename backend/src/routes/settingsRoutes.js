// src/routes/settingsRoutes.js
import express from "express";
import { protect, adminOrSuperadmin, superadmin } from "../middleware/authMiddleware.js";
import {
  getAllSettings,
  getPublicSettings,
  getSettingByKey,
  updateSetting,
  createSetting,
  deleteSetting,
  resetSettings,
} from "../controllers/settingsController.js";

const router = express.Router();

// Public route (no auth required)
router.get("/settings/public", getPublicSettings);

// Admin routes
router.get("/admin/settings", protect, adminOrSuperadmin, getAllSettings);
router.get("/admin/settings/:key", protect, adminOrSuperadmin, getSettingByKey);
router.put("/admin/settings/:key", protect, adminOrSuperadmin, updateSetting);

// Superadmin only routes
router.post("/admin/settings", protect, superadmin, createSetting);
router.delete("/admin/settings/:key", protect, superadmin, deleteSetting);
router.post("/admin/settings/reset", protect, superadmin, resetSettings);

export default router;