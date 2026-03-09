import Notification from "../models/Notification.js";
import User from "../models/User.js";
import AdminAlert from "../models/AdminAlert.js";
import mongoose from "mongoose";

export const getUserNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, read } = req.query;
    const query = { user: req.user.id };

    if (read !== undefined) {
      query.read = read === "true";
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1, priority: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    notification.read = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { $set: { read: true, readAt: new Date() } },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    console.error("Error marking all as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    res.json({
      success: true,
      message: "Notification deleted",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user.id });

    res.json({
      success: true,
      message: "All notifications cleared",
    });
  } catch (error) {
    console.error("Error clearing notifications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// export const getUnreadCount = async (req, res) => {
//   try {
//     const count = await Notification.countDocuments({
//       user: req.user.id,
//       read: false,
//     });

//     res.json({
//       success: true,
//       count,
//     });
//   } catch (error) {
//     console.error("Error getting unread count:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// };

export const getUnreadCount = async (req, res) => {
  try {
    let count = 0;

    // For regular users - get unread notifications
    if (req.user.role === "user") {
      count = await Notification.countDocuments({
        user: req.user.id,
        read: false,
      });
    }
    // For admins/superadmins - get unread admin alerts
    else if (req.user.role === "admin" || req.user.role === "superadmin") {
      count = await AdminAlert.countDocuments({
        status: "new",
      });
    }

    res.json({
      success: true,
      count,
      hasNotifications: count > 0,
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Helper function to create notification (used by other controllers)
export const createNotification = async ({
  userId,
  type,
  title,
  message,
  priority = "medium",
  data = {},
  actionUrl = null,
  actionText = null,
  image = null,
}) => {
  try {
    const notification = new Notification({
      user: userId,
      type,
      title,
      message,
      priority,
      data,
      actionUrl,
      actionText,
      image,
    });

    await notification.save();

    // TODO: Send real-time notification via WebSocket/Socket.io
    // emitNotification(userId, notification);

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};

export const createAdminNotification = async (req, res) => {
  try {
    const { userId, type, title, message, priority, actionUrl, actionText } =
      req.body;

    if (!userId || !type || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const notification = await createNotification({
      userId,
      type,
      title,
      message,
      priority: priority || "medium",
      actionUrl,
      actionText,
      metadata: { createdBy: req.user.id },
    });

    res.status(201).json({
      success: true,
      message: "Notification created",
      notification,
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const broadcastNotification = async (req, res) => {
  try {
    const { type, title, message, priority, userFilter = {} } = req.body;

    if (!type || !title || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const users = await User.find(userFilter).select("_id");
    const notifications = [];

    for (const user of users) {
      const notification = await createNotification({
        userId: user._id,
        type,
        title,
        message,
        priority: priority || "medium",
        metadata: { broadcast: true, createdBy: req.user.id },
      });
      notifications.push(notification);
    }

    res.json({
      success: true,
      message: `Notification broadcast to ${users.length} users`,
      count: users.length,
    });
  } catch (error) {
    console.error("Error broadcasting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMenuNotificationCounts = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);

    
    const notifications = await Notification.find({
      user: userId,
      read: false,
    });

    const menuCounts = {
      dashboard: 0,
      transactions: 0,
      cards: 0,
      "local-transfer": 0,
      "international-transfer": 0,
      deposit: 0,
      "currency-swap": 0,
      loans: 0,
      "tax-refund": 0,
      grants: 0,
      settings: 0,
      support: 0,
      kyc: 0,
    };

    notifications.forEach((n) => {
      const type = n.type || "";
      const transferType = n.data?.transferType || "local";
      const isInternational = transferType === "international";

      // Dashboard gets everything
      menuCounts.dashboard += 1;

      // Transactions
      if (
        type.includes("transfer") ||
        type.includes("transaction") ||
        type.includes("deposit") ||
        type.includes("withdraw")
      ) {
        menuCounts.transactions += 1;
      }

      
      if (
        type.includes("transfer") ||
        type.includes("sent") ||
        type.includes("received")
      ) {
        if (isInternational) {
          menuCounts["international-transfer"] += 1;
        } else {
          menuCounts["local-transfer"] += 1;
        }
      }

      if (type.includes("card")) menuCounts.cards += 1;
      if (type.includes("deposit")) menuCounts.deposit += 1;
      if (type.includes("swap")) menuCounts["currency-swap"] += 1;
      if (type.includes("loan")) menuCounts.loans += 1;
      if (type.includes("refund") || type.includes("tax"))
        menuCounts["tax-refund"] += 1;
      if (type.includes("grant")) menuCounts.grants += 1;
      if (type.includes("kyc")) {
        menuCounts.settings += 1;
        menuCounts.kyc += 1;
      }
      if (
        type.includes("profile") ||
        type.includes("password") ||
        type.includes("pin")
      )
        menuCounts.settings += 1;
      if (type.includes("ticket")) menuCounts.support += 1;
    });

    res.json({ success: true, counts: menuCounts });
  } catch (error) {
    console.error(" Error in getMenuNotificationCounts:", error);
    res
      .status(500)
      .json({ success: false, message: error.message, counts: {} });
  }
};
