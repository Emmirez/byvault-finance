import mongoose from "mongoose";
import User from "./User.js";

const adminAlertSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: [
        "deposit_request",
        "withdrawal_request",
        "kyc_pending",
        "large_transaction",
        "user_blocked",
        "security_alert",
        "system_alert",
        "support_ticket",
        "user_registration",
        "suspicious_registration",
        "multiple_registrations",
        "disposable_email",
        "registration_failed",
        "large_deposit",
        "rapid_deposits",
        "first_deposit",
        "unusual_deposit_pattern",
        "deposit_failed",
        "large_transfer",
        "new_recipient_transfer",
        "rapid_transfers",
        "transfer_error",
        "failed_transfer",
        "limit_exceeded",
        "single_limit_exceeded",
        "card_application",
        "kyc_submitted",
        "kyc_high_risk_country",
        "kyc_underage",
        "kyc_elderly",
        "kyc_multiple_attempts",
        "kyc_name_mismatch",
        "kyc_upload_failed",
        "kyc_missing_documents",
        "kyc_system_error",
        "kyc_approved",
        "kyc_rejected",
        "kyc_expired",
        "kyc_suspicious_document",
        "kyc_duplicate_document",
        "password_reset_requested",
        "password_reset_attempt_no_user",
        "password_reset_email_failed",
        "password_reset_email_error",
        "password_reset_invalid_token",
        "password_reset_completed",
        "password_reset_system_error",
        "system_performance",
        "ticket_created", 
        "ticket_replied", 
        "ticket_closed", 
        "ticket_assigned", 
        "ticket_deleted",
        "urgent_ticket",
        "new_recipient_transfer"
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
    severity: {
      type: String,
      enum: ["info", "warning", "critical", "success"],
      default: "info",
    },
    status: {
      type: String,
      enum: ["new", "acknowledged", "resolved"],
      default: "new",
    },
    actionRequired: {
      type: Boolean,
      default: false,
    },
    actionUrl: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    acknowledgedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    resolvedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

// Indexes for better query performance
adminAlertSchema.index({ status: 1, createdAt: -1 });
adminAlertSchema.index({ type: 1, status: 1 });
adminAlertSchema.index({ severity: 1 });

const AdminAlert = mongoose.model("AdminAlert", adminAlertSchema);
export default AdminAlert;
