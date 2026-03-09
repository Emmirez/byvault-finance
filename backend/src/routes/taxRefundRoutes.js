import express from "express";
import {
  protect,
  admin,
  adminOrSuperadmin,
  superadmin,
  checkUserStatus,
} from "../middleware/authMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import {
  applyForTaxRefund,
  getUserTaxRefunds,
  getTaxRefundById,
  cancelTaxRefund,
  getAllTaxRefunds,
  getTaxRefundDetails,
  updateTaxRefundStatus,
  deleteTaxRefund,
} from "../controllers/taxRefundController.js";

const router = express.Router();

//  USER ROUTES
router.post("/tax-refund/apply", protect, checkUserStatus,requireVerified, applyForTaxRefund);
router.get("/tax-refund/my-requests", protect, getUserTaxRefunds);
router.get("/tax-refund/:id", protect, getTaxRefundById);
router.put("/tax-refund/:id/cancel", protect, cancelTaxRefund);

// ADMIN ROUTES
router.get("/admin/tax-refunds", protect, adminOrSuperadmin, getAllTaxRefunds);
router.get(
  "/admin/tax-refunds/:id",
  protect,
  adminOrSuperadmin,
  getTaxRefundDetails,
);
router.put(
  "/admin/tax-refunds/:id/status",
  protect,
  adminOrSuperadmin,
  updateTaxRefundStatus,
);
router.delete("/admin/tax-refunds/:id", protect, superadmin, deleteTaxRefund);

export default router;
