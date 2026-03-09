// src/models/Setting.js
import mongoose from "mongoose";

const settingSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    type: {
      type: String,
      enum: ["string", "number", "boolean", "array", "object"],
      default: "string",
    },
    group: {
      type: String,
      enum: [
        "general",
        "security",
        "notifications",
        "limits",
        "fees",
        "kyc",
        "email",
        "maintenance",
      ],
      default: "general",
    },
    description: {
      type: String,
      trim: true,
    },
    isPublic: {
      type: Boolean,
      default: false, // Whether this setting is exposed to users
    },
    options: [String], // For select inputs
    validation: {
      min: Number,
      max: Number,
      pattern: String,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Setting = mongoose.model("Setting", settingSchema);
export default Setting;