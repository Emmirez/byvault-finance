// src/routes/beneficiaryRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getBeneficiaries,
  saveBeneficiary,
  deleteBeneficiary,
} from "../controllers/beneficiaryController.js";

const router = express.Router();

router.use(protect);

router.get("/beneficiaries", getBeneficiaries);
router.post("/beneficiaries", saveBeneficiary);
router.delete("/beneficiaries/:id", deleteBeneficiary);

export default router;