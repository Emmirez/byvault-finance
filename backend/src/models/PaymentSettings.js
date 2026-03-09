import mongoose from "mongoose";

const paymentSettingsSchema = new mongoose.Schema({
  bankTransfer: {
    bankName: { type: String, default: "JPMorgan Chase Bank" },
    accountName: { type: String, default: "John A. Smith" },
    accountNumber: { type: String, default: "123456789" },
    routingNumber: { type: String, default: "021000021" },
    swiftCode: { type: String, default: "CHASUS33" },
    bankAddress: { type: String, default: "270 Park Avenue, New York, NY 10017, United States" },
  },
  paypal: {
    accountName: { type: String, default: "Jane Eric" },
    email: { type: String, default: "janeeric@gmail.com" },
  },
  usdt: {
    address: { type: String, default: "TRX7xPdK3jLUf8pMkVj3z9BwNhYzXqC2aE" },
    networkType: { type: String, default: "TRC20" },
  },
  creditCard: {
    cardholderName: { type: String, default: "Jane Eric" },
    cardNumber: { type: String, default: "**** **** **** 4242" },
    expiryDate: { type: String, default: "08/27" },
    cardType: { type: String, default: "Visa" },
  },
  crypto: {
    address: { type: String, default: "bc1q8kdnq4a5jr8ply8w0qvm0359m255jkw4cqca3t" },
    networkType: { type: String, default: "Bitcoin" },
  },
}, { timestamps: true });

const PaymentSettings = mongoose.model("PaymentSettings", paymentSettingsSchema);
export default PaymentSettings;