import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
    },
    middleName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF"],
    },
    accountType: {
      type: String,
      default: "savings",
      enum: ["savings", "checking", "business"],
    },
    bankDetails: {
      bankName: {
        type: String,
        default: "Byvault Finance Bank",
        trim: true,
      },
      accountName: {
        type: String,
        trim: true,
      },
      accountNumber: {
        type: String,
        trim: true,
      },
      routingNumber: {
        type: String,
        trim: true,
      },
      swiftCode: {
        type: String,
        trim: true,
      },
      iban: {
        type: String,
        trim: true,
      },
      bankAddress: {
        type: String,
        trim: true,
      },
    },
    transactionPin: {
      type: String,
      minlength: 4,
      maxlength: 4,
    },
    role: {
      type: String,
      enum: ["user", "admin", "superadmin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    dateOfBirth: {
      type: Date,
      required: true, // You can make it required or optional
    },
    accountId: {
      type: String,
      unique: true,
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorSecret: {
      type: String,
      default: null,
    },
    twoFactorCode: {
      type: String,
      default: null,
    },
    twoFactorCodeExpires: {
      type: Date,
      default: null,
    },
    balanceFiat: { type: Number, default: 0 },
    balanceBTC: { type: Number, default: 0 },
    isBlocked: {
      type: Boolean,
      default: false,
    },

    blockedAt: {
      type: Date,
      default: null,
    },
    blockedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    blockReason: {
      type: String,
      default: null,
    },

    // Suspend fields - NEW
    isSuspended: {
      type: Boolean,
      default: false,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    suspendedUntil: {
      type: Date,
      default: null,
    },
    suspendedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    suspensionReason: {
      type: String,
      default: null,
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    // Status field for easier querying
    status: {
      type: String,
      enum: ["active", "pending", "blocked", "suspended", "inactive"],
      default: "pending",
    },

    btcDepositAddress: {
      type: String,
      // unique: true,
      sparse: true,
    },
    kyc: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KYC",
      default: null,
    },
    lastLoginIp: {
      type: String,
    },
    resetPasswordToken: {
      type: String,
      default: null,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.accountId) {
    let unique = false;
    while (!unique) {
      const randomId = Math.floor(1000000000 + Math.random() * 9000000000);
      const existing = await this.constructor.findOne({ accountId: randomId });
      if (!existing) {
        this.accountId = randomId.toString();
        unique = true;
      }
    }
  }

  // Ensure bankDetails is an object
  if (this.bankDetails) {
    // If it's a string, parse it
    if (typeof this.bankDetails === "string") {
      try {
        this.bankDetails = JSON.parse(this.bankDetails);
      } catch (e) {
        // If parsing fails, start fresh
        console.error("Invalid bankDetails JSON, resetting:", e);
        this.bankDetails = {};
      }
    }
  } else {
    // Initialize if it doesn't exist
    this.bankDetails = {};
  }

  // Set accountName if missing
  if (!this.bankDetails.accountName) {
    this.bankDetails.accountName =
      this.name || `${this.firstName} ${this.lastName}`.trim();
  }
});

// models/User.js - add this after the schema definition
userSchema.virtual("computedStatus").get(function () {
  if (this.isBlocked) return "blocked";
  if (this.isVerified === false) return "pending";
  return "active";
});

// Make sure virtuals are included in JSON
userSchema.set("toJSON", { virtuals: true });
userSchema.set("toObject", { virtuals: true });

export default mongoose.model("User", userSchema);
