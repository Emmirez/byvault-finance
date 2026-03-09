import express from "express";
import { protect, admin, superadmin, adminOrSuperadmin } from "../middleware/authMiddleware.js";
import {
  getAllDeposits,
  getDepositDetails,
  approveDeposit,
  rejectDeposit,
  getDepositStats,
  deleteDeposit,
} from "../controllers/adminDepositController.js";

const router = express.Router();


// Admin routes (accessible by both admin and superadmin)
router.get("/stats", protect, adminOrSuperadmin, getDepositStats);
router.get("/", protect, adminOrSuperadmin, getAllDeposits);
router.get("/:id", protect, adminOrSuperadmin, getDepositDetails);
router.put("/:id/approve", protect, adminOrSuperadmin, approveDeposit);
router.put("/:id/reject", protect, adminOrSuperadmin, rejectDeposit);

// Superadmin only route
router.delete("/:id", protect, superadmin, deleteDeposit);

export default router;