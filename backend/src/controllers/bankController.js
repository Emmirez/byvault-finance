// controllers/bankController.js
import User from "../models/User.js";


export const getBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "bankDetails firstName lastName email accountId accountNumber btcDepositAddress"
    );
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Log the raw bankDetails to see what's there
    console.log("Raw bankDetails:", user.bankDetails);
    console.log("Raw accountNumber:", user.bankDetails?.accountNumber);

    // Return bank details
    res.json({
      success: true,
      data: {
        accountName: user.bankDetails?.accountName || `${user.firstName} ${user.lastName}`,
        accountNumber:
          user.bankDetails?.accountNumber ||
          user.accountId ||
          user.accountNumber ||
          "Not provided",
        bankName: user.bankDetails?.bankName || "Byvault Finance Bank",
        routingNumber: user.bankDetails?.routingNumber || "021000021",
        swiftCode: user.bankDetails?.swiftCode || "BYVAUS33",
        iban: user.bankDetails?.iban || "",
        bankAddress: user.bankDetails?.bankAddress || "800 Nicollet Mall Minneapolis, MN 55304 United States",
        bitcoinWallet: user.btcDepositAddress || "bc1qyf5ae8kzuxh8y7axd9yxnmmyh3q3g4eqs3j9ag",
      }
    });
  } catch (error) {
    console.error("Error fetching bank details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const updateBankDetails = async (req, res) => {
  try {
    const {
      bankName,
      accountName,
      accountNumber,
      routingNumber,
      swiftCode,
      iban,
      bankAddress
    } = req.body.bankDetails; // ✅ THIS IS THE FIX

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.bankDetails = {
      bankName: bankName ?? user.bankDetails?.bankName,
      accountName: accountName ?? user.bankDetails?.accountName,
      accountNumber: accountNumber ?? user.bankDetails?.accountNumber,
      routingNumber: routingNumber ?? user.bankDetails?.routingNumber,
      swiftCode: swiftCode ?? user.bankDetails?.swiftCode,
      iban: iban ?? user.bankDetails?.iban,
      bankAddress: bankAddress ?? user.bankDetails?.bankAddress,
    };

    await user.save();

    res.json({
      success: true,
      message: "Bank details updated successfully",
      data: user.bankDetails
    });
  } catch (error) {
    console.error("Error updating bank details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const getUserBankDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select("bankDetails firstName lastName email");
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      data: {
        userId: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        ...user.bankDetails
      }
    });
  } catch (error) {
    console.error("Error fetching user bank details:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};