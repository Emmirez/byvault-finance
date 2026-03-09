import mongoose from "mongoose";

const cardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cardType: {
      type: String,
      enum: ["visa", "mastercard", "amex", "discover"],
      required: true,
    },
    cardBrand: {
      type: String,
      enum: ["virtual", "physical"],
      default: "virtual",
    },
    cardNumber: {
      type: String,
      required: true,
      unique: true,
    },
    maskedNumber: {
      type: String,
      required: true,
    },
    cardholderName: {
      type: String,
      required: true,
    },
    expiryMonth: {
      type: String,
      required: true,
    },
    expiryYear: {
      type: String,
      required: true,
    },
    cvv: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "rejected", "blocked", "expired"],
      default: "pending",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    activatedAt: Date,
    expiresAt: Date,
    dailyLimit: {
      type: Number,
      default: 1000,
    },
    monthlyLimit: {
      type: Number,
      default: 10000,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

// Generate card number helper
cardSchema.statics.generateCardNumber = function (cardType) {
  const prefixes = {
    visa: "4",
    mastercard: "5",
    amex: "3",
    discover: "6",
  };

  const prefix = prefixes[cardType] || "4";
  let cardNumber = prefix;

  // Generate 15 more digits (16 total)
  for (let i = 0; i < 15; i++) {
    cardNumber += Math.floor(Math.random() * 10);
  }

  return cardNumber;
};

// Mask card number helper
cardSchema.statics.maskCardNumber = function (cardNumber) {
  return "**** **** **** " + cardNumber.slice(-4);
};

// Generate expiry date (3 years from now)
cardSchema.statics.generateExpiry = function () {
  const date = new Date();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear() + 3).slice(-2);
  return { month, year };
};

// Generate CVV
cardSchema.statics.generateCVV = function () {
  return String(Math.floor(100 + Math.random() * 900)); // 3-digit
};

const Card = mongoose.model("Card", cardSchema);
export default Card;
