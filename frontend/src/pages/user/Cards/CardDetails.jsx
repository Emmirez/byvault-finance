/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/user/Cards/CardDetails.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CreditCard,
  ArrowLeft,
  Copy,
  Check,
  Eye,
  EyeOff,
  Lock,
  Shield,
  AlertCircle,
  Calendar,
  User,
  Zap,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { cardService } from "../../../services/cardService";

const CardDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [card, setCard] = useState(null);
  const [showCVV, setShowCVV] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  useEffect(() => {
    fetchCardDetails();
  }, [id]);

  const fetchCardDetails = async () => {
    try {
      setLoading(true);
      const response = await cardService.getCardDetails(id);
      if (response.success && response.card) {
        setCard(response.card);
      }
    } catch (error) {
      console.error("Error fetching card details:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getCardGradient = (type) => {
    switch (type) {
      case "visa":
        return "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800";
      case "mastercard":
        return "bg-gradient-to-br from-orange-500 via-red-500 to-orange-600";
      case "amex":
        return "bg-gradient-to-br from-cyan-600 via-blue-600 to-cyan-700";
      case "discover":
        return "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800";
      default:
        return "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900";
    }
  };

  const getCardLogo = (type) => {
    switch (type) {
      case "visa":
        return <span className="text-2xl font-bold text-white">VISA</span>;
      case "mastercard":
        return (
          <div className="flex items-center">
            <div className="w-6 h-6 bg-yellow-400 rounded-full mr-1"></div>
            <div className="w-6 h-6 bg-red-500 rounded-full"></div>
          </div>
        );
      case "amex":
        return <span className="text-xl font-bold text-white">AMEX</span>;
      case "discover":
        return <span className="text-xl font-bold text-white">DISCOVER</span>;
      default:
        return <CreditCard className="text-white" size={24} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading card details...
          </p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-gray-900 dark:text-white font-semibold">
            Card not found
          </p>
        </div>
      </div>
    );
  }

  const userName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "YOUR NAME";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={user?.email || ""}
        showBackButton={true}
        onBackClick={() => navigate("/dashboard")}
        pageTitle="Card Details"
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
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Card Status Badge */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white"></h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  card.status === "active"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : card.status === "blocked"
                      ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {card.status.toUpperCase()}
              </span>
            </div>

            {/* Card Display */}
            <div
              className={`${getCardGradient(card.cardType)} rounded-2xl p-6 text-white shadow-2xl mb-8`}
            >
              {/* Card Logo */}
              <div className="flex justify-between items-start mb-8">
                <div>{getCardLogo(card.cardType)}</div>
                <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold">
                  {card.cardBrand === "virtual" ? "VIRTUAL" : "PHYSICAL"}
                </div>
              </div>

              {/* Card Chip */}
              <div className="flex items-center mb-8">
                <div className="w-10 h-8 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center mr-3">
                  <div className="w-8 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md border border-yellow-700"></div>
                </div>
              </div>

              {/* Card Number */}
              <div className="font-mono text-xl tracking-widest mb-6">
                {card.status === "active" ? (
                  <div className="flex items-center justify-between">
                    <span>{card.cardNumber?.match(/.{1,4}/g)?.join(" ")}</span>
                    <button
                      onClick={() => copyToClipboard(card.cardNumber, "number")}
                      className="ml-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
                    >
                      {copiedField === "number" ? (
                        <Check size={18} />
                      ) : (
                        <Copy size={18} />
                      )}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>**** **** **** ****</span>
                    <Lock size={18} className="opacity-50" />
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs opacity-80 mb-1">Card Holder</p>
                  <p className="font-semibold">
                    {card.cardholderName || userName.toUpperCase()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-80 mb-1">Expires</p>
                  <p className="font-mono font-semibold">
                    {card.expiryMonth}/{card.expiryYear}
                  </p>
                </div>
              </div>
            </div>

            {/* Card Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* CVV */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Lock size={18} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      CVV
                    </span>
                  </div>
                  {card.status === "active" && (
                    <button
                      onClick={() => setShowCVV(!showCVV)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      {showCVV ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xl font-mono font-bold text-gray-900 dark:text-white">
                    {card.status === "active"
                      ? showCVV
                        ? card.cvv
                        : "***"
                      : "***"}
                  </p>
                  {card.status === "active" && (
                    <button
                      onClick={() => copyToClipboard(card.cvv, "cvv")}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {copiedField === "cvv" ? (
                        <Check size={18} className="text-green-600" />
                      ) : (
                        <Copy size={18} className="text-gray-400" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Card Type */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Card Type
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white capitalize">
                  {card.cardType} • {card.cardBrand}
                </p>
              </div>

              {/* Daily Limit */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Daily Limit
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${card.dailyLimit?.toLocaleString() || "1,000"}
                </p>
              </div>

              {/* Monthly Limit */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar size={18} className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Monthly Limit
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  ${card.monthlyLimit?.toLocaleString() || "10,000"}
                </p>
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-gray-700 mb-8">
              <div className="flex gap-3">
                <Shield
                  className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                  size={20}
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Security Tips
                  </h4>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc ml-4">
                    <li>Never share your CVV with anyone</li>
                    <li>We will never ask for your full card number</li>
                    <li>Enable notifications for all transactions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Done
              </button>
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

export default CardDetails;
