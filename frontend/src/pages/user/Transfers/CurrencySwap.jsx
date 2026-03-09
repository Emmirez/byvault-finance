/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Wallet,
  Bitcoin,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  AlertCircle,
  X,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { dashboardService } from "../../../services/dashhboardService";
import { transferService } from "../../../services/transferService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const CurrencySwap = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [swapLoading, setSwapLoading] = useState(false);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success', 'error', 'warning'
    message: "",
  });

  // Balances
  const [usdBalance, setUsdBalance] = useState(0);
  const [btcBalance, setBtcBalance] = useState(0);

  // Exchange rate
  const [exchangeRate, setExchangeRate] = useState(67020.0); // Default fallback

  // Form state
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("BTC");
  const [amount, setAmount] = useState("");

  // Fetch user data and exchange rate on mount
  useEffect(() => {
    fetchUserData();
    fetchExchangeRate();
  }, []);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await dashboardService.getDashboardData();

      setUsdBalance(data.fiatBalance || 0);
      setBtcBalance(data.btcBalance || 0);
    } catch (error) {
      console.error("Error fetching user data:", error);
      showNotification("error", "Failed to load your balances");
    } finally {
      setLoading(false);
    }
  };

  const fetchExchangeRate = async () => {
    try {
      // From public API (CoinGecko - free, no API key needed)
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd",
      );
      const data = await response.json();
      setExchangeRate(data.bitcoin.usd);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      // Keep default fallback value
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

  // Calculate conversion on the fly
  const getEstimatedConversion = () => {
    if (!amount || parseFloat(amount) <= 0) {
      return null;
    }

    let converted;
    if (fromCurrency === "USD" && toCurrency === "BTC") {
      converted = parseFloat(amount) / exchangeRate;
      return `${converted.toFixed(8)} BTC`;
    } else if (fromCurrency === "BTC" && toCurrency === "USD") {
      converted = parseFloat(amount) * exchangeRate;
      return `$${converted.toFixed(2)} USD`;
    }
    return null;
  };

  const estimatedConversion = getEstimatedConversion();

  const handleSwap = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showNotification("error", "Please enter a valid amount");
      return;
    }

    // Check sufficient balance
    if (fromCurrency === "USD" && parseFloat(amount) > usdBalance) {
      showNotification("error", "Insufficient USD balance");
      return;
    }
    if (fromCurrency === "BTC" && parseFloat(amount) > btcBalance) {
      showNotification("error", "Insufficient BTC balance");
      return;
    }

    setSwapLoading(true);
    try {
      // Call your swap API
      const swapData = {
        fromCurrency,
        toCurrency,
        amount: parseFloat(amount),
        estimatedRate: exchangeRate,
      };

      const response = await transferService.swapCurrency(swapData);

      if (response.success) {
        // Refresh balances
        await fetchUserData();

        // Show success message
        showNotification("success", "Swap completed successfully!");
        setAmount(""); // Clear input
      }
    } catch (error) {
      if (error.status !== 403 && error.status !== 401) {
        console.error("Swap error:", error);
      }

      const code = error.data?.code || "";
      const message = error.message || "";

      if (
        code === "VERIFICATION_REQUIRED" ||
        message.includes("verification") ||
        message.includes("KYC")
      ) {
        showNotification(
          "error",
          "Your account is not yet verified. Please complete KYC verification to access currency swap.",
        );
        return;
      }

      if (code === "ACCOUNT_BLOCKED" || message.includes("blocked")) {
        showNotification(
          "error",
          "Your account has been blocked. Please contact support.",
        );
        return;
      }

      if (code === "ACCOUNT_SUSPENDED" || message.includes("suspended")) {
        showNotification(
          "error",
          "Your account is temporarily suspended. Please contact support.",
        );
        return;
      }

      if (message.includes("balance") || message.includes("Insufficient")) {
        showNotification("error", "Insufficient balance for this swap.");
        return;
      }

      if (message.includes("rate") || message.includes("exchange")) {
        showNotification(
          "error",
          "Exchange rate unavailable. Please try again.",
        );
        return;
      }

      showNotification("error", message || "Swap failed. Please try again.");
    } finally {
      setSwapLoading(false);
    }
  };

  const currencies = [
    { code: "USD", name: "US Dollar", balance: usdBalance },
    { code: "BTC", name: "Bitcoin", balance: btcBalance },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading currency data...
          </p>
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
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="font-medium text-sm">{notification.message}</p>
            <button
              onClick={() =>
                setNotification({ show: false, type: "", message: "" })
              }
              className="ml-2 hover:bg-white/20 rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

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
        pageTitle="Currency Swap"
        isMobile={true}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="swap"
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-3xl mx-auto p-4 lg:p-8">
            {/* Current Balances */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                Current Balances
              </h2>

              {/* USD Balance */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    USD Balance
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  ${usdBalance.toFixed(2)}
                </span>
              </div>

              {/* Bitcoin Balance */}
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-xl mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl flex items-center justify-center">
                    <Bitcoin className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Bitcoin Balance
                  </span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white text-lg">
                  {btcBalance.toFixed(8)} BTC
                </span>
              </div>

              {/* Current Exchange Rate */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900">
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400 mb-2 text-center">
                  Current Exchange Rate
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                    <Bitcoin className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white">
                    1 BTC = ${exchangeRate.toFixed(2)} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-20 lg:mb-8 border border-gray-200 dark:border-gray-700">
              {/* From Currency */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  From Currency
                </label>
                <div className="relative">
                  <select
                    value={fromCurrency}
                    onChange={(e) => {
                      const newFrom = e.target.value;
                      setFromCurrency(newFrom);
                      // Auto-switch To Currency to avoid same currency
                      if (newFrom === toCurrency) {
                        setToCurrency(
                          currencies.find((c) => c.code !== newFrom).code,
                        );
                      }
                    }}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none appearance-none"
                  >
                    {currencies.map((currency) => (
                      <option key={currency.code} value={currency.code}>
                        {currency.code}{" "}
                        {currency.code === "USD"
                          ? `($${currency.balance.toFixed(2)})`
                          : `(${currency.balance.toFixed(8)} BTC)`}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* To Currency */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  To Currency
                </label>
                <div className="relative">
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full px-4 py-3 pr-10 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none appearance-none"
                  >
                    {currencies
                      .filter((c) => c.code !== fromCurrency)
                      .map((currency) => (
                        <option key={currency.code} value={currency.code}>
                          {currency.code}
                        </option>
                      ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Destination currency is automatically selected
                </p>
              </div>

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-3 pr-16 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                    {fromCurrency}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Enter the amount you want to swap
                </p>
              </div>

              {/* Estimated Conversion */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Estimated Conversion
                </label>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 text-center border-2 border-gray-200 dark:border-gray-700">
                  {estimatedConversion ? (
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      {estimatedConversion}
                    </span>
                  ) : (
                    <span className="text-gray-400 dark:text-gray-500">
                      Enter an amount to see conversion
                    </span>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={handleSwap}
                disabled={!amount || parseFloat(amount) <= 0 || swapLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
              >
                {swapLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Swap Currencies
                  </>
                )}
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
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

export default CurrencySwap;
