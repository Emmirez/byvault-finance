import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { protect, admin, adminOrSuperadmin, superadmin } from "../middleware/authMiddleware.js";
import {
  submitKYC,
  getKYCStatus,
  getKYCDetails,
  updateKYC,
  getAllKYC,
  getKYCDetailsAdmin,
  reviewKYC,
  deleteKYC,
  getUserKycByUserId
} from "../controllers/kycController.js";

const router = express.Router();

// Get current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/kyc-documents");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "kyc-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

//  USER ROUTES 
router.post(
  "/kyc/submit",
  protect,
  upload.fields([
    { name: "frontImage", maxCount: 1 },
    { name: "backImage", maxCount: 1 },
    { name: "selfie", maxCount: 1 },
  ]),
  submitKYC
);
router.get("/kyc/status", protect, getKYCStatus);
router.get("/kyc/details", protect, getKYCDetails);
router.put("/kyc/update", protect, updateKYC);

// ADMIN ROUTES 
router.get("/admin/kyc", protect, adminOrSuperadmin, getAllKYC);
router.get("/admin/kyc/:id", protect, adminOrSuperadmin, getKYCDetailsAdmin);
router.put("/admin/kyc/:id/review", protect, adminOrSuperadmin, reviewKYC);
router.delete("/admin/kyc/:id", protect, superadmin, deleteKYC);
router.get("/admin/kyc/user/:userId", protect, adminOrSuperadmin, getUserKycByUserId);

export default router;