// src/routes/documentRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { protect, adminOrSuperadmin, superadmin } from "../middleware/authMiddleware.js";
import {
  uploadDocument,
  getUserDocuments,
  getDocumentById,
  deleteDocument,
  getAllDocuments,
  getDocumentDetails,
  verifyDocument,
  adminDeleteDocument,
  getDocumentStats,
} from "../controllers/documentController.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, "../uploads/documents");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "doc-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDF documents are allowed"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter,
});

// User routes
router.post("/documents/upload", protect, upload.single("document"), uploadDocument);
router.get("/documents", protect, getUserDocuments);
router.get("/documents/:id", protect, getDocumentById);
router.delete("/documents/:id", protect, deleteDocument);

// Admin routes
router.get("/admin/documents", protect, adminOrSuperadmin, getAllDocuments);
router.get("/admin/documents/stats", protect, adminOrSuperadmin, getDocumentStats);
router.get("/admin/documents/:id", protect, adminOrSuperadmin, getDocumentDetails);
router.put("/admin/documents/:id/verify", protect, adminOrSuperadmin, verifyDocument);
router.delete("/admin/documents/:id", protect, superadmin, adminDeleteDocument);

export default router;