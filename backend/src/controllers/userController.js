import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import AccountLimit from "../models/AccountLimit.js";
import bcrypt from "bcrypt";
import { createNotification } from "./notificationsController.js";
import { createSystemAlert } from "./adminAlertController.js";
import KYC from "../models/KYC.js";

export const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -transactionPin",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get or create account limits
    let accountLimits = await AccountLimit.findOne({ user: user._id });
    if (!accountLimits) {
      accountLimits = await AccountLimit.create({
        user: user._id,
        dailyLimit: 500000,
        weeklyLimit: 1000000,
        monthlyLimit: 5000000,
        singleTransactionLimit: 100000,
        remainingDaily: 500000,
        remainingWeekly: 1000000,
        remainingMonthly: 5000000,
      });
    } else {
      // Check and reset limits if needed
      const now = new Date();
      const lastReset = accountLimits.lastReset || now;

      // Reset daily limit
      if (
        now.getDate() !== lastReset.getDate() ||
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
      ) {
        accountLimits.remainingDaily = accountLimits.dailyLimit;
      }

      // Reset weekly limit
      const oneWeek = 7 * 24 * 60 * 60 * 1000;
      if (now - lastReset > oneWeek) {
        accountLimits.remainingWeekly = accountLimits.weeklyLimit;
      }

      // Reset monthly limit
      if (
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear()
      ) {
        accountLimits.remainingMonthly = accountLimits.monthlyLimit;
      }

      accountLimits.lastReset = now;
      await accountLimits.save();
    }

    // Get user's transactions for the current month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const transactions = await Transaction.find({
      user: user._id,
      createdAt: { $gte: startOfMonth },
    });

    // Calculate monthly stats
    const monthlyDeposits = transactions
      .filter((t) => t.type === "deposit" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpenses = transactions
      .filter(
        (t) =>
          (t.type === "withdraw" || t.type === "transfer") &&
          t.status === "completed",
      )
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const totalVolume = monthlyDeposits + monthlyExpenses;
    const pendingTransactions = transactions.filter(
      (t) => t.status === "pending",
    ).length;

    // Format account number for display
    const formatAccountNumber = (accountId) => {
      if (!accountId) return "**** ****";
      const str = accountId.toString();
      return `**** ${str.slice(-4)}`;
    };

    // Format account type for display
    const formatAccountType = (type) => {
      const types = {
        savings: "Savings Account",
        checking: "Checking Account",
        business: "Business Account",
      };
      return types[type] || "Savings Account";
    };

    // Determine the correct account status
    let accountStatus = "active";
    let accountStatusDisplay = "Active";

    if (user.isBlocked) {
      accountStatus = "blocked";
      accountStatusDisplay = "Blocked";
    } else if (user.isSuspended) {
      accountStatus = "suspended";
      accountStatusDisplay = "Suspended";
    } else if (user.status === "pending" || !user.isVerified) {
      accountStatus = "pending";
      accountStatusDisplay = "Pending";
    }

    // Format status for display (capitalized properly)
    const formatStatus = (status) => {
      return status.charAt(0).toUpperCase() + status.slice(1);
    };

    res.json({
      // User info
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,

      // Account info
      accountId: user.accountId,
      accountNumber: formatAccountNumber(user.accountId),
      accountType: user.accountType || "savings",
      accountTypeDisplay: formatAccountType(user.accountType || "savings"),
      accountStatus: accountStatusDisplay, 
      status: accountStatus, 
      isVerified: user.isVerified,

      // Balances
      fiatBalance: user.balanceFiat || 0,
      btcBalance: user.balanceBTC || 0,

      // Account Limits
      accountLimits: {
        dailyLimit: accountLimits.dailyLimit,
        weeklyLimit: accountLimits.weeklyLimit,
        monthlyLimit: accountLimits.monthlyLimit,
        singleTransactionLimit: accountLimits.singleTransactionLimit,
        remainingDaily: accountLimits.remainingDaily,
        remainingWeekly: accountLimits.remainingWeekly,
        remainingMonthly: accountLimits.remainingMonthly,
        dailyUsed: accountLimits.dailyLimit - accountLimits.remainingDaily,
        weeklyUsed: accountLimits.weeklyLimit - accountLimits.remainingWeekly,
        monthlyUsed:
          accountLimits.monthlyLimit - accountLimits.remainingMonthly,
        dailyPercentage: (
          ((accountLimits.dailyLimit - accountLimits.remainingDaily) /
            accountLimits.dailyLimit) *
          100
        ).toFixed(1),
        weeklyPercentage: (
          ((accountLimits.weeklyLimit - accountLimits.remainingWeekly) /
            accountLimits.weeklyLimit) *
          100
        ).toFixed(1),
        monthlyPercentage: (
          ((accountLimits.monthlyLimit - accountLimits.remainingMonthly) /
            accountLimits.monthlyLimit) *
          100
        ).toFixed(1),
      },

      // Monthly stats
      monthlyDeposits: monthlyDeposits || 0,
      monthlyExpenses: monthlyExpenses || 0,
      totalVolume: totalVolume || 0,
      pendingTransactions: pendingTransactions || 0,

      // Additional
      currency: user.currency || "USD",
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select(
      "-password -transactionPin",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const kyc = await KYC.findOne({ user: user._id }).select("status").lean();

    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      phone: user.phone,
      username: user.username,
      address: user.address,
      dateOfBirth: user.dateOfBirth,
      accountId: user.accountId,
      accountNumber: user.accountId
        ? `**** ${user.accountId.toString().slice(-4)}`
        : "**** ****",
      accountType: user.accountType,
      balanceFiat: user.balanceFiat || 0,
      balanceBTC: user.balanceBTC || 0,
      currency: user.currency || "USD",
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked, 
      isSuspended: user.isSuspended, 
      kycStatus: kyc?.status || null,
      status: user.isBlocked ? "blocked" 
      : user.isSuspended ? "suspended"
      : user.isVerified ? "active" 
      : "pending",
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, address } = req.body;

    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    // Update name field too
    user.name = `${user.firstName} ${user.lastName}`.trim();

    await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Change transaction PIN
export const changeTransactionPin = async (req, res) => {
  try {
    const { newPin, currentPassword } = req.body;

    console.log("Change transaction PIN request for user:", req.user._id);

    // Validate input
    if (!newPin || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "New PIN and current password are required",
      });
    }

    // Validate PIN format (4 digits)
    if (!/^\d{4}$/.test(newPin)) {
      return res.status(400).json({
        success: false,
        message: "Transaction PIN must be exactly 4 digits",
      });
    }

    // Get user with password field
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    // Check if new PIN is same as old
    if (user.transactionPin === newPin) {
      return res.status(400).json({
        success: false,
        message: "New PIN must be different from current PIN",
      });
    }

    // Update transaction PIN
    user.transactionPin = newPin;
    await user.save();

    console.log(`Transaction PIN updated for user: ${user.email}`);

    // Create notification - now using the imported function
    await createNotification({
      userId: user._id,
      type: "profile_updated",
      title: "Transaction PIN Changed",
      message: "Your transaction PIN has been successfully updated.",
      priority: "high",
      actionUrl: "/settings",
      actionText: "View Settings",
    });

    res.json({
      success: true,
      message: "Transaction PIN updated successfully",
    });
  } catch (error) {
    console.error("Change transaction PIN error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

// Verify transaction PIN (for use in transfers)
export const verifyTransactionPin = async (req, res) => {
  try {
    const { pin } = req.body;

    if (!pin) {
      return res.status(400).json({
        success: false,
        message: "PIN is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if PIN matches
    const isValid = user.transactionPin === pin;

    res.json({
      success: true,
      isValid,
      message: isValid ? "PIN verified" : "Invalid PIN",
    });
  } catch (error) {
    console.error("Verify transaction PIN error:", error);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};
