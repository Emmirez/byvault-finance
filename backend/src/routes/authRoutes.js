import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getCurrentUser,
  forgotPassword,
  resetPassword,
  register,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", protect, getCurrentUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


export default router;
