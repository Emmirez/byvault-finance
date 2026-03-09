/* eslint-disable no-unused-vars */
// src/pages/user/Deposit/DepositSuccess.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, Home, Receipt, Clock } from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const DepositSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { amount, method, transactionId, fee = "0", total = amount } = location.state || {
    amount: "0",
    method: "Unknown",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleBack = () => {
    navigate(-1); 
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={handleBack}
        pageTitle="Deposit Status"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="deposit"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Success Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 border border-gray-200 dark:border-gray-700 text-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Payment Submitted Successfully!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your deposit request has been received and is being processed
              </p>

              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Transaction ID
                  </span>
                  <span className="text-sm font-mono font-bold text-gray-900 dark:text-white">
                    {transactionId || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Amount
                  </span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${parseFloat(amount).toFixed(2)}
                  </span>
                </div>
                {parseFloat(fee) > 0 && (
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Fee
                    </span>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                      ${parseFloat(fee).toFixed(2)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Method
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {method}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-xs font-semibold">
                    <Clock size={12} />
                    Pending Verification
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Date
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3 text-left">
                  <Clock size={20} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                      What happens next?
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Our team will verify your payment proof within 24 hours. Once
                      verified, the funds will be credited to your account. You will
                      receive a notification via email.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Home size={20} />
                  Back to Dashboard
                </button>

                <button
                  onClick={() => navigate("/transactions")}
                  className="w-full py-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border-2 border-gray-200 dark:border-gray-700 transition-all flex items-center justify-center gap-2"
                >
                  <Receipt size={20} />
                  View Transactions
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default DepositSuccess;