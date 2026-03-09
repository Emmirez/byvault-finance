// src/routes/adminRoutes.js
import express from "express";
import {
  protect,
  authorize,
  adminOrSuperadmin,
} from "../middleware/authMiddleware.js";
import {
  blockUser,
  deleteUser,
  getAllUsers,
  getDashboardStats,
  getUserDetails,
  unblockUser,
  updateUser,
  approveDeposit,
  rejectDeposit,
  getPendingDeposits,
  suspendUser,
  getSuspendedUsers,
  unsuspendUser,
  updateUserTimestamp,
  getDashboardData,
  getPaymentSettings,
  updatePaymentSettings,
} from "../controllers/adminController.js";
import {
  getUserActivities,
  getActivityDetails,
  getActivityStats,
} from "../controllers/activityController.js";
import {
  getAllTransactions,
  getTransactionStats,
  getTransactionDetails,
  updateTransactionStatus,
  getPendingCount,
  editTransaction,
} from "../controllers/adminTransactionController.js";

const router = express.Router();

// Apply protection to all admin routes
router.use(protect);
router.use(authorize("admin", "superadmin"));

// Only admin or superadmin can access
router.get(
  "/admin-dashboard",
  protect,
  authorize("admin", "superadmin"),
  (req, res) => {
    res.json({ message: "Welcome to admin dashboard", user: req.user });
  },
);

// Only superadmin can access
router.get(
  "/superadmin-dashboard",
  protect,
  authorize("superadmin"),
  (req, res) => {
    res.json({ message: "Welcome to superadmin dashboard", user: req.user });
  },
);
//all request routes
router.get("/dashboard-data", protect, adminOrSuperadmin, getDashboardData);

router.get("/users", getAllUsers);
router.patch("/edit/:userId", updateUser);
router.delete("/delete/:userId", deleteUser);
router.patch("/block/:userId", blockUser);
router.patch("/unblock/:userId", unblockUser);
router.get("/users/:id", getUserDetails);
router.put("/users/:id", updateUser);
// Dashboard stats
router.get("/stats", getDashboardStats);
// Deposit management
router.get("/deposits/pending", getPendingDeposits); // Get pending deposits
router.patch("/deposits/:depositId/approve", approveDeposit); // Approve deposit
router.patch("/deposits/:depositId/reject", rejectDeposit); // Reject deposit
// Suspend routes
router.patch("/suspend/:userId", suspendUser);
router.patch("/unsuspend/:userId", unsuspendUser);
router.get("/suspended-users", getSuspendedUsers);
router.patch("/force-update-timestamp/:userId", updateUserTimestamp);

// Activity log routes
router.get(
  "/users/:userId/activities",
  protect,
  adminOrSuperadmin,
  getUserActivities,
);
router.get(
  "/users/:userId/activities/stats",
  protect,
  adminOrSuperadmin,
  getActivityStats,
);
router.get(
  "/activities/:activityId",
  protect,
  adminOrSuperadmin,
  getActivityDetails,
);

// Transaction management routes
router.get("/transactions", protect, adminOrSuperadmin, getAllTransactions);
router.get(
  "/transactions/stats",
  protect,
  adminOrSuperadmin,
  getTransactionStats,
);
router.get(
  "/transactions/pending-count",
  protect,
  adminOrSuperadmin,
  getPendingCount,
);
router.get(
  "/transactions/:id",
  protect,
  adminOrSuperadmin,
  getTransactionDetails,
);
router.patch(
  "/transactions/:id/status",
  protect,
  adminOrSuperadmin,
  updateTransactionStatus,
);
router.put("/transactions/:id", protect, adminOrSuperadmin, editTransaction);

//Payment settings
router.get("/payment-settings", protect, adminOrSuperadmin, getPaymentSettings);
router.put(
  "/payment-settings",
  protect,
  adminOrSuperadmin,
  updatePaymentSettings,
);

export default router;
