// src/pages/auth/Login/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import Header from "../../../components/header/Header.jsx";
import {
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useLanguageContext } from "../../../contexts/LanguageContext";
import { useAuth } from "../../../contexts/AuthContext";
import { twoFactorService } from "../../../services/twoFactorService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguageContext();
  const { login, loading: authLoading, isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("email");
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  //debugging
  useEffect(() => {
    window.onerror = function (message, source, lineno, colno, error) {
      console.log("🔥 Global error caught:", {
        message,
        source,
        lineno,
        colno,
        error,
      });
    };

    window.addEventListener("unhandledrejection", function (event) {
      console.log("🔥 Unhandled promise rejection:", event.reason);
    });
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo =
        location.state?.from ||
        (user.role === "superadmin" || user.role === "admin"
          ? "/admin/dashboard"
          : "/dashboard");
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (error) setError("");

    if (name === "identifier") {
      if (value.includes("@")) {
        setLoginType("email");
      } else {
        setLoginType("username");
      }
    }
  };

  const validateForm = () => {
    if (!formData.identifier.trim()) {
      setError("Please enter your email or username");
      return false;
    }

    if (!formData.password.trim()) {
      setError("Please enter your password");
      return false;
    }

    if (loginType === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.identifier.trim())) {
        setError("Please enter a valid email address");
        return false;
      }
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError("");

    const credentials = {
      [loginType === "email" ? "email" : "username"]:
        formData.identifier.trim(),
      password: formData.password,
      rememberMe: formData.rememberMe,
    };

    try {
      const result = await login(credentials);

      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setTempUserId(result.tempUserId);
        setIsLoading(false);
        return;
      }

      if (result.success) {
        // Get redirect path from location state or determine based on role
        const from = location.state?.from;
        const defaultPath =
          result.user?.role === "superadmin" || result.user?.role === "admin"
            ? "/admin/dashboard"
            : "/dashboard";

        const redirectTo = from || defaultPath;

        // Use replace to prevent going back to login page
        navigate(redirectTo, { replace: true });
      } else {
        setError(result.error || "Invalid credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error("Login error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update handleOTPSubmit
  const handleOTPSubmit = async (e) => {
    e.preventDefault();

    if (otpCode.length !== 6) {
      setOtpError("Please enter the 6-digit code");
      return;
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const result = await twoFactorService.verifyLoginOTP({
        userId: tempUserId,
        code: otpCode,
      });

      if (result && result.token) {
        // Call login with the token and user data
        const loginResult = await login({
          token: result.token,
          user: result.user,
        });

        if (loginResult && loginResult.success) {
          navigate("/dashboard", { replace: true });
        } else {
          setOtpError(loginResult?.error || "Login failed after verification");
        }
      } else {
        setOtpError(result?.message || "Invalid verification code");
      }
    } catch (err) {
      setOtpError(err.message || "Invalid code. Please try again.");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendCode = async () => {
   

    if (!tempUserId) {
      setOtpError("Session expired. Please go back and log in again.");
      return; 
    }

    setOtpLoading(true);
    setOtpError("");

    try {
      const response = await twoFactorService.resendOTP(tempUserId);
      console.log("Resend response:", response);
      setOtpError("");
      // Show success inline instead of alert
      setOtpError("✅ New code sent! Check your email.");
    } catch (err) {
      console.error("Resend error:", err);
      setOtpError(
        err.response?.data?.message ||
          "Failed to resend code. Please try again.",
      );
    } finally {
      setOtpLoading(false);
    }
  };

  const isProcessing = isLoading || authLoading;

  // Don't render login form if already authenticated
  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Redirecting to dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
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

      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
        <div className="w-full max-w-md mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-6 animate-slideDown">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-800 rounded-full mb-4 shadow-lg">
              <Lock className="text-white" size={28} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Sign in to Byvault Finance
            </p>
          </div>

          {/* Form Card */}
          {requiresTwoFactor ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Shield
                    size={28}
                    className="text-green-600 dark:text-green-400"
                  />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  Two-Factor Verification
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Enter the 6-digit code sent to your email
                </p>
              </div>

              {otpError && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-600 dark:text-red-400 flex-shrink-0"
                  />
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {otpError}
                  </p>
                </div>
              )}

              <form onSubmit={handleOTPSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtpCode(value);
                    }}
                    placeholder="000000"
                    maxLength="6"
                    className="w-full px-4 py-3 text-center text-2xl font-mono tracking-widest border-2 border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none transition-all"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Code expires in 10 minutes
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={otpLoading || otpCode.length !== 6}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {otpLoading ? (
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
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Lock size={18} strokeWidth={2.5} />
                      Verify & Sign In
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={otpLoading}
                  className="w-full py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline mt-2"
                >
                  Resend verification code
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRequiresTwoFactor(false);
                    setOtpCode("");
                    setOtpError("");
                    setTempUserId(null);
                  }}
                  className="w-full py-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:underline transition-colors"
                >
                  ← Back to login
                </button>
              </form>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 animate-fadeIn">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Lock
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                Enter Your Credentials
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email/Username Field */}
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    {loginType === "email" ? "Email Address" : "Username"}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="identifier"
                      value={formData.identifier}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 text-sm font-medium rounded-xl border-2 border-gray-300/70 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-0 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder={
                        loginType === "email"
                          ? "your.email@example.com"
                          : "your_username"
                      }
                      required
                      disabled={isProcessing}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      {loginType === "email" ? (
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
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You can login with your email address or username
                  </p>
                </div>

                {/* Password Field */}
                <div className="group">
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-semibold text-gray-800 dark:text-gray-200">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 pr-12 text-sm font-medium rounded-xl border-2 border-gray-300/70 dark:border-gray-600/50 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:ring-offset-0 transition-all duration-300 outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                      placeholder="Enter your password"
                      required
                      disabled={isProcessing}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 transition-colors"
                      disabled={isProcessing}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-offset-0"
                    disabled={isProcessing}
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Keep me signed in
                  </label>
                </div>

                {/* Sign In Button */}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
                >
                  {isProcessing ? (
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
                      <span className="font-semibold">Signing In...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={18} strokeWidth={2.5} />
                      <span className="font-semibold">Sign in to Account</span>
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-6 pt-5 border-t border-gray-200/50 dark:border-gray-700/50">
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  New to Byvault Finance?
                </p>
                <button
                  onClick={() => navigate("/register")}
                  disabled={isProcessing}
                  className="w-full py-3 text-sm font-semibold rounded-xl border-2 border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center gap-3 group hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="group-hover:scale-110 transition-transform"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <line x1="19" y1="8" x2="19" y2="14" />
                    <line x1="22" y1="11" x2="16" y2="11" />
                  </svg>
                  Create New Account
                </button>
              </div>
            </div>
          )}

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
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:text-green-600 dark:group-hover:text-green-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
              </div>
              <span className="font-medium">Support</span>
            </Link>
            <Link
              to="/terms-conditions"
              className="group flex items-center gap-2.5 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all duration-300"
            >
              <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-purple-50 dark:group-hover:bg-purple-900/20 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:text-purple-600 dark:group-hover:text-purple-400"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <span className="font-medium">Terms</span>
            </Link>
          </div>

          {/* Security Notice */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 px-6 py-3 rounded-full border border-gray-200 dark:border-gray-700 shadow-sm">
              <Shield className="h-5 w-5 text-green-600 animate-pulse" />
              <span>{t("landing.trustBadges.ssl256Bit")}</span>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-center text-xs font-medium text-gray-500 dark:text-gray-500 mt-6 py-3 border-t border-gray-200/30 dark:border-gray-700/30">
            By signing in, you agree to our Terms of Service and Privacy Policy.
            Your data is protected with bank-grade security.
          </p>

          {/* Copyright */}
          <p className="text-center text-xs font-medium text-gray-500 dark:text-gray-500 mt-2">
            © {new Date().getFullYear()}{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent font-bold">
              Byvault Finance
            </span>
            . All Rights Reserved.
          </p>
        </div>
      </div>

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
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
        .animate-slideDown {
          animation: slideDown 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Login;
