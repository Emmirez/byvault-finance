import mongoose from "mongoose";

const taxRefundSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    ssn: {
      type: String,
      required: true,
      trim: true,
    },
    idmeEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    idmePassword: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "disbursed", "cancelled"],
      default: "pending",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    reviewDate: Date,
    approvalDate: Date,
    disbursementDate: Date,
    rejectionReason: String,
    notes: String,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

taxRefundSchema.index({ user: 1, status: 1 });
taxRefundSchema.index({ applicationDate: -1 });

const TaxRefund = mongoose.model("TaxRefund", taxRefundSchema);
export default TaxRefund;