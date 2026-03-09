import express from "express";
import { protect, admin, adminOrSuperadmin, superadmin, checkUserStatus } from "../middleware/authMiddleware.js";
import { requireVerified } from "../middleware/verificationMiddleware.js";
import {
  applyIndividualGrant,
  applyCompanyGrant,
  getUserGrants,
  getGrantById,
  cancelGrant,
  getAllGrants,
  getGrantDetails,
  updateGrantStatus,
  deleteGrant,
} from "../controllers/grantController.js";

const router = express.Router();

//  USER ROUTES 
router.post("/grants/individual/apply", protect,checkUserStatus,requireVerified, applyIndividualGrant);
router.post("/grants/company/apply", protect,checkUserStatus, applyCompanyGrant);
router.get("/grants/my-applications", protect, getUserGrants);
router.get("/grants/:id", protect, getGrantById);
router.put("/grants/:id/cancel", protect, cancelGrant);

//  ADMIN ROUTES 
router.get("/admin/grants", protect, adminOrSuperadmin, getAllGrants);
router.get("/admin/grants/:id", protect, adminOrSuperadmin, getGrantDetails);
router.put("/admin/grants/:id/status", protect, adminOrSuperadmin, updateGrantStatus);
router.delete("/admin/grants/:id", protect, superadmin, deleteGrant);

export default router;