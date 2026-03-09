import User from "../models/User.js";
import DepositRequest from "../models/DepositRequest.js";


// Promote user to admin
export const promoteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "superadmin") {
      return res
        .status(400)
        .json({ message: "User is already an admin or superadmin" });
    }

    user.role = "admin";
    await user.save();
    res.json({ message: "User promoted to admin", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Demote admin to user
export const demoteAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role !== "admin") {
      return res.status(400).json({ message: "User is not an admin" });
    }

    user.role = "user";
    await user.save();

    res.json({ message: "Admin demoted to user", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ 
      role: { $in: ["admin", "superadmin"] } 
    }).select("-password -transactionPin")
    
    res.json({ admins })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// Get system statistics
export const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments()
    const totalAdmins = await User.countDocuments({ role: "admin" })
    const totalSuperadmins = await User.countDocuments({ role: "superadmin" })
    const pendingDeposits = await DepositRequest.countDocuments({ status: "pending" })
    
    const totalDeposits = await DepositRequest.aggregate([
      { $match: { status: "approved" } },
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ])

    res.json({
      stats: {
        totalUsers,
        totalAdmins,
        totalSuperadmins,
        pendingDeposits,
        totalDeposited: totalDeposits[0]?.total || 0,
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

// Get admin activity logs
export const getAdminLogs = async (req, res) => {
  try {
    // Get recent approved/rejected deposits with admin info
    const processedDeposits = await DepositRequest.find({ 
      status: { $in: ["approved", "rejected"] } 
    })
    .populate("user", "email")
    .populate("processedBy", "email role")
    .sort({ processedAt: -1 })
    .limit(50)

    res.json({ logs: processedDeposits })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .select("-password -transactionPin")
      .sort({ createdAt: -1 });
    
    res.json({ 
      success: true,
      users 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};