import KYC from "../models/KYC.js";
import User from "../models/User.js";
import { createNotification } from "./notificationsController.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";
import { createSystemAlert } from "./adminAlertController.js";

export const submitKYC = async (req, res) => {
  try {
    console.log("=== KYC Submission Started ===");
    console.log("User ID:", req.user.id);
    console.log("Request body:", req.body);
    console.log("Request files:", req.files);

    const {
      personalInfo,
      addressInfo,
      employmentInfo,
      documentType,
      documentNumber,
    } = req.body;

    // Parse JSON strings if they came as strings
    const parsedPersonalInfo =
      typeof personalInfo === "string"
        ? JSON.parse(personalInfo)
        : personalInfo;
    const parsedAddressInfo =
      typeof addressInfo === "string" ? JSON.parse(addressInfo) : addressInfo;
    const parsedEmploymentInfo =
      typeof employmentInfo === "string"
        ? JSON.parse(employmentInfo)
        : employmentInfo;

    console.log("Parsed data:", {
      personalInfo: parsedPersonalInfo,
      addressInfo: parsedAddressInfo,
      employmentInfo: parsedEmploymentInfo,
      documentType,
      documentNumber,
    });

    // Check if files were uploaded
    if (!req.files || !req.files.frontImage || !req.files.selfie) {
      console.log("❌ Missing required files");

      //  ADD ADMIN ALERT: Missing documents
      await createSystemAlert("kyc_missing_documents", {
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        reason: "Missing required documents",
      });

      return res.status(400).json({
        success: false,
        message: "Please upload required documents",
      });
    }

    console.log("Files received:", {
      frontImage: req.files.frontImage[0].originalname,
      selfie: req.files.selfie[0].originalname,
      backImage: req.files.backImage
        ? req.files.backImage[0].originalname
        : null,
    });

    // Check if user already has KYC
    const existingKYC = await KYC.findOne({ user: req.user.id });
    console.log("Existing KYC:", existingKYC ? "Found" : "None");

    if (existingKYC && existingKYC.status === "verified") {
      return res.status(400).json({
        success: false,
        message: "You are already verified",
      });
    }

    if (existingKYC && existingKYC.status === "pending") {
      return res.status(400).json({
        success: false,
        message: "You already have a pending KYC application",
      });
    }

    // Upload images to Cloudinary
    let frontImageUrl = "";
    let frontImagePublicId = "";
    let backImageUrl = "";
    let backImagePublicId = "";
    let selfieUrl = "";
    let selfiePublicId = "";

    try {
      console.log("📤 Uploading to Cloudinary...");

      // Upload front image
      const frontResult = await cloudinary.uploader.upload(
        req.files.frontImage[0].path,
        {
          folder: "kyc-documents",
          resource_type: "image",
        },
      );
      frontImageUrl = frontResult.secure_url;
      frontImagePublicId = frontResult.public_id;
      console.log("✅ Front image uploaded:", frontImageUrl);

      // Upload back image if provided
      if (req.files.backImage) {
        const backResult = await cloudinary.uploader.upload(
          req.files.backImage[0].path,
          {
            folder: "kyc-documents",
            resource_type: "image",
          },
        );
        backImageUrl = backResult.secure_url;
        backImagePublicId = backResult.public_id;
        console.log("✅ Back image uploaded:", backImageUrl);
      }

      // Upload selfie
      const selfieResult = await cloudinary.uploader.upload(
        req.files.selfie[0].path,
        {
          folder: "kyc-documents",
          resource_type: "image",
        },
      );
      selfieUrl = selfieResult.secure_url;
      selfiePublicId = selfieResult.public_id;
      console.log("✅ Selfie uploaded:", selfieUrl);

      // Clean up temp files
      fs.unlinkSync(req.files.frontImage[0].path);
      if (req.files.backImage) fs.unlinkSync(req.files.backImage[0].path);
      fs.unlinkSync(req.files.selfie[0].path);
      console.log("✅ Temp files cleaned up");
    } catch (uploadError) {
      console.error("❌ Cloudinary upload failed:", uploadError);
      console.error("❌ Upload error message:", uploadError.message);
      console.error("❌ Upload error stack:", uploadError.stack);

      //  ADD ADMIN ALERT: Document upload failed
      await createSystemAlert("kyc_upload_failed", {
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        error: uploadError.message,
      });

      return res.status(500).json({
        success: false,
        message: "Failed to upload documents: " + uploadError.message,
      });
    }

    // Create or update KYC record
    const kycData = {
      user: req.user.id,
      status: "pending",
      documents: [
        {
          type: documentType,
          documentNumber,
          frontImage: {
            url: frontImageUrl,
            publicId: frontImagePublicId,
          },
          ...(backImageUrl && {
            backImage: {
              url: backImageUrl,
              publicId: backImagePublicId,
            },
          }),
          selfieImage: {
            url: selfieUrl,
            publicId: selfiePublicId,
          },
          uploadedAt: new Date(),
        },
      ],
      personalInfo: parsedPersonalInfo,
      addressInfo: parsedAddressInfo,
      employmentInfo: parsedEmploymentInfo,
      submittedAt: new Date(),
      verificationHistory: [
        {
          status: "pending",
          timestamp: new Date(),
        },
      ],
    };

    console.log("Creating KYC record with data:", kycData);

    let kyc;
    if (existingKYC) {
      kyc = await KYC.findByIdAndUpdate(existingKYC._id, kycData, {
        new: true,
      });
      console.log("✅ Existing KYC updated:", kyc._id);
    } else {
      kyc = new KYC(kycData);
      await kyc.save();
      console.log("✅ New KYC created:", kyc._id);
    }

    //  ADD ADMIN ALERTS FOR SUCCESSFUL KYC SUBMISSION

    // 1. Primary alert for new KYC submission
    await createSystemAlert("kyc_submitted", {
      userId: req.user.id,
      userName: `${req.user.firstName} ${req.user.lastName}`,
      userEmail: req.user.email,
      kycId: kyc._id,
      documentType: documentType,
      submissionDate: new Date().toISOString(),
    });

    // 2. Check for high-risk country (you would need to implement country detection)
    const highRiskCountries = ["XXX"]; // Add your list of high-risk countries
    if (highRiskCountries.includes(parsedPersonalInfo?.nationality)) {
      await createSystemAlert("kyc_high_risk_country", {
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        kycId: kyc._id,
        country: parsedPersonalInfo?.nationality,
      });
    }

    // 3. Check for unusual age (very young or very old)
    if (parsedPersonalInfo?.dateOfBirth) {
      const age =
        new Date().getFullYear() -
        new Date(parsedPersonalInfo.dateOfBirth).getFullYear();
      if (age < 18) {
        await createSystemAlert("kyc_underage", {
          userId: req.user.id,
          userName: `${req.user.firstName} ${req.user.lastName}`,
          userEmail: req.user.email,
          kycId: kyc._id,
          age: age,
        });
      } else if (age > 80) {
        await createSystemAlert("kyc_elderly", {
          userId: req.user.id,
          userName: `${req.user.firstName} ${req.user.lastName}`,
          userEmail: req.user.email,
          kycId: kyc._id,
          age: age,
        });
      }
    }

    // 4. Check for suspicious document patterns (example: multiple KYC attempts)
    const previousAttempts = await KYC.countDocuments({
      user: req.user.id,
      status: { $in: ["rejected", "pending"] },
    });

    if (previousAttempts > 2) {
      await createSystemAlert("kyc_multiple_attempts", {
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        kycId: kyc._id,
        attemptCount: previousAttempts + 1,
      });
    }

    // 5. Check for name mismatches with registered user
    const registeredName =
      `${req.user.firstName} ${req.user.lastName}`.toLowerCase();
    const kycName = parsedPersonalInfo?.fullName?.toLowerCase();

    if (kycName && registeredName !== kycName) {
      await createSystemAlert("kyc_name_mismatch", {
        userId: req.user.id,
        userName: `${req.user.firstName} ${req.user.lastName}`,
        userEmail: req.user.email,
        kycId: kyc._id,
        registeredName: `${req.user.firstName} ${req.user.lastName}`,
        submittedName: parsedPersonalInfo?.fullName,
      });
    }

    // Create notification
    try {
      await createNotification({
        userId: req.user.id,
        type: "kyc_documents_uploaded",
        title: "KYC Documents Received",
        message:
          "Your verification documents have been submitted and are pending review.",
        priority: "medium",
        actionUrl: "/kyc/status",
        actionText: "Track Status",
      });
      console.log("✅ Notification created");
    } catch (notifError) {
      console.error("❌ Failed to create notification:", notifError);
      // Don't fail the whole request if notification fails
    }

    console.log("=== KYC Submission Completed Successfully ===");

    res.status(201).json({
      success: true,
      message: "KYC application submitted successfully",
      kyc: {
        id: kyc._id,
        status: kyc.status,
        submittedAt: kyc.submittedAt,
      },
    });
  } catch (error) {
    console.error("❌ KYC Submission Error:", error);
    console.error("❌ Error message:", error.message);
    console.error("❌ Error stack:", error.stack);

    //ADD ADMIN ALERT: System error
    await createSystemAlert("kyc_system_error", {
      userId: req.user?.id,
      userName: req.user
        ? `${req.user.firstName} ${req.user.lastName}`
        : "Unknown",
      userEmail: req.user?.email || "Unknown",
      error: error.message,
    });

    res.status(500).json({
      success: false,
      message: "Server error: " + error.message,
    });
  }
};


export const getKYCStatus = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user.id });

    if (!kyc) {
      return res.json({
        success: true,
        status: "not_submitted",
        message: "No KYC application found",
      });
    }

    res.json({
      success: true,
      status: kyc.status,
      submittedAt: kyc.submittedAt,
      reviewedAt: kyc.reviewedAt,
      rejectionReason: kyc.rejectionReason,
      kyc,
    });
  } catch (error) {
    console.error("Error fetching KYC status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getKYCDetails = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user.id });

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "No KYC application found",
      });
    }

    res.json({
      success: true,
      kyc,
    });
  } catch (error) {
    console.error("Error fetching KYC details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateKYC = async (req, res) => {
  try {
    const kyc = await KYC.findOne({ user: req.user.id });

    if (!kyc) {
      return res.status(404).json({
        success: false,
        message: "No KYC application found",
      });
    }

    if (kyc.status !== "rejected") {
      return res.status(400).json({
        success: false,
        message: "Can only update rejected applications",
      });
    }

    // Update fields
    Object.assign(kyc, req.body);
    kyc.status = "pending";
    kyc.submittedAt = new Date();
    kyc.verificationHistory.push({
      status: "pending",
      timestamp: new Date(),
    });

    await kyc.save();

    res.json({
      success: true,
      message: "KYC application updated successfully",
      kyc,
    });
  } catch (error) {
    console.error("Error updating KYC:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getAllKYC = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    const kycApplications = await KYC.find(query)
      .populate("user", "firstName lastName email")
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await KYC.countDocuments(query);

    res.json({
      success: true,
      applications: kycApplications,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Error fetching KYC applications:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getKYCDetailsAdmin = async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.id).populate(
      "user",
      "firstName lastName email phone",
    );

    if (!kyc) {
      return res.status(404).json({ message: "KYC application not found" });
    }

    res.json({
      success: true,
      kyc,
    });
  } catch (error) {
    console.error("Error fetching KYC details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const reviewKYC = async (req, res) => {
  try {
    const { status, comment, rejectionReason } = req.body;
    const kyc = await KYC.findById(req.params.id).populate("user");

    if (!kyc) {
      return res.status(404).json({ message: "KYC application not found" });
    }

    // Update KYC status
    kyc.status = status;
    kyc.reviewedAt = new Date();
    kyc.reviewedBy = req.user.id;

    kyc.verificationHistory.push({
      status,
      comment,
      reviewedBy: req.user.id,
      reviewedAt: new Date(),
    });

    if (status === "rejected") {
      kyc.rejectionReason =
        rejectionReason || "Documents did not meet requirements";
    }

    await kyc.save();

    // Update user's KYC status if needed
    if (status === "verified") {
      await User.findByIdAndUpdate(kyc.user._id, {
        isVerified: true,
        status: "active",
      });
    }

    // Create notification for user
    let notificationType, title, message, actionUrl;

    if (status === "verified") {
      notificationType = "kyc_verified";
      title = "Identity Verified ✅";
      message = "Your account has been successfully verified.";
      actionUrl = "/dashboard";
    } else if (status === "rejected") {
      notificationType = "kyc_rejected";
      title = "Verification Failed";
      message = `Your KYC application was rejected. Reason: ${kyc.rejectionReason}`;
      actionUrl = "/kyc/resubmit";
    }

    await createNotification({
      userId: kyc.user._id,
      type: notificationType,
      title,
      message,
      priority: status === "verified" ? "high" : "medium",
      actionUrl,
      actionText:
        status === "verified" ? "Go to Dashboard" : "Resubmit Documents",
    });

    res.json({
      success: true,
      message: `KYC application ${status}`,
      kyc,
    });
  } catch (error) {
    console.error("Error reviewing KYC:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteKYC = async (req, res) => {
  try {
    const kyc = await KYC.findById(req.params.id);

    if (!kyc) {
      return res.status(404).json({ message: "KYC application not found" });
    }

    console.log("KYC user field:", kyc.user);

    // ✅ Capture the updated user in a variable
    const updatedUser = await User.findByIdAndUpdate(
      kyc.user, 
      {
        isVerified: false,
        status: "pending",
      },
      { new: true } // This returns the updated document
    );

    console.log(
      "Updated user:",
      updatedUser?._id,
      updatedUser?.isVerified,
      updatedUser?.status,
    );

    await kyc.deleteOne();

  

    res.json({
      success: true,
      message: "KYC application deleted and user reset to pending",
    });
  } catch (error) {
    console.error("Error deleting KYC:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getUserKycByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const kyc = await KYC.findOne({ user: userId }).populate(
      "user",
      "firstName lastName email",
    );

     if (!kyc) {
      return res.json({
        success: true,
        kyc: null,
        message: "No KYC submitted yet",
      });
    }

    res.json({
      success: true,
      kyc,
    });
  } catch (error) {
    console.error("Error fetching user KYC:", error);
    res.status(500).json({ message: "Server error" });
  }
};
