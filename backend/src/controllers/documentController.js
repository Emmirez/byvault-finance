// src/controllers/documentController.js
import Document from "../models/Document.js";
import User from "../models/User.js";
import { logActivity } from "./activityController.js";
import { createNotification } from "./notificationsController.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

// @desc    Upload document (user)
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  try {
    const { documentType, description } = req.body;
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user-documents",
      resource_type: "auto",
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    const document = new Document({
      user: req.user.id,
      documentType,
      fileName: req.file.originalname,
      fileUrl: result.secure_url,
      fileSize: req.file.size,
      mimeType: req.file.mimetype,
      publicId: result.public_id,
      description,
      status: "pending",
    });

    await document.save();

    await logActivity({
      userId: req.user.id,
      type: "document_upload",
      title: "Document Uploaded",
      description: `Uploaded ${documentType.replace(/_/g, ' ')}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        documentId: document._id,
        documentType,
        fileName: req.file.originalname,
      },
    });

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error("Error uploading document:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get user's documents (user)
// @route   GET /api/documents
// @access  Private
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      documents,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single document (user)
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete document (user)
// @route   DELETE /api/documents/:id
// @access  Private
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete from Cloudinary
    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId);
    }

    await document.deleteOne();

    await logActivity({
      userId: req.user.id,
      type: "document_delete",
      title: "Document Deleted",
      description: `Deleted ${document.documentType.replace(/_/g, ' ')}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ADMIN CONTROLLERS

// @desc    Get all documents (admin)
// @route   GET /api/admin/documents
// @access  Private/Admin
export const getAllDocuments = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      status,
      documentType,
      userId,
      search,
      startDate,
      endDate,
    } = req.query;

    const filter = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (documentType && documentType !== "all") {
      filter.documentType = documentType;
    }

    if (userId) {
      filter.user = userId;
    }

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.createdAt.$lte = end;
      }
    }

    if (search) {
      filter.$or = [
        { fileName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const documents = await Document.find(filter)
      .populate("user", "firstName lastName email")
      .populate("verifiedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const total = await Document.countDocuments(filter);

    // Get statistics
    const stats = {
      total: await Document.countDocuments(),
      pending: await Document.countDocuments({ status: "pending" }),
      verified: await Document.countDocuments({ status: "verified" }),
      rejected: await Document.countDocuments({ status: "rejected" }),
      byType: await Document.aggregate([
        { $group: { _id: "$documentType", count: { $sum: 1 } } },
      ]),
    };

    res.json({
      success: true,
      documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single document (admin)
// @route   GET /api/admin/documents/:id
// @access  Private/Admin
export const getDocumentDetails = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate("user", "firstName lastName email phone")
      .populate("verifiedBy", "firstName lastName email");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Error fetching document details:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Verify document (admin)
// @route   PUT /api/admin/documents/:id/verify
// @access  Private/Admin
export const verifyDocument = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const document = await Document.findById(req.params.id).populate("user");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const oldStatus = document.status;

    document.status = status;
    document.verifiedAt = new Date();
    document.verifiedBy = req.user.id;

    if (status === "rejected") {
      document.rejectionReason = rejectionReason || "Document did not meet requirements";
    }

    await document.save();

    // Create notification for user
    await createNotification({
      userId: document.user._id,
      type: status === "verified" ? "document_verified" : "document_rejected",
      title: status === "verified" ? "Document Verified" : "Document Rejected",
      message: status === "verified"
        ? `Your ${document.documentType.replace(/_/g, ' ')} has been verified.`
        : `Your ${document.documentType.replace(/_/g, ' ')} was rejected. Reason: ${document.rejectionReason}`,
      priority: status === "verified" ? "medium" : "high",
      metadata: {
        documentId: document._id,
        documentType: document.documentType,
      },
    });

    await logActivity({
      userId: document.user._id,
      type: "admin_document_verify",
      title: `Document ${status}`,
      description: `Admin ${status} ${document.documentType.replace(/_/g, ' ')}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user.id,
      metadata: {
        documentId: document._id,
        oldStatus,
        newStatus: status,
      },
    });

    res.json({
      success: true,
      message: `Document ${status} successfully`,
      document,
    });
  } catch (error) {
    console.error("Error verifying document:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete document (admin)
// @route   DELETE /api/admin/documents/:id
// @access  Private/Superadmin
export const adminDeleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate("user");

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // Delete from Cloudinary
    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId);
    }

    await document.deleteOne();

    await logActivity({
      userId: document.user._id,
      type: "admin_document_delete",
      title: "Document Deleted by Admin",
      description: `Admin deleted ${document.documentType.replace(/_/g, ' ')}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      performedBy: req.user.id,
      metadata: {
        documentId: document._id,
        documentType: document.documentType,
      },
    });

    res.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get document statistics
// @route   GET /api/admin/documents/stats
// @access  Private/Admin
export const getDocumentStats = async (req, res) => {
  try {
    const stats = await Document.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: { $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] } },
          verified: { $sum: { $cond: [{ $eq: ["$status", "verified"] }, 1, 0] } },
          rejected: { $sum: { $cond: [{ $eq: ["$status", "rejected"] }, 1, 0] } },
        },
      },
    ]);

    const byType = await Document.aggregate([
      {
        $group: {
          _id: "$documentType",
          count: { $sum: 1 },
        },
      },
    ]);

    const recentUploads = await Document.find()
      .populate("user", "firstName lastName")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: stats[0] || { total: 0, pending: 0, verified: 0, rejected: 0 },
      byType,
      recentUploads,
    });
  } catch (error) {
    console.error("Error fetching document stats:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};