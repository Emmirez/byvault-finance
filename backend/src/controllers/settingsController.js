// src/controllers/settingsController.js
import Setting from "../models/Settings.js";
import { logActivity } from "./activityController.js";

// @desc    Get all settings (admin)
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getAllSettings = async (req, res) => {
  try {
    const { group } = req.query;
    const filter = {};

    if (group && group !== "all") {
      filter.group = group;
    }

    const settings = await Setting.find(filter)
      .populate("lastUpdatedBy", "firstName lastName email")
      .sort({ group: 1, key: 1 });

    // Group settings by category
    const groupedSettings = settings.reduce((acc, setting) => {
      if (!acc[setting.group]) {
        acc[setting.group] = [];
      }
      acc[setting.group].push(setting);
      return acc;
    }, {});

    res.json({
      success: true,
      groupedSettings,
      allSettings: settings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get public settings (for frontend)
// @route   GET /api/settings/public
// @access  Public
export const getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true });
    
    const publicSettings = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {});

    res.json({
      success: true,
      settings: publicSettings,
    });
  } catch (error) {
    console.error("Error fetching public settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Get single setting
// @route   GET /api/admin/settings/:key
// @access  Private/Admin
export const getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key })
      .populate("lastUpdatedBy", "firstName lastName email");

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    res.json({
      success: true,
      setting,
    });
  } catch (error) {
    console.error("Error fetching setting:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Update setting
// @route   PUT /api/admin/settings/:key
// @access  Private/Admin
export const updateSetting = async (req, res) => {
  try {
    const { value } = req.body;
    const setting = await Setting.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    // Validate based on type
    if (setting.type === "number" && isNaN(value)) {
      return res.status(400).json({
        success: false,
        message: "Value must be a number",
      });
    }

    if (setting.validation) {
      if (setting.validation.min !== undefined && value < setting.validation.min) {
        return res.status(400).json({
          success: false,
          message: `Value must be at least ${setting.validation.min}`,
        });
      }
      if (setting.validation.max !== undefined && value > setting.validation.max) {
        return res.status(400).json({
          success: false,
          message: `Value must be at most ${setting.validation.max}`,
        });
      }
      if (setting.validation.pattern) {
        const regex = new RegExp(setting.validation.pattern);
        if (!regex.test(value)) {
          return res.status(400).json({
            success: false,
            message: "Value format is invalid",
          });
        }
      }
    }

    const oldValue = setting.value;
    setting.value = value;
    setting.lastUpdatedBy = req.user.id;
    await setting.save();

    await logActivity({
      userId: req.user.id,
      type: "settings_update",
      title: "Setting Updated",
      description: `Updated ${setting.key} from ${oldValue} to ${value}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        settingKey: setting.key,
        oldValue,
        newValue: value,
        group: setting.group,
      },
    });

    res.json({
      success: true,
      message: "Setting updated successfully",
      setting,
    });
  } catch (error) {
    console.error("Error updating setting:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Create new setting (superadmin)
// @route   POST /api/admin/settings
// @access  Private/Superadmin
export const createSetting = async (req, res) => {
  try {
    const {
      key,
      value,
      type = "string",
      group = "general",
      description,
      isPublic = false,
      options,
      validation,
    } = req.body;

    // Check if setting already exists
    const existing = await Setting.findOne({ key });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Setting already exists",
      });
    }

    const setting = new Setting({
      key,
      value,
      type,
      group,
      description,
      isPublic,
      options,
      validation,
      lastUpdatedBy: req.user.id,
    });

    await setting.save();

    await logActivity({
      userId: req.user.id,
      type: "settings_create",
      title: "Setting Created",
      description: `Created new setting: ${key}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        settingKey: key,
        group,
      },
    });

    res.status(201).json({
      success: true,
      message: "Setting created successfully",
      setting,
    });
  } catch (error) {
    console.error("Error creating setting:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Delete setting (superadmin)
// @route   DELETE /api/admin/settings/:key
// @access  Private/Superadmin
export const deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key });

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: "Setting not found",
      });
    }

    await setting.deleteOne();

    await logActivity({
      userId: req.user.id,
      type: "settings_delete",
      title: "Setting Deleted",
      description: `Deleted setting: ${setting.key}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        settingKey: setting.key,
      },
    });

    res.json({
      success: true,
      message: "Setting deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting setting:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// @desc    Reset to default settings
// @route   POST /api/admin/settings/reset
// @access  Private/Superadmin
export const resetSettings = async (req, res) => {
  try {
    // Define default settings
    const defaultSettings = [
      // General
      {
        key: "siteName",
        value: "Byvault Finance",
        type: "string",
        group: "general",
        description: "Site name displayed in emails and headers",
        isPublic: true,
      },
      {
        key: "supportEmail",
        value: "support@byvault.com",
        type: "string",
        group: "general",
        description: "Email address for support inquiries",
        isPublic: true,
      },
      {
        key: "maintenanceMode",
        value: false,
        type: "boolean",
        group: "general",
        description: "Put the site in maintenance mode",
        isPublic: false,
      },

      // Security
      {
        key: "maxLoginAttempts",
        value: 5,
        type: "number",
        group: "security",
        description: "Maximum failed login attempts before lockout",
        validation: { min: 1, max: 10 },
      },
      {
        key: "lockoutDuration",
        value: 30,
        type: "number",
        group: "security",
        description: "Account lockout duration in minutes",
        validation: { min: 5, max: 120 },
      },
      {
        key: "sessionTimeout",
        value: 60,
        type: "number",
        group: "security",
        description: "Session timeout in minutes",
        validation: { min: 15, max: 480 },
      },
      {
        key: "requireTwoFactor",
        value: false,
        type: "boolean",
        group: "security",
        description: "Require 2FA for all users",
      },

      // Limits
      {
        key: "minDeposit",
        value: 10,
        type: "number",
        group: "limits",
        description: "Minimum deposit amount",
        validation: { min: 1, max: 1000 },
      },
      {
        key: "maxDeposit",
        value: 10000,
        type: "number",
        group: "limits",
        description: "Maximum deposit amount",
        validation: { min: 100, max: 100000 },
      },
      {
        key: "minWithdrawal",
        value: 20,
        type: "number",
        group: "limits",
        description: "Minimum withdrawal amount",
        validation: { min: 1, max: 1000 },
      },
      {
        key: "maxWithdrawal",
        value: 5000,
        type: "number",
        group: "limits",
        description: "Maximum withdrawal amount",
        validation: { min: 100, max: 50000 },
      },
      {
        key: "dailyTransferLimit",
        value: 5000,
        type: "number",
        group: "limits",
        description: "Daily transfer limit per user",
        validation: { min: 100, max: 50000 },
      },

      // Fees
      {
        key: "depositFee",
        value: 0,
        type: "number",
        group: "fees",
        description: "Deposit fee percentage",
        validation: { min: 0, max: 10 },
      },
      {
        key: "withdrawalFee",
        value: 1,
        type: "number",
        group: "fees",
        description: "Withdrawal fee percentage",
        validation: { min: 0, max: 10 },
      },
      {
        key: "transferFee",
        value: 0.5,
        type: "number",
        group: "fees",
        description: "Transfer fee percentage",
        validation: { min: 0, max: 10 },
      },
      {
        key: "currency",
        value: "USD",
        type: "string",
        group: "fees",
        description: "Default currency",
        options: ["USD", "EUR", "GBP", "JPY", "CAD", "AUD"],
      },

      // KYC
      {
        key: "requireKYC",
        value: true,
        type: "boolean",
        group: "kyc",
        description: "Require KYC verification for all users",
      },
      {
        key: "kycAgeLimit",
        value: 18,
        type: "number",
        group: "kyc",
        description: "Minimum age for KYC verification",
        validation: { min: 18, max: 25 },
      },

      // Email
      {
        key: "emailNotifications",
        value: true,
        type: "boolean",
        group: "email",
        description: "Enable email notifications",
      },
      {
        key: "adminEmailAlerts",
        value: true,
        type: "boolean",
        group: "email",
        description: "Send email alerts to admins",
      },
    ];

    // Clear existing settings and insert defaults
    await Setting.deleteMany({});
    await Setting.insertMany(
      defaultSettings.map(setting => ({
        ...setting,
        lastUpdatedBy: req.user.id,
      }))
    );

    await logActivity({
      userId: req.user.id,
      type: "settings_reset",
      title: "Settings Reset",
      description: "Reset all settings to default values",
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Settings reset to defaults successfully",
    });
  } catch (error) {
    console.error("Error resetting settings:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};