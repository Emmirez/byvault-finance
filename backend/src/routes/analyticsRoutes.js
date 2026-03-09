// src/routes/analyticsRoutes.js
import express from "express";
import { protect, adminOrSuperadmin } from "../middleware/authMiddleware.js";
import {
  getOverviewStats,
  getUserAnalytics,
  getTransactionAnalytics,
  getKYCAnalytics,
  getCardAnalytics,
  getFinancialSummary,
  getRecentActivities,
} from "../controllers/analyticsController.js";

const router = express.Router();

// All analytics routes require admin authentication
router.use(protect);
router.use(adminOrSuperadmin);

// Overview stats
router.get("/overview", getOverviewStats);

// User analytics
router.get("/users", getUserAnalytics);

// Transaction analytics
router.get("/transactions", getTransactionAnalytics);

// KYC analytics
router.get("/kyc", getKYCAnalytics);

// Card analytics
router.get("/cards", getCardAnalytics);

// Financial summary
router.get("/financial", getFinancialSummary);

// Recent activities
router.get("/recent-activities", getRecentActivities);

export default router;