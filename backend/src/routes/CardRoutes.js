import express from "express";
import { protect, admin, superadmin, adminOrSuperadmin, checkUserStatus } from "../middleware/authMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import {
  applyForCard,
  getUserCards,
  getCardDetails,
  getPendingCards,
  approveCard,
  rejectCard,
  toggleBlockCard,
  getAllCards,
  deleteCard,
  userToggleBlockCard
} from "../controllers/cardController.js";

const router = express.Router();


// Accessible to any logged-in user
router.post("/cards/apply", protect,checkUserStatus,requireVerified, applyForCard);
router.get("/cards", protect, getUserCards);
router.get("/cards/:id", protect, getCardDetails);
router.put("/cards/:id/toggle-block", protect, checkUserStatus, userToggleBlockCard);


// Both admin and superadmin can access these
router.get("/admin/cards/pending", protect, adminOrSuperadmin, getPendingCards);
router.put("/admin/cards/:id/approve", protect, adminOrSuperadmin, approveCard);
router.put("/admin/cards/:id/reject", protect, adminOrSuperadmin, rejectCard);
router.put("/admin/cards/:id/toggle-block", protect, adminOrSuperadmin, toggleBlockCard);


// Only superadmin can access these (add if needed)
router.get("/superadmin/all-cards", protect, adminOrSuperadmin, getAllCards);
router.delete("/superadmin/cards/:id", protect, superadmin, deleteCard);

export default router;