// src/controllers/activityController.js
import ActivityLog from "../models/ActivityLog.js";
import User from "../models/User.js";
import mongoose from "mongoose";

// @desc    Get user activities with filters and pagination
// @route   GET /api/admin/users/:userId/activities
// @access  Private/Admin
export const getUserActivities = async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      page = 1, 
      limit = 20, 
      type, 
      status,
      startDate, 
      endDate,
      search 
    } = req.query;

    console.log(`📋 Fetching activities for user: ${userId}`);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    // Build filter
    const filter = { user: userId };
    
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Search in title/description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get activities
    const activities = await ActivityLog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('performedBy', 'firstName lastName email')
      .lean();

    // Get total count
    const total = await ActivityLog.countDocuments(filter);

    // Get activity statistics
    const stats = await ActivityLog.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId) } },
      { $group: {
        _id: null,
        logins: {
          $sum: { $cond: [{ $in: ["$type", ["login", "logout"]] }, 1, 0] }
        },
        transactions: {
          $sum: { $cond: [{ $in: ["$type", ["deposit", "withdraw", "transfer", "payment"]] }, 1, 0] }
        },
        updates: {
          $sum: { $cond: [{ $in: ["$type", ["profile_update", "password_change"]] }, 1, 0] }
        },
        security: {
          $sum: { $cond: [{ $in: ["$type", ["two_factor_enabled", "two_factor_disabled", "security_alert"]] }, 1, 0] }
        },
        cards: {
          $sum: { $cond: [{ $regexMatch: { input: "$type", regex: /^card_/ } }, 1, 0] }
        },
        admin: {
          $sum: { $cond: [{ $regexMatch: { input: "$type", regex: /^admin_/ } }, 1, 0] }
        }
      }}
    ]);

    console.log(`✅ Found ${activities.length} activities for user ${userId}`);

    res.json({
      success: true,
      activities,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        logins: 0,
        transactions: 0,
        updates: 0,
        security: 0,
        cards: 0,
        admin: 0,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching user activities:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error",
      error: error.message 
    });
  }
};

// @desc    Get activity statistics
// @route   GET /api/admin/users/:userId/activities/stats
// @access  Private/Admin
export const getActivityStats = async (req, res) => {
  try {
    const { userId } = req.params;
    const { period = "30days" } = req.query;

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (period) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    const stats = await ActivityLog.aggregate([
      {
        $match: {
          user: new mongoose.Types.ObjectId(userId),
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $facet: {
          byType: [
            { $group: {
              _id: "$type",
              count: { $sum: 1 }
            }}
          ],
          byDay: [
            {
              $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                count: { $sum: 1 }
              }
            },
            { $sort: { _id: 1 } }
          ],
          totals: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                unique: { $addToSet: "$type" }
              }
            }
          ]
        }
      }
    ]);

    res.json({
      success: true,
      stats: stats[0] || { byType: [], byDay: [], totals: [] },
      period,
    });
  } catch (error) {
    console.error("Error fetching activity stats:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// @desc    Get single activity details
// @route   GET /api/admin/activities/:activityId
// @access  Private/Admin
export const getActivityDetails = async (req, res) => {
  try {
    const { activityId } = req.params;

    const activity = await ActivityLog.findById(activityId)
      .populate('user', 'firstName lastName email')
      .populate('performedBy', 'firstName lastName email')
      .lean();

    if (!activity) {
      return res.status(404).json({ 
        success: false, 
        message: "Activity not found" 
      });
    }

    res.json({
      success: true,
      activity,
    });
  } catch (error) {
    console.error("Error fetching activity details:", error);
    res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};


export const logActivity = async ({
  userId,
  type,
  title,
  description,
  status = "success",
  metadata = {},
  ip,
  userAgent,
  amount,
  currency = "USD",
  performedBy = null,
}) => {
  try {
    // Parse user agent for device info (simple version)
    let device = "Unknown";
    let browser = "Unknown";
    let os = "Unknown";

    if (userAgent) {
      if (userAgent.includes("Mobile")) device = "Mobile";
      else if (userAgent.includes("Tablet")) device = "Tablet";
      else device = "Desktop";

      if (userAgent.includes("Chrome")) browser = "Chrome";
      else if (userAgent.includes("Firefox")) browser = "Firefox";
      else if (userAgent.includes("Safari")) browser = "Safari";
      else if (userAgent.includes("Edge")) browser = "Edge";

      if (userAgent.includes("Windows")) os = "Windows";
      else if (userAgent.includes("Mac")) os = "macOS";
      else if (userAgent.includes("Linux")) os = "Linux";
      else if (userAgent.includes("Android")) os = "Android";
      else if (userAgent.includes("iOS")) os = "iOS";
    }

    const activity = new ActivityLog({
      user: userId,
      type,
      title,
      description,
      status,
      metadata,
      ip,
      userAgent,
      device,
      browser,
      os,
      amount,
      currency,
      performedBy,
    });

    await activity.save();
    console.log(`📝 Activity logged: ${type} for user ${userId}`);
    return activity;
  } catch (error) {
    console.error("Failed to log activity:", error);
    return null;
  }
};

