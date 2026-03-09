import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: [
        "deposit",
        "withdraw",
        "transfer",
        "loan_application",
        "loan_disbursement",
        "tax_refund",
        "grant_application",
        "swap",
      ],
      required: true,
    },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "completed",
    },
    description: { type: String },
    currency: {
      type: String,
      enum: ["fiat", "btc", "usdt"],
      required: true,
    },

    balanceBefore: { type: Number, required: true },
    balanceAfter: { type: Number, required: true },
  
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {
        walletAddress: String,
        paymentProof: String, // URL to uploaded image
        paymentProofId: String, // Cloudinary/Firebase file ID
        txId: String,
        confirmations: { type: Number, default: 0 },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        reviewedAt: Date,
        rejectionReason: String,
      },
    },
  },
  { timestamps: true },
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
