/* eslint-disable no-unused-vars */
// src/pages/user/Settings/TransactionPin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  Lock,
  AlertCircle,
  CheckCircle,
  Loader,
  AlertTriangle,
  X,
  ShieldCheck,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { userService } from "../../../services/userService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const TransactionPin = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    newPin: "",
    currentPassword: "",
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 4 digits for PIN
    if (name === "newPin") {
      if (value.length <= 4 && /^\d*$/.test(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.newPin.length !== 4) {
      showNotification("error", "Transaction PIN must be exactly 4 digits");
      return;
    }
    if (!formData.currentPassword) {
      showNotification("error", "Please enter your current password for verification");
      return;
    }

    setLoading(true);

    try {
      const response = await userService.changeTransactionPin({
        newPin: formData.newPin,
        currentPassword: formData.currentPassword,
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          setShowModal(false);
          setSuccess(false);
          setFormData({ newPin: "", currentPassword: "" });
          showNotification("success", "Transaction PIN updated successfully!");
        }, 2000);
      }
    } catch (error) {
      console.error("PIN change error:", error);
      showNotification("error", error.message || "Failed to change PIN. Please try again.");
    } finally {
      setLoading(false);
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
              <CheckCircle size={20} />
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
        pageTitle="Transaction Settings"
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
            <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <CreditCard size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Transaction PIN</h2>
                  <p className="text-white/90 text-sm">
                    Secure your transactions with a PIN
                  </p>
                </div>
              </div>
            </div>

            {/* PIN Info Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="text-orange-600 dark:text-orange-400" size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                    What is a Transaction PIN?
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Your Transaction PIN is a 4-digit security code used to authorize
                    financial transactions. This adds an extra layer of protection to
                    prevent unauthorized access to your funds.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">
                  When You'll Need Your PIN:
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>Sending money to other accounts</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>Making bill payments</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>International wire transfers</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 mt-1.5 flex-shrink-0"></div>
                    <span>Large withdrawals or transfers</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <CreditCard size={20} />
                Change Transaction PIN
              </button>
            </div>

            {/* Security Alert */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-20 lg:mb-8">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                    Security Alert
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Keep your transaction PIN confidential. Never share it with
                    anyone, including bank staff. We will never ask for your PIN via
                    email, phone, or text message.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Change PIN Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full relative">
            {!success ? (
              <>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      Change Transaction PIN
                    </h3>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        setFormData({ newPin: "", currentPassword: "" });
                        setError("");
                      }}
                      className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                    >
                      <X size={20} className="text-gray-600 dark:text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* New PIN */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        New Transaction PIN
                      </label>
                      <div className="relative">
                        <CreditCard
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="password"
                          name="newPin"
                          value={formData.newPin}
                          onChange={handleChange}
                          placeholder="Enter new transaction PIN"
                          maxLength="4"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all tracking-widest text-lg text-center font-mono"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Create a secure PIN you can remember
                      </p>
                    </div>

                    {/* Current Password */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <Lock
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="password"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          placeholder="Enter your current password"
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 focus:border-transparent transition-all"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        For security verification
                      </p>
                    </div>

                    {/* Security Alert */}
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="text-yellow-600 dark:text-yellow-400 flex-shrink-0" size={20} />
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          Keep your transaction PIN confidential. Never share it with
                          anyone.
                        </p>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                    >
                      {loading ? (
                        <>
                          <Loader className="animate-spin" size={20} />
                          Updating PIN...
                        </>
                      ) : (
                        <>
                          <CreditCard size={20} />
                          Update Transaction PIN
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  PIN Updated!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Your transaction PIN has been successfully changed
                </p>
              </div>
            )}
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

export default TransactionPin;