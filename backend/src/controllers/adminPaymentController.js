// controllers/adminPaymentController.js
import Transaction from "../models/Transaction.js";

// @desc    Get all pending deposits
// @route   GET /api/admin/payments/pending
// @access  Private/Admin
export const getPendingDeposits = async (req, res) => {
  try {
    const pendingDeposits = await Transaction.find({
      type: "deposit",
      currency: "btc",
      status: "pending",
    })
      .populate("user", "email firstName lastName balanceBTC")
      .sort({ createdAt: -1 });

    const formattedDeposits = pendingDeposits.map((deposit) => ({
      id: deposit._id,
      user: {
        id: deposit.user._id,
        name: `${deposit.user.firstName || ""} ${deposit.user.lastName || ""}`.trim(),
        email: deposit.user.email,
        currentBalance: deposit.user.balanceBTC,
      },
      amount: deposit.amount,
      date: deposit.createdAt,
      proof: deposit.metadata?.paymentProof,
      walletAddress: deposit.metadata?.walletAddress,
      description: deposit.description,
    }));

    res.json({
      success: true,
      deposits: formattedDeposits,
    });
  } catch (error) {
    console.error("Error fetching pending deposits:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update deposit details before accepting
// @route   PUT /api/admin/payments/:id/update
// @access  Private/Admin
export const updateDeposit = async (req, res) => {
  try {
    const { amount, txId, image, date } = req.body;
    const deposit = await Transaction.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    // Initialize metadata if it doesn't exist
    if (!deposit.metadata) {
      deposit.metadata = {};
    }

    // Update fields if provided
    if (amount) deposit.amount = amount;
    if (txId) deposit.metadata.txId = txId;
    if (image) deposit.metadata.paymentProof = image;
    if (date) deposit.createdAt = new Date(date);

    await deposit.save();

    res.json({
      success: true,
      message: "Deposit updated successfully",
      deposit: {
        id: deposit._id,
        amount: deposit.amount,
        status: deposit.status,
        date: deposit.createdAt,
        metadata: deposit.metadata,
      },
    });
  } catch (error) {
    console.error("Error updating deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Accept deposit
// @route   PUT /api/admin/payments/:id/accept
// @access  Private/Admin
export const acceptDeposit = async (req, res) => {
  try {
    const { amount, txId } = req.body;
    const deposit = await Transaction.findById(req.params.id).populate("user");

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit is not pending" });
    }

    const user = deposit.user;

    // Update transaction
    deposit.status = "completed";
    deposit.balanceAfter = user.balanceBTC + (amount || deposit.amount);
    deposit.metadata = {
      ...deposit.metadata,
      txId: txId || deposit.metadata?.txId,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
      confirmations: 3,
    };

    // Update user's BTC balance
    user.balanceBTC = (user.balanceBTC || 0) + (amount || deposit.amount);

    await Promise.all([deposit.save(), user.save()]);

    res.json({
      success: true,
      message: "Deposit accepted successfully",
      deposit: {
        id: deposit._id,
        status: deposit.status,
        newBalance: user.balanceBTC,
      },
    });
  } catch (error) {
    console.error("Error accepting deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reject deposit
// @route   PUT /api/admin/payments/:id/reject
// @access  Private/Admin
export const rejectDeposit = async (req, res) => {
  try {
    const { reason } = req.body;
    const deposit = await Transaction.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: "Deposit is not pending" });
    }

    deposit.status = "rejected";
    deposit.metadata = {
      ...deposit.metadata,
      rejectionReason: reason || "Payment proof invalid",
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    };

    await deposit.save();

    res.json({
      success: true,
      message: "Deposit rejected",
      deposit: {
        id: deposit._id,
        status: deposit.status,
      },
    });
  } catch (error) {
    console.error("Error rejecting deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel deposit
// @route   PUT /api/admin/payments/:id/cancel
// @access  Private/Admin
export const cancelDeposit = async (req, res) => {
  try {
    const { reason } = req.body;
    const deposit = await Transaction.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    deposit.status = "cancelled";
    deposit.metadata = {
      ...deposit.metadata,
      cancellationReason: reason || "Cancelled by admin",
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    };

    await deposit.save();

    res.json({
      success: true,
      message: "Deposit cancelled",
      deposit: {
        id: deposit._id,
        status: deposit.status,
      },
    });
  } catch (error) {
    console.error("Error cancelling deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllPayments = async (req, res) => {
  try {
    const payments = await Transaction.find({
      type: "deposit",
      currency: "btc",
    })
      .populate("user", "email firstName lastName balanceBTC")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Error fetching all payments:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete payment (superadmin)
// @route   DELETE /api/superadmin/payments/:id
// @access  Private/Superadmin
export const deletePayment = async (req, res) => {
  try {
    const payment = await Transaction.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    await payment.deleteOne();

    res.json({
      success: true,
      message: "Payment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get deposit details
// @route   GET /api/admin/payments/:id
// @access  Private/Admin
export const getDepositDetails = async (req, res) => {
  try {
    const deposit = await Transaction.findById(req.params.id).populate(
      "user",
      "email firstName lastName balanceBTC",
    );

    if (!deposit) {
      return res.status(404).json({ message: "Deposit not found" });
    }

    res.json({
      success: true,
      deposit: {
        id: deposit._id,
        user: {
          id: deposit.user._id,
          name: `${deposit.user.firstName || ""} ${deposit.user.lastName || ""}`.trim(),
          email: deposit.user.email,
          currentBalance: deposit.user.balanceBTC,
        },
        amount: deposit.amount,
        status: deposit.status,
        date: deposit.createdAt,
        proof: deposit.metadata?.paymentProof,
        walletAddress: deposit.metadata?.walletAddress,
        description: deposit.description,
        metadata: deposit.metadata,
      },
    });
  } catch (error) {
    console.error("Error fetching deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};
