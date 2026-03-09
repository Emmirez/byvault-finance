// src/pages/user/Transfers/InternationalTransfer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Globe,
  ChevronRight,
  Lock,
  Building2,
  Bitcoin,
  Banknote,
  MoreHorizontal,
  Shield,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const InternationalTransfer = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);

  const transferMethods = [
    {
      id: "wire-transfer",
      name: "Wire Transfer",
      description: "Transfer funds directly to international bank accounts.",
      icon: Building2,
      color: "blue",
      route: "/transfer/international/wire",
    },
    {
      id: "cryptocurrency",
      name: "Cryptocurrency",
      description: "Send funds to your cryptocurrency wallet.",
      icon: Bitcoin,
      color: "orange",
      route: "/transfer/international/crypto",
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Transfer funds to your PayPal account.",
      icon: Banknote,
      color: "blue",
      route: "/transfer/international/paypal",
    },
    {
      id: "wise",
      name: "Wise Transfer",
      description: "Transfer with lower fees using Wise.",
      icon: Globe,
      color: "green",
      route: "/transfer/international/wise",
      featured: true,
    },
    {
      id: "cashapp",
      name: "Cash App",
      description: "Quick transfers to your Cash App account.",
      icon: DollarSign,
      color: "green",
      route: "/transfer/international/cashapp",
    },
  ];

  const moreOptions = [
    { 
      id: "zelle", 
      name: "Zelle", 
      description: "Fast US transfers",
      icon: "⚡",
      color: "purple"
    },
    { 
      id: "venmo", 
      name: "Venmo", 
      description: "Social payments",
      icon: "💙",
      color: "blue"
    },
    { 
      id: "alipay", 
      name: "Alipay", 
      description: "Chinese payments",
      icon: "🅰️",
      color: "blue"
    },
    { 
      id: "revolut", 
      name: "Revolut", 
      description: "European transfers",
      icon: "🔷",
      color: "indigo"
    },
  ];

  const handleMethodSelect = (method) => {
    navigate(method.route);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const getIconColor = (color) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400",
      yellow: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400",
    };
    return colors[color] || colors.blue;
  };

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
        onBackClick={() => navigate(-1)}
        pageTitle="International Transfer"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="international-transfer"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Select Transfer Method
            </h2>

            <div className="space-y-3 mb-6">
              {transferMethods.map((method) => {
                const Icon = method.icon;
                const isFeatured = method.featured;

                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    className={`w-full p-4 rounded-xl border-2 transition-all bg-white dark:bg-gray-800 hover:shadow-md ${
                      isFeatured
                        ? "border-green-300 dark:border-green-700"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-14 h-14 rounded-xl flex items-center justify-center ${getIconColor(
                          method.color
                        )}`}
                      >
                        <Icon size={28} />
                      </div>

                      <div className="flex-1 text-left">
                        <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                          {method.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {method.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={20}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                  </button>
                );
              })}

              <button
                onClick={() => setShowMoreOptions(!showMoreOptions)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                    <MoreHorizontal size={28} />
                  </div>

                  <div className="flex-1 text-left">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                      More Options
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Zelle, Venmo, Revolut, and more.
                    </p>
                  </div>

                  <ChevronRight
                    size={20}
                    className={`text-gray-400 dark:text-gray-500 transition-transform ${
                      showMoreOptions ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {showMoreOptions && (
                <div className="ml-4 space-y-2 animate-fadeIn">
                  {moreOptions.map((option) => (
                    <button
                      key={option.id}
                      onClick={() => navigate(`/transfer/international/${option.id}`)}
                      className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center text-xl">
                          {option.icon}
                        </div>
                        <div className="flex-1 text-left">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                            {option.name}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {option.description}
                          </p>
                        </div>
                        <ChevronRight
                          size={16}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Secure Transaction
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All transfers are encrypted and processed securely. Never share
                    your PIN with anyone.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 mb-20 lg:mb-8"
            >
              <Home size={18} />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

const DollarSign = ({ size, className }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="1" x2="12" y2="23" />
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

export default InternationalTransfer;