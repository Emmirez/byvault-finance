// src/pages/user/Transfers/TransferHold.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Clock,
  AlertCircle,
  Phone,
  MessageCircle,
  Mail,
  HelpCircle,
  ArrowLeft,
  Home,
  FileText,
  Shield,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";

const TransferHold = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    amount,
    recipient,
    type = "local",
  } = location.state || {
    amount: "0",
    recipient: "Recipient",
    type: "local",
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const [transactionRef] = useState(
    () => "TRX-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
  );

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)} 
        pageTitle="Transfer Status"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="transfers"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Hold/Verification Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 mb-6 border border-gray-200 dark:border-gray-700 text-center relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 dark:bg-amber-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200 dark:bg-blue-900/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                {/* Animated Clock Icon */}
                <div className="w-24 h-24 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <Clock
                    size={48}
                    className="text-amber-600 dark:text-amber-400 animate-pulse"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Transfer On Hold
                </h2>

                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6 border border-amber-200 dark:border-amber-800">
                  <p className="text-amber-800 dark:text-amber-300 text-sm">
                    Your transfer is currently{" "}
                    <span className="font-bold">pending verification</span> and
                    has been temporarily placed on hold for your security.
                  </p>
                </div>

                {/* Transfer Details */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 mb-6 text-left">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={18} className="text-blue-600" />
                    Transfer Details
                  </h3>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-600">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Amount
                      </span>
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        ${parseFloat(amount).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Recipient
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {recipient}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Transfer Type
                      </span>
                      <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize">
                        {type} Transfer
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-xs font-semibold">
                        <Clock size={12} />
                        Pending Verification
                      </span>
                    </div>

                    <div className="flex justify-between items-center dark:text-white">
                      <span className="text-sm text-gray-600 dark:text-gray-400 ">
                        Reference ID
                      </span>
                      <span className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                        {transactionRef}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Security Message */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3 text-left">
                    <Shield
                      size={20}
                      className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-1 text-sm">
                        Why is my transfer on hold?
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        For your security, we review certain transactions to
                        prevent fraud. This is a standard procedure and your
                        funds are safe.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact Support Section */}
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 justify-center">
                    <HelpCircle size={18} className="text-blue-600" />
                    Need Help? Contact Support
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="tel:+1234567890"
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group"
                    >
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <Phone
                          size={20}
                          className="text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        Call Support
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        24/7 Available
                      </p>
                    </a>

                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate("/support");
                      }}
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group"
                    >
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <MessageCircle
                          size={20}
                          className="text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <p className="text-xs font-semibold text-gray-900 dark:text-white">
                        Live Chat
                      </p>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400">
                        Instant Response
                      </p>
                    </a>

                    <a
                      href="mailto:admin@byvaultonline.com"
                      className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl p-4 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all group col-span-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                          <Mail
                            size={20}
                            className="text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform"
                          />
                        </div>
                        <div className="text-left">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            Email Support
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            admin@byvaultonline.com
                          </p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500">
                            24-48h response time
                          </p>
                        </div>
                      </div>
                    </a>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Home size={20} />
                    Back to Dashboard
                  </button>

                  <button
                    onClick={() => navigate("/support")}
                    className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Contact Support
                  </button>

                  <button
                    onClick={() => navigate(-1)}
                    className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft size={18} />
                    Go Back
                  </button>
                </div>

                {/* Additional Info */}
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-6 flex items-center justify-center gap-1">
                  <AlertCircle size={12} />
                  This is a security hold. Your funds have not been debited yet.
                </p>
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

export default TransferHold;
