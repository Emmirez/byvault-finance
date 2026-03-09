// src/models/ActivityLog.js
import mongoose from "mongoose";

const activityLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "login",
        "logout",
        "login_failed",
        "registration",
        "email",
        "profile_update",
        "password_change",
        "password_reset_request",
        "password_reset_email_sent",
        "password_reset_completed",
        "two_factor_enabled",
        "two_factor_disabled",
        "deposit",
        "withdraw",
        "transfer",
        "payment",
        "kyc_submit",
        "kyc_approve",
        "kyc_reject",
        "card_apply",
        "card_approve",
        "card_reject",
        "card_block",
        "card_unblock",
        "admin_block",
        "admin_unblock",
        "admin_suspend",
        "admin_unsuspend",
        "admin_role_change",
        "admin_balance_update",
        "admin_transaction_update",
        "admin_deposit_update",
        "admin_withdrawal_update",
        "support_ticket",
      ],
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "success",
        "failed",
        "pending",
        "completed",
        "rejected",
        "approved",
      ],
      default: "success",
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: String,
    userAgent: String,
    device: String,
    browser: String,
    os: String,
    amount: Number,
    currency: { type: String, default: "USD" },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

// Indexes for faster queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 });

const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);
export default ActivityLog;
