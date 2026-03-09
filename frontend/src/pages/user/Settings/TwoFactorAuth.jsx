/* eslint-disable no-unused-vars */
// src/pages/user/Settings/TwoFactorAuth.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Mail,
  Check,
  AlertCircle,
  Info,
  Lock,
  Clock,
  ShieldCheck,
  AlertTriangle,
  X,
  Loader,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { twoFactorService } from "../../../services/twoFactorService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const TwoFactorAuth = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  useEffect(() => {
    fetch2FAStatus();
  }, []);

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const fetch2FAStatus = async () => {
    try {
      setLoading(true);
      const response = await twoFactorService.get2FAStatus();
      if (response.success) {
        setIsEnabled(response.enabled);
      }
    } catch (error) {
      console.error("Error fetching 2FA status:", error);
      showNotification("error", "Failed to load 2FA status");
    } finally {
      setLoading(false);
    }
  };

  const handleEnable2FA = async () => {
    setActionLoading(true);
    setError("");

    try {
      const response = await twoFactorService.enable2FA();
      if (response.success) {
        setShowVerifyModal(true);
        setCountdown(600); // 10 minutes in seconds
        setCanResend(false);
        showNotification("success", "Verification code sent to your email");
      }
    } catch (error) {
      console.error("Error enabling 2FA:", error);
      showNotification("error", error.message || "Failed to enable 2FA");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError("Please enter a valid 6-digit code");
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const response = await twoFactorService.verifyAndEnable2FA({
        code: verificationCode,
      });

      if (response.success) {
        setIsEnabled(true);
        setShowVerifyModal(false);
        setVerificationCode("");
        showNotification("success", "Two-factor authentication enabled successfully");
      }
    } catch (error) {
      console.error("Error verifying code:", error);
      setError(error.message || "Invalid verification code");
    } finally {
      setActionLoading(false);
    }
  };

  const handleResendCode = async () => {
    setActionLoading(true);
    setError("");

    try {
      const response = await twoFactorService.enable2FA();
      if (response.success) {
        setCountdown(600);
        setCanResend(false);
        showNotification("success", "New verification code sent to your email");
      }
    } catch (error) {
      console.error("Error resending code:", error);
      showNotification("error", error.message || "Failed to resend code");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    if (!password) {
      setError("Please enter your password");
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      const response = await twoFactorService.disable2FA({ password });

      if (response.success) {
        setIsEnabled(false);
        setShowConfirmDialog(false);
        setPassword("");
        showNotification("success", "Two-factor authentication disabled");
      }
    } catch (error) {
      console.error("Error disabling 2FA:", error);
      setError(error.message || "Failed to disable 2FA");
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggle2FA = () => {
    if (isEnabled) {
      setShowConfirmDialog(true);
    } else {
      handleEnable2FA();
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const securityTips = [
    "Use a strong, unique password",
    "Enable two-factor authentication",
    "Keep your email secure",
    "Log out when using shared devices",
    "Regularly check your account activity",
  ];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading 2FA status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : notification.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-yellow-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <Check size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="font-medium text-sm">{notification.message}</p>
            <button
              onClick={() => setNotification({ show: false, type: "", message: "" })}
              className="ml-2 hover:bg-white/20 rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Two-Factor Authentication"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Header Card */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Shield size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">
                    Email-Based Two-Factor Authentication
                  </h2>
                  <p className="text-white/90 text-sm">
                    Add an extra layer of security to your account
                  </p>
                </div>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isEnabled 
                      ? 'bg-green-100 dark:bg-green-900/30' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Shield
                      size={24}
                      className={isEnabled ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Current Status
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      {isEnabled ? (
                        <>
                          <Check size={16} className="text-green-600 dark:text-green-400" />
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            Enabled
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          Disabled
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {isEnabled && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-4">
                  <p className="text-sm text-gray-900 dark:text-white">
                    When enabled, a 6-digit verification code will be sent to your
                    email address{" "}
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {userEmail}
                    </span>{" "}
                    each time you log in to your account.
                  </p>
                </div>
              )}

              {/* How it Works */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3 mb-3">
                  <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={20} />
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                    How Two-Factor Authentication Works
                  </h4>
                </div>
                <ul className="space-y-2 ml-8">
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>
                      When you log in with your password, a 6-digit code will be
                      sent to your email
                    </span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>You must enter this code to complete your login</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>This adds an extra layer of security to your account</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>The code expires after 10 minutes for security</span>
                  </li>
                </ul>
              </div>

              {/* Toggle Button */}
              <button
                onClick={handleToggle2FA}
                disabled={actionLoading}
                className={`w-full font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                  isEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {actionLoading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Processing...
                  </>
                ) : isEnabled ? (
                  <>
                    <AlertTriangle size={20} />
                    Disable Two-Factor Authentication
                  </>
                ) : (
                  <>
                    <ShieldCheck size={20} />
                    Enable Two-Factor Authentication
                  </>
                )}
              </button>
            </div>

            {/* Security Tips */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Info className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  Security Tips
                </h3>
              </div>

              <ul className="space-y-3">
                {securityTips.map((tip, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400"
                  >
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={14} className="text-green-600 dark:text-green-400" />
                    </div>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>

      {/* Enable 2FA - Verification Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Verify Your Email
              </h3>
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setVerificationCode("");
                  setError("");
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              We've sent a 6-digit verification code to{" "}
              <span className="font-semibold text-green-600 dark:text-green-400">
                {userEmail}
              </span>
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="000000"
                maxLength="6"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-center text-2xl font-mono tracking-widest text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Code expires in {formatTime(countdown)}
                </span>
              </div>
              <button
                onClick={handleResendCode}
                disabled={!canResend || actionLoading}
                className="text-sm text-green-600 dark:text-green-400 hover:underline disabled:opacity-50 disabled:no-underline"
              >
                Resend Code
              </button>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setVerificationCode("");
                  setError("");
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyCode}
                disabled={actionLoading || verificationCode.length !== 6}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader className="animate-spin mx-auto" size={20} />
                ) : (
                  "Verify"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Disable 2FA - Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <AlertTriangle className="text-red-600 dark:text-red-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Disable Two-Factor Authentication?
              </h3>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Please enter your password to confirm disabling two-factor authentication.
            </p>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 mb-4">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPassword("");
                  setError("");
                }}
                className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDisable2FA}
                disabled={actionLoading || !password}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? (
                  <Loader className="animate-spin mx-auto" size={20} />
                ) : (
                  "Disable"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      <style>{`
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default TwoFactorAuth;