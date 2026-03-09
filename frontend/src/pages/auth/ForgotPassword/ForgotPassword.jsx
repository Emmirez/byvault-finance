/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../../components/header/header.jsx";
import {
  Shield,
  Mail,
  ArrowLeft,
  HelpCircle,
  FileText,
  CheckCircle,
  AlertCircle,
  User,
} from "lucide-react";
import { useLanguageContext } from "../../../contexts/LanguageContext";


const ForgotPassword = () => {
  const { t } = useLanguageContext();
  const [identifier, setIdentifier] = useState("");
  const [identifierType, setIdentifierType] = useState("email"); // "email" or "username"
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

  // Detect identifier type
  const handleIdentifierChange = (value) => {
    setIdentifier(value);
    setError("");

    if (value.includes("@")) {
      setIdentifierType("email");
    } else {
      setIdentifierType("username");
    }
  };

  // Validation function
  const validateForm = () => {
    if (!identifier.trim()) {
      setError("Please enter your email address or username");
      return false;
    }

    if (identifierType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(identifier.trim())) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    if (identifierType === "username" && identifier.length < 3) {
      setError("Username must be at least 3 characters");
      return false;
    }

    return true;
  };

  // API call to request password reset
  const requestPasswordReset = async (data) => {
    console.log("Sending request to:", `${API_URL}/auth/forgot-password`);
    console.log("Request data:", data);

    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (!response.ok) {
        throw new Error(result.message || "Failed to send reset link");
      }

      return result;
    } catch (error) {
      console.error("Fetch error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    const resetData = {
      identifier: identifier.trim(),
      identifierType: identifierType, // Let backend know if it's email or username
    };

    try {
      // Call the password reset API
      const result = await requestPasswordReset(resetData);

      setIsSubmitted(true);
      setSuccess(result.message || "Password reset link sent successfully!");
    } catch (err) {
      setError(err.message || "Failed to send reset link. Please try again.");
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
          {/* Header Section with smooth animation */}
          <div className="text-center mb-8 animate-slideDown">
            <div className="relative inline-flex mb-5">
              <div className="absolute inset-0 bg-blue-500/10 dark:bg-blue-500/20 blur-xl rounded-full animate-pulse"></div>
              <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-full shadow-lg transform transition-transform duration-300 hover:scale-105">
                <Mail className="text-white" size={36} strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
              Reset your password in just a few clicks
            </p>
          </div>

          {/* Form Card with glass morphism effect */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 sm:p-8 border border-white/20 dark:border-gray-700/50 transition-all duration-300 hover:shadow-2xl">
            {!isSubmitted ? (
              <div className="animate-fadeIn">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Mail
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  Reset Your Password
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Enter your{" "}
                  {identifierType === "email" ? "email address" : "username"}{" "}
                  and we'll send you a secure reset link
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Email/Username Field */}
                  <div className="group">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {identifierType === "email"
                        ? "Email Address"
                        : "Username"}{" "}
                      *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => handleIdentifierChange(e.target.value)}
                        className="w-full px-4 py-3.5 text-sm font-medium rounded-xl border-2 border-gray-300/70 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-0 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                        placeholder={
                          identifierType === "email"
                            ? "name@email.com"
                            : "your_username"
                        }
                        required
                        disabled={isLoading}
                      />
                      <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        {identifierType === "email" ? (
                          <Mail
                            size={18}
                            className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                        ) : (
                          <User
                            size={18}
                            className="text-gray-400 group-focus-within:text-blue-500 transition-colors"
                          />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Enter your registered email address or username
                      {identifierType === "email" && (
                        <span className="ml-1 text-blue-600 dark:text-blue-400 font-medium">
                          (Currently detecting as email)
                        </span>
                      )}
                      {identifierType === "username" && (
                        <span className="ml-1 text-purple-600 dark:text-purple-400 font-medium">
                          (Currently detecting as username)
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
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
                          Sending Reset Link...
                        </span>
                      </>
                    ) : (
                      <>
                        <Mail size={18} strokeWidth={2.5} />
                        <span className="font-semibold">
                          Send Password Reset Link
                        </span>
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
                    Check Your{" "}
                    {identifierType === "email" ? "Email" : "Account"}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    We've sent a password reset link to your{" "}
                    {identifierType === "email" ? "email address" : "account"}:
                  </p>
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2.5 ${
                      identifierType === "email"
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "bg-purple-50 dark:bg-purple-900/20"
                    } rounded-full mb-4`}
                  >
                    {identifierType === "email" ? (
                      <Mail
                        size={14}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    ) : (
                      <User
                        size={14}
                        className="text-purple-600 dark:text-purple-400"
                      />
                    )}
                    <p
                      className={`text-sm font-semibold ${
                        identifierType === "email"
                          ? "text-blue-700 dark:text-blue-300"
                          : "text-purple-700 dark:text-purple-300"
                      }`}
                    >
                      {identifier}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-gray-500"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      {identifierType === "email"
                        ? "Can't find it? Check your spam folder"
                        : "Check your email associated with this username"}
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
                    Return to Login
                  </Link>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setIdentifier("");
                      setError("");
                      setSuccess("");
                    }}
                    className="w-full py-3 text-sm font-semibold rounded-xl border-2 border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-[1.02]"
                  >
                    Try Different{" "}
                    {identifierType === "email" ? "Email" : "Username"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Icons */}
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

          {/* Security Notice */}
          <div className="mt-7 text-center animate-slideUp">
            <div className="inline-flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 px-6 py-3.5 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <Shield className="h-5 w-5 text-green-600 animate-pulse" />
              <span>{t("landing.trustBadges.ssl256Bit")}</span>
            </div>
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

      {/* Add CSS for custom animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
