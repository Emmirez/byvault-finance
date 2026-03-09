// routes/bankRoutes.js
import express from "express";
import {
  protect,
  admin,
  superadmin,
  adminOrSuperadmin,
} from "../middleware/authMiddleware.js";
import {
  getBankDetails,
  updateBankDetails,
  getUserBankDetails,
} from "../controllers/bankController.js";

const router = express.Router();

// User routes
router.get("/bank-details", protect, getBankDetails);
router.put("/bank-details", protect, updateBankDetails);

router.get(
  "/admin/bank-details/:userId",
  protect,
  adminOrSuperadmin,
  getUserBankDetails,
);

export default router;
