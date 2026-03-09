import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  promoteUser,
  demoteAdmin,
  getAllAdmins,
  getSystemStats,
  getAdminLogs,
  getAllUsers
} from "../controllers/superadminController.js";

const router = express.Router();

// Middleware: only superadmin can access these routes
router.use(protect, authorize("superadmin"));

// Admin management
router.get("/users", getAllUsers); // Add this line
router.get("/admins", getAllAdmins);
router.patch("/promote/:userId", promoteUser);

router.patch("/demote/:userId", demoteAdmin);
// System
router.get("/stats", getSystemStats);
router.get("/logs", getAdminLogs);

export default router;
