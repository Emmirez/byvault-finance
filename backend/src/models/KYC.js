import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "verified", "rejected"],
      default: "pending",
    },
    documents: [
      {
        type: {
          type: String,
          enum: ["passport", "drivers_license", "national_id", "utility_bill", "bank_statement"],
          required: true,
        },
        documentNumber: String,
        frontImage: {
          url: String,
          publicId: String,
        },
        backImage: {
          url: String,
          publicId: String,
        },
        selfieImage: {
          url: String,
          publicId: String,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verifiedAt: Date,
      },
    ],
    personalInfo: {
      fullName: {
        type: String,
        required: true,
      },
      dateOfBirth: {
        type: Date,
        required: true,
      },
      nationality: String,
      gender: {
        type: String,
        enum: ["male", "female", "other", "prefer_not_to_say"],
      },
    },
    addressInfo: {
      streetAddress: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
      proofOfAddress: {
        url: String,
        publicId: String,
        documentType: String,
      },
    },
    employmentInfo: {
      employmentStatus: {
        type: String,
        enum: ["employed", "self-employed", "unemployed", "retired", "student"],
      },
      occupation: String,
      employerName: String,
      annualIncome: Number,
      sourceOfFunds: String,
    },
    verificationHistory: [
      {
        status: {
          type: String,
          enum: ["pending", "under_review", "verified", "rejected"],
        },
        comment: String,
        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        reviewedAt: Date,
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: String,
    notes: String,
    expiresAt: Date,
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Add indexes for faster queries

kycSchema.index({ status: 1 });
kycSchema.index({ submittedAt: -1 });

const KYC = mongoose.model("KYC", kycSchema);
export default KYC;