// routes/twoFactorRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  enable2FA,
  verifyAndEnable2FA,
  disable2FA,
  get2FAStatus,
  verifyLoginOTP,
  resendOTP,
} from "../controllers/twoFactorController.js";

const router = express.Router();

router.post("/verify-2fa", verifyLoginOTP);
router.post("/2fa/resend", resendOTP);
// All routes require authentication
// router.use(protect);
router.get("/2fa/status", protect, get2FAStatus);
router.post("/2fa/enable", protect, enable2FA);
router.post("/2fa/verify-enable", protect, verifyAndEnable2FA);
router.post("/2fa/disable", protect, disable2FA);

export default router;
