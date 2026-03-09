import AdminAlert from "../models/AdminAlert.js";
import User from "../models/User.js";

// Get all admin alerts
export const getAlerts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      severity,
      type,
      startDate,
      endDate,
    } = req.query;

    const query = {};

    if (status) query.status = status;
    if (severity) query.severity = severity;
    if (type) query.type = type;

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const alerts = await AdminAlert.find(query)
      .sort({ createdAt: -1, severity: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate("acknowledgedBy", "firstName lastName email")
      .populate("resolvedBy", "firstName lastName email");

    const total = await AdminAlert.countDocuments(query);
    const newCount = await AdminAlert.countDocuments({ status: "new" });
    const criticalCount = await AdminAlert.countDocuments({
      severity: "critical",
      status: { $ne: "resolved" },
    });

    // Get statistics by severity
    const stats = await AdminAlert.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 },
          new: {
            $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] },
          },
        },
      },
    ]);

    res.json({
      alerts,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        new: newCount,
        critical: criticalCount,
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching admin alerts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single alert
export const getAlert = async (req, res) => {
  try {
    const alert = await AdminAlert.findById(req.params.id)
      .populate("acknowledgedBy", "firstName lastName email")
      .populate("resolvedBy", "firstName lastName email");

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({ alert });
  } catch (error) {
    console.error("Error fetching alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Acknowledge alert
export const acknowledgeAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const alert = await AdminAlert.findByIdAndUpdate(
      id,
      {
        status: "acknowledged",
        acknowledgedBy: adminId,
        acknowledgedAt: new Date(),
      },
      { new: true },
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({
      success: true,
      message: "Alert acknowledged",
      alert,
    });
  } catch (error) {
    console.error("Error acknowledging alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Resolve alert
export const resolveAlert = async (req, res) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;
    const adminId = req.user._id;

    const alert = await AdminAlert.findByIdAndUpdate(
      id,
      {
        status: "resolved",
        resolvedBy: adminId,
        resolvedAt: new Date(),
        "metadata.resolution": resolution,
      },
      { new: true },
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({
      success: true,
      message: "Alert resolved",
      alert,
    });
  } catch (error) {
    console.error("Error resolving alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Bulk acknowledge alerts
export const bulkAcknowledge = async (req, res) => {
  try {
    const { alertIds } = req.body;
    const adminId = req.user._id;

    const result = await AdminAlert.updateMany(
      { _id: { $in: alertIds }, status: "new" },
      {
        status: "acknowledged",
        acknowledgedBy: adminId,
        acknowledgedAt: new Date(),
      },
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} alerts acknowledged`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error bulk acknowledging alerts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Create alert (for system events)
export const createAlert = async (req, res) => {
  try {
    const {
      type,
      title,
      message,
      severity,
      actionRequired,
      actionUrl,
      metadata,
    } = req.body;

    const alert = new AdminAlert({
      type,
      title,
      message,
      severity,
      actionRequired,
      actionUrl,
      metadata,
    });

    await alert.save();

    // If critical, maybe send email/SMS to admins
    if (severity === "critical") {
      console.log(`🚨 CRITICAL ALERT: ${title}`);
      // Add email/SMS logic here
    }

    res.status(201).json({
      success: true,
      message: "Alert created",
      alert,
    });
  } catch (error) {
    console.error("Error creating alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get alert counts for dashboard
export const getAlertCounts = async (req, res) => {
  try {
    const [newCount, criticalCount, byType] = await Promise.all([
      AdminAlert.countDocuments({ status: "new" }),
      AdminAlert.countDocuments({
        severity: "critical",
        status: { $ne: "resolved" },
      }),
      AdminAlert.aggregate([
        { $match: { status: { $ne: "resolved" } } },
        {
          $group: {
            _id: "$type",
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    res.json({
      new: newCount,
      critical: criticalCount,
      byType,
    });
  } catch (error) {
    console.error("Error getting alert counts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// System function to auto-create alerts
export const createSystemAlert = async (event, data) => {
  console.log("🔍 createSystemAlert called with:", { event, data });
  try {
    let alert = null;

    switch (event) {
      case "large_deposit":
        if (data.amount > 10000) {
          alert = new AdminAlert({
            type: "deposit_request",
            title: "Large Deposit Alert",
            message: `Deposit of $${data.amount.toLocaleString()} from ${data.userName} requires review`,
            severity: "warning",
            actionRequired: true,
            actionUrl: `/admin/deposits/${data.depositId}`,
            metadata: { amount: data.amount, userId: data.userId },
          });
        }
        break;

      case "kyc_submitted":
        alert = new AdminAlert({
          type: "kyc_pending",
          title: "KYC Verification Pending",
          message: `${data.userName} submitted KYC documents for review`,
          severity: "info",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: { kycId: data.kycId, userId: data.userId },
        });
        break;

      case "failed_login_attempts":
        if (data.attempts >= 5) {
          alert = new AdminAlert({
            type: "security_alert",
            title: "Multiple Failed Login Attempts",
            message: `${data.attempts} failed login attempts for ${data.email}`,
            severity: "warning",
            actionRequired: false,
            actionUrl: `/admin/users/${data.userId}`,
            metadata: { email: data.email, attempts: data.attempts },
          });
        }
        break;

      case "user_blocked":
        alert = new AdminAlert({
          type: "user_blocked",
          title: "User Account Blocked",
          message: `${data.userName} was blocked due to ${data.reason}`,
          severity: "critical",
          actionRequired: true,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: { userId: data.userId, reason: data.reason },
        });
        break;

      case "system_error":
        alert = new AdminAlert({
          type: "system_alert",
          title: "System Error Detected",
          message: data.message,
          severity: "critical",
          actionRequired: true,
          actionUrl: "/admin/system/logs",
          metadata: data.metadata,
        });
        break;
      case "card_application":
        alert = new AdminAlert({
          type: "card_application",
          title: "New Card Application",
          message: `${data.userName} applied for a ${data.cardType} ${data.cardBrand} card`,
          severity: "info",
          actionRequired: true,
          actionUrl: `/admin/cards/${data.cardId}`,
          metadata: {
            userId: data.userId,
            cardId: data.cardId,
            cardType: data.cardType,
            cardBrand: data.cardBrand,
          },
        });
        break;

      // Add these cases to your switch statement in adminAlertController.js

      case "new_user_registration":
        alert = new AdminAlert({
          type: "user_registration",
          title: "New User Registered",
          message: `${data.userName} (${data.userEmail}) just created an account`,
          severity: "info",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            email: data.userEmail,
            accountId: data.accountId,
          },
        });
        break;

      case "suspicious_registration":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Suspicious Registration",
          message: `Suspicious registration detected for ${data.userEmail} from ${data.ipAddress}`,
          severity: "warning",
          actionRequired: true,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            email: data.userEmail,
            ipAddress: data.ipAddress,
            reason: data.reason,
          },
        });
        break;

      case "multiple_registrations":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Multiple Registrations from Same IP",
          message: `${data.count} registrations from ${data.ipAddress} in ${data.timeframe}`,
          severity: "critical",
          actionRequired: true,
          actionUrl: "/admin/users",
          metadata: {
            count: data.count,
            ipAddress: data.ipAddress,
            timeframe: data.timeframe,
            latestUser: data.latestUser,
          },
        });
        break;

      case "disposable_email":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Disposable Email Detected",
          message: `${data.userEmail} (${data.domain}) used for registration`,
          severity: "warning",
          actionRequired: true,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            email: data.userEmail,
            domain: data.domain,
          },
        });
        break;

      case "registration_failed":
        alert = new AdminAlert({
          type: "system_alert",
          title: "Registration Failed",
          message: `Failed registration attempt for ${data.email}: ${data.error}`,
          severity: "info",
          actionRequired: false,
          actionUrl: "/admin/users",
          metadata: {
            email: data.email,
            ipAddress: data.ipAddress,
            error: data.error,
          },
        });
        break;

      case "kyc_missing_documents":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "KYC Submission Failed - Missing Documents",
          message: `${data.userName} attempted KYC but didn't upload required documents`,
          severity: "warning",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            reason: data.reason,
          },
        });
        break;

      case "kyc_upload_failed":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "KYC Document Upload Failed",
          message: `Failed to upload KYC documents for ${data.userName}: ${data.error}`,
          severity: "warning",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            error: data.error,
          },
        });
        break;

      case "kyc_submitted":
        alert = new AdminAlert({
          type: "kyc_pending",
          title: "New KYC Submission",
          message: `${data.userName} submitted KYC documents for review (${data.documentType})`,
          severity: "info",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            documentType: data.documentType,
            submissionDate: data.submissionDate,
          },
        });
        break;

      case "support_ticket":
        alert = new AdminAlert({
          type: "support_ticket",
          title: `New Support Ticket: ${data.ticketTitle}`,
          message: `Ticket #${data.ticketNumber} from ${data.userName}: ${data.action || "new_ticket"}`,
          severity: data.priority === "Urgent" ? "critical" : "info",
          actionRequired:
            data.priority === "Urgent" || data.action === "ticket_assigned",
          actionUrl: data.actionUrl || `/admin/support/${data.ticketId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            userName: data.userName,
            ticketId: data.ticketId,
            ticketNumber: data.ticketNumber,
            ticketTitle: data.ticketTitle,
            priority: data.priority,
            category: data.category,
            action: data.action || "new_ticket",
          },
        });
        break;

      case "new_location_login":
        alert = new AdminAlert({
          type: "security_alert", 
          title: "🔐 New Location Login",
          message: `${data.userName} logged in from a new location`,
          severity: "warning",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.email,
            userName: data.userName,
            newIp: data.newIp,
            lastIp: data.lastIp,
            userAgent: data.userAgent,
          },
        });
        break;

      case "kyc_high_risk_country":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "⚠️ HIGH RISK COUNTRY DETECTED",
          message: `${data.userName} (${data.userEmail}) submitted KYC from high-risk country: ${data.country}`,
          severity: "critical",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            country: data.country,
          },
        });
        break;

      case "kyc_underage":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "⚠️ UNDERAGE USER DETECTED",
          message: `${data.userName} (${data.userEmail}) submitted KYC but is only ${data.age} years old`,
          severity: "critical",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            age: data.age,
          },
        });
        break;

      case "kyc_elderly":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "Elderly User Verification",
          message: `${data.userName} (${data.userEmail}) is ${data.age} years old - may require additional verification`,
          severity: "info",
          actionRequired: false,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            age: data.age,
          },
        });
        break;

      case "kyc_multiple_attempts":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "Multiple KYC Attempts",
          message: `${data.userName} has submitted KYC ${data.attemptCount} times - possible fraud pattern`,
          severity: "warning",
          actionRequired: true,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            attemptCount: data.attemptCount,
          },
        });
        break;

      case "kyc_name_mismatch":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "⚠️ NAME MISMATCH DETECTED",
          message: `${data.userName} submitted KYC with name "${data.submittedName}" but registered name is "${data.registeredName}"`,
          severity: "critical",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            registeredName: data.registeredName,
            submittedName: data.submittedName,
          },
        });
        break;

      case "kyc_system_error":
        alert = new AdminAlert({
          type: "system_alert",
          title: "KYC System Error",
          message: `KYC submission failed for ${data.userName}: ${data.error}`,
          severity: "critical",
          actionRequired: true,
          actionUrl: data.userId ? `/admin/users/${data.userId}` : "/admin/kyc",
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            error: data.error,
          },
        });
        break;

      case "kyc_approved":
        alert = new AdminAlert({
          type: "kyc_completed",
          title: "KYC Approved",
          message: `${data.userName}'s KYC was approved by ${data.adminName}`,
          severity: "success",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            adminId: data.adminId,
            adminName: data.adminName,
          },
        });
        break;

      case "kyc_rejected":
        alert = new AdminAlert({
          type: "kyc_completed",
          title: "KYC Rejected",
          message: `${data.userName}'s KYC was rejected by ${data.adminName}. Reason: ${data.reason}`,
          severity: "warning",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            adminId: data.adminId,
            adminName: data.adminName,
            reason: data.reason,
          },
        });
        break;

      case "kyc_expired":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "KYC Expired",
          message: `${data.userName}'s KYC verification has expired and needs renewal`,
          severity: "warning",
          actionRequired: true,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            expiredAt: data.expiredAt,
          },
        });
        break;

      case "kyc_suspicious_document":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "⚠️ SUSPICIOUS DOCUMENT DETECTED",
          message: `${data.userName} submitted potentially fraudulent document: ${data.reason}`,
          severity: "critical",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            documentType: data.documentType,
            reason: data.reason,
          },
        });
        break;

      case "kyc_duplicate_document":
        alert = new AdminAlert({
          type: "kyc_issue",
          title: "Duplicate Document Detected",
          message: `${data.userName} submitted a document that matches another user's KYC`,
          severity: "critical",
          actionRequired: true,
          actionUrl: `/admin/kyc/${data.kycId}`,
          metadata: {
            userId: data.userId,
            kycId: data.kycId,
            matchedUserId: data.matchedUserId,
            documentNumber: data.documentNumber,
          },
        });
        break;

      case "password_change_missing_input":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Password Change - Missing Input",
          message: `${data.userName} attempted to change password but didn't provide all required fields`,
          severity: "info",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            reason: data.reason,
            ipAddress: data.ipAddress,
          },
        });
        break;

      case "password_change_weak_password":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Password Change - Weak Password",
          message: `${data.userName} attempted to set a weak password that doesn't meet security requirements`,
          severity: "info",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            ipAddress: data.ipAddress,
          },
        });
        break;

      case "password_change_user_not_found":
        alert = new AdminAlert({
          type: "system_alert",
          title: "Password Change - User Not Found",
          message: `Password change attempted for non-existent user ID: ${data.userId}`,
          severity: "warning",
          actionRequired: true,
          actionUrl: "/admin/users",
          metadata: {
            userId: data.userId,
            ipAddress: data.ipAddress,
          },
        });
        break;

      case "password_change_incorrect_password":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Password Change - Incorrect Password",
          message: `${data.userName} entered incorrect current password while trying to change password`,
          severity: "warning",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
          },
        });
        break;

      case "password_changed":
        alert = new AdminAlert({
          type: "security_alert",
          title: "Password Changed Successfully",
          message: `${data.userName} successfully changed their password`,
          severity: "info",
          actionRequired: false,
          actionUrl: `/admin/users/${data.userId}`,
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            ipAddress: data.ipAddress,
            userAgent: data.userAgent,
          },
        });
        break;

      case "password_change_system_error":
        alert = new AdminAlert({
          type: "system_alert",
          title: "Password Change - System Error",
          message: `Error during password change for ${data.userName}: ${data.error}`,
          severity: "critical",
          actionRequired: true,
          actionUrl: data.userId
            ? `/admin/users/${data.userId}`
            : "/admin/users",
          metadata: {
            userId: data.userId,
            userEmail: data.userEmail,
            error: data.error,
            ipAddress: data.ipAddress,
          },
        });
        break;
    }

    if (alert) {
      await alert.save();
      console.log(`✅ System alert created: ${event}`);
    }

    return alert;
  } catch (error) {
    console.error("Error creating system alert:", error);
    return null;
  }
};

// Mark alert as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user._id;

    const alert = await AdminAlert.findByIdAndUpdate(
      id,
      {
        status: "read",
        readBy: adminId,
        readAt: new Date(),
      },
      { new: true },
    );

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({
      success: true,
      message: "Alert marked as read",
      alert,
    });
  } catch (error) {
    console.error("Error marking alert as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Mark all alerts as read
export const markAllAsRead = async (req, res) => {
  try {
    const adminId = req.user._id;

    const result = await AdminAlert.updateMany(
      { status: "new" },
      {
        status: "read",
        readBy: adminId,
        readAt: new Date(),
      },
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} alerts marked as read`,
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Error marking all alerts as read:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete single alert
export const deleteAlert = async (req, res) => {
  try {
    const { id } = req.params;

    const alert = await AdminAlert.findByIdAndDelete(id);

    if (!alert) {
      return res.status(404).json({ message: "Alert not found" });
    }

    res.json({
      success: true,
      message: "Alert deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting alert:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Clear all alerts
export const clearAllAlerts = async (req, res) => {
  try {
    const result = await AdminAlert.deleteMany({});

    res.json({
      success: true,
      message: `${result.deletedCount} alerts cleared`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Error clearing alerts:", error);
    res.status(500).json({ message: "Server error" });
  }
};
