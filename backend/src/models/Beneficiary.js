// src/models/Beneficiary.js
import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      default: "local", // local, wire, swift, paypal, cashapp, zelle, crypto, etc.
    },
    // Core identity fields
    name: { type: String, required: true },
    accountNumber: { type: String, default: "" },
    bankName: { type: String, default: "" },
    routingNumber: { type: String, default: "" },
    swiftCode: { type: String, default: "" },
    address: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    cashtag: { type: String, default: "" },
    walletAddress: { type: String, default: "" },
    // Store any extra fields as raw JSON
    raw: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// One user can't save the same account+bank twice
beneficiarySchema.index(
  { user: 1, accountNumber: 1, bankName: 1 },
  { unique: false }
);

const Beneficiary = mongoose.model("Beneficiary", beneficiarySchema);
export default Beneficiary;