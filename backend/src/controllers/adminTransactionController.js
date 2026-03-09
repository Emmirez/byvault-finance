// src/controllers/adminTransactionController.js
import Transaction from "../models/Transaction.js";
import User from "../models/User.js";
import { logActivity } from "./activityController.js";
import { createNotification } from "./notificationsController.js";
import mongoose from "mongoose";

export const getAllTransactions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      type,
      userId,
      search,
      startDate,
      endDate,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    console.log("📊 Fetching admin transactions with filters:", {
      page,
      limit,
      status,
      type,
      userId,
      search,
      startDate,
      endDate,
    });

    // Build filter object
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (type && type !== "all") {
      filter.type = type;
    }

    if (userId) {
      filter.user = userId;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) {
        filter.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    // Search by transaction ID or description
    if (search) {
      filter.$or = [
        { _id: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Get transactions with user details
    const transactions = await Transaction.find(filter)
      .populate("user", "firstName lastName email accountId")
      .populate("metadata.reviewedBy", "firstName lastName email")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Transaction.countDocuments(filter);

    // Calculate summary stats
    const stats = await Transaction.aggregate([
      {
        $match: filter,
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$amount" },
          avgAmount: { $avg: "$amount" },
          minAmount: { $min: "$amount" },
          maxAmount: { $max: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    console.log(
      `✅ Found ${transactions.length} transactions (total: ${total})`,
    );

    res.json({
      success: true,
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || {
        totalAmount: 0,
        avgAmount: 0,
        minAmount: 0,
        maxAmount: 0,
        count: 0,
      },
    });
  } catch (error) {
    console.error("❌ Error fetching transactions:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const getTransactionStats = async (req, res) => {
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

    // Get stats by status
    const byStatus = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get stats by type
    const byType = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
        },
      },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          total: { $sum: "$amount" },
        },
      },
    ]);

    // Get daily volume
    const dailyVolume = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          volume: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Get pending transactions count
    const pendingCount = await Transaction.countDocuments({
      status: "pending",
    });

    res.json({
      success: true,
      stats: {
        byStatus,
        byType,
        dailyVolume,
        pending: pendingCount,
        dateRange: {
          start: startDate,
          end: endDate,
        },
      },
    });
  } catch (error) {
    console.error("❌ Error fetching transaction stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const getTransactionDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const transaction = await Transaction.findById(id)
      .populate("user", "firstName lastName email accountId phone")
      .populate("metadata.reviewedBy", "firstName lastName email")
      .lean();

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    res.json({
      success: true,
      transaction,
    });
  } catch (error) {
    console.error("❌ Error fetching transaction details:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const updateTransactionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, note } = req.body;

    console.log(`🔄 Updating transaction ${id} to status: ${status}`);

    if (!["completed", "failed", "pending"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be completed, failed, or pending",
      });
    }

    const transaction = await Transaction.findById(id).populate("user");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    const oldStatus = transaction.status;
    const transferType = transaction.metadata?.transferType || "local";
    const isInternational = transferType === "international";
    const transferLabel = isInternational ? "International Transfer" : "Local Transfer";

    // Update transaction
    transaction.status = status;
    transaction.metadata = {
      ...transaction.metadata,
      reviewedBy: req.user._id,
      reviewedAt: new Date(),
      reviewNote: note || "",
    };

    await transaction.save();

    // If deposit completed — credit balance
    if (
      transaction.type === "deposit" &&
      status === "completed" &&
      oldStatus !== "completed"
    ) {
      const user = await User.findById(transaction.user._id);

      if (transaction.currency === "fiat") {
        user.balanceFiat = (user.balanceFiat || 0) + transaction.amount;
      } else if (transaction.currency === "btc") {
        user.balanceBTC = (user.balanceBTC || 0) + transaction.amount;
      }

      await user.save();

      await createNotification({
        userId: user._id,
        type: "deposit_completed",
        title: "Deposit Completed",
        message: `Your deposit of $${transaction.amount} has been completed.`,
        priority: "high",
        data: {
          transactionId: transaction._id,
          amount: transaction.amount,
        },
      });
    }

    // If transfer rejected — refund balance
    if (
      transaction.type === "transfer" &&
      status === "failed" &&
      oldStatus === "pending"
    ) {
      const user = await User.findById(transaction.user._id);

      if (transaction.currency === "btc") {
        user.balanceBTC = (user.balanceBTC || 0) + transaction.amount;
      } else {
        user.balanceFiat = (user.balanceFiat || 0) + transaction.amount;
      }

      await user.save();

      await createNotification({
        userId: user._id,
        type: "transaction_status_updated",
        title: `${transferLabel} Rejected - Refunded`,
        message: `Your ${transferLabel} of $${transaction.amount} was rejected and has been refunded to your account. ${note ? `Reason: ${note}` : ""}`,
        priority: "high",
        data: {
          transactionId: transaction._id,
          amount: transaction.amount,
          refunded: true,
          transferType,
        },
        actionUrl: `/transaction/${transaction._id}`,
        actionText: "View Transaction",
      });
    }

    // Log the admin action
    await logActivity({
      userId: transaction.user._id,
      type: "admin_transaction_update",
      title: `Transaction ${status}`,
      description: `Admin ${status} transaction of $${transaction.amount}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user._id,
      amount: transaction.amount,
      currency: transaction.currency,
      metadata: {
        transactionId: transaction._id,
        oldStatus,
        newStatus: status,
        note,
      },
    });

    // General status update notification
    await createNotification({
      userId: transaction.user._id,
      type: "transaction_status_updated",
      title: transaction.type === "transfer"
        ? `${transferLabel} ${status}`
        : `Transaction ${status}`,
      message: transaction.type === "transfer"
        ? `Your ${transferLabel} of $${transaction.amount} has been ${status}. ${note ? `Note: ${note}` : ""}`
        : `Your transaction of $${transaction.amount} has been ${status}. ${note ? `Note: ${note}` : ""}`,
      priority: status === "completed" ? "high" : "medium",
      data: {
        transactionId: transaction._id,
        amount: transaction.amount,
        status,
        note,
        transferType,  
      },
      actionUrl: `/transaction/${transaction._id}`,
      actionText: "View Transaction",
    });

    res.json({
      success: true,
      message: `Transaction ${status} successfully`,
      transaction,
    });
  } catch (error) {
    console.error(" Error updating transaction status:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const getPendingCount = async (req, res) => {
  try {
    const count = await Transaction.countDocuments({ status: "pending" });

    res.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("❌ Error fetching pending count:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const editTransaction = async (req, res) => {
  try {
    const {
      amount,
      type,
      status,
      description,
      createdAt,
      currency,
      reference,
      method,
      metadata,
    } = req.body;

    console.log(`📝 Editing transaction ${req.params.id}`);

    // First, get the transaction to access user and old values
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Store old values for audit
    const oldValues = {
      amount: transaction.amount,
      type: transaction.type,
      status: transaction.status,
      description: transaction.description,
      createdAt: transaction.createdAt,
    };

    // Track if amount or type changed to handle balance updates
    const amountChanged = amount !== undefined && amount !== transaction.amount;
    const typeChanged = type !== undefined && type !== transaction.type;
    const statusChanged = status !== undefined && status !== transaction.status;

    // If amount or type changed, we need to adjust user balance
    if (
      (amountChanged || typeChanged || statusChanged) &&
      (transaction.status === "completed" || status === "completed")
    ) {
      const user = await User.findById(transaction.user);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Associated user not found",
        });
      }

      // Reverse the original transaction effect if it was completed
      if (transaction.status === "completed") {
        if (transaction.type === "deposit" || transaction.type === "credit") {
          user.balanceFiat = (user.balanceFiat || 0) - transaction.amount;
        } else if (
          transaction.type === "withdraw" ||
          transaction.type === "debit"
        ) {
          user.balanceFiat = (user.balanceFiat || 0) + transaction.amount;
        }
      }

      // Apply new transaction effect if new status is completed
      const newType = type || transaction.type;
      const newAmount = amount !== undefined ? amount : transaction.amount;
      const newStatus = status || transaction.status;

      if (newStatus === "completed") {
        if (newType === "deposit" || newType === "credit") {
          user.balanceFiat = (user.balanceFiat || 0) + newAmount;
        } else if (newType === "withdraw" || newType === "debit") {
          if ((user.balanceFiat || 0) < newAmount) {
            return res.status(400).json({
              success: false,
              message: "Insufficient balance for this transaction",
            });
          }
          user.balanceFiat = (user.balanceFiat || 0) - newAmount;
        }
      }

      await user.save();
    }

    // Prepare update object
    const updateObj = {
      $set: {
        amount: amount !== undefined ? amount : transaction.amount,
        type: type !== undefined ? type : transaction.type,
        status: status !== undefined ? status : transaction.status,
        description:
          description !== undefined ? description : transaction.description,
        currency: currency !== undefined ? currency : transaction.currency,
        reference: reference !== undefined ? reference : transaction.reference,
        method: method !== undefined ? method : transaction.method,
        balanceAfter: transaction.balanceAfter,
        "metadata.editedBy": req.user._id,
        "metadata.editedAt": new Date(),
        "metadata.editHistory": [
          ...(transaction.metadata?.editHistory || []),
          {
            editedBy: req.user._id,
            editedAt: new Date(),
            changes: oldValues,
          },
        ],
      },
    };

    // Add createdAt to update if provided
    if (createdAt) {
      console.log("Setting date to:", new Date(createdAt));
      updateObj.$set.createdAt = new Date(createdAt);
    }

    // Add any additional metadata
    if (metadata) {
      Object.keys(metadata).forEach((key) => {
        updateObj.$set[`metadata.${key}`] = metadata[key];
      });
    }

    // Use raw MongoDB update to bypass all Mongoose magic
    const db = mongoose.connection.db;
    const collection = db.collection("transactions");

    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId(req.params.id) },
      updateObj,
    );

    console.log("Raw update result:", result);

    // Fetch the updated transaction
    const updatedTransaction = await Transaction.findById(
      req.params.id,
    ).populate("user", "firstName lastName email");

    console.log("Updated transaction createdAt:", updatedTransaction.createdAt);

    // Log activity
    try {
      await logActivity({
        userId: updatedTransaction.user._id,
        type: "admin_balance_update",
        title: "Transaction Edited",
        description: `Admin edited transaction of $${updatedTransaction.amount}`,
        status: "success",
        ip: req.ip,
        userAgent: req.headers["user-agent"],
        performedBy: req.user._id,
        amount: updatedTransaction.amount,
        currency: updatedTransaction.currency,
        metadata: {
          transactionId: updatedTransaction._id,
          oldValues,
          newValues: {
            amount: updatedTransaction.amount,
            type: updatedTransaction.type,
            status: updatedTransaction.status,
          },
        },
      });
    } catch (activityError) {
      console.error("Failed to log activity:", activityError.message);
    }

    console.log(`✅ Transaction ${req.params.id} updated successfully`);

    // Remove transactionDate if it exists
    const transactionObj = updatedTransaction.toObject();
    if (transactionObj.transactionDate) {
      delete transactionObj.transactionDate;
    }

    res.json({
      success: true,
      transaction: transactionObj,
      message: "Transaction updated successfully",
    });
  } catch (error) {
    console.error("❌ Error editing transaction:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};
