// src/models/Document.js
import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    documentType: {
      type: String,
      enum: [
        "profile_image",
        "passport",
        "drivers_license",
        "national_id",
        "utility_bill",
        "bank_statement",
        "contract",
        "tax_document",
        "proof_of_address",
        "proof_of_income",
        "other"
      ],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    publicId: {
      type: String, // For Cloudinary
    },
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    verifiedAt: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    rejectionReason: String,
    expiresAt: Date,
    description: String,
    tags: [String],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
documentSchema.index({ status: 1 });
documentSchema.index({ documentType: 1 });
documentSchema.index({ createdAt: -1 });

const Document = mongoose.model("Document", documentSchema);
export default Document;