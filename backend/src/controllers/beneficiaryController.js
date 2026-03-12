// src/controllers/beneficiaryController.js
import Beneficiary from "../models/Beneficiary.js";

// GET /api/beneficiaries
export const getBeneficiaries = async (req, res) => {
  try {
    const beneficiaries = await Beneficiary.find({ user: req.user._id }).sort({
      updatedAt: -1,
    });
    res.json({ success: true, beneficiaries });
  } catch (error) {
    console.error("getBeneficiaries error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch beneficiaries" });
  }
};

// POST /api/beneficiaries
export const saveBeneficiary = async (req, res) => {
  try {
    const {
      type = "local",
      name,
      accountNumber = "",
      bankName = "",
      routingNumber = "",
      swiftCode = "",
      address = "",
      email = "",
      phone = "",
      cashtag = "",
      walletAddress = "",
      raw = {},
    } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    // Duplicate check
    const query = { user: req.user._id };
    if (email) query.email = email.toLowerCase().trim();
    else if (phone) query.phone = phone.trim();
    else if (cashtag) query.cashtag = cashtag.trim();
    else if (walletAddress) query.walletAddress = walletAddress.trim();
    else if (accountNumber && bankName) {
      query.accountNumber = accountNumber.trim();
      query.bankName = bankName.trim();
    }

    const exists = Object.keys(query).length > 1
      ? await Beneficiary.findOne(query)
      : null;

    if (exists) {
      return res.status(409).json({
        success: false,
        message: `${exists.name} is already saved as a beneficiary`,
      });
    }

    const beneficiary = await Beneficiary.create({
      user: req.user._id,
      type,
      name: name.trim(),
      accountNumber: accountNumber.trim(),
      bankName: bankName.trim(),
      routingNumber: routingNumber.trim(),
      swiftCode: swiftCode.trim(),
      address: address.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      cashtag: cashtag.trim(),
      walletAddress: walletAddress.trim(),
      raw,
    });

    res.status(201).json({ success: true, beneficiary });
  } catch (error) {
    console.error("saveBeneficiary error:", error);
    res.status(500).json({ success: false, message: "Failed to save beneficiary" });
  }
};

// DELETE /api/beneficiaries/:id
export const deleteBeneficiary = async (req, res) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!beneficiary) {
      return res.status(404).json({ success: false, message: "Beneficiary not found" });
    }

    res.json({ success: true, message: "Beneficiary deleted" });
  } catch (error) {
    console.error("deleteBeneficiary error:", error);
    res.status(500).json({ success: false, message: "Failed to delete beneficiary" });
  }
};