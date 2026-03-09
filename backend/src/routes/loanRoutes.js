import express from "express";
import { protect, admin, adminOrSuperadmin, superadmin, checkUserStatus } from "../middleware/authMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import {
  getLoanProducts,
  getUserLoanStatus,
  applyForLoan,
  getUserLoans,
  getLoanById,
  cancelLoan,
  getAllLoans,
  getLoanDetails,
  updateLoanStatus,
  createLoanProduct,
  updateLoanProduct,
  deleteLoanProduct,
  seedLoanProducts,
  deleteLoan
} from "../controllers/loanController.js";

const router = express.Router();

//  USER ROUTES 
router.get("/loan/products", protect, getLoanProducts);
router.get("/loan/user-status", protect, getUserLoanStatus);
router.post("/loan/apply", protect,checkUserStatus,requireVerified, applyForLoan);
router.get("/loan/my-applications", protect, getUserLoans);
router.get("/loan/:id", protect, getLoanById);
router.put("/loan/:id/cancel", protect, cancelLoan);

// ADMIN ROUTES 
router.get("/admin/loans", protect, adminOrSuperadmin, getAllLoans);
router.get("/admin/loans/:id", protect, adminOrSuperadmin, getLoanDetails);
router.put("/admin/loans/:id/status", protect, adminOrSuperadmin, updateLoanStatus);
router.post("/admin/loan-products", protect, adminOrSuperadmin, createLoanProduct);
router.put("/admin/loan-products/:id", protect, adminOrSuperadmin, updateLoanProduct);
router.delete("/admin/loan-products/:id", protect, adminOrSuperadmin, deleteLoanProduct);

// SUPERADMIN ONLY ROUTES 
router.post("/admin/loan-products/seed", protect, superadmin, seedLoanProducts);
router.delete("/admin/loans/:id", protect, superadmin, deleteLoan);

export default router;