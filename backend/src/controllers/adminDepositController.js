import DepositRequest from "../models/DepositRequest.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import AccountLimit from "../models/AccountLimit.js";

// Get all deposit requests (admin)
export const getAllDeposits = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const query = {};
    if (status) query.status = status;

    const deposits = await DepositRequest.find(query)
      .populate("user", "firstName lastName email accountId balanceFiat")
      .populate("processedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DepositRequest.countDocuments(query);

    res.json({
      deposits,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching deposits:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single deposit request (admin)
export const getDepositDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const deposit = await DepositRequest.findById(id)
      .populate("user", "firstName lastName email accountId balanceFiat phone")
      .populate("processedBy", "firstName lastName email");

    if (!deposit) {
      return res.status(404).json({ message: "Deposit request not found" });
    }

    res.json({ deposit });
  } catch (error) {
    console.error("Error fetching deposit details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Approve deposit request
export const approveDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    const deposit = await DepositRequest.findById(id).populate("user");

    if (!deposit) {
      return res.status(404).json({ message: "Deposit request not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: `Deposit already ${deposit.status}` });
    }

    const user = deposit.user;
    const amount = deposit.amount;

    // Update user's balance
    const balanceBefore = user.balanceFiat || 0;
    const balanceAfter = balanceBefore + amount;

    user.balanceFiat = balanceAfter;
    await user.save();

    // Update account limits (if tracking deposits in limits)
    const accountLimits = await AccountLimit.findOne({ user: user._id });
    if (accountLimits) {
      // Optional: Update deposit limits if you track them
      await accountLimits.save();
    }

    // Update deposit request
    deposit.status = "approved";
    deposit.processedBy = adminId;
    deposit.processedAt = new Date();
    if (notes) deposit.adminNotes = notes;
    await deposit.save();

    // Create completed transaction
    const transaction = await Transaction.create({
      user: user._id,
      type: "deposit",
      currency: "fiat",
      amount,
      status: "completed",
      description: `Deposit via ${deposit.method} - Approved`,
      balanceBefore,
      balanceAfter,
      metadata: {
        depositRequestId: deposit._id,
        transactionId: deposit.transactionId,
        approvedBy: adminId,
      },
    });

    // Update pending transaction if exists
    await Transaction.findOneAndUpdate(
      { "metadata.depositRequestId": deposit._id, status: "pending" },
      { status: "completed", balanceBefore, balanceAfter }
    );

    res.json({
      success: true,
      message: "Deposit approved successfully",
      deposit,
      transaction,
    });
  } catch (error) {
    console.error("Error approving deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Reject deposit request
export const rejectDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id;

    const deposit = await DepositRequest.findById(id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit request not found" });
    }

    if (deposit.status !== "pending") {
      return res.status(400).json({ message: `Deposit already ${deposit.status}` });
    }

    // Update deposit request
    deposit.status = "rejected";
    deposit.processedBy = adminId;
    deposit.processedAt = new Date();
    deposit.adminNotes = notes || "Payment verification failed";
    await deposit.save();

    // Update pending transaction
    await Transaction.findOneAndUpdate(
      { "metadata.depositRequestId": deposit._id, status: "pending" },
      { status: "failed", description: `Deposit rejected: ${notes || "Verification failed"}` }
    );

    res.json({
      success: true,
      message: "Deposit rejected",
      deposit,
    });
  } catch (error) {
    console.error("Error rejecting deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get deposit statistics (admin dashboard)
export const getDepositStats = async (req, res) => {
  try {
    const stats = await DepositRequest.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayDeposits = await DepositRequest.aggregate([
      {
        $match: {
          createdAt: { $gte: today },
          status: "approved",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]);

    const pendingCount = await DepositRequest.countDocuments({ status: "pending" });

    res.json({
      stats,
      today: todayDeposits[0] || { total: 0, count: 0 },
      pendingCount,
    });
  } catch (error) {
    console.error("Error fetching deposit stats:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete deposit request (superadmin only)
export const deleteDeposit = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const deposit = await DepositRequest.findById(id);

    if (!deposit) {
      return res.status(404).json({ message: "Deposit request not found" });
    }

    // Only superadmin can delete
    if (req.user.role !== "superadmin") {
      return res.status(403).json({ message: "Superadmin privileges required" });
    }

    // Store info for logging
    const depositInfo = {
      id: deposit._id,
      amount: deposit.amount,
      user: deposit.user,
      status: deposit.status,
    };

    // Delete the receipt file if it exists
    if (deposit.receiptUrl) {
      const filePath = path.join(__dirname, "..", deposit.receiptUrl);
      fs.unlink(filePath, (err) => {
        if (err) console.error("Error deleting receipt file:", err);
      });
    }

    // Delete the deposit request
    await deposit.deleteOne();

    // Log the action (you could create an admin log model)
    console.log(`Superadmin ${adminId} deleted deposit ${id}:`, depositInfo);

    res.json({
      success: true,
      message: "Deposit request deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting deposit:", error);
    res.status(500).json({ message: "Server error" });
  }
};
