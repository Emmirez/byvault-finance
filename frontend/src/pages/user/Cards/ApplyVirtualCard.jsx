// src/pages/user/Cards/ApplyVirtualCard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
  Loader,
  Shield,
  Zap,
  Globe,
  Lock,
  Award,
  Sparkles,
  Gift,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { cardService } from "../../../services/cardService";

const ApplyVirtualCard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [hasPendingCard, setHasPendingCard] = useState(false);
  const [existingCard, setExistingCard] = useState(null);

  const [formData, setFormData] = useState({
    cardType: "visa",
    cardBrand: "virtual",
  });
  // Check for existing pending cards on mount
  useEffect(() => {
    const checkPendingCards = async () => {
      try {
        const response = await cardService.getUserCards();
        console.log("Cards response:", response); // Debug log

        // Now response is the actual data object, not an axios response
        if (response && response.success && response.cards) {
          const pending = response.cards.find(
            (card) => card.status === "pending",
          );
          if (pending) {
            setHasPendingCard(true);
            setExistingCard(pending);
          }
        }
      } catch (error) {
        console.error("Error checking pending cards:", error);
      }
    };

    checkPendingCards();
  }, []);

  const cardTypes = [
    {
      value: "visa",
      label: "Visa",
      icon: () => (
        <div className="flex items-center justify-center">
          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            VISA
          </span>
        </div>
      ),
      gradient: "from-blue-600 via-blue-700 to-blue-800",
      bgLight: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      value: "mastercard",
      label: "Mastercard",
      icon: () => (
        <div className="flex items-center justify-center">
          <div className="w-6 h-6 bg-yellow-500 rounded-full mr-1"></div>
          <div className="w-6 h-6 bg-red-500 rounded-full"></div>
        </div>
      ),
      gradient: "from-orange-500 via-red-500 to-orange-600",
      bgLight: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      value: "amex",
      label: "American Express",
      icon: () => (
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">
            AMEX
          </span>
        </div>
      ),
      gradient: "from-cyan-600 via-blue-600 to-cyan-700",
      bgLight: "bg-cyan-50 dark:bg-cyan-900/20",
      border: "border-cyan-200 dark:border-cyan-800",
      textColor: "text-cyan-600 dark:text-cyan-400",
    },
    {
      value: "discover",
      label: "Discover",
      icon: () => (
        <div className="flex items-center justify-center">
          <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
            DISCOVER
          </span>
        </div>
      ),
      gradient: "from-purple-600 via-purple-700 to-purple-800",
      bgLight: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
    },
  ];

  const cardBrands = [
    {
      value: "virtual",
      label: "Virtual Card",
      icon: Zap,
      desc: "Instant use, online payments",
      features: [
        "Instant issuance",
        "Online transactions",
        "Mobile wallet ready",
      ],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      value: "physical",
      label: "Physical Card",
      icon: CreditCard,
      desc: "Shipped to your address",
      features: ["Premium metal card", "Worldwide acceptance", "Chip & PIN"],
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  // Card Preview Component
  const CardPreview = ({ type, brand, userName }) => {
    const selectedCard =
      cardTypes.find((t) => t.value === type) || cardTypes[0];
    const expiryMonth = String(new Date().getMonth() + 1).padStart(2, "0");
    const expiryYear = String(new Date().getFullYear() + 3).slice(-2);

    return (
      <div
        className={`relative bg-gradient-to-br ${selectedCard.gradient} rounded-2xl p-6 text-white shadow-2xl transform transition-all duration-500 hover:scale-105 hover:rotate-1 cursor-pointer group`}
      >
        {/* Background Pattern - Fixed SVG string */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: "repeat",
          }}
        ></div>

        {/* Card Logo */}
        <div className="relative flex justify-between items-start mb-6">
          <div className="text-2xl font-bold tracking-wider">
            {selectedCard.icon()}
          </div>
          {brand === "virtual" ? (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Zap size={12} />
              VIRTUAL
            </div>
          ) : (
            <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <CreditCard size={12} />
              PHYSICAL
            </div>
          )}
        </div>

        {/* Card Chip */}
        <div className="relative flex items-center mb-6">
          <div className="w-10 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
            <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md border border-yellow-700"></div>
          </div>
          <div className="text-xs opacity-80">CHIP</div>
        </div>

        {/* Card Number */}
        <div className="relative font-mono text-xl tracking-widest mb-6">
          <div className="flex items-center space-x-3">
            <span>****</span>
            <span>****</span>
            <span>****</span>
            <span className="text-yellow-300">1234</span>
          </div>
        </div>

        {/* Card Details */}
        <div className="relative flex justify-between items-end">
          <div>
            <p className="text-xs opacity-80 mb-1">Card Holder</p>
            <p className="font-semibold text-base">
              {userName.toUpperCase() || "YOUR NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80 mb-1">Expires</p>
            <p className="font-mono font-semibold">
              {expiryMonth}/{expiryYear}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs opacity-80 mb-1">CVV</p>
            <p className="font-mono font-semibold">***</p>
          </div>
        </div>

        {/* Contactless Indicator */}
        <div className="absolute bottom-6 right-6">
          <div className="w-8 h-8 rounded-full border-2 border-white/30 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/30"></div>
          </div>
        </div>
      </div>
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await cardService.applyForCard(formData);
      if (response.success) {
        setSuccess(true);
      }
    } catch (err) {
      if (err.status !== 403 && err.status !== 401) {
        console.error("Error applying for card:", err);
      }

      const code = err.data?.code || "";
      const message = err.message || "";

      if (
        code === "VERIFICATION_REQUIRED" ||
        message.includes("verification") ||
        message.includes("KYC")
      ) {
        setError(
          "Your account is not yet verified. Please complete KYC verification to apply for a card.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (code === "ACCOUNT_BLOCKED" || message.includes("blocked")) {
        setError("Your account has been blocked. Please contact support.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (code === "ACCOUNT_SUSPENDED" || message.includes("suspended")) {
        setError(
          "Your account is temporarily suspended. Please contact support.",
        );
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      if (message.includes("already") || message.includes("existing")) {
        setError("You already have an active card application or card.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }

      setError(message || "Failed to apply for card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-green-100 dark:border-gray-700 relative">
          {/* Close button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-200 dark:bg-green-900/30 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="text-white" size={48} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Application Submitted!
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your {formData.cardType.toUpperCase()} {formData.cardBrand} card
            application is pending review. We'll notify you once it's approved.
          </p>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-yellow-500" />
              Expected approval time: 24-48 hours
            </p>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full animate-pulse"
              style={{ width: "60%" }}
            ></div>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Go to Dashboard
            </button>

            <button
              onClick={() => navigate("/cards")}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              View My Cards
            </button>
          </div>
        </div>
      </div>
    );
  }

  const userName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "YOUR NAME";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={user?.email || ""}
        showBackButton={true}
        onBackClick={() => navigate("/dashboard")}
        pageTitle="Apply for Card"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={user?.email || ""}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative flex items-center gap-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <CreditCard size={40} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Apply for a Card</h1>
                  <p className="text-white/90 text-lg">
                    Get instant access to a virtual card for online payments and
                    subscriptions
                  </p>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-200 dark:border-gray-700 shadow-xl mb-20 lg:mb-8">
              {/* Pending Card Warning */}
              {hasPendingCard && (
                <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle
                      className="text-yellow-600 dark:text-yellow-400 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <h3 className="font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
                        Pending Application Found
                      </h3>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mb-2">
                        You already have a pending{" "}
                        {existingCard?.cardType?.toUpperCase()}{" "}
                        {existingCard?.cardBrand} card application. Please wait
                        for it to be approved before applying for another card.
                      </p>
                      <button
                        onClick={() => navigate("/dashboard")}
                        className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                      >
                        Back to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!hasPendingCard && (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                      <AlertCircle
                        className="text-red-600 dark:text-red-400 flex-shrink-0"
                        size={20}
                      />
                      <p className="text-sm text-red-600 dark:text-red-400">
                        {error}
                      </p>
                    </div>
                  )}

                  {/* Card Preview */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <CreditCard className="text-blue-600" size={20} />
                      Card Preview
                    </h3>
                    <CardPreview
                      type={formData.cardType}
                      brand={formData.cardBrand}
                      userName={userName}
                    />
                  </div>

                  {/* Card Type Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Select Card Network
                    </label>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      {cardTypes.map((type) => {
                        const isSelected = formData.cardType === type.value;
                        const borderColor =
                          type.value === "visa"
                            ? "blue"
                            : type.value === "mastercard"
                              ? "orange"
                              : type.value === "amex"
                                ? "cyan"
                                : "purple";
                        return (
                          <button
                            key={type.value}
                            type="button"
                            onClick={() =>
                              setFormData({ ...formData, cardType: type.value })
                            }
                            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                              isSelected
                                ? `border-${borderColor}-500 bg-gradient-to-br from-white to-${borderColor}-50 dark:from-gray-800 dark:to-${borderColor}-900/30 shadow-lg scale-105`
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
                            }`}
                          >
                            <div className="flex flex-col items-center">
                              {type.icon()}
                              <span
                                className={`text-sm font-semibold mt-2 ${
                                  isSelected
                                    ? type.textColor
                                    : "text-gray-900 dark:text-white"
                                }`}
                              >
                                {type.label}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={14} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Card Brand Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Choose Card Type
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {cardBrands.map((brand) => {
                        const Icon = brand.icon;
                        const isSelected = formData.cardBrand === brand.value;
                        return (
                          <button
                            key={brand.value}
                            type="button"
                            onClick={() =>
                              setFormData({
                                ...formData,
                                cardBrand: brand.value,
                              })
                            }
                            className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                              isSelected
                                ? `border-transparent bg-gradient-to-br ${brand.gradient} text-white shadow-xl scale-105`
                                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg"
                            }`}
                          >
                            <div className="flex items-start gap-4">
                              <div
                                className={`p-3 rounded-xl ${
                                  isSelected
                                    ? "bg-white/20"
                                    : brand.value === "virtual"
                                      ? "bg-blue-100 dark:bg-blue-900/30"
                                      : "bg-purple-100 dark:bg-purple-900/30"
                                }`}
                              >
                                <Icon
                                  size={24}
                                  className={
                                    isSelected
                                      ? "text-white"
                                      : brand.value === "virtual"
                                        ? "text-blue-600 dark:text-blue-400"
                                        : "text-purple-600 dark:text-purple-400"
                                  }
                                />
                              </div>
                              <div className="flex-1 text-left">
                                <p
                                  className={`text-lg font-bold mb-1 ${
                                    isSelected
                                      ? "text-white"
                                      : "text-gray-900 dark:text-white"
                                  }`}
                                >
                                  {brand.label}
                                </p>
                                <p
                                  className={`text-sm mb-3 ${
                                    isSelected
                                      ? "text-white/80"
                                      : "text-gray-600 dark:text-gray-400"
                                  }`}
                                >
                                  {brand.desc}
                                </p>
                                <div className="space-y-1">
                                  {brand.features.map((feature, i) => (
                                    <div
                                      key={i}
                                      className="flex items-center gap-1"
                                    >
                                      <CheckCircle
                                        size={12}
                                        className={
                                          isSelected
                                            ? "text-white/60"
                                            : "text-green-500"
                                        }
                                      />
                                      <span
                                        className={`text-xs ${
                                          isSelected
                                            ? "text-white/60"
                                            : "text-gray-500 dark:text-gray-500"
                                        }`}
                                      >
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                            {isSelected && (
                              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                <CheckCircle size={14} className="text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Benefits */}
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Award className="text-yellow-500" size={20} />
                      Card Benefits
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Zap
                            className="text-blue-600 dark:text-blue-400"
                            size={20}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          Instant Use
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Shield
                            className="text-green-600 dark:text-green-400"
                            size={20}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          Zero Fraud
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Globe
                            className="text-purple-600 dark:text-purple-400"
                            size={20}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          Global
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-2">
                          <Gift
                            className="text-orange-600 dark:text-orange-400"
                            size={20}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-900 dark:text-white">
                          Rewards
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors whitespace-nowrap text-ellipsis overflow-hidden"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin w-5 h-5" />
                        Processing Application...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-6 h-6" />
                        <span className="truncate">
                          Apply for {formData.cardType.toUpperCase()}{" "}
                          {formData.cardBrand} Card
                        </span>
                      </>
                    )}
                  </button>
                </form>
              )}
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

export default ApplyVirtualCard;
