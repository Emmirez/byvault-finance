// routes/paymentRoutes.js
import express from "express";
import {
  protect,
  admin,
  superadmin,
  adminOrSuperadmin,
} from "../middleware/authMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import { upload, handleUploadError } from "../middleware/uploadMiddleware.js";
import {
  uploadPaymentProof,
  getBTCAddress,
  getDepositHistory,
} from "../controllers/paymentController.js";
import {
  getPendingDeposits,
  acceptDeposit,
  rejectDeposit,
  cancelDeposit,
  getDepositDetails,
  updateDeposit,
  getAllPayments,
  deletePayment,
} from "../controllers/adminPaymentController.js";

const router = express.Router();

router.get("/user/btc-address", protect, getBTCAddress);
router.post(
  "/payments/upload-proof",
  protect,
  upload.single("paymentProof"),
  handleUploadError,
  requireVerified,
  uploadPaymentProof,
);
router.get("/payments/history", protect, getDepositHistory);

router.get(
  "/admin/payments/pending",
  protect,
  adminOrSuperadmin,
  getPendingDeposits,
);
router.get(
  "/admin/payments/:id",
  protect,
  adminOrSuperadmin,
  getDepositDetails,
);
router.put(
  "/admin/payments/:id/update",
  protect,
  adminOrSuperadmin,
  updateDeposit,
);

router.put(
  "/admin/payments/:id/accept",
  protect,
  admin, // only admin
  acceptDeposit,
);
router.put(
  "/admin/payments/:id/reject",
  protect,
  admin, // only admin
  rejectDeposit,
);
router.put(
  "/admin/payments/:id/cancel",
  protect,
  admin, // only admin
  cancelDeposit,
);

router.get("/superadmin/all-payments", protect, superadmin, getAllPayments);
router.delete("/superadmin/payments/:id", protect, superadmin, deletePayment);

export default router;
