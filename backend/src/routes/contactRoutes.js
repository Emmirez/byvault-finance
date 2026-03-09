// routes/contactRoutes.js
import express from "express";
import { sendContactMessage } from "../controllers/contactController.js";

const router = express.Router();

// Public route - no auth required
router.post("/contact", sendContactMessage);

export default router;