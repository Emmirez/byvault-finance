// models/DepositRequest.js
import mongoose from "mongoose";

const depositRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      required: true,
      enum: [
        "bank-transfer", 
        "credit-card", 
        "usdt", 
        "paypal", 
        "bitcoin",
        "Bank Transfer",
        "Credit Card",
        "USDT",
        "PayPal",
        "Bitcoin"
      ],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "cancelled"],
      default: "pending",
    },
    receiptUrl: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    notes: {
      type: String,
      default: "",
    },
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    processedAt: {
      type: Date,
    },
    metadata: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { 
    timestamps: true,
    // Add this to see detailed errors
    strict: true 
  }
);


depositRequestSchema.pre("save", function () {
  // Only generate transactionId if it doesn't exist
  if (!this.transactionId) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.transactionId = `DEP${timestamp}${random}`;
    console.log(`✅ Generated transaction ID: ${this.transactionId}`);
  }
});


depositRequestSchema.post("save", function (doc) {
  console.log(`📝 Deposit request saved: ${doc._id} - Status: ${doc.status}`);
});


const DepositRequest = mongoose.model("DepositRequest", depositRequestSchema);
export default DepositRequest;