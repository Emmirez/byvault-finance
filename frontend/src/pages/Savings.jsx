// pages/Savings.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Lock,
  PieChart,
  Target,
  DollarSign,
  Calendar,
  Check,
  ArrowLeft,
  Sparkles,
  Shield,
  Zap,
  ArrowRight,
  Users,
  Award,
  CheckCircle,
  Percent,
  CreditCard,
  Plus,
  Calculator,
  LineChart,
  BarChart3,
  ArrowUp,
} from "lucide-react";
import Header from "../components/header/header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";
import { CTASection } from "../components/sections/CTA";
import Features from "../components/sections/Features.jsx";

const Savings = () => {
  const { t } = useLanguageContext();
  const [initialDeposit, setInitialDeposit] = useState(5000);
  const [monthlyContribution, setMonthlyContribution] = useState(200);
   const [showScrollTop, setShowScrollTop] = useState(false);
  
    useEffect(() => {
      const handleScroll = () => {
        setShowScrollTop(window.scrollY > 400);
      };
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, []);
  
    const scrollToTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };

  const [timePeriod, setTimePeriod] = useState(5); // Add this state
  const [apy, setApy] = useState(4.25); // Add this state

  // Add this calculation function
  const calculateBalanceForYear = (years) => {
    const monthlyRate = apy / 100 / 12;
    const months = years * 12;

    // Future value of initial deposit
    const futureValueInitial =
      initialDeposit * Math.pow(1 + monthlyRate, months);

    // Future value of monthly contributions
    const futureValueContributions =
      (monthlyContribution * (Math.pow(1 + monthlyRate, months) - 1)) /
      monthlyRate;

    return Math.round(futureValueInitial + futureValueContributions);
  };

  // Update existing calculateBalance function
  const calculateBalance = () => {
    return calculateBalanceForYear(timePeriod);
  };

  const savingsAccounts = [
    {
      name: "High-Yield Savings",
      description: "Maximize your savings with our highest available rate",
      apy: "4.25%",
      minimum: "$100",
      badge: "Most Popular",
      features: [
        "No monthly fees",
        "FDIC insured up to $250K",
        "24/7 account access",
        "Automatic savings plans",
      ],
      color: "from-green-500 to-emerald-600",
      iconBg: "bg-green-100 dark:bg-green-900/50",
      icon: TrendingUp,
      textColor: "text-green-600 dark:text-green-400",
      borderColor: "border-green-500",
    },
    {
      name: "Goal Savings",
      description: "Save for specific goals with automated contributions",
      apy: "3.75%",
      minimum: "$25",
      badge: "Best for Beginners",
      features: [
        "Goal tracking tools",
        "Auto-save features",
        "Progress notifications",
        "Flexible withdrawals",
      ],
      color: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-100 dark:bg-blue-900/50",
      icon: Target,
      textColor: "text-blue-600 dark:text-blue-400",
      borderColor: "border-blue-500",
    },
    {
      name: "Certificate of Deposit",
      description: "Lock in rates for guaranteed returns",
      apy: "4.50%",
      minimum: "$1,000",
      badge: "Highest APY",
      features: [
        "Fixed rates guaranteed",
        "Terms from 6-60 months",
        "Early withdrawal options",
        "Compound interest daily",
      ],
      color: "from-purple-500 to-violet-600",
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      icon: Lock,
      textColor: "text-purple-600 dark:text-purple-400",
      borderColor: "border-purple-500",
    },
  ];

  const features = [
    {
      icon: Shield,
      title: "FDIC Insured",
      description: "Up to $250,000 per depositor",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20",
      iconBg: "bg-green-500",
    },
    {
      icon: TrendingUp,
      title: "High APY",
      description: "Competitive interest rates",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20",
      iconBg: "bg-blue-500",
    },
    {
      icon: Sparkles,
      title: "No Hidden Fees",
      description: "Transparent banking with no surprises",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20",
      iconBg: "bg-purple-500",
    },
    {
      icon: Zap,
      title: "Auto-Save Tools",
      description: "Automate your savings goals",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
      iconBg: "bg-orange-500",
    },
  ];

  const savingsGoals = [
    {
      goal: "Emergency Fund",
      amount: "$10,000",
      timeline: "12 months",
      icon: Shield,
      gradient: "from-green-400 to-emerald-500",
      bgGradient:
        "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
    },
    {
      goal: "Down Payment",
      amount: "$50,000",
      timeline: "36 months",
      icon: Target,
      gradient: "from-blue-400 to-indigo-500",
      bgGradient:
        "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
    },
    {
      goal: "Vacation",
      amount: "$5,000",
      timeline: "6 months",
      icon: Sparkles,
      gradient: "from-purple-400 to-violet-500",
      bgGradient:
        "from-purple-50 to-violet-50 dark:from-purple-900/30 dark:to-violet-900/30",
    },
    {
      goal: "New Car",
      amount: "$25,000",
      timeline: "24 months",
      icon: TrendingUp,
      gradient: "from-orange-400 to-amber-500",
      bgGradient:
        "from-orange-50 to-amber-50 dark:from-orange-900/30 dark:to-amber-900/30",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 w-full overflow-hidden">
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
                    Savings Accounts
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section - Compact */}
      <section className="relative text-white overflow-hidden min-h-[40vh]">
        {/* Background Image with Gradient Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80"
            alt="Savings and financial growth"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="opacity-60 absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-teal-900/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
          <div className="text-center max-w-3xl mx-auto">
            {/* Badge - Smaller */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full mb-4 border border-white/30">
              <Sparkles className="w-3 h-3" />
              <span className="text-xs font-semibold">
                Start earning more today
              </span>
            </div>

            {/* Main Heading - Compact */}
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              Savings Accounts That
              <span className="block bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-400 bg-clip-text text-transparent">
                Work Harder
              </span>
            </h1>

            {/* Description - Shorter */}
            <p className="text-sm lg:text-base mb-6 text-green-50 max-w-2xl mx-auto">
              Grow your money faster with competitive rates & zero fees
            </p>

            {/* Stats Row - Compact */}
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <TrendingUp className="w-4 h-4" />
                <span className="text-lg font-bold">4.50%</span>
                <span className="text-xs opacity-90">APY</span>
              </div>
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-semibold">FDIC Insured</span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center px-6 py-2.5 bg-white text-green-600 font-bold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform text-base"
              >
                Start Saving Now
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Trust Indicators - Smaller */}
            <div className="mt-8 pt-4 border-t border-white/20">
              <p className="text-xs text-green-100 mb-3">
                Trusted by thousands of savers
              </p>
              <div className="flex justify-center items-center gap-4 text-white/80">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3 h-3" />
                  <span className="text-xs">50K+ Customers</span>
                </div>
                <div className="w-0.5 h-0.5 bg-white/40 rounded-full"></div>
                <div className="flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" />
                  <span className="text-xs">$1B+ Managed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Savings Calculator - Modern & Interactive */}
      <section
        id="calculator"
        className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full mb-4 shadow-lg text-sm sm:text-base">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-semibold">Smart Savings Calculator</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Watch Your Savings
              <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Grow Exponentially
              </span>
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-2">
              Calculate how compound interest can transform your savings over
              time
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start">
            {/* Calculator Panel - Enhanced */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 sm:-top-6 sm:-left-6 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full blur-2xl sm:blur-3xl opacity-20 animate-pulse"></div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 shadow-xl sm:shadow-2xl border border-gray-200 dark:border-gray-700 relative z-10">
                {/* Time Period Selector */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                    <label className="text-gray-700 dark:text-gray-300 font-semibold text-base sm:text-lg">
                      Savings Timeline
                    </label>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {[1, 3, 5, 10].map((years) => (
                        <button
                          key={years}
                          onClick={() => setTimePeriod(years)}
                          className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-all text-sm sm:text-base ${
                            timePeriod === years
                              ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {years} year{years !== 1 ? "s" : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Input Controls */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Initial Deposit */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-1">
                      <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                        Initial Deposit
                      </label>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${initialDeposit.toLocaleString()}
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="500"
                        max="50000"
                        step="500"
                        value={initialDeposit}
                        onChange={(e) =>
                          setInitialDeposit(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gradient-to-r from-green-200 to-emerald-200 dark:from-gray-700 dark:to-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 sm:h-6 [&::-webkit-slider-thumb]:w-5 sm:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-green-500 [&::-webkit-slider-thumb]:to-emerald-500 [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span>$500</span>
                        <span>$50k</span>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Contribution */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-1">
                      <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        Monthly Contribution
                      </label>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        ${monthlyContribution}/mo
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="2000"
                        step="50"
                        value={monthlyContribution}
                        onChange={(e) =>
                          setMonthlyContribution(parseInt(e.target.value))
                        }
                        className="w-full h-2 bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-gray-700 dark:to-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 sm:h-6 [&::-webkit-slider-thumb]:w-5 sm:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-indigo-500 [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span>$0</span>
                        <span>$2k</span>
                      </div>
                    </div>
                  </div>

                  {/* APY Selector */}
                  <div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 gap-1">
                      <label className="text-gray-700 dark:text-gray-300 font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <Percent className="w-3 h-3 sm:w-4 sm:h-4" />
                        Annual Rate (APY)
                      </label>
                      <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {apy}%
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="7"
                        step="0.25"
                        value={apy}
                        onChange={(e) => setApy(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-gray-700 dark:to-gray-600 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 sm:h-6 [&::-webkit-slider-thumb]:w-5 sm:w-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-purple-500 [&::-webkit-slider-thumb]:to-pink-500 [&::-webkit-slider-thumb]:shadow-lg"
                      />
                      <div className="flex justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                        <span>1%</span>
                        <span>7%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Results Card - Enhanced */}
                <div className="mt-6 sm:mt-10">
                  <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/30 dark:to-teal-900/30 border-2 border-green-200 dark:border-green-800 p-4 sm:p-6 lg:p-8">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4 gap-3">
                      <div>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
                          Projected Balance After {timePeriod} Year
                          {timePeriod !== 1 ? "s" : ""}
                        </p>
                        <p className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mt-1 sm:mt-2">
                          ${calculateBalance().toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shadow-lg w-fit">
                        +
                        {(
                          (calculateBalance() /
                            (initialDeposit +
                              monthlyContribution * timePeriod * 12) -
                            1) *
                          100
                        ).toFixed(1)}
                        % Growth
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-green-200 dark:border-green-800">
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Total Invested
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                          $
                          {(
                            initialDeposit +
                            monthlyContribution * timePeriod * 12
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Interest Earned
                        </p>
                        <p className="text-base sm:text-lg font-bold text-green-600 dark:text-green-400">
                          $
                          {(
                            calculateBalance() -
                            (initialDeposit +
                              monthlyContribution * timePeriod * 12)
                          ).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                          Monthly Growth
                        </p>
                        <p className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                          $
                          {(
                            (calculateBalance() -
                              (initialDeposit +
                                monthlyContribution * timePeriod * 12)) /
                            (timePeriod * 12)
                          ).toFixed(0)}
                          /mo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goals & Visualization - Enhanced */}
            <div>
              <div className="sticky top-4 sm:top-6 lg:top-24">
                {/* Visual Growth Chart */}
                <div className="bg-gradient-to-br from-gray-900 to-black rounded-2xl sm:rounded-3xl p-4 sm:p-6 text-white mb-6 sm:mb-8 shadow-xl sm:shadow-2xl">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">
                        Growth Visualization
                      </h3>
                      <p className="text-gray-300 text-xs sm:text-sm">
                        Compound interest over time
                      </p>
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                      <LineChart className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                  </div>

                  {/* Simple Bar Chart */}
                  <div className="space-y-3 sm:space-y-4">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const year = i + 1;
                      const balance = calculateBalanceForYear(year);
                      const prevBalance =
                        i === 0
                          ? initialDeposit
                          : calculateBalanceForYear(year - 1);
                      const growth =
                        ((balance - prevBalance) / prevBalance) * 100;

                      return (
                        <div key={i} className="space-y-1.5 sm:space-y-2">
                          <div className="flex justify-between text-xs sm:text-sm">
                            <span className="text-gray-300">Year {year}</span>
                            <span className="font-semibold">
                              ${balance.toLocaleString()}
                            </span>
                          </div>
                          <div className="relative h-3 sm:h-4 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="absolute h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min((balance / calculateBalance()) * 100, 100)}%`,
                              }}
                            />
                          </div>
                          <div className="text-xs text-gray-400 flex justify-between">
                            <span>
                              +${(balance - prevBalance).toLocaleString()}
                            </span>
                            <span className="text-green-400">
                              +{growth.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Quick Goals */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center gap-3">
                    <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                    Popular Savings Goals
                  </h3>

                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                    {savingsGoals.slice(0, 4).map((goal, index) => {
                      const GoalIcon = goal.icon;
                      return (
                        <div
                          key={index}
                          className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-700 transition-all hover:shadow-lg cursor-pointer"
                        >
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div
                              className={`w-8 h-8 sm:w-10 sm:h-10 ${goal.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}
                            >
                              <GoalIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-xs sm:text-sm truncate">
                                {goal.goal}
                              </h4>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {goal.amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <div className="text-center">
                  <Link
                    to="/register"
                    className="group inline-flex items-center justify-center w-full px-4 py-3 sm:px-6 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold rounded-lg sm:rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all duration-300 shadow-lg text-sm sm:text-base"
                  >
                    <Calculator className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" />
                    <span className="truncate">
                      Start Saving with These Numbers
                    </span>
                    <ArrowRight className="ml-2 w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-500 dark:text-gray-400 px-2">
                    Based on your calculations, you could achieve your goals{" "}
                    {timePeriod} years faster
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid - Image Backgrounds */}
      <section className="py-16 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose Our Savings Accounts?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Discover the features that make our savings accounts the smart
              choice for growing your money securely and efficiently
            </p>

            {/* Stats Banner */}
            <div className="mt-8 flex flex-wrap justify-center gap-6">
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/30 px-4 py-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="font-semibold text-green-700 dark:text-green-300">
                  4.50% APY
                </span>
              </div>
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-700 dark:text-blue-300">
                  50,000+ Customers
                </span>
              </div>
              <div className="flex items-center gap-2 bg-purple-50 dark:bg-purple-900/30 px-4 py-2 rounded-lg">
                <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-purple-700 dark:text-purple-300">
                  Award Winning
                </span>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              // Different images for each feature
              const featureImages = [
                " https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&q=80", // High interest
                "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80", // No fees
                "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=800&h=600&fit=crop&q=80", // Mobile app
                "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Security
              ];

              const featureImage = featureImages[index] || featureImages[0];

              return (
                <div
                  key={index}
                  className="relative rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group h-64"
                >
                  {/* Background Image */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${featureImage})` }}
                  >
                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 h-full flex flex-col justify-end p-6">
                    <div className="mb-3">
                      <div
                        className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center mb-3 shadow-lg backdrop-blur-sm bg-black/30`}
                      >
                        <feature.icon className="text-white" size={20} />
                      </div>
                      <h3 className={`font-bold text-lg text-white mb-2`}>
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Learn More Link */}
                    <Link
                      to="/login"
                      className="inline-flex items-center gap-1 text-white text-sm font-medium mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:underline"
                    >
                      Learn more
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>

                  {/* Overlay Border */}
                  <div className="absolute inset-0 border-2 border-white/10 rounded-2xl pointer-events-none group-hover:border-white/20 transition-colors"></div>

                  {/* Feature Number Badge */}
                  <div className="absolute top-4 left-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {index + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <Plus className="w-5 h-5 mr-2" />
              Open Your Savings Account Today
            </Link>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              No minimum balance required • Open in 5 minutes • FDIC insured
            </p>
          </div>
        </div>
      </section>

      {/* Account Options - Clean minimal style matching the screenshot */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Savings Options
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our full range of banking products and services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {savingsAccounts.map((account, index) => {
              const AccountIcon = account.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl ${account.iconBg} flex items-center justify-center mb-6`}
                  >
                    <AccountIcon className={`w-6 h-6 ${account.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {account.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {account.description}
                  </p>

                  {/* Learn More Link */}
                  <Link
                    to="/register"
                    className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all group"
                  >
                    Open Account
                    <svg
                      className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full overflow-hidden">
        <Features t={t} />
      </section>

      {/*CTA*/}
      <section className="w-full overflow-hidden">
        <CTASection
          title={t("landing.cta.readyToGetStarted")}
          description={t("landing.cta.openAccountToday")}
          primaryButtonText={t("landing.cta.openAnAccount")}
          primaryButtonLink="/register"
          secondaryButtonText={t("landing.cta.scheduleAppointment")}
          secondaryButtonAction={() =>
            alert("Schedule appointment feature coming soon!")
          }
          showLoginLink={true}
          t={t}
        />
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

export default Savings;
