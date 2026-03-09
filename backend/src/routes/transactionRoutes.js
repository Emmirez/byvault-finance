import express from "express";
import { protect, checkUserStatus } from "../middleware/authMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import {
  deposit,
  withdraw,
  transfer,
  getTransactions,
  getTransactionById,
  swapCurrency
} from "../controllers/transactionController.js";


const router = express.Router();

router.post("/deposit", protect, checkUserStatus, requireVerified, deposit);
router.post("/withdraw", protect, checkUserStatus, requireVerified, withdraw);
router.post("/transfer", protect, checkUserStatus,requireVerified, transfer);
router.get("/", protect, getTransactions);
router.get("/:id", protect, getTransactionById);
router.post("/swap", protect, checkUserStatus,requireVerified, swapCurrency);

export default router;
