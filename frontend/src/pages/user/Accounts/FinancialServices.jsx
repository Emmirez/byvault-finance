// src/pages/user/Services/FinancialServices.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  DollarSign,
  FileText,
  CreditCard,
  ChevronRight,
  Sparkles,
  Zap,
  Shield,
  Clock,
  CheckCircle,
  TrendingUp,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const FinancialServices = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const services = [
    {
      id: "loans",
      title: "Loans",
      description: "Quick approval process with competitive rates",
      icon: Building2,
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
      route: "/apply-loan",
      features: [
        { icon: Zap, text: "Fast Approval", color: "text-blue-600" },
        { icon: DollarSign, text: "Low Interest", color: "text-green-600" },
        { icon: Shield, text: "Secure", color: "text-purple-600" },
      ],
      benefits: [
        "Flexible repayment terms",
        "No hidden fees",
        "Online application",
        "24-hour approval process",
      ],
    },
    {
      id: "grants",
      title: "Grants",
      description: "No repayment required - Free financial assistance",
      icon: DollarSign,
      color: "green",
      gradient: "from-green-500 to-emerald-500",
      route: "/grants",
      features: [
        { icon: CheckCircle, text: "No Repayment", color: "text-green-600" },
        { icon: Clock, text: "Quick Process", color: "text-blue-600" },
        { icon: Shield, text: "Verified", color: "text-purple-600" },
      ],
      benefits: [
        "100% free money",
        "Multiple grant programs",
        "Easy eligibility check",
        "Expert assistance available",
      ],
    },
    {
      id: "tax-refund",
      title: "Tax Refunds",
      description: "Fast processing and maximum refund guarantee",
      icon: FileText,
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
      route: "/tax-refund",
      features: [
        { icon: Zap, text: "Fast Processing", color: "text-purple-600" },
        { icon: DollarSign, text: "Max Refund", color: "text-green-600" },
        { icon: Shield, text: "Accurate", color: "text-blue-600" },
      ],
      benefits: [
        "Maximum refund guaranteed",
        "Expert tax assistance",
        "Audit protection included",
        "Direct deposit available",
      ],
    },
    {
      id: "virtual-cards",
      title: "Virtual Cards",
      description: "Instant virtual cards for secure online payments",
      icon: CreditCard,
      color: "orange",
      gradient: "from-orange-500 to-red-500",
      route: "/apply-virtual-card",
      features: [
        { icon: Zap, text: "Instant Issue", color: "text-orange-600" },
        { icon: Shield, text: "Secure", color: "text-blue-600" },
        { icon: TrendingUp, text: "Rewards", color: "text-green-600" },
      ],
      benefits: [
        "Instant card generation",
        "Enhanced security features",
        "Global acceptance",
        "Cashback rewards program",
      ],
    },
  ];

  const handleServiceClick = (service) => {
    navigate(service.route);
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
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Financial Services"
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
            <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                    <Sparkles size={40} className="text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-2">
                  Financial Services
                </h2>
                <p className="text-center text-white/90 text-sm">
                  Explore our comprehensive financial solutions
                </p>
              </div>
            </div>

            {/* Services Grid */}
            <div className="space-y-4 mb-6">
              {services.map((service, index) => {
                const Icon = service.icon;

                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-lg transition-all"
                    style={{
                      animation: `fadeInUp 0.5s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Service Header */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <Icon size={32} className="text-white" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            {service.title}
                          </h3>
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              Available
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {service.description}
                        </p>

                        {/* Features */}
                        <div className="flex items-center gap-3 flex-wrap mb-4">
                          {service.features.map((feature, idx) => {
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
                    </div>

                    {/* Benefits */}
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-4">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                        Key Benefits:
                      </h4>
                      <ul className="grid grid-cols-2 gap-2">
                        {service.benefits.map((benefit, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400"
                          >
                            <CheckCircle
                              size={14}
                              className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5"
                            />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => handleServiceClick(service)}
                      className={`w-full bg-gradient-to-r ${service.gradient} hover:opacity-90 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl`}
                    >
                      <Icon size={20} />
                      Apply Now
                      <ChevronRight size={20} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-20 lg:mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Secure & Reliable
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All our financial services are protected by bank-grade security
                    and comply with regulatory standards. Your information is always
                    safe with us.
                  </p>
                </div>
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

export default FinancialServices;