import express from "express";
import { protect, admin, adminOrSuperadmin, superadmin } from "../middleware/authMiddleware.js";
import {
  submitTicket,
  getUserTickets,
  getTicketById,
  addTicketMessage,
  closeTicket,
  getAllTickets,
  getTicketDetails,
  updateTicketStatus,
  addAdminReply,
  deleteTicket,
} from "../controllers/supportController.js";

const router = express.Router();

//  USER ROUTES
router.post("/support/tickets", protect, submitTicket);
router.get("/support/tickets", protect, getUserTickets);
router.get("/support/tickets/:id", protect, getTicketById);
router.post("/support/tickets/:id/messages", protect, addTicketMessage);
router.put("/support/tickets/:id/close", protect, closeTicket);

//  ADMIN ROUTES 
router.get("/admin/support/tickets", protect, adminOrSuperadmin, getAllTickets);
router.get("/admin/support/tickets/:id", protect, adminOrSuperadmin, getTicketDetails);
router.put("/admin/support/tickets/:id/status", protect, adminOrSuperadmin, updateTicketStatus);
router.post("/admin/support/tickets/:id/reply", protect, adminOrSuperadmin, addAdminReply);
router.delete("/admin/support/tickets/:id", protect, superadmin, deleteTicket);

export default router;