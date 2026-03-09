// src/pages/user/Cards/VirtualCards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  CreditCard,
  HourglassIcon,
  Wallet,
  Shield,
  Globe,
  Layers,
  Zap,
  Plus,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";

import { useAuth } from "../../../contexts/AuthContext";
import { cardService } from "../../../services/cardService";
import Card from "./CardUi";
import { useDarkMode } from "../../../hooks/useDarkMode";

const VirtualCards = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cards from API
  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await cardService.getUserCards();
      if (response && response.success && response.cards) {
        setCards(response.cards);
      }
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  const activeCards = cards.filter(card => card.status === "active").length;
  const pendingApplications = cards.filter(card => card.status === "pending").length;
  // eslint-disable-next-line no-unused-vars
  const totalBalance = 0; // You can calculate this if cards have balances

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const handleApplyNow = () => {
    navigate("/apply-virtual-card");
  };

  const handleNewCard = () => {
    navigate("/apply-virtual-card");
  };

  const handleCardClick = (card) => {
    navigate(`/cards/${card._id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading your cards...</p>
        </div>
      </div>
    );
  }

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
        pageTitle="Virtual Cards"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="cards"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Active Cards */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center">
                    <CreditCard className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Active Cards
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {activeCards}
                    </p>
                  </div>
                </div>
              </div>

              {/* Pending Applications */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center">
                    <HourglassIcon className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Pending Applications
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {pendingApplications}
                    </p>
                  </div>
                </div>
              </div>

              {/* Total Cards */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Total Cards
                    </p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                      {cards.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Promotional Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 lg:p-8 mb-6 text-white shadow-lg">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                Virtual Cards Made Easy
              </h2>
              <p className="text-blue-50 mb-6 text-sm lg:text-base leading-relaxed">
                Create virtual cards for secure online payments, subscription
                management, and more. Enhanced security and spending control.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm lg:text-base">Secure</p>
                    <p className="text-blue-100 text-xs lg:text-sm">
                      Protected payments
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm lg:text-base">Global</p>
                    <p className="text-blue-100 text-xs lg:text-sm">
                      Worldwide acceptance
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm lg:text-base">
                      Control
                    </p>
                    <p className="text-blue-100 text-xs lg:text-sm">
                      Spending limits
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm lg:text-base">
                      Instant
                    </p>
                    <p className="text-blue-100 text-xs lg:text-sm">
                      Quick issuance
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyNow}
                className="w-full lg:w-auto bg-white hover:bg-white/90 text-blue-600 px-8 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Apply Now
              </button>
            </div>

            {/* Your Cards Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Your Cards
                </h3>
                {cards.length > 0 && (
                  <button
                    onClick={handleNewCard}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    New Card
                  </button>
                )}
              </div>

              {/* Cards List or Empty State */}
              {cards.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CreditCard className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    No Cards Yet
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                    Get started by applying for your first virtual card. It only
                    takes a few minutes!
                  </p>
                  <button
                    onClick={handleNewCard}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors font-semibold"
                  >
                    <Plus className="w-5 h-5" />
                    Apply for Your First Card
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cards.map((card) => (
                    <Card 
                      key={card._id} 
                      card={card}
                      onViewDetails={handleCardClick}
                    />
                  ))}
                </div>
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

export default VirtualCards;