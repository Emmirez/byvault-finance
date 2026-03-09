import jwt from "jsonwebtoken"
import User from "../models/User.js"

// Protect routes (any logged-in user)
export const protect = async (req, res, next) => {
  let token

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1] // "Bearer TOKEN"

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // Attach user to request
      req.user = await User.findById(decoded.id).select("-password")
      next()
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" })
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" })
  }
}

// Only allow specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not have access" })
    }
    next()
  }
}

export const admin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    res.status(403).json({ 
      message: "Access denied. Admin privileges required." 
    });
  }
};

// Superadmin check middleware (superadmin only)
export const superadmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    res.status(403).json({ 
      message: "Access denied. Superadmin privileges required." 
    });
  }
};

// Optional: Admin or higher (admin or superadmin)
export const adminOrSuperadmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    res.status(403).json({ 
      message: "Access denied. Admin or Superadmin privileges required." 
    });
  }
};

export const checkUserStatus = async (req, res, next) => {
  try {
    // Fetch fresh user from DB — don't trust the token payload
    const user = await User.findById(req.user._id).select("isBlocked isSuspended suspendedUntil status");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Blocked users — full lockout
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_BLOCKED",
        message: "Your account has been blocked. Please contact support.",
      });
    }

    // Suspended users — check if suspension has expired
    if (user.isSuspended) {
      if (user.suspendedUntil && new Date() > new Date(user.suspendedUntil)) {
        // Suspension expired — auto-lift it
        await User.findByIdAndUpdate(req.user._id, {
          isSuspended: false,
          status: user.isVerified ? "active" : "pending",
          suspendedUntil: null,
        });
      } else {
        return res.status(403).json({
          success: false,
          code: "ACCOUNT_SUSPENDED",
          message: "Your account is temporarily suspended. Please contact support.",
          suspendedUntil: user.suspendedUntil,
        });
      }
    }

    next();
  } catch (err) {
    console.error("checkUserStatus error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
