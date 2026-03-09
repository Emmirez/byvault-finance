import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getProfile,
  updateProfile,
  changeTransactionPin,
  verifyTransactionPin,
} from "../controllers/userController.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Get current user profile
router.get("/profile", getProfile);

// Update user profile
router.put("/profile", updateProfile);

// Change password
// router.put("/change-password", changePassword);

router.put("/change-transaction-pin", changeTransactionPin);
router.post("/verify-transaction-pin", verifyTransactionPin);

export default router;
