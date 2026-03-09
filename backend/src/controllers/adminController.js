import User from "../models/User.js";
import DepositRequest from "../models/DepositRequest.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";
import { logActivity } from "./activityController.js";
import KYC from "../models/KYC.js";
import ChatSession from "../models/ChatSession.js";
import Card from "../models/Card.js";
import Grant from "../models/Grant.js";
import TaxRefund from "../models/TaxRefund.js";
import Loan from "../models/Loan.js";
import PaymentSettings from "../models/PaymentSettings.js";

// GET all users
export const getAllUsers = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("📋 GET ALL USERS REQUEST");
    console.log("Query params:", req.query);

    const { page = 1, limit = 10, status, search, role } = req.query;

    // Build filter object
    let filter = {};

    // Filter by status
    if (status) {
      switch (status) {
        case "active":
          filter.$and = [
            { $or: [{ isBlocked: false }, { isBlocked: { $exists: false } }] },
            {
              $or: [
                { isSuspended: false },
                { isSuspended: { $exists: false } },
              ],
            },
          ];
          break;
        case "blocked":
          filter.$or = [{ isBlocked: true }, { status: "blocked" }];
          break;
        case "suspended":
          filter.$or = [{ isSuspended: true }, { status: "suspended" }];
          break;
        case "pending":
          filter.$or = [{ isVerified: false }, { status: "pending" }];
          break;
        case "inactive":
          filter.isActive = false;
          break;
        default:
          filter.status = status;
      }
    }

    // Filter by role
    if (role) {
      filter.role = role;
    }

    // Search by name, email, or accountId
    if (search && search.trim()) {
      const searchRegex = new RegExp(search, "i");
      filter.$or = [
        { firstName: searchRegex },
        { lastName: searchRegex },
        { email: searchRegex },
        { accountId: searchRegex },
        { name: searchRegex },
      ];
    }

    console.log("MongoDB filter:", JSON.stringify(filter, null, 2));

    // Get total count for pagination
    const total = await User.countDocuments(filter);

    // Get users with pagination
    const users = await User.find(filter)
      .select("-password -transactionPin")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .lean(); // Use lean() for better performance

    // Add computed status to each user
    const usersWithStatus = users.map((user) => ({
      ...user,
      // Compute status based on flags
      computedStatus: user.isBlocked
        ? "blocked"
        : user.isSuspended
          ? "suspended"
          : user.isVerified === false
            ? "pending"
            : "active",
    }));

    console.log(`Found ${users.length} users (total: ${total})`);
    console.log("=".repeat(50));

    res.json({
      users: usersWithStatus,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("❌ Error in getAllUsers:", err);
    res.status(500).json({ message: "Server error: " + err.message });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Block/freeze user
export const blockUser = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("🔴 BLOCK USER REQUEST RECEIVED");
    console.log("Time:", new Date().toISOString());
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);
    console.log("Request headers:", {
      authorization: req.headers.authorization ? "Bearer [HIDDEN]" : "Missing",
      "content-type": req.headers["content-type"],
    });

    // Check if user is authenticated
    if (!req.user) {
      console.log("❌ No authenticated user found in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Authenticated admin:", {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });

    const userId = req.params.userId;
    console.log("Looking for user to block with ID:", userId);

    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Update user using findByIdAndUpdate (bypasses validation)
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: true,
        status: "blocked",
        isSuspended: false, // Ensure user is not suspended when blocked
        suspendedUntil: null, // Clear any suspension
        blockedAt: new Date(),
        blockedBy: req.user._id,
        blockReason: req.body.reason || "No reason provided",
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: false,
        select: "-password -transactionPin",
      },
    );

    if (!updatedUser) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User blocked successfully:", {
      id: updatedUser._id,
      email: updatedUser.email,
      isBlocked: updatedUser.isBlocked,
      status: updatedUser.status,
    });

    // LOG ACTIVITY
    await logActivity({
      userId: updatedUser._id,
      type: "admin_block",
      title: "Account Blocked",
      description: `User was blocked by admin. Reason: ${req.body.reason || "No reason provided"}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user._id,
      metadata: {
        reason: req.body.reason || "No reason provided",
        blockedBy: req.user.email,
        blockedAt: new Date().toISOString(),
      },
    });

    console.log("Response being sent:", {
      success: true,
      message: "User has been blocked",
      userId: updatedUser._id,
      isBlocked: updatedUser.isBlocked,
    });

    console.log("=".repeat(50));

    res.json({
      success: true,
      message: "User has been blocked",
      user: updatedUser,
    });
  } catch (err) {
    console.error("=".repeat(50));
    console.error("❌ ERROR in blockUser:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    // Check for specific MongoDB errors
    if (err.name === "CastError") {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    if (err.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Validation error: " + err.message });
    }

    console.error("=".repeat(50));
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// all request
export const getDashboardData = async (req, res) => {
  try {
    console.log("📊 Fetching all dashboard data in one request");
    // console.time("dashboard-data");

    // Calculate date ranges
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const last24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const last30d = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Run all queries in parallel
    const [
      stats,
      recentUsers,
      recentTransactions,
      pendingKyc,
      analytics,
      supportTickets,
      systemMetrics,
    ] = await Promise.all([
      // 1. Dashboard stats (existing code)
      (async () => {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
          isBlocked: false,
          isSuspended: false,
          lastLogin: { $gte: last30d },
        });
        const pendingVerifications = await KYC.countDocuments({
          status: "pending",
        }).catch(() => 0);
        const totalTransactions = await Transaction.countDocuments();
        const pendingTransactions = await Transaction.countDocuments({
          status: "pending",
        });
        const blockedAccounts = await User.countDocuments({ isBlocked: true });

        const pendingCards = await Card.countDocuments({
          status: "pending",
        }).catch(() => 0);
        const pendingGrants = await Grant.countDocuments({
          status: "pending",
        }).catch(() => 0);
        const pendingTaxRefunds = await TaxRefund.countDocuments({
          status: "pending",
        }).catch(() => 0);
        const pendingLoans = await Loan.countDocuments({
          status: "pending",
        }).catch(() => 0);

        const totalVolume = await Transaction.aggregate([
          { $match: { status: "completed" } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const monthlyRevenue = await Transaction.aggregate([
          {
            $match: {
              status: "completed",
              createdAt: {
                $gte: new Date(
                  new Date().getFullYear(),
                  new Date().getMonth(),
                  1,
                ),
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        const activeChats =
          (await ChatSession?.countDocuments({ status: "active" }).catch(
            () => 0,
          )) || 0;

        return {
          totalUsers,
          activeUsers,
          pendingVerifications,
          totalTransactions,
          totalVolume: totalVolume[0]?.total || 0,
          monthlyRevenue: monthlyRevenue[0]?.total || 0,
          pendingTransactions,
          blockedAccounts,
          activeChats,
          pendingCards,
          pendingGrants,
          pendingTaxRefunds,
          pendingLoans,
        };
      })(),

      // 2. Recent users (existing code)
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select(
          "firstName lastName email isBlocked isVerified balanceFiat createdAt",
        )
        .lean()
        .then((users) =>
          users.map((user) => ({
            id: user._id,
            name:
              user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.name || "User",
            email: user.email,
            status: user.isBlocked
              ? "Blocked"
              : user.isVerified
                ? "Active"
                : "Pending",
            balance: user.balanceFiat || 0,
            joined: user.createdAt,
          })),
        ),

      // 3. Recent transactions (existing code)
      Transaction.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("user", "firstName lastName")
        .lean()
        .then((transactions) =>
          transactions.map((tx) => ({
            id: tx._id,
            user: tx.user
              ? `${tx.user.firstName || ""} ${tx.user.lastName || ""}`.trim()
              : "Unknown",
            type: tx.type.charAt(0).toUpperCase() + tx.type.slice(1),
            amount: tx.amount,
            status: tx.status.charAt(0).toUpperCase() + tx.status.slice(1),
            date: tx.createdAt,
          })),
        ),

      // 4. Pending KYC (existing code)
      KYC.find({ status: "pending" })
        .limit(3)
        .populate("user", "firstName lastName")
        .lean()
        .then((kycs) =>
          kycs.map((kyc) => ({
            id: kyc._id,
            name: kyc.user
              ? `${kyc.user.firstName || ""} ${kyc.user.lastName || ""}`.trim()
              : "Unknown",
            type:
              kyc.documents?.[0]?.type?.replace(/_/g, " ") || "KYC Document",
            date: kyc.submittedAt,
          })),
        )
        .catch(() => []),

      // 5. Analytics overview (existing code)
      (async () => {
        const [
          totalUsers,
          newUsersToday,
          totalTransactions,
          todayTransactions,
        ] = await Promise.all([
          User.countDocuments(),
          User.countDocuments({ createdAt: { $gte: startOfDay } }),
          Transaction.countDocuments(),
          Transaction.countDocuments({ createdAt: { $gte: startOfDay } }),
        ]);

        return {
          users: { total: totalUsers, newToday: newUsersToday },
          transactions: { total: totalTransactions, today: todayTransactions },
        };
      })(),

      // 6. Support tickets count (existing code)
      (async () => {
        try {
          const SupportTicket = mongoose.model("SupportTicket");
          return await SupportTicket.countDocuments({ status: "open" });
        } catch (e) {
          return 0;
        }
      })(),

      // 7. NEW: System metrics for success rate, avg response, uptime
      (async () => {
        // Calculate success rate from last 30 days
        const transactions = await Transaction.aggregate([
          {
            $match: {
              createdAt: { $gte: last30d },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: 1 },
              successful: {
                $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
              },
              failed: {
                $sum: { $cond: [{ $eq: ["$status", "failed"] }, 1, 0] },
              },
            },
          },
        ]);

        const stats = transactions[0] || { total: 0, successful: 0, failed: 0 };
        const successRate =
          stats.total > 0
            ? ((stats.successful / stats.total) * 100).toFixed(1)
            : 99.9;

        // Calculate average response time (if you have support tickets with response times)
        // This is a placeholder - you'd need actual response time data
        const avgResponse = "1.2s";

        // Calculate uptime based on health checks
        // This is a placeholder - you'd need actual uptime monitoring
        const uptime = 99.9;

        return {
          successRate,
          avgResponse,
          uptime,
        };
      })(),
    ]);

    // console.timeEnd("dashboard-data");

    res.json({
      success: true,
      stats,
      recentUsers,
      recentTransactions,
      pendingVerifications: pendingKyc,
      analytics,
      supportTickets,
      systemMetrics, // Add this to the response
    });
  } catch (error) {
    console.error("❌ Error in getDashboardData:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Unblock user - UPDATED with findByIdAndUpdate
export const unblockUser = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("🟢 UNBLOCK USER REQUEST RECEIVED");
    console.log("Time:", new Date().toISOString());
    console.log("Request params:", req.params);
    console.log("Request body:", req.body);

    // Check if user is authenticated
    if (!req.user) {
      console.log("❌ No authenticated user found in request");
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("Authenticated admin:", {
      id: req.user._id,
      email: req.user.email,
      role: req.user.role,
    });

    const userId = req.params.userId;
    console.log("Looking for user to unblock with ID:", userId);

    // Validate userId format
    if (!userId.match(/^[0-9a-fA-F]{24}$/)) {
      console.log("❌ Invalid user ID format:", userId);
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const existingUser = await User.findById(userId);

    // Update user using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isBlocked: false,
        status: existingUser.isVerified ? "active" : "pending",
        blockedAt: null,
        blockedBy: null,
        blockReason: null,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: false,
        select: "-password -transactionPin",
      },
    );

    if (!updatedUser) {
      console.log("❌ User not found with ID:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User unblocked successfully:", {
      id: updatedUser._id,
      email: updatedUser.email,
      isBlocked: updatedUser.isBlocked,
      status: updatedUser.status,
    });

    //  LOG ACTIVITY
    await logActivity({
      userId: updatedUser._id,
      type: "admin_unblock",
      title: "Account Unblocked",
      description: `User was unblocked by admin.`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user._id,
      metadata: {
        unblockedBy: req.user.email,
        unblockedAt: new Date().toISOString(),
        previousStatus: "blocked",
      },
    });

    console.log("=".repeat(50));

    res.json({
      success: true,
      message: "User has been unblocked",
      user: updatedUser,
    });
  } catch (err) {
    console.error("❌ ERROR in unblockUser:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    // User stats
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({
      isBlocked: false,
      isSuspended: false,
      lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    });
    const blockedAccounts = await User.countDocuments({ isBlocked: true });
    const suspendedAccounts = await User.countDocuments({ isSuspended: true });

    // KYC stats
    let pendingVerifications = 0;
    try {
      pendingVerifications = await KYC.countDocuments({ status: "pending" });
    } catch (e) {
      console.log("KYC model not available");
    }

    // Transaction stats
    const totalTransactions = await Transaction.countDocuments();
    const pendingTransactions = await Transaction.countDocuments({
      status: "pending",
    });

    const totalVolume = await Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Monthly revenue
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyRevenue = await Transaction.aggregate([
      {
        $match: {
          status: "completed",
          createdAt: { $gte: startOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    // Deposit stats
    const pendingDeposits = await DepositRequest.countDocuments({
      status: "pending",
    });

    const totalDeposits = await DepositRequest.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    //  LIVE CHAT STATS
    let activeChats = 0;
    try {
      // Count chat sessions with status 'active'
      activeChats = await ChatSession.countDocuments({
        status: "active",
      });

      console.log(`📊 Found ${activeChats} active chat sessions`);
    } catch (e) {
      console.log("ChatSession model error:", e.message);
    }

    const recentDeposits = await DepositRequest.find()
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        activeUsers,
        pendingVerifications,
        totalTransactions,
        totalVolume: totalVolume[0]?.total || 0,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        pendingTransactions,
        blockedAccounts,
        suspendedAccounts,
        activeChats, // This will now show your active chat sessions
        pendingDeposits,
        totalDeposited: totalDeposits[0]?.total || 0,
      },
      recentDeposits,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user details
export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password -transactionPin",
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const deposits = await DepositRequest.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const transactions = await Transaction.find({ user: user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      user,
      deposits,
      transactions,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

//update user
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Extract all possible fields from request body
    const {
      firstName,
      lastName,
      middleName,
      username,
      email,
      phone,
      address,
      accountType,
      currency,
      balanceFiat,
      balanceBTC,
      role,
      isVerified,
      btcDepositAddress,
      twoFactorEnabled,
      bankDetails,
      dateOfBirth,
      status,
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store old values for logging
    const oldValues = {
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      accountType: user.accountType,
      currency: user.currency,
      balanceFiat: user.balanceFiat,
      balanceBTC: user.balanceBTC,
      role: user.role,
      isVerified: user.isVerified,
      status: user.status,
      twoFactorEnabled: user.twoFactorEnabled,
      btcDepositAddress: user.btcDepositAddress,
    };

    // Track what's being updated
    const updates = {};

    // Update personal information
    if (firstName !== undefined) {
      user.firstName = firstName;
      updates.firstName = firstName;
      console.log("📌 Updating firstName to:", firstName);
    }
    if (lastName !== undefined) {
      user.lastName = lastName;
      updates.lastName = lastName;
      console.log("📌 Updating lastName to:", lastName);
    }
    if (middleName !== undefined) {
      user.middleName = middleName;
      updates.middleName = middleName;
    } 
    if (username !== undefined) {
      user.username = username;
      updates.username = username;
    } 
    if (email !== undefined) {
      user.email = email;
      updates.email = email;
      
    }
    if (phone !== undefined) {
      user.phone = phone;
      updates.phone = phone;
      
    }
    if (address !== undefined) {
      user.address = address;
      updates.address = address;
      
    }
    if (dateOfBirth !== undefined) {
      user.dateOfBirth = dateOfBirth;
      updates.dateOfBirth = dateOfBirth;
      
    }

    // Update account settings
    if (accountType !== undefined) {
      user.accountType = accountType;
      updates.accountType = accountType;
      
    }
    if (currency !== undefined) {
      user.currency = currency;
      updates.currency = currency;
     
    }

    // Update balances
    if (balanceFiat !== undefined) {
      user.balanceFiat = balanceFiat;
      updates.balanceFiat = balanceFiat;
      
    }
    if (balanceBTC !== undefined) {
      user.balanceBTC = balanceBTC;
      updates.balanceBTC = balanceBTC;
      
    }

    // Update role and status
    if (role !== undefined) {
      user.role = role;
      updates.role = role;
      
    }
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
      updates.isVerified = isVerified;
      
    }
    if (status !== undefined) {
      user.status = status;
      updates.status = status;
      
    }

    // Update security settings
    if (twoFactorEnabled !== undefined) {
      user.twoFactorEnabled = twoFactorEnabled;
      updates.twoFactorEnabled = twoFactorEnabled;
      
    }

    // Update BTC deposit address
    if (btcDepositAddress !== undefined) {
      user.btcDepositAddress = btcDepositAddress;
      updates.btcDepositAddress = btcDepositAddress;
      
    }

    // Update bank details
    if (bankDetails && typeof bankDetails === "object") {
      // Initialize bankDetails if it doesn't exist
      if (!user.bankDetails) user.bankDetails = {};

      const bankUpdates = [];

      if (bankDetails.bankName !== undefined) {
        user.bankDetails.bankName = bankDetails.bankName;
        bankUpdates.push("bankName");
      }
      if (bankDetails.accountName !== undefined) {
        user.bankDetails.accountName = bankDetails.accountName;
        bankUpdates.push("accountName");
      }
      if (bankDetails.accountNumber !== undefined) {
        user.bankDetails.accountNumber = bankDetails.accountNumber;
        bankUpdates.push("accountNumber");
      }
      if (bankDetails.routingNumber !== undefined) {
        user.bankDetails.routingNumber = bankDetails.routingNumber;
        bankUpdates.push("routingNumber");
      }
      if (bankDetails.swiftCode !== undefined) {
        user.bankDetails.swiftCode = bankDetails.swiftCode;
        bankUpdates.push("swiftCode");
      }
      if (bankDetails.iban !== undefined) {
        user.bankDetails.iban = bankDetails.iban;
        bankUpdates.push("iban");
      }
      if (bankDetails.bankAddress !== undefined) {
        user.bankDetails.bankAddress = bankDetails.bankAddress;
        bankUpdates.push("bankAddress");
      }

      if (bankUpdates.length > 0) {
        updates.bankDetails = bankUpdates;
        console.log("📌 Updating bank details fields:", bankUpdates);
      }
    }

    // Update full name if firstName or lastName changed
    if (firstName !== undefined || lastName !== undefined) {
      const newFirstName = firstName || user.firstName;
      const newLastName = lastName || user.lastName;
      user.name = `${newFirstName} ${newLastName}`.trim();
      updates.name = user.name;
      console.log("📌 Updating name to:", user.name);
    }

    console.log("📊 Summary of updates:", updates);

    if (Object.keys(updates).length === 0) {
      console.log("⚠️ No fields were updated");
      return res.json({
        success: true,
        message: "No changes detected",
        user,
      });
    }

    console.log("💾 Saving user to database...");
    await user.save({ validateBeforeSave: false });
    console.log("✅ User saved successfully");

    // LOG ACTIVITY
    const changedFields = Object.keys(updates)
      .map((key) => {
        if (key === "bankDetails") {
          return `Bank details updated: ${updates[key].join(", ")}`;
        }
        return `${key}: ${oldValues[key]} → ${user[key]}`;
      })
      .join("; ");

    await logActivity({
      userId: user._id,
      type: "profile_update",
      title: "User Profile Updated",
      description: `User profile was updated by admin. Changes: ${changedFields}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user?._id,
      metadata: {
        updatedBy: req.user?.email,
        updates: updates,
        oldValues: oldValues,
        updatedAt: new Date().toISOString(),
      },
    });

    // Remove sensitive data before sending response
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.transactionPin;

    console.log("📤 Sending response with updated user data");
    console.log("=".repeat(50));

    res.json({
      success: true,
      message: "User updated successfully",
      user: userResponse,
      updatesApplied: updates,
    });
  } catch (err) {
    console.error("❌ ERROR in updateUser:");
    console.error("Error name:", err.name);
    console.error("Error message:", err.message);
    console.error("Error stack:", err.stack);

    // Log failed attempt
    if (req.params.userId) {
      await logActivity({
        userId: req.params.userId,
        type: "profile_update",
        title: "Update User Failed",
        description: `Failed to update user: ${err.message}`,
        status: "failed",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        performedBy: req.user?._id,
        metadata: {
          error: err.message,
          attemptedUpdates: req.body,
        },
      }).catch((e) => console.error("Failed to log activity:", e));
    }

    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// Get pending deposits
export const getPendingDeposits = async (req, res) => {
  try {
    const deposits = await DepositRequest.find({ status: "pending" })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({ deposits });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve deposit
export const approveDeposit = async (req, res) => {
  try {
    const deposit = await DepositRequest.findById(
      req.params.depositId,
    ).populate("user");

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    // Update user balance
    const user = deposit.user;
    const balanceBefore = user.balanceFiat;
    const balanceAfter = balanceBefore + deposit.amount;

    user.balanceFiat = balanceAfter;
    await user.save();

    // Update deposit status
    deposit.status = "approved";
    await deposit.save();

    // Create transaction record
    await Transaction.create({
      user: user._id,
      type: "deposit",
      currency: "fiat",
      amount: deposit.amount,
      status: "completed",
      description: `Deposit via ${deposit.method} - Approved`,
      balanceBefore,
      balanceAfter,
      metadata: { depositId: deposit._id },
    });

    res.json({
      success: true,
      message: "Deposit approved and user balance updated",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject deposit
export const rejectDeposit = async (req, res) => {
  try {
    const { reason } = req.body;
    const deposit = await DepositRequest.findById(req.params.depositId);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    deposit.status = "rejected";
    deposit.notes = reason;
    await deposit.save();

    // Update pending transaction
    await Transaction.findOneAndUpdate(
      { "metadata.depositId": deposit._id, status: "pending" },
      {
        status: "failed",
        description: `Deposit rejected: ${reason || "Verification failed"}`,
      },
    );

    res.json({ success: true, message: "Deposit rejected" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Suspend user
export const suspendUser = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("🟠 SUSPEND USER REQUEST");
    console.log("User ID:", req.params.userId);
    console.log("Admin:", req.user?.email);
    console.log("Body:", req.body);

    const { reason, duration } = req.body;

    // Calculate suspension end date if duration provided (in hours)
    let suspendedUntil = null;
    if (duration && !isNaN(duration)) {
      suspendedUntil = new Date(Date.now() + duration * 60 * 60 * 1000);
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isSuspended: true,
        status: "suspended",
        suspendedAt: new Date(),
        suspendedUntil,
        suspendedBy: req.user._id,
        suspensionReason: reason || "No reason provided",
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: false,
        select: "-password -transactionPin",
      },
    );

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User suspended successfully:", {
      id: user._id,
      email: user.email,
      isSuspended: user.isSuspended,
      suspendedUntil: user.suspendedUntil,
    });
    console.log("=".repeat(50));

    res.json({
      success: true,
      message: duration
        ? `User suspended for ${duration} hours`
        : "User suspended permanently",
      user,
    });
  } catch (err) {
    console.error("❌ Error in suspendUser:", err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// Unsuspend / Reactivate user
export const unsuspendUser = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("🟢 UNSUSPEND USER REQUEST");
    console.log("User ID:", req.params.userId);

    const existingUser = await User.findById(req.params.userId);

    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId,
      {
        isSuspended: false,
        status: existingUser.isVerified ? "active" : "pending",
        suspendedAt: null,
        suspendedUntil: null,
        suspendedBy: null,
        suspensionReason: null,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: false,
        select: "-password -transactionPin",
      },
    );

    if (!user) {
      console.log("❌ User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ User unsuspended successfully:", {
      id: user._id,
      email: user.email,
      isSuspended: user.isSuspended,
    });
    console.log("=".repeat(50));

    res.json({
      success: true,
      message: "User has been reactivated",
      user,
    });
  } catch (err) {
    console.error("❌ Error in unsuspendUser:", err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// Get all suspended users
export const getSuspendedUsers = async (req, res) => {
  try {
    const users = await User.find({
      $or: [{ isSuspended: true }, { status: "suspended" }],
    })
      .select("-password -transactionPin")
      .sort({ suspendedAt: -1 });

    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error("❌ Error in getSuspendedUsers:", err);
    res.status(500).json({
      success: false,
      message: "Server error: " + err.message,
    });
  }
};

// Check and auto-unsuspend expired suspensions
export const checkExpiredSuspensions = async () => {
  try {
    const now = new Date();
    const result = await User.updateMany(
      {
        isSuspended: true,
        suspendedUntil: { $lt: now, $ne: null },
      },
      {
        $set: {
          isSuspended: false,
          status: "active",
          suspendedUntil: null,
          suspendedAt: null,
          suspendedBy: null,
          suspensionReason: null,
        },
      },
    );

    if (result.modifiedCount > 0) {
      console.log(
        `✅ Auto-unsuspended ${result.modifiedCount} users with expired suspensions`,
      );
    }
    return result;
  } catch (err) {
    console.error("❌ Error checking expired suspensions:", err);
    return { modifiedCount: 0 };
  }
};

// Force update user timestamp (admin only)
export const updateUserTimestamp = async (req, res) => {
  try {
    console.log("=".repeat(50));
    console.log("🕒 FORCE UPDATE TIMESTAMP REQUEST");
    console.log("User ID:", req.params.userId);
    console.log("Request body:", req.body);
    console.log("Admin:", req.user?.email);

    const { createdAt } = req.body;

    if (!createdAt) {
      return res.status(400).json({
        success: false,
        message: "createdAt date is required",
      });
    }

    // Validate the date
    const newDate = new Date(createdAt);
    if (isNaN(newDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid date format",
      });
    }

    // Don't allow future dates
    if (newDate > new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot set future date",
      });
    }

    const result = await User.collection.findOneAndUpdate(
      { _id: new mongoose.Types.ObjectId(req.params.userId) },
      {
        $set: {
          createdAt: newDate,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" },
    );

    const user = result.value || result; // handle driver version differences

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    console.log("✅ Timestamp updated successfully:", {
      email: user.email,
      oldCreatedAt: user.createdAt,
      newCreatedAt: newDate,
    });
    console.log("=".repeat(50));

    res.json({
      success: true,
      message: "User creation date updated successfully",
      user: {
        id: user._id,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error updating timestamp:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const getPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) {
      settings = await PaymentSettings.create({});
    }
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();

    console.log("📊 Before update:", settings);
    if (!settings) {
      settings = new PaymentSettings();
    }

    const { bankTransfer, paypal, usdt, creditCard, crypto } = req.body;

    if (bankTransfer)
      settings.bankTransfer = { ...settings.bankTransfer, ...bankTransfer };
    if (paypal) settings.paypal = { ...settings.paypal, ...paypal };
    if (usdt) settings.usdt = { ...settings.usdt, ...usdt };
    if (creditCard)
      settings.creditCard = { ...settings.creditCard, ...creditCard };
    if (crypto) settings.crypto = { ...settings.crypto, ...crypto };

    await settings.save();
    console.log("✅ After update:", settings);
    res.json({ success: true, message: "Payment settings updated", settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  Public
export const getPublicPaymentSettings = async (req, res) => {
  try {
    let settings = await PaymentSettings.findOne();
    if (!settings) settings = await PaymentSettings.create({});
    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
