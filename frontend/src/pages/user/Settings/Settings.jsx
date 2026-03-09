// src/pages/user/Settings/AccountSettings.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  Lock,
  Shield,
  CreditCard,
  ChevronRight,
  Headphones,
  Clock,
  MessageSquare,
  Phone,
  Camera,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const settingsOptions = [
    {
      id: "profile",
      title: "Profile Information",
      description: "Your personal information and account details",
      icon: User,
      route: "/settings/profile",
      color: "blue",
    },
    {
      id: "password",
      title: "Password Settings",
      description: "Update your account password to maintain security",
      icon: Lock,
      route: "/settings/password",
      color: "purple",
    },
    {
      id: "two-factor",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security to your account",
      icon: Shield,
      route: "/settings/two-factor",
      color: "green",
      badge: user?.twoFactorEnabled ? "On" : null,
    },
    {
      id: "transaction-pin",
      title: "Transaction PIN",
      description: "Secure your transactions with a PIN",
      icon: CreditCard,
      route: "/settings/transaction-pin",
      color: "orange",
    },
  ];

  const handleSelectOption = (option) => {
    navigate(option.route);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";
  const accountNumber = user?.accountNumber || "47794377394";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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
        pageTitle="Account Settings"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="settings"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Profile Card */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-8 mb-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10 flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-cyan-200 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-blue-600">
                      {initials}
                    </span>
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Camera size={16} className="text-blue-600" />
                  </button>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-1">{userName}</h2>
                  <p className="text-white/90 text-sm">
                    Account #{accountNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Settings Options */}
            <div className="space-y-3 mb-6">
              {settingsOptions.map((option, index) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md transition-all"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 bg-${option.color}-100 dark:bg-${option.color}-900/30 rounded-xl flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon
                          size={24}
                          className={`text-${option.color}-600 dark:text-${option.color}-400`}
                        />
                      </div>

                      <div className="flex-1 text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {option.title}
                          </h3>
                          {option.badge && (
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-semibold rounded-full">
                              {option.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                          {option.description}
                        </p>
                      </div>

                      <ChevronRight
                        size={20}
                        className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Support Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Headphones
                    size={32}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Need Assistance?
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Our expert support team is available
                </p>
                <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                    24/7 Live Support
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Clock
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      Quick Response
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    &lt; 5 minutes
                  </p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield
                      size={16}
                      className="text-gray-600 dark:text-gray-400"
                    />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">
                      Secure Chat
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Encrypted
                  </p>
                </div>
              </div>

              <Link to="/support">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 mb-3">
                  <MessageSquare size={20} />
                  Start Live Chat
                </button>
              </Link>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 flex items-center justify-center gap-2">
                <Phone size={16} />
                Or call us directly for urgent matters
              </p>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AccountSettings;
