/* eslint-disable no-unused-vars */
// src/pages/user/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  ArrowLeftRight,
  CreditCard,
  Send,
  Building2,
  Repeat,
  PiggyBank,
  DollarSign,
  FileText,
  LifeBuoy,
  Settings,
  Bell,
  Moon,
  Sun,
  User,
  Plus,
  Wallet,
  TrendingUp,
  TrendingDown,
  MessageCircle,
  Phone,
  Menu,
  X,
  Lock,
  BarChart3,
  LogOut,
  Shield,
  Gauge,
  Clock,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import { dashboardService } from "../../../services/dashhboardService";
import BTCCard from "../../../components/btcComponents/BTCCard";
import { cardService } from "../../../services/cardService";
import Card from "../Cards/CardUi";
import ProfileDropdown from "../Components/ProfileDropdown";
import NotificationBell from "../Components/NotificationBell";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { twoFactorService } from "../../../services/twoFactorService";
import { kycService } from "../../../services/kycService";
import { userService } from "../../../services/userService";
import { useNotifications } from "../../../contexts/NotificationContext";
import KYCBanner from "../Components/KYCBanner";
import AnnouncementBanner from "../Components/AnnouncementBanner";

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [activeCard, setActiveCard] = useState(0);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [accountData, setAccountData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [showLimits, setShowLimits] = useState(false);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState([]);
  const [userCards, setUserCards] = useState([]);
  const [hasPendingCard, setHasPendingCard] = useState(false);
  const [existingCard, setExistingCard] = useState(null);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [kycVerified, setKycVerified] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const { user, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { menuCounts } = useNotifications();
  const getCount = (key) => menuCounts?.[key] || 0;

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;

      try {
        const profile = await userService.getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user]);

  useEffect(() => {
    const fetch2FAStatus = async () => {
      try {
        const response = await twoFactorService.get2FAStatus();
        if (response.success) {
          setTwoFactorEnabled(response.enabled);
        }
      } catch (error) {
        console.error("Error fetching 2FA status:", error);
      }
    };
    fetch2FAStatus();
  }, []);

  useEffect(() => {
    const fetchKYCStatus = async () => {
      try {
        const response = await kycService.getKYCStatus();
        if (response.success && response.status === "verified") {
          setKycVerified(true);
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
      }
    };
    fetchKYCStatus();
  }, []);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      try {
        setIsDataLoading(true);
        setDataError(null);

        console.log("Fetching dashboard data...");

        const data = await dashboardService.getDashboardData();
        setAccountData(data);

        const transactions = await dashboardService.getRecentTransactions(5);
        setRecentTransactions(transactions);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        const status = error?.status || error?.response?.status;
        if (status === 401 || status === 403 || status === 404) {
          return;
        }
        setDataError(
          "Failed to load your account data. Please refresh the page.",
        );

        if (user) {
          setAccountData({
            firstName: user.firstName || "User",
            lastName: user.lastName || "",
            accountNumber: user.accountNumber || "**** ****",
            accountType: user.accountType || "savings",
            accountTypeDisplay:
              user.accountType === "business"
                ? "Business Account"
                : user.accountType === "checking"
                  ? "Checking Account"
                  : "Savings Account",
            fiatBalance: user.balanceFiat || 0,
            btcBalance: user.balanceBTC || 0,
            accountStatus: "active",
            monthlyDeposits: 0,
            monthlyExpenses: 0,
            accountLimits: {
              dailyLimit: 500000,
              weeklyLimit: 1000000,
              monthlyLimit: 5000000,
              singleTransactionLimit: 100000,
              remainingDaily: 500000,
              remainingWeekly: 1000000,
              remainingMonthly: 5000000,
              dailyUsed: 0,
              weeklyUsed: 0,
              monthlyUsed: 0,
              dailyPercentage: 0,
              weeklyPercentage: 0,
              monthlyPercentage: 0,
            },
          });
        }
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Load beneficiaries from localStorage
  useEffect(() => {
    if (user) {
      const userBeneficiariesKey = `savedBeneficiaries_${user.id}`;
      const saved = localStorage.getItem(userBeneficiariesKey);
      if (saved) {
        try {
          setSavedBeneficiaries(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse saved beneficiaries:", e);
        }
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardService.getUserCards();

        // Check the response structure
        if (response && response.success && response.cards) {
          setUserCards(response.cards);
        } else if (response && Array.isArray(response)) {
          setUserCards(response);
        } else if (response && response.data && response.data.cards) {
          setUserCards(response.data.cards);
        } else {
          console.error("Unexpected cards response format:", response);
          setUserCards([]);
        }
      } catch (error) {
        console.error("Error fetching cards:", error);
        setUserCards([]);
      }
    };

    fetchCards();
  }, []);

  useEffect(() => {
    const checkPendingCards = async () => {
      try {
        const response = await cardService.getUserCards();

        const cards = Array.isArray(response)
          ? response
          : response?.cards || [];

        const pendingCard = cards.find((card) => card.status === "pending");

        if (pendingCard) {
          setHasPendingCard(true);
          setExistingCard(pendingCard);
        }
      } catch (error) {
        console.error("Error checking pending cards:", error);
      }
    };

    checkPendingCards();
  }, []);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && activeCard === 0) {
      setActiveCard(1);
    }
    if (isRightSwipe && activeCard === 1) {
      setActiveCard(0);
    }
  };

  const quickActions = [
    { name: "Transfer", icon: Send, color: "blue", link: "/transfer/local" },
    { name: "Pay Bills", icon: FileText, color: "green", link: "/pay-bills" },
    { name: "Request", icon: TrendingDown, color: "pink", link: "/receive" },
    {
      name: "Bank Details",
      icon: Building2,
      color: "blue",
      link: "/bank-details",
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Show loading state
  if (authLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{dataError}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Refresh Page
            </button>
            <button
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.href = "/login";
              }}
              className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300"
            >
              Sign In Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user || !accountData) {
    return null;
  }

  const displayData = {
    accountHolder:
      `${accountData.firstName || user.firstName || ""} ${accountData.lastName || user.lastName || ""}`.trim() ||
      "User",
    accountNumber:
      accountData.accountNumber || user.accountNumber || "**** ****",
    accountType: accountData.accountType || user.accountType || "savings",
    accountTypeDisplay:
      accountData.accountTypeDisplay ||
      (accountData.accountType === "business"
        ? "Business Account"
        : accountData.accountType === "checking"
          ? "Checking Account"
          : "Savings Account"),
    accountStatus:
      userProfile?.status ||
      (userProfile?.isVerified === true
        ? "active"
        : userProfile?.isBlocked === true
          ? "blocked"
          : userProfile?.isSuspended === true
            ? "suspended"
            : "pending"),
    fiatBalance: accountData.fiatBalance || 0,
    btcBalance: accountData.btcBalance || 0,
    // Calculate monthly totals from transactions
    monthlyDeposits: recentTransactions.reduce((sum, tx) => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const txDate = new Date(tx.createdAt);
      if (txDate >= firstDayOfMonth && tx.type === "deposit") {
        return sum + tx.amount;
      }
      return sum;
    }, 0),
    monthlyExpenses: recentTransactions.reduce((sum, tx) => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const txDate = new Date(tx.createdAt);
      if (txDate >= firstDayOfMonth && tx.type !== "deposit") {
        return sum + tx.amount;
      }
      return sum;
    }, 0),
    totalVolume: accountData.totalVolume || 0,
    pendingTransactions: accountData.pendingTransactions || 0,
    accountLimits: accountData.accountLimits || {
      dailyLimit: 500000,
      weeklyLimit: 1000000,
      monthlyLimit: 5000000,
      singleTransactionLimit: 100000,
      remainingDaily: 500000,
      remainingWeekly: 1000000,
      remainingMonthly: 5000000,
      dailyUsed: 0,
      weeklyUsed: 0,
      monthlyUsed: 0,
      dailyPercentage: 0,
      weeklyPercentage: 0,
      monthlyPercentage: 0,
    },
  };

  const userEmail = user?.email || "user@email.com";
  const userName = displayData.accountHolder;
  const achievementsDone = [true, kycVerified, twoFactorEnabled];
  const completedCount = achievementsDone.filter(Boolean).length;
  const totalCount = achievementsDone.length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden pb-20">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Menu Toggle */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                <Menu size={24} />
              </button>
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                  Byvault Finance
                </span>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                {darkMode ? (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                )}
              </button>
              <NotificationBell
                iconSize={20}
                showCount={true}
                maxDisplay={5}
                position="right-0"
                onNotificationClick={(notification) => {
                  // Custom handling if needed
                  console.log("Notification clicked:", notification);
                }}
              />
              {/* Profile */}
              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                kycStatus="pending"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Sidebar Header with Close Button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                Byvault Finance
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center"
            >
              <X size={24} className="text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Scrollable Sidebar Content */}
          <div className="overflow-y-auto h-[calc(100vh-140px)] lg:h-[calc(100vh-140px)] p-4 pb-24 lg:pb-4">
            {/* Main Section */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Main
              </p>
              <Link
                to="/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 bg-blue-500 text-white rounded-lg mb-1"
              >
                <Home size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                to="/transactions"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <ArrowLeftRight size={18} />
                  <span className="text-sm">Transactions</span>
                </div>
                {getCount("transactions") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {getCount("transactions")}
                  </span>
                )}
              </Link>
              <Link
                to="/cards"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={18} />
                  <span className="text-sm">Cards</span>
                </div>
                {getCount("cards") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-blue-500 rounded-full">
                    {getCount("cards")}
                  </span>
                )}
              </Link>
            </div>

            {/* Transfers Section */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Transfers
              </p>
              <Link
                to="/transfer/local"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <Send size={18} />
                  <span className="text-sm">Local Transfer</span>
                </div>
                {getCount("local-transfer") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded-full">
                    {getCount("local-transfer")}
                  </span>
                )}
              </Link>
              <Link
                to="/transfer/international"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <Building2 size={18} />
                  <span className="text-sm">International</span>
                </div>
                {getCount("international-transfer") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-orange-500 rounded-full">
                    {getCount("international-transfer")}
                  </span>
                )}
              </Link>
              <Link
                to="/deposit"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <Plus size={18} />
                  <span className="text-sm">Deposit</span>
                </div>
                {getCount("deposit") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-green-500 rounded-full">
                    {getCount("deposit")}
                  </span>
                )}
              </Link>
              <Link
                to="/currency-swap"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Repeat size={18} />
                  <span className="text-sm">Currency Swap</span>
                </div>
                {getCount("currency-swap") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-teal-500 rounded-full">
                    {getCount("currency-swap")}
                  </span>
                )}
              </Link>
            </div>

            {/* Services Section */}
            <div className="mb-6">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Services
              </p>
              <Link
                to="/loan-services"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <DollarSign size={18} />
                  <span className="text-sm">Loans</span>
                </div>
                {getCount("loans") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-purple-500 rounded-full">
                    {getCount("loans")}
                  </span>
                )}
              </Link>
              <Link
                to="/tax-refund"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <FileText size={18} />
                  <span className="text-sm">Tax Refund</span>
                </div>
                {getCount("tax-refund") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-purple-500 rounded-full">
                    {getCount("tax-refund")}
                  </span>
                )}
              </Link>
              <Link
                to="/grants"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <PiggyBank size={18} />
                  <span className="text-sm">Grants</span>
                </div>
                {getCount("grants") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-purple-500 rounded-full">
                    {getCount("grants")}
                  </span>
                )}
              </Link>
            </div>

            {/* Account Section */}
            <div>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                Account
              </p>
              <Link
                to="/settings"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
              >
                <div className="flex items-center gap-3">
                  <Settings size={18} />
                  <span className="text-sm">Settings</span>
                </div>
                {getCount("settings") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-yellow-500 rounded-full">
                    {getCount("settings")}
                  </span>
                )}
              </Link>
              <Link
                to="/support"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy size={18} />
                  <span className="text-sm">Support</span>
                </div>
                {getCount("support") > 0 && (
                  <span className="px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                    {getCount("support")}
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full mt-2 mb-4 lg:mb-2"
              >
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>

          {/* User Profile at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center relative">
                <User size={20} className="text-white" />
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-full overflow-x-hidden">
          <KYCBanner />
          <AnnouncementBanner />
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl ml-4 font-bold text-gray-900 dark:text-white">
              Welcome, {displayData.accountHolder.split(" ")[0] || "User"} 👋
            </h1>
          </div>

          {/* ACCOUNT TYPE  */}
          <div className="mb-4 ml-4 flex items-center gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-full">
              <Shield size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {displayData.accountTypeDisplay}
              </span>
            </div>
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${
                displayData.accountStatus === "Active"
                  ? "bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800"
                  : "bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  displayData.accountStatus === "Active"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              ></span>
              <span
                className={`text-xs font-medium ${
                  displayData.accountStatus === "Active"
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                {displayData.accountStatus}
              </span>
            </div>
          </div>

          {/* Swipeable Balance Cards */}
          <div className="mb-6">
            <div
              className="relative overflow-hidden"
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-out"
                style={{ transform: `translateX(-${activeCard * 100}%)` }}
              >
                {/* Fiat/USD Card */}
                <div className="w-full flex-shrink-0 px-2">
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs opacity-90">
                            BYVAULT FINANCE
                          </span>
                        </div>
                        <p className="text-sm font-semibold">
                          {displayData.accountHolder}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs opacity-90 mb-1">Account ID</p>
                        <p className="text-sm font-semibold">
                          {displayData.accountNumber}
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm opacity-90 mb-1">
                        Available Balance
                      </p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold">
                          $
                          {displayData.fiatBalance.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <Lock size={18} className="opacity-70" />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs mb-4">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-300 rounded-full"></div>
                        <span className="opacity-90">
                          {displayData.accountStatus}
                        </span>
                      </div>
                      <div className="text-xs opacity-75">
                        Last updated:{" "}
                        {new Date().toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* BTC Card - Live Rate */}
                <div className="w-full flex-shrink-0 px-2">
                  <BTCCard
                    accountData={{
                      ...accountData,
                      accountHolder: displayData.accountHolder,
                      btcBalance: displayData.btcBalance,
                      btcRate:
                        displayData.btcRate || accountData.btcRate || 69898,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Card Indicators */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <button
                onClick={() => setActiveCard(0)}
                className={`h-2 rounded-full transition-all ${
                  activeCard === 0
                    ? "w-8 bg-gray-800 dark:bg-white"
                    : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              ></button>
              <button
                onClick={() => setActiveCard(1)}
                className={`h-2 rounded-full transition-all ${
                  activeCard === 1
                    ? "w-8 bg-gray-800 dark:bg-white"
                    : "w-2 bg-gray-300 dark:bg-gray-600"
                }`}
              ></button>
            </div>

            {/* Swipe Hint */}
            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center justify-center gap-1">
              <ArrowLeftRight size={14} />
              Swipe to switch between accounts
            </p>
          </div>

          {/*  ACCOUNT LIMITS CARD */}
          <div className="mb-6 px-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Header with toggle */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                onClick={() => setShowLimits(!showLimits)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <Gauge
                      size={20}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Account Limits
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Daily: $
                      {displayData.accountLimits.remainingDaily.toLocaleString()}{" "}
                      remaining
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {showLimits ? "Hide" : "View"}
                  </span>
                  <div
                    className={`transform transition-transform duration-200 ${showLimits ? "rotate-180" : ""}`}
                  >
                    <TrendingDown
                      size={16}
                      className="text-gray-500 dark:text-gray-400 rotate-90"
                    />
                  </div>
                </div>
              </div>

              {/* Limits details - collapsible */}
              {showLimits && (
                <div className="p-4 pt-0 border-t border-gray-200 dark:border-gray-700">
                  <div className="space-y-4 mt-4">
                    {/* Daily Limit */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Daily Limit
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          $
                          {displayData.accountLimits.dailyUsed.toLocaleString()}{" "}
                          / $
                          {displayData.accountLimits.dailyLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(displayData.accountLimits.dailyPercentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        $
                        {displayData.accountLimits.remainingDaily.toLocaleString()}{" "}
                        remaining today
                      </p>
                    </div>

                    {/* Weekly Limit */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Weekly Limit
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          $
                          {displayData.accountLimits.weeklyUsed.toLocaleString()}{" "}
                          / $
                          {displayData.accountLimits.weeklyLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(displayData.accountLimits.weeklyPercentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        $
                        {displayData.accountLimits.remainingWeekly.toLocaleString()}{" "}
                        remaining this week
                      </p>
                    </div>

                    {/* Monthly Limit */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <Clock
                            size={14}
                            className="text-gray-500 dark:text-gray-400"
                          />
                          <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                            Monthly Limit
                          </span>
                        </div>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          $
                          {displayData.accountLimits.monthlyUsed.toLocaleString()}{" "}
                          / $
                          {displayData.accountLimits.monthlyLimit.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${Math.min(displayData.accountLimits.monthlyPercentage, 100)}%`,
                          }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        $
                        {displayData.accountLimits.remainingMonthly.toLocaleString()}{" "}
                        remaining this month
                      </p>
                    </div>

                    {/* Single Transaction Limit */}
                    <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          Per Transaction
                        </span>
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          $
                          {displayData.accountLimits.singleTransactionLimit.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons  */}
          <div className="grid grid-cols-4 gap-3 mb-6">
            {/* Top Up Button */}
            <button
              onClick={() => navigate("/deposit")}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                <Plus
                  className="text-yellow-600 dark:text-yellow-400"
                  size={24}
                />
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                Top Up
              </span>
            </button>

            {/* Send Button */}
            <button
              onClick={() => navigate("/transfer")}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Send className="text-gray-600 dark:text-gray-300" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                Send
              </span>
            </button>

            {/* Receive Button */}
            <button
              onClick={() => navigate("/receive")}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <TrendingDown
                  className="text-gray-600 dark:text-gray-300"
                  size={24}
                />
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                Receive
              </span>
            </button>

            {/* More Button */}
            <button
              onClick={() => navigate("/more")}
              className="flex flex-col items-center gap-2 p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <Menu className="text-gray-600 dark:text-gray-300" size={24} />
              </div>
              <span className="text-xs font-medium text-gray-900 dark:text-white">
                Menu
              </span>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.link}
                    className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
                  >
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2 bg-${action.color}-100 dark:bg-${action.color}-900`}
                    >
                      <Icon
                        className={`text-${action.color}-600 dark:text-${action.color}-400`}
                        size={24}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white text-center">
                      {action.name}
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Quick Transfer */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Quick Transfer
              </h2>
              <Link
                to="/transfer/local"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                {/* Add New Button */}
                <Link
                  to="/transfer/local"
                  className="flex flex-col items-center gap-2 flex-shrink-0"
                >
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <Plus
                      size={24}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    Add New
                  </span>
                </Link>

                {/* Saved Beneficiaries */}
                {savedBeneficiaries.length > 0 ? (
                  savedBeneficiaries.slice(0, 5).map((beneficiary) => (
                    <Link
                      key={beneficiary.id}
                      to="/transfer/local"
                      state={{ beneficiary }} // Pass beneficiary data
                      className="flex flex-col items-center gap-2 flex-shrink-0 group"
                    >
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                        <User
                          size={24}
                          className="text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <span className="text-xs text-gray-900 dark:text-white font-medium text-center break-words max-w-[80px]">
                        {beneficiary.name?.split(" ")[0] || beneficiary.name}
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {beneficiary.bankName?.substring(0, 10)}...
                      </span>
                    </Link>
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-2 mx-auto py-2">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                      <User
                        size={24}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      No saved beneficiaries
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Your Active Cards */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Your Active Cards
              </h2>
              {userCards.length > 0 && (
                <Link
                  to="/cards"
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All →
                </Link>
              )}
            </div>

            {userCards.filter((c) => c.status === "active").length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userCards
                  .filter((c) => c.status === "active")
                  .slice(0, 2)
                  .map((card) => (
                    <Card
                      key={card._id}
                      card={card}
                      onViewDetails={(card) => navigate(`/cards/${card._id}`)}
                    />
                  ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 text-center">
                <div className="py-8">
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No active cards
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
                    Apply for a virtual card to get started with secure online
                    payments.
                  </p>
                  <button
                    onClick={() => navigate("/apply-virtual-card")}
                    className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 mx-auto"
                  >
                    <Plus size={18} />
                    Apply for Card
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Financial Services */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Financial Services
              </h2>
              <Link
                to="/services"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Loans */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center">
                    <Building2
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      Loans
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Quick approval process
                </p>
                <button
                  onClick={() => navigate("/apply-loan")}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <Building2 size={14} />
                  Apply Now
                </button>
              </div>

              {/* Grants */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                    <DollarSign
                      className="text-green-600 dark:text-green-400"
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      Grants
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  No repayment required
                </p>
                <button
                  onClick={() => navigate("/grants")}
                  className="w-full py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <DollarSign size={14} />
                  Apply Now
                </button>
              </div>

              {/* Tax Refunds */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center">
                    <FileText
                      className="text-purple-600 dark:text-purple-400"
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      Tax Refunds
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Fast processing
                </p>
                <button
                  onClick={() => navigate("/tax-refund")}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <FileText size={14} />
                  Apply Now
                </button>
              </div>

              {/* Virtual Cards */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-xl flex items-center justify-center">
                    <CreditCard
                      className="text-orange-600 dark:text-orange-400"
                      size={24}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      Virtual Cards
                    </h3>
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Instant virtual cards
                </p>
                <button
                  onClick={() => navigate("/apply-virtual-card")}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1"
                >
                  <CreditCard size={14} />
                  Apply Now
                </button>
              </div>
            </div>
          </div>

          {/* Financial Insights */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Financial Insights
              </h2>
              <Link
                to="/insights"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View Report →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-xl flex items-center justify-center">
                  <TrendingDown
                    className="text-red-600 dark:text-red-400"
                    size={24}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Account Health
                    </h3>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Balance Ratio
                      </p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {displayData.accountLimits?.dailyLimit > 0
                          ? (
                              (displayData.fiatBalance /
                                displayData.accountLimits.dailyLimit) *
                              100
                            ).toFixed(1)
                          : 0}
                        %
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold mb-2 ${
                      displayData.fiatBalance /
                        (displayData.accountLimits?.dailyLimit || 500000) <
                      0.1
                        ? "text-red-600 dark:text-red-400"
                        : "text-green-600 dark:text-green-400"
                    }`}
                  >
                    {displayData.fiatBalance /
                      (displayData.accountLimits?.dailyLimit || 500000) <
                    0.1
                      ? "Needs Attention"
                      : "Healthy"}
                  </p>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className={`h-2 rounded-full ${
                    displayData.fiatBalance /
                      (displayData.accountLimits?.dailyLimit || 500000) <
                    0.1
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${Math.min((displayData.fiatBalance / (displayData.accountLimits?.dailyLimit || 500000)) * 100, 100)}%`,
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                ${displayData.fiatBalance.toLocaleString()} of $
                {(
                  displayData.accountLimits?.dailyLimit || 500000
                ).toLocaleString()}{" "}
                daily limit
              </p>
            </div>

            {/* This Month */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
                This Month
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingDown
                      className="text-green-600 dark:text-green-400 rotate-180"
                      size={20}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Income
                  </p>
                  <p className="text-lg font-bold text-green-600 dark:text-green-400">
                    $
                    {displayData.monthlyDeposits.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-2">
                    <TrendingUp
                      className="text-red-600 dark:text-red-400"
                      size={20}
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Expenses
                  </p>
                  <p className="text-lg font-bold text-red-600 dark:text-red-400">
                    $
                    {displayData.monthlyExpenses.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Net:
                </p>
                <p
                  className={`text-xl font-bold ${
                    displayData.monthlyDeposits - displayData.monthlyExpenses >=
                    0
                      ? "text-green-600 dark:text-green-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {displayData.monthlyDeposits - displayData.monthlyExpenses >=
                  0
                    ? "+"
                    : "-"}
                  $
                  {Math.abs(
                    displayData.monthlyDeposits - displayData.monthlyExpenses,
                  ).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Stay Secure Tip */}
          <div className="mb-6">
            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Lock
                    className="text-purple-600 dark:text-purple-400"
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                      Stay Secure
                    </h3>
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 text-[10px] font-semibold rounded-full">
                      💡 Tip
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Enable two-factor authentication for better security
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity  */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Link
                to="/transactions"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              {recentTransactions.length > 0 ? (
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
                    No Recent Activity
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your account activity will appear here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Achievements
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {completedCount} / {totalCount} completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4">
              <div
                className="bg-gradient-to-r from-yellow-400 to-green-500 h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: `${(completedCount / totalCount) * 100}%`,
                }}
              ></div>
            </div>

            <div className="space-y-3">
              {/* Welcome  */}
              <div className="bg-yellow-50 dark:bg-gray-800 rounded-xl p-4 border border-yellow-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/50 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                    <span className="text-2xl">⭐</span>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                      ✓
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Welcome to Byvault Finance!
                      </h3>
                      <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full">
                        Completed
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      Account created{" "}
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "recently"}
                    </p>
                  </div>
                </div>
              </div>

              {/* KYC Verification */}
              <div
                className={`rounded-xl p-4 border transition-all ${kycVerified ? "bg-green-50 dark:bg-gray-800 border-green-200 dark:border-gray-700" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                    <Shield
                      size={22}
                      className={
                        kycVerified
                          ? "text-green-600 dark:text-green-400"
                          : "text-gray-400 dark:text-gray-500"
                      }
                    />
                    {kycVerified && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Identity Verified
                      </h3>
                      {kycVerified ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {kycVerified
                        ? "KYC verification complete — full access unlocked"
                        : "Complete KYC to unlock higher limits & all features"}
                    </p>
                    {!kycVerified && (
                      <button
                        onClick={() =>
                          navigate(kycVerified ? "/kyc/status" : "/kyc/submit")
                        }
                        className="mt-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Verify now →
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2FA */}
              <div
                className={`rounded-xl p-4 border transition-all ${twoFactorEnabled ? "bg-blue-50 dark:bg-gray-800 border-blue-200 dark:border-gray-700" : "bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center flex-shrink-0 relative">
                    <Lock
                      size={22}
                      className={
                        twoFactorEnabled
                          ? "text-blue-600 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-500"
                      }
                    />
                    {twoFactorEnabled && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                        Security Champion
                      </h3>
                      {twoFactorEnabled ? (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full">
                          Completed
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full">
                          Not set
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      {twoFactorEnabled
                        ? "Two-factor authentication is active"
                        : "Enable 2FA to protect your account"}
                    </p>
                    {!twoFactorEnabled && (
                      <button
                        onClick={() => navigate("/settings/two-factor")}
                        className="mt-2 text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Enable 2FA →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Need Help? */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Need Help?
              </h2>
              <Link
                to="/support"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Support Center →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => navigate("/support")}
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <MessageCircle
                    className="text-blue-600 dark:text-blue-400"
                    size={24}
                  />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Live Chat
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Get instant help from our team
                </p>
              </button>

              <button
                onClick={() =>
                  (window.location.href = "mailto:admin@byvaultonline.com")
                }
                className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <Phone
                    className="text-green-600 dark:text-green-400"
                    size={24}
                  />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                  Email Support
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Send us a detailed message
                </p>
              </button>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <LifeBuoy
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                    24/7 Support
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                    We're here to help you anytime
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-lg">🕐</span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-900 dark:text-white">
                    24/7
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-lg">🎧</span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-900 dark:text-white">
                    Support
                  </p>
                </div>
                <div>
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-1">
                    <span className="text-lg">⚡</span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-900 dark:text-white">
                    Fast
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden h-20"></div>

      {/* Fixed Bottom Navigation (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
        <div className="grid grid-cols-5 h-16">
          <Link
            to="/transactions"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === "/activity"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <BarChart3 size={20} />
            <span className="text-[10px] font-medium">Activity</span>
          </Link>
          <Link
            to="/transfer"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname.startsWith("/transfer")
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <Send size={20} />
            <span className="text-[10px] font-medium">Transfer</span>
          </Link>
          <Link
            to="/dashboard"
            className="flex flex-col items-center justify-center gap-1"
          >
            <div
              className={`w-14 h-14 -mt-8 rounded-2xl flex items-center justify-center shadow-lg ${
                location.pathname === "/dashboard"
                  ? "bg-blue-500"
                  : "bg-gray-400"
              }`}
            >
              <Home size={24} className="text-white" />
            </div>
            <span
              className={`text-[10px] font-medium ${
                location.pathname === "/dashboard"
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 dark:text-gray-400"
              }`}
            >
              Home
            </span>
          </Link>
          <Link
            to="/cards"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === "/cards"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <CreditCard size={20} />
            <span className="text-[10px] font-medium">Cards</span>
          </Link>
          <Link
            to="/settings/profile"
            className={`flex flex-col items-center justify-center gap-1 ${
              location.pathname === "/profile"
                ? "text-blue-600 dark:text-blue-400"
                : "text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            <User size={20} />
            <span className="text-[10px] font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
