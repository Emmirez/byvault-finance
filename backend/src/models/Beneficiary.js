// models/Beneficiary.js
import mongoose from "mongoose";

const beneficiarySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  accountNumber: { type: String, required: true },
  bankName: { type: String }, // optional
  email: { type: String }, // optional
  address: { type: String }, // optional
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Beneficiary", beneficiarySchema);
