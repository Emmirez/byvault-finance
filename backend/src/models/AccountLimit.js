import mongoose from "mongoose";

const accountLimitSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true,
      unique: true 
    },
    dailyLimit: {
      type: Number,
      default: 500000,
    },
    weeklyLimit: {
      type: Number,
      default: 1000000,
    },
    monthlyLimit: {
      type: Number,
      default: 5000000,
    },
    singleTransactionLimit: {
      type: Number,
      default: 100000,
    },
    remainingDaily: {
      type: Number,
      default: 500000,
    },
    remainingWeekly: {
      type: Number,
      default: 1000000,
    },
    remainingMonthly: {
      type: Number,
      default: 5000000,
    },
    lastReset: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const AccountLimit = mongoose.model("AccountLimit", accountLimitSchema);
export default AccountLimit;