// src/pages/user/Transfer/Transfer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Globe,
  Users,
  Clock,
  DollarSign,
  ChevronRight,
  Lock,
  Zap,
  Building2,
  TrendingUp,
  TrendingDown,
  ArrowLeftRight,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { dashboardService } from "../../../services/dashhboardService";

const Transfer = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loadingTransfers, setLoadingTransfers] = useState(true);

  // Same pattern as Dashboard.jsx — uses dashboardService.getRecentTransactions
  useEffect(() => {
    const fetchRecentTransactions = async () => {
      if (!user) return;
      try {
        setLoadingTransfers(true);
        const transactions = await dashboardService.getRecentTransactions(5);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error("Error fetching recent transactions:", error);
        setRecentTransactions([]);
      } finally {
        setLoadingTransfers(false);
      }
    };

    fetchRecentTransactions();
  }, [user]);

  const transferTypes = [
    {
      id: "local",
      title: "Local Transfer",
      description: "Send money to local accounts instantly",
      icon: Users,
      color: "blue",
      features: [
        { icon: Zap, text: "Instant", color: "text-green-600" },
        { icon: DollarSign, text: "0% Fee", color: "text-blue-600" },
        { icon: Building2, text: "All Local", color: "text-purple-600" },
      ],
      route: "/transfer/local",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "international",
      title: "International Wire",
      description: "Global transfers within 72 hours",
      icon: Globe,
      color: "purple",
      features: [
        { icon: Lock, text: "Secure", color: "text-blue-600" },
        { icon: Clock, text: "72hrs", color: "text-orange-600" },
        { icon: Globe, text: "Worldwide", color: "text-green-600" },
      ],
      route: "/transfer/international",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const handleSelectType = (type) => {
    setSelectedType(type.id);
    setTimeout(() => {
      navigate(type.route);
    }, 300);
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
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Send Money"
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
            {/* Hero Banner */}
            <div className="bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Send size={40} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Send Money
                </h2>
                <p className="text-center text-white/90 text-sm">
                  Swift & Secure Money Transfer
                </p>
              </div>
            </div>

            {/* Transfer Type Buttons */}
            <div className="space-y-4 mb-6">
              {transferTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type)}
                    className={`w-full bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
                      isSelected
                        ? "border-blue-500 dark:border-blue-400 shadow-xl scale-[1.02]"
                        : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
                    }`}
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <Icon size={32} className="text-white" />
                      </div>
                      <div className="flex-1 text-left">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                          {type.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {type.description}
                        </p>
                        <div className="flex items-center gap-3 flex-wrap">
                          {type.features.map((feature, idx) => {
                            const FeatureIcon = feature.icon;
                            return (
                              <span
                                key={idx}
                                className={`flex items-center gap-1 text-xs font-semibold ${feature.color}`}
                              >
                                <FeatureIcon size={14} />
                                {feature.text}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <ChevronRight
                        size={24}
                        className="text-gray-400 dark:text-gray-500 flex-shrink-0"
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-gray-700 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Secure Transaction
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All transfers are protected by bank-grade encryption and
                    require verification for your security. Never share your PIN
                    with anyone.
                  </p>
                </div>
              </div>
            </div>

            {/* Recent Transfers — same data + rendering as Dashboard Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Transfers
              </h3>

              {loadingTransfers ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          <div className="h-2 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                        </div>
                      </div>
                      <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.slice(0, 5).map((transaction, index) => (
                    <div
                      key={transaction._id || index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            transaction.type === "deposit"
                              ? "bg-green-100 dark:bg-green-900"
                              : "bg-red-100 dark:bg-red-900"
                          }`}
                        >
                          {transaction.type === "deposit" ? (
                            <TrendingDown
                              className="text-green-600 dark:text-green-400 rotate-180"
                              size={18}
                            />
                          ) : (
                            <TrendingUp
                              className="text-red-600 dark:text-red-400"
                              size={18}
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description ||
                              (transaction.type === "deposit"
                                ? "Deposit"
                                : transaction.type === "withdraw"
                                  ? "Withdrawal"
                                  : "Transfer")}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p
                          className={`text-sm font-bold ${
                            transaction.type === "deposit"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}$
                          {Math.abs(transaction.amount).toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                          {transaction.currency || "fiat"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ArrowLeftRight
                      size={32}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No Recent Transfers
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your transfer history will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Transfer;
