// src/controllers/announcementController.js
import Announcement from "../models/Announcement.js";
import User from "../models/User.js";
import { createNotification } from "./notificationsController.js";
import { logActivity } from "./activityController.js";


export const createAnnouncement = async (req, res) => {
  try {
    const {
      title,
      content,
      type = "info",
      priority = "medium",
      targetAudience = ["all"],
      scheduledAt,
      expiresAt,
    } = req.body;

    const announcement = new Announcement({
      title,
      content,
      type,
      priority,
      targetAudience,
      scheduledAt: scheduledAt || new Date(),
      expiresAt,
      createdBy: req.user.id,
      status: scheduledAt ? "scheduled" : "published",
      publishedAt: scheduledAt ? null : new Date(),
    });

    await announcement.save();

    // If published immediately, send notifications to target users
    if (!scheduledAt) {
      await sendAnnouncementNotifications(announcement);
    }

    await logActivity({
      userId: req.user.id,
      type: "email",
      title: "Announcement Created",
      description: `Created announcement: ${title}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        announcementId: announcement._id,
        type,
        priority,
      },
    });

    res.status(201).json({
      success: true,
      message: "Announcement created successfully",
      announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Helper function to send notifications
const sendAnnouncementNotifications = async (announcement) => {
  try {
    // Build user query based on target audience
    const query = {};
    if (!announcement.targetAudience.includes("all")) {
      if (announcement.targetAudience.includes("verified")) {
        query.isVerified = true;
      }
      if (announcement.targetAudience.includes("admins")) {
        query.role = { $in: ["admin", "superadmin"] };
      }
    }

    const users = await User.find(query).select("_id");
    
    // Create notifications for each user
    const notifications = users.map(user => ({
      userId: user._id,
      type: "new_feature",
      title: announcement.title,
      message: announcement.content.substring(0, 100) + "...",
      priority: announcement.priority === "critical" ? "high" : "medium",
      data: {
        announcementId: announcement._id,
        type: announcement.type,
      },
      actionUrl: "/announcements",
      actionText: "View Details",
    }));

    await Promise.all(
      notifications.map(notif => createNotification(notif))
    );

    console.log(`📢 Sent notifications to ${users.length} users`);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};


export const getAllAnnouncements = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      priority,
      search,
    } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }
    if (type && type !== "all") {
      filter.type = type;
    }
    if (priority && priority !== "all") {
      filter.priority = priority;
    }
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const announcements = await Announcement.find(filter)
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Announcement.countDocuments(filter);

    // Get statistics
    const stats = {
      total: await Announcement.countDocuments(),
      published: await Announcement.countDocuments({ status: "published" }),
      scheduled: await Announcement.countDocuments({ status: "scheduled" }),
      draft: await Announcement.countDocuments({ status: "draft" }),
    };

    res.json({
      success: true,
      announcements,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getAnnouncementById = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate("createdBy", "firstName lastName email")
      .lean();

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    res.json({
      success: true,
      announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const updateAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Only allow editing drafts and scheduled announcements
    if (!["draft", "scheduled"].includes(announcement.status)) {
      return res.status(400).json({
        success: false,
        message: "Cannot edit published or archived announcements",
      });
    }

    const {
      title,
      content,
      type,
      priority,
      targetAudience,
      scheduledAt,
      expiresAt,
    } = req.body;

    if (title) announcement.title = title;
    if (content) announcement.content = content;
    if (type) announcement.type = type;
    if (priority) announcement.priority = priority;
    if (targetAudience) announcement.targetAudience = targetAudience;
    if (scheduledAt) announcement.scheduledAt = scheduledAt;
    if (expiresAt) announcement.expiresAt = expiresAt;

    await announcement.save();

    await logActivity({
      userId: req.user.id,
      type: "announcement_update",
      title: "Announcement Updated",
      description: `Updated announcement: ${announcement.title}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        announcementId: announcement._id,
      },
    });

    res.json({
      success: true,
      message: "Announcement updated successfully",
      announcement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const publishAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    announcement.status = "published";
    announcement.publishedAt = new Date();
    await announcement.save();

    // Send notifications
    await sendAnnouncementNotifications(announcement);

    res.json({
      success: true,
      message: "Announcement published successfully",
      announcement,
    });
  } catch (error) {
    console.error("Error publishing announcement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const archiveAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    announcement.status = "archived";
    await announcement.save();

    res.json({
      success: true,
      message: "Announcement archived successfully",
    });
  } catch (error) {
    console.error("Error archiving announcement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message: "Announcement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const getUserAnnouncements = async (req, res) => {
  try {
    const user = req.user;
    
    const announcements = await Announcement.find({
      status: "published",
      $or: [
        { expiresAt: { $gt: new Date() } },
        { expiresAt: null },
      ],
      targetAudience: { $in: ["all", user.role === "admin" ? "admins" : "users"] },
    })
      .sort({ priority: -1, publishedAt: -1 })
      .lean();

    // Add read status
    const announcementsWithReadStatus = announcements.map(ann => ({
      ...ann,
      isRead: ann.readBy?.some(r => r.user.toString() === user.id),
    }));

    res.json({
      success: true,
      announcements: announcementsWithReadStatus,
    });
  } catch (error) {
    console.error("Error fetching user announcements:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: "Announcement not found",
      });
    }

    // Check if already read
    const alreadyRead = announcement.readBy.some(
      r => r.user.toString() === req.user.id
    );

    if (!alreadyRead) {
      announcement.readBy.push({
        user: req.user.id,
        readAt: new Date(),
      });
      await announcement.save();
    }

    res.json({
      success: true,
      message: "Marked as read",
    });
  } catch (error) {
    console.error("Error marking announcement as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};