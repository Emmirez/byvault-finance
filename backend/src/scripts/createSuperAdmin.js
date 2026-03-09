import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

const createSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existing = await User.findOne({ email: "superadmin@byvault.com" });
    if (existing) {
      console.log("Super admin already exists");
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      process.env.SUPERADMIN_PASSWORD,
      10,
    );

    // Create super admin
    const superAdmin = await User.create({
      name: process.env.SUPERADMIN_NAME,
      email: process.env.SUPERADMIN_EMAIL,
      password: hashedPassword,
      role: "superadmin",
    });

    console.log("Super admin created:", superAdmin);
    process.exit(0);
  } catch (err) {
    console.error("Error creating super admin:", err);
    process.exit(1);
  }
};

createSuperAdmin();
