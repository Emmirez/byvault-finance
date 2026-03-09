// src/controllers/adminProfileController.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import { logActivity } from "./activityController.js";


export const getAdminProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password -transactionPin");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        accountId: user.accountId,
        accountType: user.accountType,
        currency: user.currency,
        twoFactorEnabled: user.twoFactorEnabled || false,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      }
    });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("📝 UPDATE ADMIN PROFILE REQUEST");
    console.log("User ID:", req.user._id);
    console.log("Request body:", req.body);
    
    const { firstName, lastName, phone, address } = req.body;
    
    // Build update object with only provided fields
    const updateData = {};
    
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;
    
    // Update full name if firstName or lastName changed
    if (firstName !== undefined || lastName !== undefined) {
      // Get current user to know the other name part
      const currentUser = await User.findById(req.user._id).select('firstName lastName');
      const newFirstName = firstName !== undefined ? firstName : currentUser.firstName;
      const newLastName = lastName !== undefined ? lastName : currentUser.lastName;
      updateData.name = `${newFirstName} ${newLastName}`.trim();
    }

    console.log("📊 Update data:", updateData);

    if (Object.keys(updateData).length === 0) {
      return res.json({
        success: true,
        message: "No changes detected",
        user: await User.findById(req.user._id).select('-password -transactionPin')
      });
    }

    // Use findByIdAndUpdate to bypass validation
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { 
        new: true, // Return the updated document
        runValidators: false, // CRITICAL: Skip validation
        select: '-password -transactionPin'
      }
    );

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    console.log("✅ User updated successfully");

    // Log activity
    try {
      await logActivity({
        userId: user._id,
        type: "profile_update",
        title: "Profile Updated",
        description: "Admin updated their profile information",
        status: "success",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: { updates: Object.keys(updateData) }
      });
    } catch (logError) {
      console.error("Failed to log activity:", logError);
      // Don't fail the request if logging fails
    }

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
        accountId: user.accountId,
      }
    });
  } catch (error) {
    console.error("❌ Error updating admin profile:");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    
    res.status(500).json({ 
      success: false, 
      message: "Server error: " + error.message 
    });
  }
};


// @access  Private/Admin
export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required"
      });
    }

    // Password strength validation
    const hasMinLength = newPassword.length >= 8;
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters and contain uppercase, lowercase, and number"
      });
    }

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    // Check if new password is same as old
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password"
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      type: "password_change",
      title: "Password Changed",
      description: "Admin changed their password",
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};


export const toggleTwoFactor = async (req, res) => {
  try {
    const { enable } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    user.twoFactorEnabled = enable;
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      type: enable ? "two_factor_enabled" : "two_factor_disabled",
      title: enable ? "2FA Enabled" : "2FA Disabled",
      description: enable ? "Admin enabled two-factor authentication" : "Admin disabled two-factor authentication",
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: enable ? "Two-factor authentication enabled" : "Two-factor authentication disabled",
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (error) {
    console.error("Error toggling 2FA:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};