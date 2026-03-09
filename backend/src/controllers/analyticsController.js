// src/controllers/analyticsController.js
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import KYC from "../models/KYC.js";
import Card from "../models/Card.js";
import ActivityLog from "../models/ActivityLog.js";
import mongoose from "mongoose";

// @desc    Get overview statistics
// @route   GET /api/admin/analytics/overview
// @access  Private/Admin
export const getOverviewStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // User stats
    const totalUsers = await User.countDocuments();
    const newUsersToday = await User.countDocuments({ createdAt: { $gte: startOfDay } });
    const newUsersThisWeek = await User.countDocuments({ createdAt: { $gte: startOfWeek } });
    const newUsersThisMonth = await User.countDocuments({ createdAt: { $gte: startOfMonth } });

    // Transaction stats
    const totalTransactions = await Transaction.countDocuments();
    const pendingTransactions = await Transaction.countDocuments({ status: "pending" });
    const completedTransactions = await Transaction.countDocuments({ status: "completed" });
    
    const transactionVolume = await Transaction.aggregate([
      { $match: { status: "completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    // KYC stats
    const pendingKYC = await KYC.countDocuments({ status: "pending" });
    const verifiedKYC = await KYC.countDocuments({ status: "verified" });
    const rejectedKYC = await KYC.countDocuments({ status: "rejected" });

    // Card stats
    const pendingCards = await Card.countDocuments({ status: "pending" });
    const activeCards = await Card.countDocuments({ status: "active" });

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          newToday: newUsersToday,
          newThisWeek: newUsersThisWeek,
          newThisMonth: newUsersThisMonth,
        },
        transactions: {
          total: totalTransactions,
          pending: pendingTransactions,
          completed: completedTransactions,
          volume: transactionVolume[0]?.total || 0,
        },
        kyc: {
          pending: pendingKYC,
          verified: verifiedKYC,
          rejected: rejectedKYC,
        },
        cards: {
          pending: pendingCards,
          active: activeCards,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user analytics
// @route   GET /api/admin/analytics/users
// @access  Private/Admin
export const getUserAnalytics = async (req, res) => {
  try {
    const { range = "30days" } = req.query;
    
    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // User growth over time
    const userGrowth = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Users by role
    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 }
        }
      }
    ]);

    // Users by status
    const usersByStatus = await User.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        growth: userGrowth,
        byRole: usersByRole,
        byStatus: usersByStatus,
        total: await User.countDocuments(),
      },
    });
  } catch (error) {
    console.error("Error fetching user analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get transaction analytics
// @route   GET /api/admin/analytics/transactions
// @access  Private/Admin
export const getTransactionAnalytics = async (req, res) => {
  try {
    const { range = "30days" } = req.query;
    
    const endDate = new Date();
    const startDate = new Date();
    
    switch (range) {
      case "7days":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "30days":
        startDate.setDate(startDate.getDate() - 30);
        break;
      case "90days":
        startDate.setDate(startDate.getDate() - 90);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }

    // Transaction volume over time
    const volumeOverTime = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: "completed"
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          total: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Transactions by type
    const transactionsByType = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          total: { $sum: "$amount" }
        }
      }
    ]);

    // Transactions by status
    const transactionsByStatus = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      analytics: {
        volumeOverTime,
        byType: transactionsByType,
        byStatus: transactionsByStatus,
      },
    });
  } catch (error) {
    console.error("Error fetching transaction analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get KYC analytics
// @route   GET /api/admin/analytics/kyc
// @access  Private/Admin
export const getKYCAnalytics = async (req, res) => {
  try {
    const kycByStatus = await KYC.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    const kycOverTime = await KYC.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$submittedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } },
      { $limit: 12 }
    ]);

    res.json({
      success: true,
      analytics: {
        byStatus: kycByStatus,
        overTime: kycOverTime,
      },
    });
  } catch (error) {
    console.error("Error fetching KYC analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get financial summary
// @route   GET /api/admin/analytics/financial
// @access  Private/Admin
export const getFinancialSummary = async (req, res) => {
  try {
    // Total balance across all users
    const totalBalance = await User.aggregate([
      {
        $group: {
          _id: null,
          totalFiat: { $sum: "$balanceFiat" },
          totalBTC: { $sum: "$balanceBTC" }
        }
      }
    ]);

    // Daily revenue (if you have fees)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dailyRevenue = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: "completed"
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$amount", 0.02] } } // 2% fee example
        }
      }
    ]);

    res.json({
      success: true,
      financial: {
        totalFiat: totalBalance[0]?.totalFiat || 0,
        totalBTC: totalBalance[0]?.totalBTC || 0,
        dailyRevenue: dailyRevenue[0]?.total || 0,
      },
    });
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get recent activities
// @route   GET /api/admin/activities/recent
// @access  Private/Admin
export const getRecentActivities = async (req, res) => {
  try {
    const { limit = 20 } = req.query;
    
    const activities = await ActivityLog.find()
      .populate("user", "firstName lastName email")
      .populate("performedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      activities,
    });
  } catch (error) {
    console.error("Error fetching recent activities:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCardAnalytics = async (req, res) => {
  try {
    // Cards by status
    const cardsByStatus = await Card.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Cards by type (Visa, Mastercard, etc.)
    const cardsByType = await Card.aggregate([
      {
        $group: {
          _id: "$cardType",
          count: { $sum: 1 }
        }
      }
    ]);

    // Cards by brand (Virtual vs Physical)
    const cardsByBrand = await Card.aggregate([
      {
        $group: {
          _id: "$cardBrand",
          count: { $sum: 1 }
        }
      }
    ]);

    // Card applications over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const cardsOverTime = await Card.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Total cards
    const totalCards = await Card.countDocuments();
    
    // Pending approvals
    const pendingApprovals = await Card.countDocuments({ status: "pending" });

    res.json({
      success: true,
      analytics: {
        total: totalCards,
        pendingApprovals,
        byStatus: cardsByStatus,
        byType: cardsByType,
        byBrand: cardsByBrand,
        overTime: cardsOverTime,
      },
    });
  } catch (error) {
    console.error("Error fetching card analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
};