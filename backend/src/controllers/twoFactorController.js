// controllers/twoFactorController.js
import User from "../models/User.js";
import {
  generateVerificationCode,
  send2FACode,
} from "../services/emailService.js";
import { createNotification } from "./notificationsController.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const enable2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: "User email not found",
      });
    }

    if (user.twoFactorEnabled) {
      return res.status(400).json({
        success: false,
        message: "2FA is already enabled",
      });
    }

    // Generate verification code
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store code
    user.twoFactorCode = code;
    user.twoFactorCodeExpires = expires;
    await user.save();

    // Send email
    const emailSent = await send2FACode(user.email, code);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again.",
      });
    }

    res.json({
      success: true,
      message: "Verification code sent to your email",
      expiresAt: expires,
    });
  } catch (error) {
    console.error("Enable 2FA error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

export const verifyAndEnable2FA = async (req, res) => {
  try {
    const { code } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if code exists and is valid
    if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
    }

    // Check if code is expired
    if (user.twoFactorCodeExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Verification code has expired. Please request a new one.",
      });
    }

    // Verify code
    if (user.twoFactorCode !== code) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    // Enable 2FA
    user.twoFactorEnabled = true;
    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    // Create notification
    await createNotification({
      userId: user._id,
      type: "two_factor_enabled",
      title: "Two-Factor Authentication Enabled",
      message: "2FA has been successfully enabled for your account.",
      priority: "high",
      actionUrl: "/settings",
      actionText: "View Settings",
    });

    res.json({
      success: true,
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    console.error("Verify 2FA error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const disable2FA = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid password",
      });
    }

    // Disable 2FA
    user.twoFactorEnabled = false;
    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    // Create notification
    await createNotification({
      userId: user._id,
      type: "two_factor_disabled",
      title: "Two-Factor Authentication Disabled",
      message: "2FA has been disabled for your account.",
      priority: "high",
      actionUrl: "/settings",
      actionText: "View Settings",
    });

    res.json({
      success: true,
      message: "Two-factor authentication disabled successfully",
    });
  } catch (error) {
    console.error("Disable 2FA error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const get2FAStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      enabled: user.twoFactorEnabled || false,
      email: user.email,
    });
  } catch (error) {
    console.error("Get 2FA status error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Verify 2FA during login (used by auth controller)
export const verifyLogin2FA = async (userId, code) => {
  try {
    const user = await User.findById(userId);

    if (!user || !user.twoFactorEnabled) {
      return { success: false, message: "2FA not enabled" };
    }

    if (!user.twoFactorCode || !user.twoFactorCodeExpires) {
      return { success: false, message: "No verification code found" };
    }

    if (user.twoFactorCodeExpires < new Date()) {
      return { success: false, message: "Code expired" };
    }

    if (user.twoFactorCode !== code) {
      return { success: false, message: "Invalid code" };
    }

    // Clear the used code
    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    return { success: true };
  } catch (error) {
    console.error("Verify login 2FA error:", error);
    return { success: false, message: "Server error" };
  }
};

export const verifyLoginOTP = async (req, res) => {
  try {
    console.log("🔐 [2FA Controller] verifyLoginOTP called");
    console.log("Request body:", req.body);

    const { userId, code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({
        success: false,
        message: "User ID and verification code are required",
      });
    }

    console.log(`Looking for user with ID: ${userId}`);
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ User found:", user.email);
    // 🔥 FIXED: Use the correct field names
    console.log("📝 Stored OTP:", user.twoFactorCode);
    console.log("⏰ Stored OTP expiry:", user.twoFactorCodeExpires);
    console.log("🕒 Current time:", new Date());

    // Check if OTP exists
    if (!user.twoFactorCode) {
      console.log("❌ No OTP found in database");
      return res.status(400).json({
        success: false,
        message: "No verification code found. Please request a new one.",
      });
    }

    // Check if OTP is expired
    if (user.twoFactorCodeExpires < new Date()) {
      console.log("❌ OTP expired");
      return res.status(400).json({
        success: false,
        message: "Verification code expired. Please request a new one.",
      });
    }

    // Check if OTP matches
    if (user.twoFactorCode !== code) {
      console.log(
        "❌ OTP mismatch - Expected:",
        user.twoFactorCode,
        "Received:",
        code,
      );
      return res.status(400).json({
        success: false,
        message: "Invalid verification code",
      });
    }

    console.log("✅ OTP verified successfully");

    // Clear OTP fields
    user.twoFactorCode = null;
    user.twoFactorCodeExpires = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        accountId: user.accountId,
        balanceFiat: user.balanceFiat || 0,
        balanceBTC: user.balanceBTC || 0,
        accountType: user.accountType || "savings",
        currency: user.currency || "USD",
        phone: user.phone,
        username: user.username,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    });
  } catch (error) {
    console.error("❌ Error in verifyLoginOTP:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const resendOTP = async (req, res) => {
  try {
    const { userId } = req.body;

    console.log("Resend OTP requested for userId:", userId);

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: "User email not found",
      });
    }

    // Generate new verification code
    const code = generateVerificationCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update user with new code
    user.twoFactorCode = code;
    user.twoFactorCodeExpires = expires;
    await user.save();

    // Send email with new code
    const emailSent = await send2FACode(user.email, code);

    if (!emailSent) {
      return res.status(500).json({
        success: false,
        message: "Failed to send verification code. Please try again.",
      });
    }
    console.log("Resend successful, sending response");

    res.json({
      success: true,
      message: "New verification code sent to your email",
      expiresAt: expires,
    });
  } catch (error) {
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};
