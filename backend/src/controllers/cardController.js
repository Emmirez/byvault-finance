import Card from "../models/Card.js";
import User from "../models/User.js";
import { createSystemAlert } from "./adminAlertController.js";


export const applyForCard = async (req, res) => {
  try {
    const { cardType, cardBrand } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user already has a pending application
    const pendingCard = await Card.findOne({
      user: user._id,
      status: "pending"
    });

    if (pendingCard) {
      return res.status(400).json({
        message: "You already have a pending card application"
      });
    }

    // Generate card details
    const cardNumber = Card.generateCardNumber(cardType);
    const maskedNumber = Card.maskCardNumber(cardNumber);
    const { month, year } = Card.generateExpiry();
    const cvv = Card.generateCVV();

    const card = new Card({
      user: user._id,
      cardType: cardType || "visa",
      cardBrand: cardBrand || "virtual",
      cardNumber,
      maskedNumber,
      cardholderName: `${user.firstName} ${user.lastName}`.toUpperCase(),
      expiryMonth: month,
      expiryYear: year,
      cvv,
      status: "pending",
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 3))
    });

    await card.save();

     //  ADD ADMIN ALERT 
    await createSystemAlert("card_application", {
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      cardId: card._id,
      cardType: card.cardType,
      cardBrand: card.cardBrand,
      maskedNumber: card.maskedNumber,
    });

    res.status(201).json({
      success: true,
      message: "Card application submitted successfully",
      card: {
        id: card._id,
        status: card.status,
        maskedNumber: card.maskedNumber,
        cardType: card.cardType
      }
    });
  } catch (error) {
    console.error("Error applying for card:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getUserCards = async (req, res) => {
  try {
    const cards = await Card.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.json({
      success: true,
      cards
    });
  } catch (error) {
    console.error("Error fetching cards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single card details
// @route   GET /api/cards/:id
// @access  Private
export const getCardDetails = async (req, res) => {
  try {
    const card = await Card.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Only show full details if card is active
    if (card.status === "active") {
      res.json({
        success: true,
        card: {
          ...card.toObject(),
          cardNumber: card.cardNumber, // Full number only for active cards
          cvv: card.cvv // CVV only for active cards
        }
      });
    } else {
      res.json({
        success: true,
        card: {
          ...card.toObject(),
          cardNumber: card.maskedNumber, // Masked for pending/rejected
          cvv: "***" // Hidden for pending/rejected
        }
      });
    }
  } catch (error) {
    console.error("Error fetching card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ADMIN CONTROLLERS

// @desc    Get all pending card applications
// @route   GET /api/admin/cards/pending
// @access  Private/Admin
export const getPendingCards = async (req, res) => {
  try {
    const cards = await Card.find({ status: "pending" })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      cards
    });
  } catch (error) {
    console.error("Error fetching pending cards:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Approve card application
// @route   PUT /api/admin/cards/:id/approve
// @access  Private/Admin
export const approveCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).populate("user");

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.status !== "pending") {
      return res.status(400).json({ message: "Card is not pending" });
    }

    card.status = "active";
    card.activatedAt = new Date();

    await card.save();

    res.json({
      success: true,
      message: "Card approved successfully",
      card: {
        id: card._id,
        status: card.status,
        maskedNumber: card.maskedNumber
      }
    });
  } catch (error) {
    console.error("Error approving card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Reject card application
// @route   PUT /api/admin/cards/:id/reject
// @access  Private/Admin
export const rejectCard = async (req, res) => {
  try {
    const { reason } = req.body;
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (card.status !== "pending") {
      return res.status(400).json({ message: "Card is not pending" });
    }

    card.status = "rejected";
    card.metadata = {
      ...card.metadata,
      rejectionReason: reason || "Application rejected",
      reviewedAt: new Date()
    };

    await card.save();

    res.json({
      success: true,
      message: "Card application rejected",
      card: {
        id: card._id,
        status: card.status
      }
    });
  } catch (error) {
    console.error("Error rejecting card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllCards = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      cardType,
      cardBrand,
      search,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    console.log("📊 Fetching cards with filters:", {
      page,
      limit,
      status,
      cardType,
      cardBrand,
      search,
    });

    // Build filter object
    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (cardType && cardType !== "all") {
      filter.cardType = cardType;
    }

    if (cardBrand && cardBrand !== "all") {
      filter.cardBrand = cardBrand;
    }

    // Search by cardholder name or masked number
    if (search) {
      filter.$or = [
        { cardholderName: { $regex: search, $options: "i" } },
        { maskedNumber: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sort = { [sortBy]: sortOrder === "desc" ? -1 : 1 };

    // Get cards with user details
    const cards = await Card.find(filter)
      .populate("user", "firstName lastName email accountId")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    // Get total count
    const total = await Card.countDocuments(filter);

    // Get statistics
    const stats = {
      total: await Card.countDocuments(),
      pending: await Card.countDocuments({ status: "pending" }),
      active: await Card.countDocuments({ status: "active" }),
      blocked: await Card.countDocuments({ status: "blocked" }),
      rejected: await Card.countDocuments({ status: "rejected" }),
      expired: await Card.countDocuments({ status: "expired" }),
    };

    console.log(`✅ Found ${cards.length} cards (total: ${total})`);

    res.json({
      success: true,
      cards,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("❌ Error fetching cards:", error);
    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    await card.deleteOne();

    res.json({
      success: true,
      message: "Card deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting card:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Block/Unblock card
// @route   PUT /api/admin/cards/:id/toggle-block
export const toggleBlockCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    card.status = card.status === "blocked" ? "active" : "blocked";
    await card.save();

    res.json({
      success: true,
      message: `Card ${card.status === "blocked" ? "blocked" : "unblocked"} successfully`,
      card: {
        id: card._id,
        status: card.status
      }
    });
  } catch (error) {
    console.error("Error toggling card block:", error);
    res.status(500).json({ message: "Server error" });
  }
};