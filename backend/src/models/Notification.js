import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: [
        // Account & Security
        "login_success",
        "login_new_device",
        "password_changed",
        "profile_updated",
        "two_factor_enabled",
        "two_factor_disabled",
        "account_locked",

        // Transactions
        "transfer_sent",
        "transfer_received",
        "transfer_failed",
        "transfer_on_hold",
        "large_transaction",
        "limit_approaching",
        "transaction_status_updated",
        "deposit_completed",
        "deposit_pending",
        "deposit_failed",
        "deposit_approved",
        "deposit_rejected",
        "withdraw_completed",
        "withdraw_pending",
        "withdraw_failed",
        "transaction_status_updated",
        "admin_transaction_update",
        "payment_completed",
        "payment_failed",

        // Cards
        "card_application_submitted",
        "card_approved",
        "card_dispatched",
        "card_activated",
        "card_blocked",
        "card_unblocked",
        "card_expiring_soon",
        "card_suspicious_activity",

        // Loans
        "loan_application_submitted",
        "loan_under_review",
        "loan_approved",
        "loan_rejected",
        "loan_disbursed",
        "loan_payment_due",
        "loan_payment_received",
        "loan_payment_late",

        // Grants
        "grant_application_submitted",
        "grant_under_review",
        "grant_approved",
        "grant_rejected",
        "grant_disbursed",

        // Tax Refunds
        "tax_refund_submitted",
        "tax_refund_under_review",
        "tax_refund_approved",
        "tax_refund_rejected",
        "tax_refund_disbursed",

        // Support
        "ticket_submitted",
        "ticket_admin_reply",
        "ticket_status_changed",
        "ticket_resolved",
        "ticket_created",
        "new_ticket", // for admins
        "ticket_replied",
        "ticket_status_changed",
        "ticket_assigned",
        "ticket_closed",
        "ticket_deleted",
        "admin_replied",
        "urgent_support_ticket",

        // KYC
        "kyc_documents_uploaded",
        "kyc_under_review",
        "kyc_verified",
        "kyc_rejected",

        // Limits
        "daily_limit_updated",
        "monthly_limit_approaching",

        // System
        "new_feature",
        "maintenance_scheduled",
        "security_alert",
        "promotional_offer",
        "statement_available",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: Date,
    actionUrl: String,
    actionText: String,
    image: String,
    expiresAt: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

// Indexes for faster queries
notificationSchema.index({ user: 1, createdAt: -1 });
notificationSchema.index({ user: 1, read: 1 });
notificationSchema.index({ priority: 1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
