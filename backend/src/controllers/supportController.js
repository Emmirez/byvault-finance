// controllers/supportController.js
import SupportTicket from "../models/SupportTicket.js";
import User from "../models/User.js";
import { createNotification } from "./notificationsController.js";
import { createSystemAlert } from "./adminAlertController.js";
import ActivityLog from "../models/ActivityLog.js";

//  USER CONTROLLERS

export const submitTicket = async (req, res) => {
  try {
    const { title, priority, description, category = "general" } = req.body;

    // Validate required fields
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    if (description.length < 10) {
      return res.status(400).json({
        success: false,
        message: "Please provide more details (at least 10 characters)",
      });
    }

    // Create ticket
    const ticket = new SupportTicket({
      user: req.user.id,
      title,
      priority: priority || "Low Priority",
      description,
      category,
      status: "open",
      messages: [
        {
          sender: req.user.id,
          senderType: "user",
          message: description,
        },
      ],
    });

    await ticket.save();

    // 🔔 CREATE NOTIFICATION FOR USER
    await createNotification({
      userId: req.user.id,
      type: "ticket_created",
      title: "Support Ticket Created",
      message: `Your ticket #${ticket.ticketNumber} has been submitted successfully.`,
      priority: "medium",
      data: {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        ticketTitle: ticket.title,
      },
      actionUrl: `/support/tickets/${ticket._id}`,
      actionText: "View Ticket",
    });

    // ALERT FOR ADMINS
    await createSystemAlert("support_ticket", {
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      ticketTitle: ticket.title,
      priority: ticket.priority,
      category: ticket.category,
       action: "new_ticket",  
      description:
        description.substring(0, 100) + (description.length > 100 ? "..." : ""),
    });

    // Create system alert for urgent tickets
    if (ticket.priority === "Urgent") {
      await createSystemAlert("support_ticket", {
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        action: "urgent_ticket",  
        priority: "urgent",
      });
    }

    // Log activity
    await ActivityLog.create({
      user: req.user.id,
      type: "support_ticket",
      title: "Support Ticket Submitted",
      description: `Ticket #${ticket.ticketNumber}: ${ticket.title}`,
      status: "success",
      metadata: {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
      },
    });

    res.status(201).json({
      success: true,
      message: "Support ticket submitted successfully",
      ticket: {
        id: ticket._id,
        ticketNumber: ticket.ticketNumber,
        title: ticket.title,
        priority: ticket.priority,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Error submitting ticket:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getUserTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      tickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addTicketMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status === "resolved" || ticket.status === "closed") {
      return res.status(400).json({
        message: "Cannot add message to resolved or closed ticket",
      });
    }

    // Add message
    ticket.messages.push({
      sender: req.user.id,
      senderType: "user",
      message,
    });

    // Reopen ticket if it was closed/resolved
    if (ticket.status === "resolved" || ticket.status === "closed") {
      ticket.status = "reopened";
      ticket.reopenedAt = new Date();
    } else if (ticket.status === "reopened") {
      // Keep as reopened
    } else {
      ticket.status = "open";
    }

    await ticket.save();

    //  NOTIFY ADMINS about user reply
    await createSystemAlert("support_ticket", {
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      ticketTitle: ticket.title,
      action: "user_replied",  
      reply: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
    });

    res.json({
      success: true,
      message: "Message added successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error adding message:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const closeTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const oldStatus = ticket.status;
    ticket.status = "closed";
    ticket.closedAt = new Date();

    await ticket.save();

    // 🔔 NOTIFY ADMINS about ticket closure using SYSTEM ALERT
    await createSystemAlert("support_ticket", {
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email,
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      ticketTitle: ticket.title,
      oldStatus,
      newStatus: "closed",
       action: "ticket_closed",
    });

    res.json({
      success: true,
      message: "Ticket closed successfully",
    });
  } catch (error) {
    console.error("Error closing ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN CONTROLLERS

export const getAllTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (priority && priority !== "all") {
      query.priority = priority;
    }

    const tickets = await SupportTicket.find(query)
      .populate("user", "firstName lastName email")
      .populate("assignedTo", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await SupportTicket.countDocuments(query);

    res.json({
      success: true,
      tickets,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getTicketDetails = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id)
      .populate("user", "firstName lastName email phone")
      .populate("assignedTo", "firstName lastName email")
      .populate("messages.sender", "firstName lastName email");

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json({
      success: true,
      ticket,
    });
  } catch (error) {
    console.error("Error fetching ticket details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateTicketStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const oldStatus = ticket.status;
    const oldAssignedTo = ticket.assignedTo;

    ticket.status = status;

    if (assignedTo) {
      ticket.assignedTo = assignedTo;
    }

    if (status === "resolved") {
      ticket.resolvedAt = new Date();
    } else if (status === "closed") {
      ticket.closedAt = new Date();
    } else if (status === "reopened") {
      ticket.reopenedAt = new Date();
    }

    await ticket.save();

    // 🔔 NOTIFY USER about status change (KEEP AS createNotification)
    await createNotification({
      userId: ticket.user,
      type: "ticket_status_changed",
      title: "Ticket Status Updated",
      message: `Your ticket #${ticket.ticketNumber} status changed from ${oldStatus} to ${status}`,
      priority: status === "resolved" ? "high" : "medium",
      data: {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        ticketTitle: ticket.title,
        oldStatus,
        newStatus: status,
        assignedTo: assignedTo || null,
      },
      actionUrl: `/support/tickets/${ticket._id}`,
      actionText: "View Ticket",
    });

    // 🔔 NOTIFY NEW ASSIGNEE using SYSTEM ALERT
    if (
      assignedTo &&
      (!oldAssignedTo || oldAssignedTo.toString() !== assignedTo.toString())
    ) {
      const assignee = await User.findById(assignedTo);
      if (assignee) {
        await createSystemAlert("support_ticket", {
          userId: ticket.user,
          userName: `${ticket.user?.firstName || ""} ${ticket.user?.lastName || ""}`,
          userEmail: ticket.user?.email || "",
          assignedToId: assignedTo,
          assignedToName: assignee
            ? `${assignee.firstName} ${assignee.lastName}`
            : "Admin",
          ticketId: ticket._id,
          ticketNumber: ticket.ticketNumber,
          ticketTitle: ticket.title,
          action: "ticket_assigned",
        });
      }
    }

    res.json({
      success: true,
      message: `Ticket status updated to ${status}`,
      ticket,
    });
  } catch (error) {
    console.error("Error updating ticket status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const addAdminReply = async (req, res) => {
  try {
    const { message } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    // Add admin reply
    ticket.messages.push({
      sender: req.user.id,
      senderType: "admin",
      message,
    });

    ticket.status = "in_progress";

    await ticket.save();

    // 🔔 NOTIFY USER about admin reply 
    await createNotification({
      userId: ticket.user,
      type: "admin_replied",
      title: "Admin Replied to Your Ticket",
      message: `Admin replied to your ticket #${ticket.ticketNumber}`,
      priority: "high",
      data: {
        ticketId: ticket._id,
        ticketNumber: ticket.ticketNumber,
        ticketTitle: ticket.title,
        adminId: req.user.id,
        adminName: `${req.user.firstName} ${req.user.lastName}`,
        reply: message.substring(0, 100) + (message.length > 100 ? "..." : ""),
      },
      actionUrl: `/support/tickets/${ticket._id}`,
      actionText: "View Reply",
    });

    res.json({
      success: true,
      message: "Reply added successfully",
      ticket,
    });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    await ticket.deleteOne();

    //  NOTIFY ADMINS about ticket deletion using SYSTEM ALERT
    await createSystemAlert("support_ticket", {
      userId: ticket.user,
      userName: `${ticket.user?.firstName || ""} ${ticket.user?.lastName || ""}`,
      userEmail: ticket.user?.email || "",
      ticketId: ticket._id,
      ticketNumber: ticket.ticketNumber,
      ticketTitle: ticket.title,
      deletedBy: `${req.user.firstName} ${req.user.lastName}`,
      action: "ticket_deleted",
    });

    // Notify user about deletion 
    await createNotification({
      userId: ticket.user,
      type: "ticket_deleted",
      title: "Ticket Deleted",
      message: `Your ticket #${ticket.ticketNumber} has been deleted by admin.`,
      priority: "medium",
      data: {
        ticketNumber: ticket.ticketNumber,
        ticketTitle: ticket.title,
      },
    });

    res.json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting ticket:", error);
    res.status(500).json({ message: "Server error" });
  }
};
