// middleware/verificationMiddleware.js
import User from "../models/User.js";

export const requireVerified = async (req, res, next) => {
  try {
    // Get user from database (req.user is set by auth middleware)
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message:
          "Account verification required. Please complete KYC to access this feature.",
        code: "VERIFICATION_REQUIRED",
        redirectTo: "/kyc",
      });
    }

    // Check if user is blocked or suspended
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account has been blocked. Please contact support.",
        code: "ACCOUNT_BLOCKED",
      });
    }

    if (user.isSuspended) {
      return res.status(403).json({
        success: false,
        message: "Your account is temporarily suspended.",
        code: "ACCOUNT_SUSPENDED",
        suspendedUntil: user.suspendedUntil,
      });
    }

    // User is verified and active - proceed
    next();
  } catch (error) {
    console.error("Verification middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
