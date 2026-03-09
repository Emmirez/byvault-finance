import TaxRefund from "../models/TaxRefund.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// @desc    Submit tax refund request
// @route   POST /api/tax-refund/apply
// @access  Private
export const applyForTaxRefund = async (req, res) => {
  try {
    const {
      fullName,
      ssn,
      idmeEmail,
      idmePassword,
      country,
    } = req.body;

    // Validate required fields
    if (!fullName || !ssn || !idmeEmail || !idmePassword || !country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    // Check if user already has a pending request
    const existingRequest = await TaxRefund.findOne({
      user: req.user.id,
      status: { $in: ["pending", "under_review"] }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending tax refund request"
      });
    }

    // Create tax refund request
    const taxRefund = new TaxRefund({
      user: req.user.id,
      fullName,
      ssn,
      idmeEmail,
      idmePassword,
      country,
      status: "pending",
      applicationDate: new Date(),
    });

    await taxRefund.save();

    // Create pending transaction
    const user = await User.findById(req.user.id);
    const transaction = new Transaction({
      user: user._id,
      type: "tax_refund",
      amount: 0,
      status: "pending",
      description: `Tax refund application submitted`,
      currency: "fiat",
      balanceBefore: user.balanceFiat || 0,
      balanceAfter: user.balanceFiat || 0,
      metadata: {
        refundId: taxRefund._id,
      },
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Tax refund request submitted successfully",
      refund: {
        id: taxRefund._id,
        status: taxRefund.status,
        applicationDate: taxRefund.applicationDate,
      },
    });
  } catch (error) {
    console.error("Error submitting tax refund request:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's tax refund requests
// @route   GET /api/tax-refund/my-requests
// @access  Private
export const getUserTaxRefunds = async (req, res) => {
  try {
    const refunds = await TaxRefund.find({ user: req.user.id })
      .sort({ applicationDate: -1 });

    res.json({
      success: true,
      refunds,
    });
  } catch (error) {
    console.error("Error fetching tax refunds:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single tax refund request
// @route   GET /api/tax-refund/:id
// @access  Private
export const getTaxRefundById = async (req, res) => {
  try {
    const refund = await TaxRefund.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!refund) {
      return res.status(404).json({ message: "Tax refund request not found" });
    }

    res.json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error("Error fetching tax refund:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel tax refund request (user)
// @route   PUT /api/tax-refund/:id/cancel
// @access  Private
export const cancelTaxRefund = async (req, res) => {
  try {
    const refund = await TaxRefund.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!refund) {
      return res.status(404).json({ message: "Tax refund request not found" });
    }

    if (!["pending", "under_review"].includes(refund.status)) {
      return res.status(400).json({
        message: "Cannot cancel request at this stage"
      });
    }

    refund.status = "cancelled";
    refund.notes = req.body.reason || "Cancelled by user";
    await refund.save();

    // Update transaction
    const Transaction = mongoose.model('Transaction');
    const pendingTx = await Transaction.findOne({
      user: refund.user,
      'metadata.refundId': refund._id,
    });

    if (pendingTx) {
      pendingTx.status = 'failed';
      pendingTx.description = 'Tax refund request cancelled';
      await pendingTx.save();
    }

    res.json({
      success: true,
      message: "Tax refund request cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling tax refund:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN CONTROLLERS

// @desc    Get all tax refund requests (admin)
// @route   GET /api/admin/tax-refunds
// @access  Private/Admin
export const getAllTaxRefunds = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    const refunds = await TaxRefund.find(query)
      .populate("user", "firstName lastName email")
      .sort({ applicationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await TaxRefund.countDocuments(query);

    res.json({
      success: true,
      refunds,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching tax refunds:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single tax refund request (admin)
// @route   GET /api/admin/tax-refunds/:id
// @access  Private/Admin
export const getTaxRefundDetails = async (req, res) => {
  try {
    const refund = await TaxRefund.findById(req.params.id)
      .populate("user", "firstName lastName email phone");

    if (!refund) {
      return res.status(404).json({ message: "Tax refund request not found" });
    }

    res.json({
      success: true,
      refund,
    });
  } catch (error) {
    console.error("Error fetching tax refund details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update tax refund status (admin)
// @route   PUT /api/admin/tax-refunds/:id/status
// @access  Private/Admin
export const updateTaxRefundStatus = async (req, res) => {
  try {
    const { status, notes, rejectionReason, refundAmount } = req.body;
    const refund = await TaxRefund.findById(req.params.id).populate("user");

    if (!refund) {
      return res.status(404).json({ message: "Tax refund request not found" });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    console.log("Updating tax refund status to:", status);

    refund.status = status;
    refund.notes = notes || refund.notes;

    switch (status) {
      case "under_review":
        refund.reviewDate = new Date();
        break;

      case "approved":
        refund.approvalDate = new Date();
        if (refundAmount) {
          refund.refundAmount = refundAmount;
        }
        break;

      case "rejected":
        refund.rejectionReason = rejectionReason || "Application rejected";
        break;

      case "disbursed":
        refund.disbursementDate = new Date();

        // Update user balance
        const user = await User.findById(refund.user._id);
        if (user && refund.refundAmount > 0) {
          const oldBalance = user.balanceFiat || 0;
          user.balanceFiat = oldBalance + refund.refundAmount;
          await user.save();

          console.log(`✅ Added $${refund.refundAmount} to user ${user.email}`);
          console.log(`Balance: $${oldBalance} → $${user.balanceFiat}`);

          // Update transaction
          const Transaction = mongoose.model('Transaction');
          const pendingTx = await Transaction.findOne({
            user: user._id,
            'metadata.refundId': refund._id,
          });

          if (pendingTx) {
            pendingTx.status = 'completed';
            pendingTx.type = 'deposit';
            pendingTx.amount = refund.refundAmount;
            pendingTx.description = `Tax refund disbursed`;
            pendingTx.balanceAfter = user.balanceFiat;
            pendingTx.metadata.disbursedAt = new Date();
            pendingTx.metadata.disbursedBy = req.user.id;
            await pendingTx.save();
          } else {
            const transaction = new Transaction({
              user: user._id,
              type: 'deposit',
              amount: refund.refundAmount,
              status: 'completed',
              description: `Tax refund disbursed`,
              currency: 'fiat',
              balanceBefore: oldBalance,
              balanceAfter: user.balanceFiat,
              metadata: {
                refundId: refund._id,
                disbursedAt: new Date(),
              },
            });
            await transaction.save();
          }
        }
        break;
    }

    await refund.save();

    res.json({
      success: true,
      message: `Tax refund status updated to ${status}`,
      refund,
    });
  } catch (error) {
    console.error("Error updating tax refund status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete tax refund request (admin)
// @route   DELETE /api/admin/tax-refunds/:id
// @access  Private/Superadmin
export const deleteTaxRefund = async (req, res) => {
  try {
    const refund = await TaxRefund.findById(req.params.id);

    if (!refund) {
      return res.status(404).json({ message: "Tax refund request not found" });
    }

    await refund.deleteOne();

    res.json({
      success: true,
      message: "Tax refund request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting tax refund:", error);
    res.status(500).json({ message: "Server error" });
  }
};