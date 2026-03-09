import Grant from "../models/Grant.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import mongoose from "mongoose";

// @desc    Apply for individual grant
// @route   POST /api/grants/individual/apply
// @access  Private
export const applyIndividualGrant = async (req, res) => {
  try {
    const { requestedAmount, fundingPurposes } = req.body;

    // Validate required fields
    if (!requestedAmount || requestedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid requested amount is required"
      });
    }

    // Check if at least one funding purpose is selected
    const hasPurpose = Object.values(fundingPurposes || {}).some(val => val === true);
    if (!hasPurpose) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one funding purpose"
      });
    }

    // Check if user already has a pending application
    const existingApplication = await Grant.findOne({
      user: req.user.id,
      status: { $in: ["pending", "under_review"] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending grant application"
      });
    }

    // Create grant application
    const grant = new Grant({
      user: req.user.id,
      grantType: "individual",
      requestedAmount,
      individualDetails: {
        fundingPurposes: {
          programFunding: fundingPurposes.programFunding || false,
          equipmentFunding: fundingPurposes.equipmentFunding || false,
          researchFunding: fundingPurposes.researchFunding || false,
          communityOutreach: fundingPurposes.communityOutreach || false,
        },
      },
      status: "pending",
      applicationDate: new Date(),
    });

    await grant.save();

    // Create pending transaction
    const user = await User.findById(req.user.id);
    const transaction = new Transaction({
      user: user._id,
      type: "grant_application",
      amount: requestedAmount,
      status: "pending",
      description: `Individual grant application submitted`,
      currency: "fiat",
      balanceBefore: user.balanceFiat || 0,
      balanceAfter: user.balanceFiat || 0,
      metadata: {
        grantId: grant._id,
        grantType: "individual",
      },
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Grant application submitted successfully",
      grant: {
        id: grant._id,
        status: grant.status,
        requestedAmount: grant.requestedAmount,
        applicationDate: grant.applicationDate,
      },
    });
  } catch (error) {
    console.error("Error applying for individual grant:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Apply for company grant
// @route   POST /api/grants/company/apply
// @access  Private
export const applyCompanyGrant = async (req, res) => {
  try {
    const {
      legalName,
      taxId,
      organizationType,
      foundingYear,
      mailingAddress,
      contactPhone,
      contactPerson,
      missionStatement,
      dateOfIncorporation,
      projectTitle,
      projectDescription,
      expectedOutcomes,
      requestedAmount,
    } = req.body;

    // Validate required fields
    const requiredFields = {
      legalName, taxId, organizationType, foundingYear,
      mailingAddress, contactPhone, contactPerson, missionStatement,
      dateOfIncorporation, projectTitle, projectDescription,
      expectedOutcomes, requestedAmount
    };

    for (const [field, value] of Object.entries(requiredFields)) {
      if (!value) {
        return res.status(400).json({
          success: false,
          message: `${field} is required`
        });
      }
    }

    if (requestedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid requested amount is required"
      });
    }

    // Check if user already has a pending application
    const existingApplication = await Grant.findOne({
      user: req.user.id,
      status: { $in: ["pending", "under_review"] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending grant application"
      });
    }

    // Create grant application
    const grant = new Grant({
      user: req.user.id,
      grantType: "company",
      requestedAmount,
      companyDetails: {
        legalName,
        taxId,
        organizationType,
        foundingYear,
        mailingAddress,
        contactPhone,
        contactPerson,
        missionStatement,
        dateOfIncorporation,
        projectTitle,
        projectDescription,
        expectedOutcomes,
      },
      status: "pending",
      applicationDate: new Date(),
    });

    await grant.save();

    // Create pending transaction
    const user = await User.findById(req.user.id);
    const transaction = new Transaction({
      user: user._id,
      type: "grant_application",
      amount: requestedAmount,
      status: "pending",
      description: `Company grant application - ${legalName}`,
      currency: "fiat",
      balanceBefore: user.balanceFiat || 0,
      balanceAfter: user.balanceFiat || 0,
      metadata: {
        grantId: grant._id,
        grantType: "company",
        companyName: legalName,
      },
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: "Grant application submitted successfully",
      grant: {
        id: grant._id,
        status: grant.status,
        requestedAmount: grant.requestedAmount,
        applicationDate: grant.applicationDate,
      },
    });
  } catch (error) {
    console.error("Error applying for company grant:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's grant applications
// @route   GET /api/grants/my-applications
// @access  Private
export const getUserGrants = async (req, res) => {
  try {
    const grants = await Grant.find({ user: req.user.id })
      .sort({ applicationDate: -1 });

    res.json({
      success: true,
      grants,
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single grant application
// @route   GET /api/grants/:id
// @access  Private
export const getGrantById = async (req, res) => {
  try {
    const grant = await Grant.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!grant) {
      return res.status(404).json({ message: "Grant application not found" });
    }

    res.json({
      success: true,
      grant,
    });
  } catch (error) {
    console.error("Error fetching grant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel grant application (user)
// @route   PUT /api/grants/:id/cancel
// @access  Private
export const cancelGrant = async (req, res) => {
  try {
    const grant = await Grant.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!grant) {
      return res.status(404).json({ message: "Grant application not found" });
    }

    if (!["pending", "under_review"].includes(grant.status)) {
      return res.status(400).json({
        message: "Cannot cancel application at this stage"
      });
    }

    grant.status = "cancelled";
    grant.notes = req.body.reason || "Cancelled by user";
    await grant.save();

    // Update transaction
    const Transaction = mongoose.model('Transaction');
    const pendingTx = await Transaction.findOne({
      user: grant.user,
      'metadata.grantId': grant._id,
    });

    if (pendingTx) {
      pendingTx.status = 'failed';
      pendingTx.description = 'Grant application cancelled';
      await pendingTx.save();
    }

    res.json({
      success: true,
      message: "Grant application cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling grant:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN CONTROLLERS

// @desc    Get all grant applications (admin)
// @route   GET /api/admin/grants
// @access  Private/Admin
export const getAllGrants = async (req, res) => {
  try {
    const { status, type, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }
    if (type && type !== "all") {
      query.grantType = type;
    }

    const grants = await Grant.find(query)
      .populate("user", "firstName lastName email")
      .sort({ applicationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Grant.countDocuments(query);

    res.json({
      success: true,
      grants,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching grants:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single grant application (admin)
// @route   GET /api/admin/grants/:id
// @access  Private/Admin
export const getGrantDetails = async (req, res) => {
  try {
    const grant = await Grant.findById(req.params.id)
      .populate("user", "firstName lastName email phone");

    if (!grant) {
      return res.status(404).json({ message: "Grant application not found" });
    }

    res.json({
      success: true,
      grant,
    });
  } catch (error) {
    console.error("Error fetching grant details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update grant status (admin)
// @route   PUT /api/admin/grants/:id/status
// @access  Private/Admin
export const updateGrantStatus = async (req, res) => {
  try {
    const { status, notes, rejectionReason, approvedAmount } = req.body;
    const grant = await Grant.findById(req.params.id).populate("user");

    if (!grant) {
      return res.status(404).json({ message: "Grant application not found" });
    }

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    console.log("Updating grant status to:", status);

    grant.status = status;
    grant.notes = notes || grant.notes;

    switch (status) {
      case "under_review":
        grant.reviewDate = new Date();
        break;

      case "approved":
        grant.approvalDate = new Date();
        if (approvedAmount) {
          grant.approvedAmount = approvedAmount;
        } else {
          grant.approvedAmount = grant.requestedAmount;
        }
        break;

      case "rejected":
        grant.rejectionReason = rejectionReason || "Application rejected";
        break;

      case "disbursed":
        grant.disbursementDate = new Date();

        // Update user balance
        const user = await User.findById(grant.user._id);
        if (user && grant.approvedAmount > 0) {
          const oldBalance = user.balanceFiat || 0;
          user.balanceFiat = oldBalance + grant.approvedAmount;
          await user.save();

          console.log(`✅ Added $${grant.approvedAmount} to user ${user.email}`);
          console.log(`Balance: $${oldBalance} → $${user.balanceFiat}`);

          // Update transaction
          const Transaction = mongoose.model('Transaction');
          const pendingTx = await Transaction.findOne({
            user: user._id,
            'metadata.grantId': grant._id,
          });

          if (pendingTx) {
            pendingTx.status = 'completed';
            pendingTx.type = 'deposit';
            pendingTx.amount = grant.approvedAmount;
            pendingTx.description = `Grant disbursed - ${grant.grantType === 'individual' ? 'Individual' : grant.companyDetails?.legalName || 'Company'} Grant`;
            pendingTx.balanceAfter = user.balanceFiat;
            pendingTx.metadata.disbursedAt = new Date();
            pendingTx.metadata.disbursedBy = req.user.id;
            await pendingTx.save();
          } else {
            const transaction = new Transaction({
              user: user._id,
              type: 'deposit',
              amount: grant.approvedAmount,
              status: 'completed',
              description: `Grant disbursed - ${grant.grantType === 'individual' ? 'Individual' : 'Company'} Grant`,
              currency: 'fiat',
              balanceBefore: oldBalance,
              balanceAfter: user.balanceFiat,
              metadata: {
                grantId: grant._id,
                grantType: grant.grantType,
                disbursedAt: new Date(),
              },
            });
            await transaction.save();
          }
        }
        break;
    }

    await grant.save();

    res.json({
      success: true,
      message: `Grant status updated to ${status}`,
      grant,
    });
  } catch (error) {
    console.error("Error updating grant status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete grant application (admin)
// @route   DELETE /api/admin/grants/:id
// @access  Private/Superadmin
export const deleteGrant = async (req, res) => {
  try {
    const grant = await Grant.findById(req.params.id);

    if (!grant) {
      return res.status(404).json({ message: "Grant application not found" });
    }

    await grant.deleteOne();

    res.json({
      success: true,
      message: "Grant application deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting grant:", error);
    res.status(500).json({ message: "Server error" });
  }
};