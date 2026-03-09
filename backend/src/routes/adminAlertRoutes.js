import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import {
  getAlerts,
  getAlert,
  acknowledgeAlert,
  resolveAlert,
  bulkAcknowledge,
  createAlert,
  getAlertCounts,
  markAsRead,
  markAllAsRead,
  deleteAlert,
  clearAllAlerts,
} from "../controllers/adminAlertController.js";

const router = express.Router();

// All routes require admin authentication
router.use(protect, authorize("admin", "superadmin"));

// Alert counts for dashboard
router.get("/counts", getAlertCounts);

//  STATIC ROUTES 
router.put("/mark-all-read", markAllAsRead);
router.delete("/clear-all", clearAllAlerts);
router.post("/bulk/acknowledge", bulkAcknowledge);

//  STANDARD ROUTES 
router.get("/", getAlerts);
router.post("/", createAlert);

//  DYNAMIC ROUTES 
router.get("/:id", getAlert);
router.put("/:id/acknowledge", acknowledgeAlert);
router.put("/:id/resolve", resolveAlert);
router.put("/:id/read", markAsRead);
router.delete("/:id", deleteAlert);

export default router;