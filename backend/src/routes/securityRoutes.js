// src/routes/securityRoutes.js
import express from "express";
import { protect, adminOrSuperadmin, superadmin } from "../middleware/authMiddleware.js";
import {
  getSecurityStats,
  getSecurityLogs,
  getSecuritySettings,
  updateSecuritySetting,
  getActiveSessions,
  revokeSession,
  getUserLoginAttempts,
  toggleUser2FA,
} from "../controllers/securityController.js";

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(adminOrSuperadmin);

// Security dashboard stats
router.get("/stats", getSecurityStats); // Changed from "/security/stats"

// Security logs
router.get("/logs", getSecurityLogs); // Changed from "/security/logs"

// Security settings
router.get("/settings", getSecuritySettings); // Changed from "/security/settings"
router.put("/settings/:key", updateSecuritySetting); // Changed from "/security/settings/:key"

// Active sessions
router.get("/sessions", getActiveSessions); // Changed from "/security/sessions"
router.post("/revoke-session", revokeSession); // Changed from "/security/revoke-session"

// User-specific security
router.get("/user/:userId/attempts", getUserLoginAttempts); // Changed from "/security/user/:userId/attempts"
router.post("/user/:userId/toggle-2fa", superadmin, toggleUser2FA); // Changed from "/security/user/:userId/toggle-2fa"

export default router;