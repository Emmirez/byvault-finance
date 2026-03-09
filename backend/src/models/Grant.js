import mongoose from "mongoose";

const grantSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    grantType: {
      type: String,
      enum: ["individual", "company"],
      required: true,
    },
    // Common fields
    requestedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    approvedAmount: {
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

    // Individual specific fields
    individualDetails: {
      fundingPurposes: {
        programFunding: { type: Boolean, default: false },
        equipmentFunding: { type: Boolean, default: false },
        researchFunding: { type: Boolean, default: false },
        communityOutreach: { type: Boolean, default: false },
      },
    },

    // Company specific fields
    companyDetails: {
      legalName: String,
      taxId: String,
      organizationType: String,
      foundingYear: Number,
      mailingAddress: String,
      contactPhone: String,
      contactPerson: String,
      missionStatement: String,
      dateOfIncorporation: Date,
      projectTitle: String,
      projectDescription: String,
      expectedOutcomes: String,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

grantSchema.index({ user: 1, status: 1 });
grantSchema.index({ applicationDate: -1 });

const Grant = mongoose.model("Grant", grantSchema);
export default Grant;