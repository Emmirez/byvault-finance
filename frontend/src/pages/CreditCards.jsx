import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Offer from "../components/sections/Offer.jsx";

import {
  CreditCard,
  Shield,
  Award,
  Percent,
  Smartphone,
  Zap,
  Gift,
  Check,
  ArrowUp,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext.jsx";

const CreditCards = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const creditCards = [
    {
      name: "Premium Rewards Card",
      description: "Earn unlimited 2x points on all purchases",
      annualFee: "$95",
      introAPR: "0% for 15 months",
      regularAPR: "16.99% - 24.99%",
      rewards: [
        "2x points on all purchases",
        "60,000 bonus points",
        "Travel insurance",
        "No foreign transaction fees",
      ],
      category: "rewards",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      iconBg: "bg-purple-100 dark:bg-purple-900",
      icon: Award,
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "Cash Back Card",
      description: "Get 3% cash back in popular categories",
      annualFee: "$0",
      introAPR: "0% for 12 months",
      regularAPR: "14.99% - 22.99%",
      rewards: [
        "3% cash back at supermarkets",
        "2% at gas stations",
        "1% on everything else",
        "$200 welcome bonus",
      ],
      category: "cashback",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      iconBg: "bg-blue-100 dark:bg-blue-900",
      icon: Percent,
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Travel Card",
      description: "Perfect for frequent travelers",
      annualFee: "$450",
      introAPR: "N/A",
      regularAPR: "17.99% - 25.99%",
      rewards: [
        "5x points on travel",
        "Lounge access",
        "Global Entry credit",
        "Travel protections",
      ],
      category: "travel",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      iconBg: "bg-green-100 dark:bg-green-900",
      icon: CreditCard,
      textColor: "text-green-600 dark:text-green-400",
    },
    {
      name: "Student Card",
      description: "Build credit while earning rewards",
      annualFee: "$0",
      introAPR: "0% for 6 months",
      regularAPR: "18.99% - 26.99%",
      rewards: [
        "1% cash back on all purchases",
        "Credit education tools",
        "No annual fee",
        "Credit limit increases",
      ],
      category: "student",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      iconBg: "bg-orange-100 dark:bg-orange-900",
      icon: Award,
      textColor: "text-orange-600 dark:text-orange-400",
    },
    {
      name: "Business Card",
      description: "Rewards for business expenses",
      annualFee: "$125",
      introAPR: "0% for 12 months",
      regularAPR: "15.99% - 23.99%",
      rewards: [
        "5x points on office supplies",
        "3x on travel",
        "Employee cards",
        "Expense management",
      ],
      category: "business",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      iconBg: "bg-indigo-100 dark:bg-indigo-900",
      icon: CreditCard,
      textColor: "text-indigo-600 dark:text-indigo-400",
    },
    {
      name: "VISA PLATINUM",
      description: "Consolidate debt with low APR",
      annualFee: "$0 first year, then $99",
      introAPR: "0% for 18 months",
      regularAPR: "16.99% - 25.99%",
      rewards: [
        "0% balance transfer fee",
        "No late fee first year",
        "Credit score tracking",
        "Debt payoff calculator",
      ],
      category: "balance",
      color: "bg-gradient-to-br from-gray-500 to-gray-600",
      iconBg: "bg-gray-100 dark:bg-gray-900",
      icon: Percent,
      textColor: "text-gray-600 dark:text-gray-400",
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Zero Fraud Liability",
      description: "You're not responsible for unauthorized charges",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: Smartphone,
      title: "Mobile Wallet",
      description: "Add to Apple Pay, Google Pay & Samsung Pay",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Zap,
      title: "Instant Approval",
      description: "Get a decision in as little as 60 seconds",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: Gift,
      title: "Welcome Bonus",
      description: "Earn bonus rewards when you meet spending requirements",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900",
    },
  ];

  // Card Component for reuse
  const CardComponent = ({ card, index }) => {
    // Card gradients based on category
    const cardGradients = {
      rewards: "bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800",
      cashback: "bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800",
      travel:
        "bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-800",
      student: "bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700",
      business:
        "bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800",
      balance: "bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900",
    };

    const cardGradient = cardGradients[card.category] || cardGradients.rewards;

    // Card brand logo
    const cardBrands = {
      rewards: "VISA",
      cashback: "MASTERCARD",
      travel: "VISA SIGNATURE",
      student: "DISCOVER",
      business: "AMERICAN EXPRESS",
      balance: "VISA PLATINUM",
    };

    const cardBrand = cardBrands[card.category] || "VISA";

    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 hover:-translate-y-2 flex flex-col h-full group">
        {/* Credit Card Display */}
        <div className="relative p-4 sm:p-6">
          {/* Actual Credit Card - Hover only affects card, not whole component */}
          <div
            className={`${cardGradient} rounded-2xl p-4 sm:p-6 text-white shadow-2xl hover:transform hover:rotate-1 transition-transform duration-500 hover:shadow-3xl cursor-pointer`}
          >
            {/* Card Top Section */}
            <div className="flex justify-between items-start mb-4 sm:mb-8">
              <div className="text-lg sm:text-xl font-bold">{cardBrand}</div>
              <div className="text-xl sm:text-2xl">
                {card.category === "business" ? (
                  <span className="font-mono font-bold text-sm sm:text-base">
                    AMEX
                  </span>
                ) : card.category === "student" ? (
                  <span className="font-mono font-bold text-sm sm:text-base">
                    DISCOVER
                  </span>
                ) : (
                  <div className="flex items-center">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-yellow-400 rounded-full mr-1 sm:mr-2"></div>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-500 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Chip */}
            <div className="flex items-center mb-4 sm:mb-6">
              <div className="w-10 h-7 sm:w-12 sm:h-9 bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center mr-3 sm:mr-4">
                <div className="w-8 h-5 sm:w-10 sm:h-7 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-md border border-yellow-700"></div>
              </div>
              <div className="text-xs opacity-80">CHIP</div>
            </div>

            {/* Card Number - Fixed for mobile */}
            <div className="font-mono text-lg sm:text-xl tracking-wider sm:tracking-widest mb-6 sm:mb-8 overflow-hidden">
              <div className="flex items-center justify-center sm:justify-start space-x-1 sm:space-x-4">
                <span className="opacity-90 text-sm sm:text-base">****</span>
                <span className="opacity-90 text-sm sm:text-base">****</span>
                <span className="opacity-90 text-sm sm:text-base">****</span>
                <span className="text-sm sm:text-base">
                  {index === 0
                    ? "1234"
                    : index === 1
                      ? "5678"
                      : index === 2
                        ? "9012"
                        : index === 3
                          ? "3456"
                          : index === 4
                            ? "7890"
                            : "2468"}
                </span>
              </div>
            </div>

            {/* Card Bottom Section */}
            <div className="flex justify-between items-end">
              <div className="flex-1 min-w-0">
                <div className="text-xs opacity-80 mb-1 truncate">
                  CARD HOLDER
                </div>
                <div className="text-base sm:text-lg font-medium truncate">
                  YOUR NAME
                </div>
              </div>
              <div className="text-right flex-1 min-w-0 ml-2">
                <div className="text-xs opacity-80 mb-1">VALID THRU</div>
                <div className="text-base sm:text-lg font-medium">
                  {index === 0
                    ? "12/28"
                    : index === 1
                      ? "05/29"
                      : index === 2
                        ? "08/30"
                        : index === 3
                          ? "03/27"
                          : index === 4
                            ? "11/29"
                            : "09/28"}
                </div>
              </div>
              <div
                className={`w-12 h-8 sm:w-16 sm:h-10 rounded-lg flex items-center justify-center ml-2 sm:ml-4 flex-shrink-0`}
                style={{
                  background:
                    card.category === "business"
                      ? "linear-gradient(to right, #4299e1, #3182ce)"
                      : card.category === "student"
                        ? "linear-gradient(to right, #ed8936, #dd6b20)"
                        : "linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.3))",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span className="text-xs font-bold">
                  {card.category === "business"
                    ? "AMEX"
                    : card.category === "student"
                      ? "DISCOVER"
                      : cardBrand.split(" ")[0]}
                </span>
              </div>
            </div>

            {/* Card Hologram Effect */}
            <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-12 h-12 sm:w-16 sm:h-16 opacity-20">
              <div className="w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse rounded-full"></div>
            </div>
          </div>

          {/* Card Category Tag */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8">
            <span
              className={`px-3 py-1 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-white ${card.color} backdrop-blur-sm shadow-lg`}
            >
              {card.category.charAt(0).toUpperCase() + card.category.slice(1)}
            </span>
          </div>
        </div>

        {/* Card Info Section */}
        <div className="p-4 sm:p-6 flex flex-col flex-grow">
          <div className="mb-4 sm:mb-6">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {card.name}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {card.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Annual Fee
              </div>
              <div className={`text-lg sm:text-xl font-bold ${card.textColor}`}>
                {card.annualFee}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm">
              <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Intro APR
              </div>
              <div className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400">
                {card.introAPR}
              </div>
            </div>
          </div>

          {/* Features List */}
          <div className="mb-4 sm:mb-6 flex-grow">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3 sm:mb-4 text-sm flex items-center gap-2">
              <Award className={`w-3 h-3 sm:w-4 sm:h-4 ${card.textColor}`} />
              Key Benefits
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {card.rewards.slice(0, 3).map((reward, i) => (
                <li
                  key={i}
                  className="flex items-start text-xs sm:text-sm text-gray-700 dark:text-gray-300 gap-2 sm:gap-3"
                >
                  <div
                    className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full ${card.iconBg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                  >
                    <Check
                      className={`w-2 h-2 sm:w-3 sm:h-3 ${card.textColor}`}
                    />
                  </div>
                  <span className="leading-tight">{reward}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 mt-auto pt-4 sm:pt-6 border-t border-gray-100 dark:border-gray-700">
            <Link
              to="/register"
              className={`flex-1 py-2 sm:py-3 text-center font-semibold rounded-lg sm:rounded-xl transition-all duration-300 text-white hover:shadow-lg hover:scale-[1.02] flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base`}
              style={{
                background: `linear-gradient(135deg, ${card.color.includes("from-purple") ? "#8B5CF6" : card.color.includes("from-blue") ? "#3B82F6" : card.color.includes("from-green") ? "#10B981" : card.color.includes("from-orange") ? "#F59E0B" : card.color.includes("from-indigo") ? "#6366F1" : "#6B7280"}, ${card.color.includes("to-purple") ? "#7C3AED" : card.color.includes("to-blue") ? "#2563EB" : card.color.includes("to-green") ? "#059669" : card.color.includes("to-orange") ? "#D97706" : card.color.includes("to-indigo") ? "#4F46E5" : "#4B5563"})`,
              }}
            >
              <CreditCard className="w-3 h-3 sm:w-4 sm:h-4" />
              Apply Now
            </Link>
            <button className="px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 hover:scale-[1.02] font-medium flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
              <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
              Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Credit Cards
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80"
            alt="Credit cards and financial services"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 opacity-35"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Credit Cards
            </h1>
            <p className="text-base sm:text-xl mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Find the perfect card with rewards, low rates, and benefits that
              match your lifestyle
            </p>
            <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 sm:mb-8 px-4">
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30 text-sm sm:text-base">
                <Award className="mr-1.5 sm:mr-2" size={16} />
                <span>Premium Rewards</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30 text-sm sm:text-base">
                <Percent className="mr-1.5 sm:mr-2" size={16} />
                <span>0% Intro APR</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-white/30 text-sm sm:text-base">
                <Shield className="mr-1.5 sm:mr-2" size={16} />
                <span>Fraud Protection</span>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl hover:-translate-y-1 text-sm sm:text-base"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Cards Grid - Simple display without categories */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-8 sm:mb-12 text-center">
            Choose Your Card
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {creditCards.map((card, index) => (
              <CardComponent key={index} card={card} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-gray-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Card Benefits
            </h2>
            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-400">
              Exclusive features that come with every card
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8 bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 ${benefit.bg} rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6`}
                >
                  <benefit.icon
                    className={`${benefit.color} w-6 h-6 sm:w-7 sm:h-7`}
                  />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  {benefit.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full overflow-hidden">
        <Offer t={t} />
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 bg-blue-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 animate-bounce hover:bg-blue-600"
        >
          <ArrowUp size={18} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default CreditCards;
