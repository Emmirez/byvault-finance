import mongoose from "mongoose";

const loanSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    loanType: {
      type: String,
      enum: ["personal", "home", "auto", "business", "health", "education", "other"],
      required: true,
    },
    loanProduct: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 100,
    },
    term: {
      type: Number, // in months
      required: true,
      min: 1,
      max: 360,
    },
    interestRate: {
      type: Number,
      required: true,
    },
    monthlyPayment: {
      type: Number,
      required: true,
    },
    totalRepayment: {
      type: Number,
      required: true,
    },
    purpose: {
      type: String,
      required: true,
      trim: true,
    },
    employmentStatus: {
      type: String,
      enum: ["employed", "self-employed", "unemployed", "retired", "student"],
      default: "employed",
    },
    annualIncome: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "approved", "rejected", "disbursed", "completed", "cancelled"],
      default: "pending",
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    reviewDate: Date,
    approvalDate: Date,
    disbursementDate: Date,
    completionDate: Date,
    rejectionReason: String,
    cancellationReason: String,
    notes: String,
  },
  { timestamps: true }
);

// Index for faster queries
loanSchema.index({ user: 1, status: 1 });
loanSchema.index({ applicationDate: -1 });

const Loan = mongoose.model("Loan", loanSchema);
export default Loan;