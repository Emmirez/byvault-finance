/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/user/PayBills/PayBills.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Zap,
  Wifi,
  Tv,
  Phone,
  Droplet,
  ChevronRight,
  Lock,
  Clock,
  DollarSign,
  Shield,
  AlertCircle,
  X,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { useEffect } from "react";

const PayBills = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedType, setSelectedType] = useState(null);
  const [kycError, setKycError] = useState(null);
  

  const billTypes = [
    {
      id: "electricity",
      title: "Electricity Bill",
      description: "Pay your power utility bills instantly",
      icon: Zap,
      color: "yellow",
      features: [
        { icon: Clock, text: "Instant", color: "text-green-600" },
        { icon: DollarSign, text: "No Fee", color: "text-blue-600" },
        { icon: Shield, text: "Secure", color: "text-purple-600" },
      ],
      route: "/paybills/electricity",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      id: "internet",
      title: "Internet & Cable",
      description: "Pay broadband and TV subscriptions",
      icon: Wifi,
      color: "blue",
      features: [
        { icon: Zap, text: "Quick", color: "text-green-600" },
        { icon: Shield, text: "Safe", color: "text-blue-600" },
        { icon: Clock, text: "24/7", color: "text-orange-600" },
      ],
      route: "/paybills/internet",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      id: "water",
      title: "Water Bill",
      description: "Settle water utility payments easily",
      icon: Droplet,
      color: "cyan",
      features: [
        { icon: Clock, text: "Fast", color: "text-green-600" },
        { icon: DollarSign, text: "0% Fee", color: "text-blue-600" },
        { icon: Shield, text: "Protected", color: "text-purple-600" },
      ],
      route: "/paybills/water",
      gradient: "from-cyan-500 to-blue-500",
    },
    {
      id: "phone",
      title: "Phone & Mobile",
      description: "Recharge airtime and data bundles",
      icon: Phone,
      color: "green",
      features: [
        { icon: Zap, text: "Instant", color: "text-green-600" },
        { icon: DollarSign, text: "Low Fee", color: "text-blue-600" },
        { icon: Clock, text: "Real-time", color: "text-orange-600" },
      ],
      route: "/paybills/phone",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      id: "tv",
      title: "TV Subscription",
      description: "Renew cable and streaming services",
      icon: Tv,
      color: "purple",
      features: [
        { icon: Clock, text: "Quick", color: "text-green-600" },
        { icon: Shield, text: "Secure", color: "text-blue-600" },
        { icon: Zap, text: "Easy", color: "text-purple-600" },
      ],
      route: "/paybills/tv",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  // const handleSelectType = (type) => {
  //   setSelectedType(type.id);
  //   setTimeout(() => {
  //     navigate(type.route);
  //   }, 300);
  // };

useEffect(() => {
  refreshUser().then((freshUser) => {
    if (freshUser && !freshUser.isVerified) {
      const kycStatus = freshUser?.kycStatus || "";
      if (["pending", "submitted", "under_review", "reviewing"].includes(kycStatus)) {
        // Don't auto-show error, just store the status for when they click
      }
    }
  }).catch(() => {});
}, []);

const handleSelectType = (type) => {
  if (!user?.isVerified) {
    const kycStatus = user?.kycStatus || "";

    if (["pending", "submitted", "under_review", "reviewing"].includes(kycStatus)) {
      setKycError("pending");
    } else {
      setKycError("unverified");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  setSelectedType(type.id);
  setTimeout(() => navigate(type.route), 300);
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
    {kycError && (
  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6 flex items-start gap-3">
    <AlertCircle size={20} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
    <div className="flex-1">
      {kycError === "pending" ? (
        <>
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            Verification In Progress
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
            Your KYC documents have been submitted and are under review. You'll be notified once approved.
          </p>
          <button
            onClick={() => navigate("/kyc/status")}
            className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 underline hover:text-red-800"
          >
            Check verification status →
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-semibold text-red-800 dark:text-red-300">
            KYC Verification Required
          </p>
          <p className="text-xs text-red-700 dark:text-red-400 mt-1">
            Your account is not yet verified. Please complete KYC verification to access bill payments.
          </p>
          <button
            onClick={() => navigate("/kyc")}
            className="mt-2 text-xs font-semibold text-red-600 dark:text-red-400 underline hover:text-red-800"
          >
            Complete Verification →
          </button>
        </>
      )}
    </div>
    <button onClick={() => setKycError(null)}>
      <X size={16} className="text-red-400 hover:text-red-600" />
    </button>
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
        pageTitle="Pay Bills"
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
            <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Receipt size={40} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Pay Bills
                </h2>
                <p className="text-center text-white/90 text-sm">
                  Quick & Convenient Bill Payments
                </p>
              </div>
            </div>

            <div className="space-y-4 mb-6">
              {billTypes.map((type, index) => {
                const Icon = type.icon;
                const isSelected = selectedType === type.id;

                return (
                  <button
                    key={type.id}
                    onClick={() => handleSelectType(type)}
                    className={`w-full bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all ${
                      isSelected
                        ? "border-purple-500 dark:border-purple-400 shadow-xl scale-[1.02]"
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

            <div className="bg-purple-50 dark:bg-gray-800 rounded-xl p-4 border border-purple-200 dark:border-gray-700 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Secure Payment
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All bill payments are encrypted and verified for your
                    protection. Payment confirmations are sent immediately after
                    processing.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Bill Payments
              </h3>
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Receipt
                    size={32}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  No Recent Payments
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Your payment history will appear here
                </p>
              </div>
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

export default PayBills;
