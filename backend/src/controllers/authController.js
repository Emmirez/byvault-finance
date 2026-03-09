import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { logActivity } from "./activityController.js";
import { createSystemAlert } from "./adminAlertController.js";
import crypto from "crypto";
import {
  sendPasswordResetEmail,
  send2FACode,
} from "../services/emailService.js";
import { sendWelcomeEmail } from "../services/welcomeEmailService.js";
import KYC from "../models/KYC.js";

export const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      middleName,
      name,
      email,
      password,
      username,
      phone,
      address,
      dateOfBirth,
      currency,
      accountType,
      transactionPin,
    } = req.body;

    const fullName =
      name || (firstName && lastName ? `${firstName} ${lastName}` : null);

    if (!fullName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let unique = false;
    let accountId;
    while (!unique) {
      accountId = Math.floor(1000000000 + Math.random() * 9000000000); // 10-digit number
      const existing = await User.findOne({ accountId });
      if (!existing) {
        unique = true;
      }
    }

    // Use the same BTC address for all users
    const btcDepositAddress = "bc1qyf5ae8kzuxh8y7axd9yxnmmyh3q3g4eqs3j9ag";

    // Create complete bank details object
    const bankDetails = {
      bankName: "Byvault Finance Bank",
      accountName: fullName,
      accountNumber: accountId.toString(),
      routingNumber: "021000021",
      swiftCode: "BYVAUS33",
      iban: "",
      bankAddress: "123 Financial Plaza, New York, NY 10001",
    };

    const userData = {
      name: fullName,
      firstName: firstName || "",
      lastName: lastName || "",
      email,
      password: hashedPassword,
      accountId,
      balanceFiat: 0,
      balanceBTC: 0,
      btcDepositAddress,
      dateOfBirth: dateOfBirth || null,
      address: address || "",
      bankDetails, // Add the complete bank details object
    };

    if (middleName) userData.middleName = middleName;
    if (username) userData.username = username;
    if (phone) userData.phone = phone;
    if (currency) userData.currency = currency;
    if (accountType) userData.accountType = accountType;
    if (transactionPin) userData.transactionPin = transactionPin;

    const user = await User.create(userData);

    //  ADD WELCOME EMAIL HERE
    try {
      const emailSent = await sendWelcomeEmail({
        to: user.email,
        name: user.firstName || user.name.split(" ")[0],
        accountId: user.accountId,
      });

      if (emailSent) {
        console.log(`📧 Welcome email sent to ${user.email}`);

        // Log activity for welcome email
        await logActivity({
          userId: user._id,
          type: "email",
          title: "Welcome Email Sent",
          description: `Welcome email sent to ${user.email}`,
          status: "success",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        });
      } else {
        console.error(`❌ Failed to send welcome email to ${user.email}`);

        // Log failure but don't block registration
        await logActivity({
          userId: user._id,
          type: "email",
          title: "Welcome Email Failed",
          description: `Failed to send welcome email to ${user.email}`,
          status: "failed",
          ip: req.ip,
          userAgent: req.headers["user-agent"],
        });
      }
    } catch (emailError) {
      console.error("❌ Welcome email error:", emailError);
      // Don't throw - user registration should succeed even if email fails
    }

    // 1. Alert for new user registration (always)
    await createSystemAlert("new_user_registration", {
      userId: user._id,
      userName: fullName,
      userEmail: email,
      accountId: accountId,
      registrationDate: new Date().toISOString(),
    });

    // 2. Check for suspicious patterns (VPN, proxy, etc. - you'd need to implement IP checking)
    // This is a placeholder for future implementation
    const suspiciousIP = false;
    if (suspiciousIP) {
      await createSystemAlert("suspicious_registration", {
        userId: user._id,
        userName: fullName,
        userEmail: email,
        ipAddress: req.ip,
        reason: "Registration from suspicious IP/location",
      });
    }

    // 3. Check for multiple registrations from same IP
    const recentRegistrationsFromIP = await User.countDocuments({
      "metadata.registrationIP": req.ip,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
    });

    if (recentRegistrationsFromIP >= 3) {
      await createSystemAlert("multiple_registrations", {
        count: recentRegistrationsFromIP,
        ipAddress: req.ip,
        timeframe: "24 hours",
        latestUser: fullName,
        latestEmail: email,
      });
    }

    // 4. Check for known disposable email domains
    const disposableDomains = [
      "tempmail.com",
      "throwaway.com",
      "mailinator.com",
    ]; // Add more
    const emailDomain = email.split("@")[1];
    if (disposableDomains.includes(emailDomain)) {
      await createSystemAlert("disposable_email", {
        userId: user._id,
        userName: fullName,
        userEmail: email,
        domain: emailDomain,
      });
    }

    //  LOG ACTIVITY
    await logActivity({
      userId: user._id,
      type: "registration",
      title: "New User Registration",
      description: `User registered with email: ${email}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        name: fullName,
        email: email,
        username: username || null,
        phone: phone || null,
        accountId: accountId,
        accountType: accountType || "savings",
        currency: currency || "USD",
        registrationDate: new Date().toISOString(),
        registrationIP: req.ip, // Store IP for future checks
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    console.log("✅ User registered with complete bank details:", {
      email: user.email,
      bankDetails: user.bankDetails,
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        email: user.email,
        role: user.role,
        username: user.username,
        phone: user.phone,
        address: user.address,
        dateOfBirth: user.dateOfBirth,
        accountId: user.accountId,
        accountNumber: `**** ${user.accountId.toString().slice(-4)}`,
        balanceFiat: user.balanceFiat || 0,
        balanceBTC: user.balanceBTC || 0,
        accountType: user.accountType,
        currency: user.currency || "USD",
        btcDepositAddress: user.btcDepositAddress,
        bankDetails: user.bankDetails,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Log failed registration attempt
    await logActivity({
      userId: null,
      type: "registration",
      title: "Registration Failed",
      description: `Failed registration attempt for email: ${req.body.email}`,
      status: "failed",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        email: req.body.email,
        username: req.body.username,
        error: error.message,
        errorCode: error.code,
      },
    }).catch((e) => console.error("Failed to log activity:", e));

    // ADD ADMIN ALERT FOR REGISTRATION FAILURE
    await createSystemAlert("registration_failed", {
      email: req.body.email,
      username: req.body.username,
      ipAddress: req.ip,
      error: error.message,
      errorCode: error.code,
    });

    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(400).json({ message: "Username already taken" });
    }

    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      //  ADDED: Track failed login for non-existent user
      const failedKey = `failed_${email}`;
      const failedAttempts = (req.app.locals[failedKey] || 0) + 1;
      req.app.locals[failedKey] = failedAttempts;

      if (failedAttempts >= 5) {
        await createSystemAlert("failed_login_attempts", {
          email: email,
          attempts: failedAttempts,
          ipAddress: req.ip,
        });
        req.app.locals[failedKey] = 0;
      }

      setTimeout(
        () => {
          req.app.locals[failedKey] = 0;
        },
        15 * 60 * 1000,
      );

      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      //  ADDED: Track failed login for existing user
      const failedKey = `failed_${user._id}`;
      const failedAttempts = (req.app.locals[failedKey] || 0) + 1;
      req.app.locals[failedKey] = failedAttempts;

      if (failedAttempts >= 5) {
        await createSystemAlert("failed_login_attempts", {
          email: user.email,
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          attempts: failedAttempts,
          ipAddress: req.ip,
        });
        req.app.locals[failedKey] = 0;
      }

      setTimeout(
        () => {
          req.app.locals[failedKey] = 0;
        },
        15 * 60 * 1000,
      );

      return res.status(400).json({ message: "Invalid credentials" });
    }

    // checkUserStatus
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        code: "ACCOUNT_BLOCKED",
        message:
          "Your account has been blocked. Please contact support at support@byvaultfinance.com",
      });
    }

    if (user.isSuspended) {
      // Auto-lift if suspension has expired
      if (user.suspendedUntil && new Date() > new Date(user.suspendedUntil)) {
        user.isSuspended = false;
        user.status = user.isVerified ? "active" : "pending";
        user.suspendedUntil = null;
        await user.save({ validateBeforeSave: false });
      } else {
        return res.status(403).json({
          success: false,
          code: "ACCOUNT_SUSPENDED",
          message:
            "Your account is temporarily suspended. Please contact support.",
          suspendedUntil: user.suspendedUntil,
        });
      }
    }

    if (!user.accountId) {
      let unique = false;
      while (!unique) {
        const randomId = Math.floor(1000000000 + Math.random() * 9000000000);
        const existing = await User.findOne({ accountId: randomId });
        if (!existing) {
          user.accountId = randomId;
          await user.save();
          console.log(
            `✅ Generated missing accountId ${randomId} for user ${user.email}`,
          );
          unique = true;
        }
      }
    }

    if (user.balanceBTC === undefined || user.balanceBTC === null) {
      user.balanceBTC = 0;
      await user.save();
    }

    if (user.balanceFiat === undefined || user.balanceFiat === null) {
      user.balanceFiat = 0;
      await user.save();
    }

    //  ADDED: Check for new location login
    if (user.lastLoginIp && user.lastLoginIp !== req.ip) {
      await createSystemAlert("new_location_login", {
        email: user.email,
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        newIp: req.ip,
        lastIp: user.lastLoginIp,
        userAgent: req.headers["user-agent"],
      });
    }

    // Update last login IP
    user.lastLoginIp = req.ip;

    // last login timestamp
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });
    console.log(
      `✅ Updated lastLogin for user ${user.email}: ${user.lastLogin}`,
    );

    if (user.twoFactorEnabled) {
      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      user.twoFactorCode = otp;
      user.twoFactorCodeExpires = otpExpiry;

      await user.save({ validateBeforeSave: false });

     

      // Send OTP email
      await send2FACode(user.email, otp);

      return res.json({
        requiresTwoFactor: true,
        tempUserId: user._id,
        message: "Verification code sent to your email",
      });
    }

    // After successful login
    await logActivity({
      userId: user._id,
      type: "login",
      title: "Successful Login",
      description: `User logged in from ${req.ip}`,
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        method: "password",
      },
    });

    // Set token expiry based on rememberMe
    const expiresIn = rememberMe ? "30d" : "24h";

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn },
    );

    // Log for security audit
    console.log(
      `User ${user._id} logged in with ${rememberMe ? "long" : "short"} session`,
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName || "",
        email: user.email,
        role: user.role,
        accountId: user.accountId,
        accountNumber: user.accountId
          ? `**** ${user.accountId.toString().slice(-4)}`
          : "**** ****",
        balanceFiat: user.balanceFiat || 0,
        balanceBTC: user.balanceBTC || 0,
        accountType: user.accountType || "savings",
        currency: user.currency || "USD",
        phone: user.phone,
        username: user.username,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get current logged-in user
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const kyc = await KYC.findOne({ user: user._id }).select("status").lean();

    // Fix missing accountId
    if (!user.accountId) {
      let unique = false;
      while (!unique) {
        const randomId = Math.floor(1000000000 + Math.random() * 9000000000);
        const existing = await User.findOne({ accountId: randomId });
        if (!existing) {
          user.accountId = randomId;
          await user.save();
          console.log(
            `✅ Generated missing accountId ${randomId} for user ${user.email}`,
          );
          unique = true;
        }
      }
    }

    // Fix missing balance fields
    if (user.balanceBTC === undefined || user.balanceBTC === null) {
      user.balanceBTC = 0;
      await user.save();
    }

    if (user.balanceFiat === undefined || user.balanceFiat === null) {
      user.balanceFiat = 0;
      await user.save();
    }

    // Format account number helper
    const formatAccountNumber = (accountId) => {
      if (!accountId) return "**** ****";
      const str = accountId.toString();
      return `**** ${str.slice(-4)}`;
    };

    // Return ALL fields your frontend needs
    res.json({
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      name: user.name,
      email: user.email,
      role: user.role,
      username: user.username,
      phone: user.phone,
      address: user.address,
      currency: user.currency || "USD",
      accountType: user.accountType || "savings",
      accountId: user.accountId,
      accountNumber: formatAccountNumber(user.accountId),
      balanceFiat: user.balanceFiat || 0,
      balanceBTC: user.balanceBTC || 0,
      isBlocked: user.isBlocked,
      isVerified: user.isVerified || false,
      kycStatus: kyc?.status || null,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } catch (err) {
    console.error("Get current user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Forgot password - request reset link
export const forgotPassword = async (req, res) => {
  console.log("🔥 FORGOT PASSWORD FUNCTION CALLED!");
  console.log("Request body:", req.body);
  try {
    const { identifier } = req.body;

    console.log("🔍 Forgot password request for:", identifier);

    if (!identifier) {
      return res.status(400).json({
        success: false,
        message: "Email or username is required",
      });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    // Log the attempt (even if user doesn't exist - for security, don't reveal that)
    await logActivity({
      userId: user?._id,
      type: "password_reset_request",
      title: "Password Reset Requested",
      description: `Password reset requested for ${identifier}`,
      status: user ? "pending" : "failed",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
      metadata: {
        identifier,
        userFound: !!user,
      },
    });

    //  ADD ADMIN ALERT: Password reset requested
    if (user) {
      await createSystemAlert("password_reset_requested", {
        userId: user._id,
        userName: `${user.firstName} ${user.lastName}`,
        userEmail: user.email,
        identifier,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
    } else {
      await createSystemAlert("password_reset_attempt_no_user", {
        identifier,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });
    }

    res.json({
      success: true,
      message:
        "If an account exists with this information, you will receive a password reset link shortly.",
    });

    // If user exists, generate reset token and send email
    if (user) {
      try {
        // Generate reset token (expires in 1 hour)
        const resetToken = crypto.randomBytes(32).toString("hex");
        const resetTokenExpiry = Date.now() + 3600000; // 1 hour

        // Save token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = resetTokenExpiry;
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Send email
        const emailSent = await sendPasswordResetEmail({
          to: user.email,
          name: user.firstName || user.name,
          resetUrl,
        });

        if (emailSent) {
          console.log(`✅ Password reset email sent to ${user.email}`);

          // Log success
          await logActivity({
            userId: user._id,
            type: "password_reset_email_sent",
            title: "Password Reset Email Sent",
            description: `Password reset email sent to ${user.email}`,
            status: "success",
            ip: req.ip,
            userAgent: req.headers["user-agent"],
          });
        } else {
          console.error(
            `❌ Failed to send password reset email to ${user.email}`,
          );

          //  ADD ADMIN ALERT: Email sending failed
          await createSystemAlert("password_reset_email_failed", {
            userId: user._id,
            userName: `${user.firstName} ${user.lastName}`,
            userEmail: user.email,
            error: "Failed to send email",
          });
        }
      } catch (emailError) {
        console.error("Error sending password reset email:", emailError);

        // ADD ADMIN ALERT: Email error
        await createSystemAlert("password_reset_email_error", {
          userId: user._id,
          userName: `${user.firstName} ${user.lastName}`,
          userEmail: user.email,
          error: emailError.message,
        });
      }
    }
  } catch (error) {
    console.error("Forgot password error:", error);

    // ADD ADMIN ALERT: System error
    await createSystemAlert("password_reset_system_error", {
      identifier: req.body.identifier,
      error: error.message,
      ipAddress: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

// Reset password with token
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    console.log("🔍 Reset password request with token");

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Token and new password are required",
      });
    }

    // Password strength validation
    const hasMinLength = newPassword.length >= 8;
    const hasLowercase = /[a-z]/.test(newPassword);
    const hasUppercase = /[A-Z]/.test(newPassword);
    const hasNumber = /\d/.test(newPassword);

    if (!hasMinLength || !hasLowercase || !hasUppercase || !hasNumber) {
      return res.status(400).json({
        success: false,
        message: "Password does not meet security requirements",
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      // ADD ADMIN ALERT: Invalid/expired token
      await createSystemAlert("password_reset_invalid_token", {
        token,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
      });

      return res.status(400).json({
        success: false,
        message: "Password reset token is invalid or has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    // Log activity
    await logActivity({
      userId: user._id,
      type: "password_reset_completed",
      title: "Password Reset Completed",
      description: "Password was successfully reset",
      status: "success",
      ip: req.ip,
      userAgent: req.headers["user-agent"],
    });

    //  ADD ADMIN ALERT: Password reset completed
    await createSystemAlert("password_reset_completed", {
      userId: user._id,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    });

    res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    // ADD ADMIN ALERT: System error
    await createSystemAlert("password_reset_system_error", {
      error: error.message,
      ipAddress: req.ip,
    });

    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};
