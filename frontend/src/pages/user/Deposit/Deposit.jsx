// src/pages/user/Deposit/Deposit.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  DollarSign,
  Building2,
  Bitcoin,
  Banknote,
  ChevronRight,
  Lock,
  Clock,
  CheckCircle2,
  Loader2, // Add this for loading spinner
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { depositService } from '../../../services/depositService';
import { useDarkMode } from "../../../hooks/useDarkMode";

const Deposit = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loadingMethods, setLoadingMethods] = useState(true); // Now we'll use this!

  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoadingMethods(true);
        const methods = await depositService.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Failed to load payment methods:', error);
      } finally {
        setLoadingMethods(false);
      }
    };
    fetchMethods();
  }, []);

  // Map icon strings to actual Lucide components
  const getIconComponent = (iconName) => {
    const icons = {
      Building2: Building2,
      CreditCard: CreditCard,
      DollarSign: DollarSign,
      Banknote: Banknote,
      Bitcoin: Bitcoin,
    };
    return icons[iconName] || DollarSign; // Default to DollarSign if not found
  };

  const quickAmounts = [100, 500, 1000, 5000, 10000];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const handleMethodSelect = (method) => {
    setSelectedMethod(method.id);
  };

  const handleQuickAmount = (value) => {
    setAmount(value.toString());
  };

  const handleContinue = () => {
    if (!selectedMethod || !amount || parseFloat(amount) <= 0) {
      return;
    }

    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to payment confirmation page
      navigate(`/deposit/${selectedMethod}`, {
        state: { amount, method: selectedMethod },
      });
    }, 2000);
  };

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: "bg-purple-100 dark:bg-purple-900/20",
        icon: "text-purple-600 dark:text-purple-400",
        border: "border-purple-200 dark:border-purple-800",
      },
      green: {
        bg: "bg-green-100 dark:bg-green-900/20",
        icon: "text-green-600 dark:text-green-400",
        border: "border-green-200 dark:border-green-800",
      },
      blue: {
        bg: "bg-blue-100 dark:bg-blue-900/20",
        icon: "text-blue-600 dark:text-blue-400",
        border: "border-blue-200 dark:border-blue-800",
      },
      orange: {
        bg: "bg-orange-100 dark:bg-orange-900/20",
        icon: "text-orange-600 dark:text-orange-400",
        border: "border-orange-200 dark:border-orange-800",
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Deposit Funds"
        isMobile={true}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="deposit"
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 rounded-2xl p-8 mb-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <DollarSign size={40} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">
                Fund Your Account
              </h2>
              <p className="text-center text-white/90 text-sm">
                Choose your preferred deposit method and amount
              </p>
            </div>

            {/* Select Deposit Method */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Select Deposit Method
              </h3>

              {loadingMethods ? (
                // Show loading state while fetching methods
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 border border-gray-200 dark:border-gray-700 text-center">
                  <Loader2 size={40} className="animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-gray-600 dark:text-gray-400">Loading payment methods...</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentMethods.map((method) => {
                    const IconComponent = getIconComponent(method.icon);
                    const colors = getColorClasses(method.color);
                    const isSelected = selectedMethod === method.id;

                    return (
                      <button
                        key={method.id}
                        onClick={() => handleMethodSelect(method)}
                        disabled={!method.available}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? `${colors.border} bg-white dark:bg-gray-800 shadow-lg scale-[1.02]`
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600"
                        } ${
                          !method.available ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
                          >
                            <IconComponent className={colors.icon} size={28} />
                          </div>

                          <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-bold text-gray-900 dark:text-white">
                                {method.name}
                              </h4>
                              {isSelected && (
                                <CheckCircle2
                                  size={18}
                                  className="text-blue-600 dark:text-blue-400"
                                />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {method.description}
                            </p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                <Clock size={12} />
                                {method.time}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {method.fee}
                              </span>
                            </div>
                          </div>

                          <ChevronRight
                            size={20}
                            className="text-gray-400 dark:text-gray-500"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Deposit Amount */}
            {selectedMethod && !loadingMethods && (
              <div className="mb-6 animate-fadeIn">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Deposit Amount
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-4">
                  <div className="relative mb-4">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 dark:text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-12 pr-4 py-4 text-3xl font-bold bg-gray-50 dark:bg-gray-900 rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-gray-900 dark:text-white"
                    />
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Quick amounts:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((value) => (
                        <button
                          key={value}
                          onClick={() => handleQuickAmount(value)}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                        >
                          ${value.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {parseFloat(amount) > 0 && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Amount:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${parseFloat(amount).toFixed(2)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Fee:
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                          {
                            paymentMethods.find((m) => m.id === selectedMethod)
                              ?.fee
                          }
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-base font-bold pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span className="text-gray-900 dark:text-white">
                          Total:
                        </span>
                        <span className="text-blue-600 dark:text-blue-400">
                          ${parseFloat(amount).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleContinue}
                  disabled={!amount || parseFloat(amount) <= 0 || isLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign size={20} />
                      Continue to Deposit
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800 mb-20 lg:mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock className="text-blue-600 dark:text-blue-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Secure Deposit
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    All deposits are processed through secure payment channels.
                    Your financial information is never stored on our servers and
                    all transactions are monitored for fraud protection.
                  </p>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                      <CheckCircle2 size={14} />
                      SSL Encrypted
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                      <CheckCircle2 size={14} />
                      Zero Data Storage
                    </span>
                    <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                      <CheckCircle2 size={14} />
                      24/7 Monitoring
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
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
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Deposit;