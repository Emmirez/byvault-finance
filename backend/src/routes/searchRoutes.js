// routes/searchRoutes.js
import express from "express";
import { protect, authorize } from "../middleware/authMiddleware.js";
import { 
  search, 
  searchUsers, 
  searchTransactions 
} from "../controllers/searchController.js";

const router = express.Router();

// All search routes require admin authentication
router.use(protect, authorize("admin", "superadmin"));

// Global search
router.get("/", search);

// Specific searches
router.get("/users", searchUsers);
router.get("/transactions", searchTransactions);

export default router;