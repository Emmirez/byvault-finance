import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { upload, handleUploadError } from "../middleware/uploadMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import {
  getPaymentMethods,
  getPaymentMethodDetails,
  submitDeposit,
  getDepositHistory,
  getDepositRequest,
  cancelDeposit,
} from "../controllers/depositController.js";

const router = express.Router();

// Test route
router.get("/test", (req, res) => {
  res.json({ message: "Deposit routes are working" });
});

// All routes are protected
router.use(protect);

// Get payment methods
router.get("/methods", getPaymentMethods);

// Get payment method details
router.get("/methods/:methodId", getPaymentMethodDetails);

// Submit deposit with receipt
router.post(
  "/submit",
  (req, res, next) => {
    console.log(" Before multer - Headers:", req.headers["content-type"]);
    next();
  },
  upload.single("receipt"),
  (req, res, next) => {
    console.log(" After multer - File:", req.file);
    console.log(" After multer - Body:", req.body);
    console.log(" After multer - Amount:", req.body.amount);
    console.log(" After multer - Method:", req.body.method);
    next();
  },
  handleUploadError,
  requireVerified,
  submitDeposit,
);

// Get user's deposit history
router.get("/history", getDepositHistory);

// Get single deposit request
router.get("/:id", getDepositRequest);

// Cancel deposit request
router.put("/:id/cancel", cancelDeposit);

export default router;
