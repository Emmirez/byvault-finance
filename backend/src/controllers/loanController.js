import Loan from "../models/Loan.js";
import LoanProduct from "../models/LoanProduct.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getLoanProducts = async (req, res) => {
  try {
    const products = await LoanProduct.find({ isActive: true }).sort({
      type: 1,
      minAmount: 1,
    });

    // Calculate min interest rate for benefits display
    const minInterestRate =
      products.length > 0
        ? Math.min(...products.map((p) => p.interestRate)).toFixed(2)
        : "5.99";

    res.json({
      success: true,
      products,
      minInterestRate,
      approvalTime: "24-48 hours",
      processDescription: "Straightforward application with minimal paperwork",
    });
  } catch (error) {
    console.error("Error fetching loan products:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get user's loan status (active applications)
// @route   GET /api/loan/user-status
// @access  Private
export const getUserLoanStatus = async (req, res) => {
  try {
    const activeLoan = await Loan.findOne({
      user: req.user.id,
      status: { $in: ["pending", "under_review", "approved", "disbursed"] },
    }).sort({ applicationDate: -1 });

    if (!activeLoan) {
      return res.json({
        success: true,
        hasActiveLoan: false,
      });
    }

    res.json({
      success: true,
      hasActiveLoan: true,
      status: activeLoan.status,
      amount: activeLoan.amount,
      loanType: activeLoan.loanType,
      applicationDate: activeLoan.applicationDate,
    });
  } catch (error) {
    console.error("Error fetching user loan status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const applyForLoan = async (req, res) => {
  try {
    const {
      loanType,
      loanProduct,
      amount,
      term,
      purpose,
      employmentStatus = "employed",
      annualIncome,
    } = req.body;

    // Validate required fields
    if (
      !loanType ||
      !loanProduct ||
      !amount ||
      !term ||
      !purpose ||
      !annualIncome
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Check if user already has a pending application
    const existingLoan = await Loan.findOne({
      user: req.user.id,
      status: { $in: ["pending", "under_review"] },
    });

    if (existingLoan) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending loan application",
      });
    }

    // ✅ FETCH THE LOAN PRODUCT FIRST
    const product = await LoanProduct.findOne({ name: loanProduct });
    if (!product) {
      return res.status(400).json({
        success: false,
        message: "Invalid loan product",
      });
    }

    // Validate amount within product limits
    if (amount < product.minAmount || amount > product.maxAmount) {
      return res.status(400).json({
        success: false,
        message: `Loan amount must be between $${product.minAmount.toLocaleString()} and $${product.maxAmount.toLocaleString()}`,
      });
    }

    // Validate term within product limits
    if (term < product.minTerm || term > product.maxTerm) {
      return res.status(400).json({
        success: false,
        message: `Loan term must be between ${product.minTerm} and ${product.maxTerm} months`,
      });
    }

    // Calculate monthly payment
    const monthlyRate = product.interestRate / 100 / 12;
    let monthlyPayment, totalRepayment;

    if (monthlyRate === 0) {
      monthlyPayment = amount / term;
      totalRepayment = amount;
    } else {
      const x = Math.pow(1 + monthlyRate, term);
      monthlyPayment = (amount * monthlyRate * x) / (x - 1);
      totalRepayment = monthlyPayment * term;
    }

    // Create loan application
    const loan = new Loan({
      user: req.user.id,
      loanType,
      loanProduct,
      amount,
      term,
      interestRate: product.interestRate,
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
      purpose,
      employmentStatus,
      annualIncome,
      status: "pending",
      applicationDate: new Date(),
    });

    await loan.save();
    console.log("✅ Loan saved with ID:", loan._id);

    // ✅ CREATE PENDING TRANSACTION HERE
    const user = await User.findById(req.user.id);
    const Transaction = mongoose.model("Transaction");

    const transaction = new Transaction({
      user: user._id,
      type: "loan_application",
      amount: amount,
      status: "pending",
      description: `Loan application - ${loanProduct}`,
      currency: "fiat",
      balanceBefore: user.balanceFiat || 0,
      balanceAfter: user.balanceFiat || 0,
      metadata: {
        loanId: loan._id,
        loanType: loanType,
        loanProduct: loanProduct,
        interestRate: product.interestRate,
        term: term,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      },
    });

    await transaction.save();
    console.log(
      `✅ Pending transaction created for loan application:`,
      transaction._id,
    );

    res.status(201).json({
      success: true,
      message: "Loan application submitted successfully",
      loan: {
        id: loan._id,
        status: loan.status,
        amount: loan.amount,
        term: loan.term,
        monthlyPayment: loan.monthlyPayment,
        totalRepayment: loan.totalRepayment,
        interestRate: loan.interestRate,
      },
    });
  } catch (error) {
    console.error("Error applying for loan:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's loan applications
// @route   GET /api/loan/my-applications
// @access  Private
export const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id }).sort({
      applicationDate: -1,
    });

    res.json({
      success: true,
      loans,
    });
  } catch (error) {
    console.error("Error fetching user loans:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single loan application
// @route   GET /api/loan/:id
// @access  Private
export const getLoanById = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan application not found" });
    }

    res.json({
      success: true,
      loan,
    });
  } catch (error) {
    console.error("Error fetching loan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Cancel loan application (user)
// @route   PUT /api/loan/:id/cancel
// @access  Private
export const cancelLoan = async (req, res) => {
  try {
    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!loan) {
      return res.status(404).json({ message: "Loan application not found" });
    }

    if (!["pending", "under_review"].includes(loan.status)) {
      return res.status(400).json({
        message: "Cannot cancel application at this stage",
      });
    }

    loan.status = "cancelled";
    loan.cancellationReason = req.body.reason || "Cancelled by user";
    await loan.save();

    res.json({
      success: true,
      message: "Loan application cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling loan:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN CONTROLLERS

// @desc    Get all loan applications (admin)
// @route   GET /api/admin/loans
// @access  Private/Admin
export const getAllLoans = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    }

    const loans = await Loan.find(query)
      .populate("user", "firstName lastName email phone")
      .sort({ applicationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Loan.countDocuments(query);

    res.json({
      success: true,
      loans,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get loan details (admin)
// @route   GET /api/admin/loans/:id
// @access  Private/Admin
export const getLoanDetails = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id).populate(
      "user",
      "firstName lastName email phone address",
    );

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    res.json({
      success: true,
      loan,
    });
  } catch (error) {
    console.error("Error fetching loan details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update loan status (admin)
// @route   PUT /api/admin/loans/:id/status
// @access  Private/Admin
// @desc    Update loan status (admin)
// @route   PUT /api/admin/loans/:id/status
// @access  Private/Admin
export const updateLoanStatus = async (req, res) => {
  try {
    const { status, notes, rejectionReason } = req.body;
    const loan = await Loan.findById(req.params.id).populate("user");

    if (!loan) {
      return res.status(404).json({ message: "Loan not found" });
    }

    // Check if status is provided
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required",
      });
    }

    console.log("Updating loan status to:", status);

    // Update status with appropriate timestamps
    loan.status = status;
    loan.notes = notes || loan.notes;

    switch (status) {
      case "under_review":
        loan.reviewDate = new Date();
        break;

      case "approved":
        loan.approvalDate = new Date();
        break;

      case "rejected":
        loan.rejectionReason = rejectionReason || "Application rejected";

        // Update the pending transaction to show rejected
        const TransactionReject = mongoose.model("Transaction");
        const pendingTx = await TransactionReject.findOne({
          user: loan.user._id,
          "metadata.loanId": loan._id,
          type: "loan_application",
        });

        if (pendingTx) {
          pendingTx.status = "failed";
          pendingTx.description = `Loan application rejected - ${loan.loanProduct}`;
          pendingTx.metadata.rejectedAt = new Date();
          pendingTx.metadata.rejectionReason = loan.rejectionReason;
          await pendingTx.save();
          console.log(`✅ Updated transaction to failed for rejected loan`);
        }
        break;

      case "disbursed":
        loan.disbursementDate = new Date();

        const user = await User.findById(loan.user._id);
        if (!user) break;

        const oldBalance = user.balanceFiat || 0;

        // ✅ ADD DEBUG LOGS HERE - BEFORE UPDATE
        console.log(`💰 Old balance: ${oldBalance}`);
        console.log(`💰 Loan amount: ${loan.amount}`);
        console.log(
          `💰 New balance calculation: ${oldBalance} + ${loan.amount} = ${oldBalance + loan.amount}`,
        );

        user.balanceFiat = oldBalance + loan.amount;
        await user.save();

        // ✅ ADD DEBUG LOG HERE - AFTER UPDATE
        console.log(`💰 New balance after save: ${user.balanceFiat}`);

        console.log(`✅ Added $${loan.amount} to user ${user.email} balance`);
        console.log(`Balance updated: $${oldBalance} → $${user.balanceFiat}`);

        await Transaction.create({
          user: user._id,
          type: "loan_disbursement",
          amount: loan.amount,
          status: "completed",
          currency: "fiat",
          description: `Loan disbursed - ${loan.loanProduct}`,
          balanceBefore: oldBalance,
          balanceAfter: user.balanceFiat,
          metadata: {
            loanId: loan._id,
            loanType: loan.loanType,
            loanProduct: loan.loanProduct,
            disbursedAt: new Date(),
            approvedBy: req.user.id,
          },
        });

        console.log(`✅ Loan disbursed & transaction recorded`);
        break;

      case "completed":
        loan.completionDate = new Date();
        break;

      default:
        // For any other status, just update without special handling
        break;
    }

    await loan.save();

    res.json({
      success: true,
      message: `Loan status updated to ${status}`,
      loan,
    });
  } catch (error) {
    console.error("Error updating loan status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete loan (superadmin only)
// @route   DELETE /api/admin/loans/:id
// @access  Private/Superadmin
export const deleteLoan = async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({
        success: false,
        message: "Loan not found",
      });
    }

    await loan.deleteOne();

    res.json({
      success: true,
      message: "Loan deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting loan:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create loan product (admin)
// @route   POST /api/admin/loan-products
// @access  Private/Admin
export const createLoanProduct = async (req, res) => {
  try {
    const {
      name,
      type,
      description,
      interestRate,
      minAmount,
      maxAmount,
      minTerm,
      maxTerm,
      requirements,
      features,
    } = req.body;

    // Check if product already exists
    const existing = await LoanProduct.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Loan product already exists" });
    }

    const product = new LoanProduct({
      name,
      type,
      description,
      interestRate,
      minAmount,
      maxAmount,
      minTerm,
      maxTerm,
      requirements: requirements || [],
      features: features || [],
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: "Loan product created successfully",
      product,
    });
  } catch (error) {
    console.error("Error creating loan product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update loan product (admin)
// @route   PUT /api/admin/loan-products/:id
// @access  Private/Admin
export const updateLoanProduct = async (req, res) => {
  try {
    const product = await LoanProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!product) {
      return res.status(404).json({ message: "Loan product not found" });
    }

    res.json({
      success: true,
      message: "Loan product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error updating loan product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete loan product (admin)
// @route   DELETE /api/admin/loan-products/:id
// @access  Private/Admin
export const deleteLoanProduct = async (req, res) => {
  try {
    const product = await LoanProduct.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Loan product not found" });
    }

    res.json({
      success: true,
      message: "Loan product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting loan product:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Seed initial loan products (admin only)
// @route   POST /api/admin/loan-products/seed
// @access  Private/Superadmin
export const seedLoanProducts = async (req, res) => {
  try {
    const products = [
      {
        name: "Personal Loan",
        type: "personal",
        description:
          "Flexible personal loans for any purpose - from debt consolidation to home improvements",
        interestRate: 8.99,
        minAmount: 1000,
        maxAmount: 50000,
        minTerm: 12,
        maxTerm: 60,
        requirements: [
          "18 years or older",
          "Regular income",
          "Good credit score",
        ],
        features: [
          "No collateral required",
          "Fixed interest rate",
          "Flexible repayment options",
        ],
      },
      {
        name: "Home Loan",
        type: "home",
        description:
          "Finance your dream home with competitive rates and flexible terms",
        interestRate: 5.99,
        minAmount: 50000,
        maxAmount: 1000000,
        minTerm: 60,
        maxTerm: 360,
        requirements: [
          "20% down payment",
          "Stable employment",
          "Good credit history",
        ],
        features: [
          "Fixed or variable rates",
          "Prepayment options",
          "Property insurance included",
        ],
      },
      {
        name: "Auto Loan",
        type: "auto",
        description:
          "Get on the road with our competitive auto financing options",
        interestRate: 6.99,
        minAmount: 5000,
        maxAmount: 100000,
        minTerm: 12,
        maxTerm: 72,
        requirements: [
          "Valid driver's license",
          "Proof of insurance",
          "Income verification",
        ],
        features: [
          "Quick approval",
          "Competitive rates",
          "Flexible down payment",
        ],
      },
      {
        name: "Business Loan",
        type: "business",
        description: "Grow your business with tailored financing solutions",
        interestRate: 9.99,
        minAmount: 10000,
        maxAmount: 500000,
        minTerm: 12,
        maxTerm: 84,
        requirements: [
          "Business registration",
          "2+ years in operation",
          "Business bank statements",
        ],
        features: [
          "No personal collateral",
          "Fast funding",
          "Business support",
        ],
      },
      {
        name: "Health Finance",
        type: "health",
        description: "Cover medical expenses with flexible payment options",
        interestRate: 7.99,
        minAmount: 500,
        maxAmount: 50000,
        minTerm: 6,
        maxTerm: 48,
        requirements: [
          "Medical documentation",
          "Income verification",
          "Credit check",
        ],
        features: ["No upfront payment", "Flexible terms", "Quick approval"],
      },
      {
        name: "Education Loan",
        type: "education",
        description: "Invest in your future with our education financing",
        interestRate: 6.99,
        minAmount: 2000,
        maxAmount: 100000,
        minTerm: 12,
        maxTerm: 120,
        requirements: [
          "Enrollment verification",
          "Income proof",
          "Credit history",
        ],
        features: [
          "Deferred payment options",
          "Competitive rates",
          "Grace period",
        ],
      },
    ];

    await LoanProduct.deleteMany({}); // Clear existing products
    await LoanProduct.insertMany(products);

    res.json({
      success: true,
      message: "Loan products seeded successfully",
      count: products.length,
    });
  } catch (error) {
    console.error("Error seeding loan products:", error);
    res.status(500).json({ message: "Server error" });
  }
};
