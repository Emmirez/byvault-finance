// src/controllers/securityController.js
import User from "../models/User.js";
import ActivityLog from "../models/ActivityLog.js";
import Setting from "../models/Settings.js";
import { logActivity } from "./activityController.js";


export const getSecurityStats = async (req, res) => {
  try {
    const now = new Date();
    const last24h = new Date(now - 24 * 60 * 60 * 1000);
    const last7d = new Date(now - 7 * 24 * 60 * 60 * 1000);
    const last30d = new Date(now - 30 * 24 * 60 * 60 * 1000);

    const [
      totalUsers,
      usersWith2FA,
      loginAttempts24h,
      failedLogins24h,
      uniqueIPs24h,
      blockedAccounts,
      suspendedAccounts,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ twoFactorEnabled: true }),
      ActivityLog.countDocuments({ 
        type: "login",
        createdAt: { $gte: last24h }
      }),
      ActivityLog.countDocuments({ 
        type: "login_failed",
        createdAt: { $gte: last24h }
      }),
      ActivityLog.distinct("ip", { 
        type: "login",
        createdAt: { $gte: last24h }
      }),
      User.countDocuments({ isBlocked: true }),
      User.countDocuments({ isSuspended: true }),
    ]);

    // Login trends
    const loginTrends = await ActivityLog.aggregate([
      {
        $match: {
          type: "login",
          createdAt: { $gte: last7d }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Failed login trends
    const failedLoginTrends = await ActivityLog.aggregate([
      {
        $match: {
          type: "login_failed",
          createdAt: { $gte: last7d }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Top IPs
    const topIPs = await ActivityLog.aggregate([
      {
        $match: {
          type: "login",
          createdAt: { $gte: last30d }
        }
      },
      {
        $group: {
          _id: "$ip",
          count: { $sum: 1 },
          lastSeen: { $max: "$createdAt" }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        usersWith2FA,
        twoFAPercentage: totalUsers ? ((usersWith2FA / totalUsers) * 100).toFixed(1) : 0,
        loginAttempts24h,
        failedLogins24h,
        successRate24h: loginAttempts24h ? 
          (((loginAttempts24h - failedLogins24h) / loginAttempts24h) * 100).toFixed(1) : 100,
        uniqueIPs24h: uniqueIPs24h.length,
        blockedAccounts,
        suspendedAccounts,
        loginTrends,
        failedLoginTrends,
        topIPs,
      }
    });
  } catch (error) {
    console.error("Error fetching security stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getSecurityLogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 50,
      type,
      userId,
      ip,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    // Filter by log types (login, login_failed, security events)
    const securityTypes = [
      "login", "login_failed", "logout",
      "two_factor_enabled", "two_factor_disabled",
      "password_change", "pin_change",
      "security_alert", "device_trusted"
    ];

    if (type && type !== "all") {
      filter.type = type;
    } else {
      filter.type = { $in: securityTypes };
    }

    if (userId) {
      filter.user = userId;
    }

    if (ip) {
      filter.ip = ip;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const logs = await ActivityLog.find(filter)
      .populate("user", "firstName lastName email")
      .populate("performedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await ActivityLog.countDocuments(filter);

    res.json({
      success: true,
      logs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching security logs:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getSecuritySettings = async (req, res) => {
  try {
    const settings = await Setting.find({
      group: "security"
    }).sort({ key: 1 });

    res.json({
      success: true,
      settings,
    });
  } catch (error) {
    console.error("Error fetching security settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const updateSecuritySetting = async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;

    const setting = await Setting.findOne({ key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    const oldValue = setting.value;
    setting.value = value;
    setting.lastUpdatedBy = req.user.id;
    await setting.save();

    await logActivity({
      userId: req.user.id,
      type: "security_setting_update",
      title: "Security Setting Updated",
      description: `Updated ${key} from ${oldValue} to ${value}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        settingKey: key,
        oldValue,
        newValue: value,
      },
    });

    res.json({
      success: true,
      message: "Security setting updated",
      setting,
    });
  } catch (error) {
    console.error("Error updating security setting:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getActiveSessions = async (req, res) => {
  try {
    // Get recent login activities (last 24h)
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const sessions = await ActivityLog.aggregate([
      {
        $match: {
          type: "login",
          createdAt: { $gte: last24h }
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: { user: "$user", ip: "$ip", device: "$device" },
          user: { $first: "$user" },
          ip: { $first: "$ip" },
          device: { $first: "$device" },
          browser: { $first: "$browser" },
          os: { $first: "$os" },
          lastActive: { $first: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userInfo"
        }
      },
      {
        $unwind: "$userInfo"
      },
      {
        $project: {
          _id: 0,
          userId: "$userInfo._id",
          name: { $concat: ["$userInfo.firstName", " ", "$userInfo.lastName"] },
          email: "$userInfo.email",
          ip: 1,
          device: 1,
          browser: 1,
          os: 1,
          lastActive: 1,
          sessionCount: "$count"
        }
      },
      { $sort: { lastActive: -1 } },
      { $limit: 100 }
    ]);

    res.json({
      success: true,
      sessions,
      total: sessions.length,
    });
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const revokeSession = async (req, res) => {
  try {
    const { userId, sessionId } = req.body;

    // This would require a session store (Redis, etc.)
    // For now, we'll log the action
    await logActivity({
      userId,
      type: "admin_revoke_session",
      title: "Session Revoked",
      description: `Admin revoked session for user`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user.id,
      metadata: {
        sessionId,
        revokedAt: new Date(),
      },
    });

    res.json({
      success: true,
      message: "Session revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking session:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getUserLoginAttempts = async (req, res) => {
  try {
    const { userId } = req.params;
    const { limit = 20 } = req.query;

    const attempts = await ActivityLog.find({
      user: userId,
      type: { $in: ["login", "login_failed"] }
    })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.json({
      success: true,
      attempts,
    });
  } catch (error) {
    console.error("Error fetching login attempts:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const toggleUser2FA = async (req, res) => {
  try {
    const { userId } = req.params;
    const { enabled } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.twoFactorEnabled = enabled;
    user.twoFactorSecret = enabled ? user.twoFactorSecret : null;
    await user.save();

    await logActivity({
      userId,
      type: "admin_toggle_2fa",
      title: enabled ? "2FA Enabled by Admin" : "2FA Disabled by Admin",
      description: `Admin ${enabled ? "enabled" : "disabled"} 2FA for user`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user.id,
    });

    res.json({
      success: true,
      message: `2FA ${enabled ? "enabled" : "disabled"} for user`,
    });
  } catch (error) {
    console.error("Error toggling 2FA:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};