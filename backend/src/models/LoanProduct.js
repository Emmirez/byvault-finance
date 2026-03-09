import mongoose from "mongoose";

const loanProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["personal", "home", "auto", "business", "health", "education", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    interestRate: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    minAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    maxAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    minTerm: {
      type: Number, // in months
      required: true,
      min: 1,
    },
    maxTerm: {
      type: Number, // in months
      required: true,
      min: 1,
    },
    requirements: [{
      type: String,
    }],
    features: [{
      type: String,
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const LoanProduct = mongoose.model("LoanProduct", loanProductSchema);
export default LoanProduct;