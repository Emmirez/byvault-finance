import DepositRequest from "../models/DepositRequest.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import AccountLimit from "../models/AccountLimit.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get payment methods configuration
export const getPaymentMethods = async (req, res) => {
  try {
    // This could come from a config file or database
    const methods = [
      {
        id: "bank-transfer",
        name: "Bank Transfer",
        description: "Direct bank account transfer",
        icon: "Building2",
        color: "blue",
        fee: "0% fee",
        time: "1-3 business days",
        available: true,
        details: {
          bankName: "Mining Bank",
          accountName: "Miller lauren",
          accountNumber: "99388383",
          swiftCode: "3222ASD",
        },
      },
      {
        id: "credit-card",
        name: "Credit Card",
        description: "Instant deposit via Visa, Mastercard",
        icon: "CreditCard",
        color: "purple",
        fee: "2.5% fee",
        time: "Instant",
        available: true,
      },
      {
        id: "usdt",
        name: "USDT",
        description: "Tether cryptocurrency deposit",
        icon: "DollarSign",
        color: "green",
        fee: "0% fee",
        time: "5-10 mins",
        available: true,
        details: {
          address: "TRX7xPdK3jLUf8pMkVj3z9BwNhYzXqC2aE",
          networkType: "TRC20",
        },
      },
      {
        id: "paypal",
        name: "PayPal",
        description: "Fast and secure PayPal transfer",
        icon: "Banknote",
        color: "blue",
        fee: "3% fee",
        time: "Instant",
        available: true,
        details: {
          accountName: "Jane Eric",
          email: "janeeric@gmail.com",
        },
      },
      {
        id: "bitcoin",
        name: "Bitcoin",
        description: "BTC cryptocurrency deposit",
        icon: "Bitcoin",
        color: "orange",
        fee: "Network fee applies",
        time: "30-60 mins",
        available: true,
        details: {
          address: "bc1q8kdnq4a5jr8ply8w0qvm0359m255jkw4cqca3t",
          networkType: "Bitcoin",
        },
      },
    ];

    res.json({ methods });
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get payment method details
export const getPaymentMethodDetails = async (req, res) => {
  try {
    const { methodId } = req.params;

    const methods = {
      "bank-transfer": {
        bankName: "Mining Bank",
        accountName: "Miller lauren",
        accountNumber: "99388383",
        swiftCode: "3222ASD",
      },
      paypal: {
        accountName: "Jane Eric",
        email: "janeeric@gmail.com",
      },
      usdt: {
        address: "TRX7xPdK3jLUf8pMkVj3z9BwNhYzXqC2aE",
        networkType: "TRC20",
      },
      bitcoin: {
        address: "bc1q8kdnq4a5jr8ply8w0qvm0359m255jkw4cqca3t",
        networkType: "Bitcoin",
      },
      "credit-card": {
        cardholderName: "Jane Eric",
        cardNumber: "**** **** **** 4242",
        expiryDate: "08/27",
        cardType: "Visa",
      },
    };

    if (!methods[methodId]) {
      return res.status(404).json({ message: "Payment method not found" });
    }

    res.json({ details: methods[methodId] });
  } catch (error) {
    console.error("Error fetching payment method details:", error);
    res.status(500).json({ message: "Server error" });
  }
};



// controllers/depositController.js
export const submitDeposit = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("📥 DEPOSIT SUBMISSION STARTED");
    console.log("=".repeat(50));
    
    // Log everything we received
    console.log("1. User ID:", req.user?.id);
    console.log("2. Request body:", req.body);
    console.log("3. Request file:", req.file);
    console.log("4. Headers:", req.headers['content-type']);

    const { amount, method } = req.body;
    const userId = req.user.id;

    // Validation
    if (!amount) {
      console.log("❌ Amount is missing");
      return res.status(400).json({ message: "Amount is required" });
    }

    if (!method) {
      console.log("❌ Method is missing");
      return res.status(400).json({ message: "Payment method is required" });
    }

    if (!req.file) {
      console.log("❌ File is missing");
      return res.status(400).json({ message: "Receipt is required" });
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      console.log("❌ Invalid amount:", amount);
      return res.status(400).json({ message: "Invalid amount" });
    }

    console.log("✅ Validation passed");
    console.log("Processing:", { 
      userId, 
      amount: numericAmount, 
      method, 
      filename: req.file.filename 
    });

    // Create receipt URL
    const receiptUrl = `/uploads/receipts/${req.file.filename}`;

    // Create deposit request
    console.log("5. Creating deposit request...");
    let depositRequest;
    try {
      depositRequest = new DepositRequest({
        user: userId,
        amount: numericAmount,
        method,
        receiptUrl,
        status: "pending",
      });
      
      console.log("6. Saving deposit request...");
      await depositRequest.save();
      console.log("✅ Deposit request saved with ID:", depositRequest._id);
      console.log("   Transaction ID:", depositRequest.transactionId);
    } catch (dbError) {
      console.error("❌ Database error creating deposit:", dbError);
      console.error("Error name:", dbError.name);
      console.error("Error message:", dbError.message);
      if (dbError.errors) {
        console.error("Validation errors:", dbError.errors);
      }
      throw new Error(`Database error: ${dbError.message}`);
    }

    // Create transaction
    console.log("7. Creating transaction record...");
    try {
      const transaction = new Transaction({
        user: userId,
        type: "deposit",
        currency: "fiat",
        amount: numericAmount,
        status: "pending",
        description: `Deposit via ${method} - Pending verification`,
        balanceBefore: 0,
        balanceAfter: 0,
        metadata: {
          depositRequestId: depositRequest._id,
          transactionId: depositRequest.transactionId,
        },
      });
      
      console.log("8. Saving transaction...");
      await transaction.save();
      console.log("✅ Transaction saved with ID:", transaction._id);
    } catch (txError) {
      console.error("❌ Database error creating transaction:", txError);
      console.error("Error name:", txError.name);
      console.error("Error message:", txError.message);
      throw new Error(`Transaction error: ${txError.message}`);
    }

    // Success response
    const responseData = {
      success: true,
      message: "Deposit request submitted successfully",
      depositRequest: {
        id: depositRequest._id,
        transactionId: depositRequest.transactionId,
        amount: depositRequest.amount,
        method: depositRequest.method,
        status: depositRequest.status,
        createdAt: depositRequest.createdAt,
      }
    };

    console.log("9. Sending success response");
    console.log("📤 Response:", responseData);
    res.status(201).json(responseData);

  } catch (error) {
    console.error("❌ ERROR in submitDeposit:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Stack trace:", error.stack);

    // If file was uploaded but request failed, delete it
    if (req.file) {
      const filePath = path.join(__dirname, "../uploads/receipts", req.file.filename);
      try {
        fs.unlinkSync(filePath);
        console.log("🧹 Cleaned up file:", req.file.filename);
      } catch (unlinkError) {
        console.error("Error deleting file:", unlinkError);
      }
    }

    // Send detailed error in development
    res.status(500).json({ 
      success: false,
      message: "Server error", 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};


// Get user's deposit history
export const getDepositHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const deposits = await DepositRequest.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DepositRequest.countDocuments({ user: userId });

    res.json({
      deposits,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching deposit history:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single deposit request
export const getDepositRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deposit = await DepositRequest.findOne({
      _id: id,
      user: userId,
    });

    if (!deposit) {
      return res.status(404).json({ message: "Deposit request not found" });
    }

    res.json({ deposit });
  } catch (error) {
    console.error("Error fetching deposit request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Cancel deposit request (user can cancel only pending requests)
export const cancelDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const deposit = await DepositRequest.findOne({
      _id: id,
      user: userId,
      status: "pending",
    });

    if (!deposit) {
      return res
        .status(404)
        .json({ message: "Pending deposit request not found" });
    }

    deposit.status = "cancelled";
    await deposit.save();

    // Update related transaction
    await Transaction.findOneAndUpdate(
      { "metadata.depositRequestId": deposit._id },
      { status: "cancelled" },
    );

    res.json({
      success: true,
      message: "Deposit request cancelled",
    });
  } catch (error) {
    console.error("Error cancelling deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};
