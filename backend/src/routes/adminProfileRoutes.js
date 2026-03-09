// src/routes/adminProfileRoutes.js
import express from "express";
import { protect, adminOrSuperadmin } from "../middleware/authMiddleware.js";
import {
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  toggleTwoFactor,
} from "../controllers/adminProfileController.js";

const router = express.Router();

// All routes require authentication and admin/superadmin role
router.use(protect);
router.use(adminOrSuperadmin);

// Profile routes
router.get("/profile", getAdminProfile);
router.patch("/profile", updateAdminProfile);
router.post("/change-password", changeAdminPassword);
router.post("/toggle-2fa", toggleTwoFactor);

export default router;