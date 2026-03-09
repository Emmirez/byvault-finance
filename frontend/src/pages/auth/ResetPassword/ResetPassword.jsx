// pages/auth/ResetPassword.jsx
import React, { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Header from "../../../components/header/header.jsx";
import {
  Shield,
  Lock,
  ArrowLeft,
  HelpCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  // Password strength validation
  const getPasswordStrength = (password) => {
    const checks = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
    };

    const strength = Object.values(checks).filter(Boolean).length;

    if (strength === 4) return { level: "Strong", color: "green" };
    if (strength === 3) return { level: "Medium", color: "yellow" };
    return { level: "Weak", color: "red" };
  };

  const passwordStrength = newPassword
    ? getPasswordStrength(newPassword)
    : null;

  const validateForm = () => {
    if (!newPassword || !confirmPassword) {
      setError("Please enter both password fields");
      return false;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (
      !/[a-z]/.test(newPassword) ||
      !/[A-Z]/.test(newPassword) ||
      !/\d/.test(newPassword)
    ) {
      setError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );
      return false;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/auth/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      setIsSubmitted(true);
      setSuccess(result.message || "Password reset successfully!");

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 overflow-x-hidden">
      <Header />

      {/* Error Message Display */}
      {error && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3 shadow-lg animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => setError("")}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Success Message Display */}
      {success && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3 shadow-lg animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
            <p className="text-sm text-green-700 dark:text-green-300">
              {success}
            </p>
            <button
              onClick={() => setSuccess("")}
              className="ml-auto text-green-500 hover:text-green-700"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8 sm:py-12">
        <div className="w-full max-w-md mx-auto animate-fadeIn">
          {/* Header Section */}
          <div className="text-center mb-8 animate-slideDown">
            <div className="relative inline-flex mb-5">
              <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Lock className="text-white" size={36} strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              Reset Password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Create a strong new password for your account
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
            {!isSubmitted ? (
              <div className="animate-fadeIn">
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* New Password Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      New Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full px-4 py-3.5 text-sm font-medium rounded-xl border-2 border-gray-300/70 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none pr-20"
                        placeholder="Enter new password"
                        required
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {newPassword && (
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${
                                passwordStrength?.level === "Strong"
                                  ? "bg-green-500 w-full"
                                  : passwordStrength?.level === "Medium"
                                    ? "bg-yellow-500 w-3/4"
                                    : "bg-red-500 w-1/2"
                              }`}
                            />
                          </div>
                          <span
                            className={`text-xs font-medium ${
                              passwordStrength?.level === "Strong"
                                ? "text-green-600 dark:text-green-400"
                                : passwordStrength?.level === "Medium"
                                  ? "text-yellow-600 dark:text-yellow-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {passwordStrength?.level}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div
                            className={`flex items-center gap-1.5 ${newPassword.length >= 8 ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            <CheckCircle size={12} />
                            Min 8 chars
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${/[a-z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            <CheckCircle size={12} />
                            Lowercase
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${/[A-Z]/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            <CheckCircle size={12} />
                            Uppercase
                          </div>
                          <div
                            className={`flex items-center gap-1.5 ${/\d/.test(newPassword) ? "text-green-600 dark:text-green-400" : "text-gray-500 dark:text-gray-400"}`}
                          >
                            <CheckCircle size={12} />
                            Number
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-4 py-3.5 text-sm font-medium rounded-xl border-2 border-gray-300/70 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 outline-none"
                        placeholder="Confirm new password"
                        required
                        disabled={isLoading}
                      />
                      {confirmPassword && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          {newPassword === confirmPassword ? (
                            <CheckCircle size={18} className="text-green-500" />
                          ) : (
                            <AlertCircle size={18} className="text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl mt-6"
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        <span className="font-semibold">
                          Resetting Password...
                        </span>
                      </>
                    ) : (
                      <>
                        <Lock size={18} strokeWidth={2.5} />
                        <span className="font-semibold">Reset Password</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Return to Login */}
                <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-700/50 animate-slideUp">
                  <Link
                    to="/login"
                    className="w-full py-3 text-sm font-semibold rounded-xl border-2 border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center gap-3 group hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    <ArrowLeft
                      size={18}
                      className="group-hover:-translate-x-1 transition-transform"
                    />
                    Return to Login
                  </Link>
                </div>
              </div>
            ) : (
              <div className="animate-fadeIn">
                {/* Success Message */}
                <div className="text-center py-4">
                  <div className="relative inline-flex mb-6">
                    <div className="absolute inset-0 bg-green-500/10 dark:bg-green-500/20 blur-xl rounded-full animate-ping"></div>
                    <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-800 rounded-full shadow-lg">
                      <CheckCircle
                        className="text-white"
                        size={36}
                        strokeWidth={1.5}
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    Password Reset Successful!
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Your password has been successfully reset. You'll be
                    redirected to login in 3 seconds.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <svg
                      className="animate-spin h-4 w-4 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Redirecting to login...
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 mt-7 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
                  <Link
                    to="/login"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
                  >
                    <ArrowLeft size={18} />
                    Go to Login
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Footer Links */}
          <div className="mt-8 flex items-center justify-center gap-8 text-sm">
            <Link
              to="/privacy-security"
              className="group flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                <Shield
                  size={16}
                  className="group-hover:text-blue-600 dark:group-hover:text-blue-400"
                />
              </div>
              <span className="font-medium">Security</span>
            </Link>
            <Link
              to="/contact-support"
              className="group flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-green-50 dark:group-hover:bg-green-900/20 transition-colors">
                <HelpCircle
                  size={16}
                  className="group-hover:text-green-600 dark:group-hover:text-green-400"
                />
              </div>
              <span className="font-medium">Support</span>
            </Link>
            <Link
              to="/terms-conditions"
              className="group flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                <FileText
                  size={16}
                  className="group-hover:text-purple-600 dark:group-hover:text-purple-400"
                />
              </div>
              <span className="font-medium">Terms</span>
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-center text-xs font-medium text-gray-500 dark:text-gray-500 mt-6 py-3 border-t border-gray-200/30 dark:border-gray-700/30">
            © 2026{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent font-bold">
              Byvault Finance
            </span>
            . All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
