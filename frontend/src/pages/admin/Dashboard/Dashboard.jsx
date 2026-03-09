/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  ArrowLeftRight,
  DollarSign,
  Settings,
  LifeBuoy,
  Bell,
  Moon,
  Sun,
  User,
  Search,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Activity,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Filter,
  MoreVertical,
  Shield,
  FileText,
  Briefcase,
  Globe,
  MessageSquare,
  ChevronRight,
  RefreshCw,
  XCircle,
} from "lucide-react";
import SuperAdminProfile from "../Components/SuperAdmin";
import adminApi from "../../../services/adminApi";
import { kycService } from "../../../services/kycService";
import { analyticsService } from "../../../services/analyticsService";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

const AdminDashboard = () => {
  const [toasts, setToasts] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    pendingVerifications: 0,
    totalTransactions: 0,
    totalVolume: 0,
    monthlyRevenue: 0,
    pendingTransactions: 0,
    blockedAccounts: 0,
    activeChats: 0,
    pendingCards: 0,
    pendingGrants: 0,
    pendingTaxRefunds: 0,
    pendingLoans: 0,
  });

  const [recentUsers, setRecentUsers] = useState([]);
  const [systemHealthLoading, setSystemHealthLoading] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [pendingVerifications, setPendingVerifications] = useState([]);
  const [systemHealth, setSystemHealth] = useState({
    apiStatus: "Online",
    databaseStatus: "Online",
    paymentGateway: "Online",
    totalTransactions24h: 0,
    newUsers24h: 0,
    supportTickets: 0,
    successRate: 0,
    avgResponse: "0s",
    uptime: "0%",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectKycId, setRejectKycId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Search function
  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.trim().length < 2) {
      setShowSearchResults(false);
      return;
    }

    setSearching(true);
    setShowSearchResults(true);

    try {
      // Call your search API endpoint
      const results = await adminApi.search(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearching(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        handleSearch(searchQuery);
      }
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchSystemHealth = async () => {
    try {
      setSystemHealthLoading(true); // Start loading

      const [healthRes, statsRes, ticketsRes] = await Promise.all([
        fetch("/api/health")
          .then((res) => res.json())
          .catch(() => ({ status: "online" })),
        analyticsService.getOverviewStats().catch(() => null),
        adminApi
          .getSupportTickets({ status: "open", limit: 1 })
          .catch(() => ({ total: 0 })),
      ]);

      // Extract stats from the response
      let totalTransactions24h = 0;
      let newUsers24h = 0;
      let successRate = 0;

      if (statsRes?.stats) {
        const stats = statsRes.stats;
       

        if (stats.transactions) {
          totalTransactions24h = stats.transactions.completed || 0;
          const total = stats.transactions.total || 0;
          const completed = stats.transactions.completed || 0;
          successRate = total > 0 ? ((completed / total) * 100).toFixed(1) : 0;
        }

        if (stats.users) {
          newUsers24h = stats.users.newToday || 0;
        }
      }

      const supportTickets = ticketsRes?.total || 0;

      setSystemHealth({
        apiStatus: healthRes?.status === "online" ? "Online" : "Checking",
        databaseStatus: "Online",
        paymentGateway: "Online",
        totalTransactions24h,
        newUsers24h,
        supportTickets,
        successRate,
        avgResponse: "1.2s",
        uptime: 99.9,
      });
    } catch (error) {
      console.error("Error fetching system health:", error);
    } finally {
      setSystemHealthLoading(false); // End loading
    }
  };

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

  // Add these functions
  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleApproveKYC = async (kycId) => {
    try {
      await kycService.reviewKYC(kycId, {
        status: "verified",
        comment: "Approved from dashboard",
      });
      // Refresh the data
      fetchDashboardData();
      addToast("KYC approved successfully", "success");
    } catch (error) {
      console.error("Error approving KYC:", error);
      addToast("Failed to approve KYC", "error");
    }
  };

  const handleRejectKYC = (kycId) => {
    setRejectKycId(kycId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const confirmRejectKYC = async () => {
    if (!rejectReason.trim()) {
      addToast("Please enter a rejection reason", "warning");
      return;
    }

    try {
      await kycService.reviewKYC(rejectKycId, {
        status: "rejected",
        rejectionReason: rejectReason,
      });
      fetchDashboardData();
      setShowRejectModal(false);
      setRejectKycId(null);
      setRejectReason("");
      addToast("KYC rejected successfully", "success");
    } catch (error) {
      console.error("Error rejecting KYC:", error);
      addToast("Failed to reject KYC", "error");
    }
  };

  // In fetchDashboardData function
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Single API call to get all dashboard data
      const response = await adminApi.getDashboardData();

      // Update stats
      setStats({
        totalUsers: response.stats?.totalUsers || 0,
        activeUsers: response.stats?.activeUsers || 0,
        pendingVerifications: response.stats?.pendingVerifications || 0,
        totalTransactions: response.stats?.totalTransactions || 0,
        totalVolume: response.stats?.totalVolume || 0,
        monthlyRevenue: response.stats?.monthlyRevenue || 0,
        pendingTransactions: response.stats?.pendingTransactions || 0,
        blockedAccounts: response.stats?.blockedAccounts || 0,
        activeChats: response.stats?.activeChats || 0,
        pendingCards: response.stats?.pendingCards || 0,
        pendingGrants: response.stats?.pendingGrants || 0,
        pendingTaxRefunds: response.stats?.pendingTaxRefunds || 0,
        pendingLoans: response.stats?.pendingLoans || 0,
      });

      // Set recent users
      if (response.recentUsers) {
        setRecentUsers(response.recentUsers);
      }

      // Set recent transactions
      if (response.recentTransactions) {
        setRecentTransactions(response.recentTransactions);
      }

      // Set pending verifications
      if (response.pendingVerifications) {
        setPendingVerifications(response.pendingVerifications);
      }

      // Set system health from analytics (already included in response)

      if (response.systemMetrics) {
        setSystemHealth({
          apiStatus: "Online",
          databaseStatus: "Online",
          paymentGateway: "Online",
          totalTransactions24h: response.analytics.transactions?.today || 0,
          newUsers24h: response.analytics.users?.newToday || 0,
          supportTickets: response.supportTickets || 0,
          successRate: response.systemMetrics.successRate || 99.9,
          avgResponse: response.systemMetrics.avgResponse || "1.2s",
          uptime: response.systemMetrics.uptime || 90.9,
        });
      }

      // await fetchSystemHealth();
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      addToast("Failed to load dashboard data", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();

    // Refresh data every 5 minutes
    const interval = setInterval(fetchDashboardData, 300000);
    return () => clearInterval(interval);
  }, []);

  // Calculate percentage changes (mock data for now)
  const calculateChange = (current, previous) => {
    if (!previous) return 0;
    return Math.round(((current - previous) / previous) * 100);
  };

  const Toast = ({ toasts, removeToast }) => (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all duration-300 max-w-sm
          ${toast.type === "success" ? "bg-green-600" : ""}
          ${toast.type === "error" ? "bg-red-600" : ""}
          ${toast.type === "info" ? "bg-blue-600" : ""}
          ${toast.type === "warning" ? "bg-orange-500" : ""}
        `}
        >
          {toast.type === "success" && (
            <CheckCircle size={16} className="flex-shrink-0" />
          )}
          {toast.type === "error" && (
            <XCircle size={16} className="flex-shrink-0" />
          )}
          {toast.type === "info" && (
            <AlertCircle size={16} className="flex-shrink-0" />
          )}
          {toast.type === "warning" && (
            <AlertCircle size={16} className="flex-shrink-0" />
          )}
          <span className="flex-1">{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 hover:opacity-70"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  const SystemHealthSkeleton = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-2 animate-pulse"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center justify-between">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-12 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden pb-20 lg:pb-0">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left: Logo & Menu Toggle */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 z-50"
                  aria-label="Toggle menu"
                >
                  <Menu size={24} className="text-gray-700 dark:text-white" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">B</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Byvault Finance
                    </span>
                    <span className="ml-2 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  </div>
                </div>
              </div>

              {/* Center: Search (Desktop) */}
              <div className="hidden md:block flex-1 max-w-lg mx-8 relative">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() =>
                      searchQuery.length >= 2 && setShowSearchResults(true)
                    }
                    placeholder="Search users, transactions..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                  {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <RefreshCw
                        size={14}
                        className="animate-spin text-gray-400"
                      />
                    </div>
                  )}
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchQuery.length >= 2 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-y-auto">
                    {searchResults.length > 0 ? (
                      <div className="p-2">
                        {searchResults.map((result) => (
                          <Link
                            key={result.id}
                            to={result.url}
                            onClick={() => setShowSearchResults(false)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            {result.type === "user" && (
                              <User size={16} className="text-blue-500" />
                            )}
                            {result.type === "transaction" && (
                              <ArrowLeftRight
                                size={16}
                                className="text-green-500"
                              />
                            )}
                            {result.type === "kyc" && (
                              <FileText size={16} className="text-yellow-500" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.title}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {result.subtitle}
                              </p>
                            </div>
                            <ChevronRight size={14} className="text-gray-400" />
                          </Link>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        {searching ? "Searching..." : "No results found"}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? (
                    <Sun
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  ) : (
                    <Moon
                      size={20}
                      className="text-gray-600 dark:text-gray-300"
                    />
                  )}
                </button>
                <button
                  onClick={fetchDashboardData}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Refresh data"
                >
                  <RefreshCw
                    size={20}
                    className={
                      loading
                        ? "animate-spin text-blue-500"
                        : "text-gray-600 dark:text-gray-300"
                    }
                  />
                </button>
                <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar - Keep your existing sidebar code */}
          <aside
            className={`fixed lg:sticky top-0 left-0 z-50 h-[calc(100vh-4rem)] w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out flex flex-col ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }`}
          >
            {/* Fixed Top: Overview + X button + Dashboard + Analytics */}
            <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Overview
                </p>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                >
                  <X size={22} className="text-gray-600 dark:text-white" />
                </button>
              </div>
              <Link
                to="/admin/dashboard"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 bg-blue-500 text-white rounded-lg mb-1"
              >
                <LayoutDashboard size={18} />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <Link
                to="/admin/analytics"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <Activity size={18} />
                <span className="text-sm">Analytics</span>
              </Link>
            </div>

            {/* Scrollable Bottom: all other sections */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
              {/* Management Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Management
                </p>
                <Link
                  to="/admin/users"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-3">
                    <Users size={18} />
                    <span className="text-sm">Users</span>
                  </div>
                  {stats.totalUsers > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.totalUsers}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/transactions"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-3">
                    <ArrowLeftRight size={18} />
                    <span className="text-sm">Transactions</span>
                  </div>
                  {stats.pendingTransactions > 0 && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingTransactions}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/cards"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-3">
                    <CreditCard size={18} />
                    <span className="text-sm">Cards</span>
                  </div>
                  {stats.pendingCards > 0 && (
                    <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingCards}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/grants"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span className="text-sm">Grants</span>
                  </div>
                  {stats.pendingGrants > 0 && (
                    <span className="bg-purple-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingGrants}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/tax-refund"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} />
                    <span className="text-sm">Tax Refund</span>
                  </div>
                  {stats.pendingTaxRefunds > 0 && (
                    <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingTaxRefunds}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/loans"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign size={18} />
                    <span className="text-sm">Loans</span>
                  </div>
                  {stats.pendingLoans > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingLoans}
                    </span>
                  )}
                </Link>
              </div>

              {/* Verification Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Verification
                </p>
                <Link
                  to="/admin/kyc"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <UserCheck size={18} />
                  <span className="text-sm">KYC Verification</span>
                  {stats.pendingVerifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.pendingVerifications}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/documents"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <FileText size={18} />
                  <span className="text-sm">Documents</span>
                </Link>
              </div>

              {/* Communication Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  Communication
                </p>
                <Link
                  to="/admin/chat"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <MessageSquare size={18} />
                  <span className="text-sm">Live Chat</span>
                  {stats.activeChats > 0 && (
                    <span className="ml-auto bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.activeChats}
                    </span>
                  )}
                </Link>
                <Link
                  to="/admin/support"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <div className="flex items-center gap-3">
                    <LifeBuoy size={18} />
                    <span className="text-sm">Support Tickets</span>
                  </div>
                  {systemHealth.supportTickets > 0 && (
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {systemHealth.supportTickets}
                    </span>
                  )}
                </Link>

                <Link
                  to="/admin/messages"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <MessageSquare size={18} />
                  <span className="text-sm">Messages</span>
                </Link>
              </div>

              {/* System Section */}
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
                  System
                </p>
                <Link
                  to="/admin/settings"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                >
                  <Settings size={18} />
                  <span className="text-sm">Settings</span>
                </Link>
                <Link
                  to="/admin/security"
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Shield size={18} />
                    <span className="text-sm">Security</span>
                  </div>
                  {stats.blockedAccounts > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stats.blockedAccounts}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </aside>

          {/* Overlay for mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-4 lg:p-8 max-w-full overflow-x-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCw size={40} className="animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                {/* Page Header */}
                <div className="mb-6">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    Admin Portal
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Overview of your banking platform
                  </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6">
                  {/* Total Users */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Users
                          className="text-blue-600 dark:text-blue-400"
                          size={20}
                        />
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-1">
                        <TrendingUp size={14} />+
                        {calculateChange(stats.totalUsers, 11000)}%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stats.totalUsers.toLocaleString()}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Users
                    </p>
                  </div>

                  {/* Active Users */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <UserCheck
                          className="text-green-600 dark:text-green-400"
                          size={20}
                        />
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-1">
                        <TrendingUp size={14} />+
                        {calculateChange(stats.activeUsers, 7500)}%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stats.activeUsers.toLocaleString()}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Active Users
                    </p>
                  </div>

                  {/* Total Volume */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <DollarSign
                          className="text-purple-600 dark:text-purple-400"
                          size={20}
                        />
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-1">
                        <TrendingUp size={14} />+
                        {calculateChange(stats.totalVolume, 2000000)}%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ${(stats.totalVolume / 1000).toFixed(1)}k
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Total Volume
                    </p>
                  </div>

                  {/* Monthly Revenue */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
                        <TrendingUp
                          className="text-orange-600 dark:text-orange-400"
                          size={20}
                        />
                      </div>
                      <span className="text-green-600 dark:text-green-400 text-xs font-semibold flex items-center gap-1">
                        <TrendingUp size={14} />+
                        {calculateChange(stats.monthlyRevenue, 150000)}%
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ${(stats.monthlyRevenue / 1000).toFixed(1)}k
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Monthly Revenue
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
                  <Link
                    to="/admin/kyc"
                    className="bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <Clock
                        className="text-yellow-600 dark:text-yellow-400"
                        size={20}
                      />
                      <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {stats.pendingVerifications}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Pending Verifications
                    </p>
                  </Link>

                  <Link
                    to="/admin/transactions"
                    className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <ArrowLeftRight
                        className="text-blue-600 dark:text-blue-400"
                        size={20}
                      />
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {stats.pendingTransactions}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Pending Transactions
                    </p>
                  </Link>

                  <Link
                    to="/admin/users"
                    className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <UserX
                        className="text-red-600 dark:text-red-400"
                        size={20}
                      />
                      <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                        {stats.blockedAccounts}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Blocked Accounts
                    </p>
                  </Link>

                  <Link
                    to="/admin/chat"
                    className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg p-4 hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <MessageSquare
                        className="text-green-600 dark:text-green-400"
                        size={20}
                      />
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {stats.activeChats}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Active Chats
                    </p>
                  </Link>
                </div>

                {/* Recent Users & Transactions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  {/* Recent Users */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">
                          Recent Users
                        </h2>
                        <Link
                          to="/admin/users"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View All
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentUsers.length > 0 ? (
                        recentUsers.map((user) => (
                          <div
                            key={user.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User
                                    className="text-blue-600 dark:text-blue-400"
                                    size={18}
                                  />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                    {user.name}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span
                                className={`px-2 py-1 rounded ${
                                  user.status === "Active"
                                    ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                    : user.status === "Pending"
                                      ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                                      : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                                }`}
                              >
                                {user.status}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400">
                                ${user.balance.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No recent users found
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Recent Transactions */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white">
                          Recent Transactions
                        </h2>
                        <Link
                          to="/admin/transactions"
                          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                        >
                          View All
                          <ChevronRight size={14} />
                        </Link>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {recentTransactions.length > 0 ? (
                        recentTransactions.map((txn) => (
                          <div
                            key={txn.id}
                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                  {txn.user}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {txn.id.substring(0, 8)}... • {txn.type}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-bold text-gray-900 dark:text-white">
                                  ${txn.amount.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {new Date(txn.date).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                txn.status === "Completed"
                                  ? "bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400"
                                  : txn.status === "Pending"
                                    ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-400"
                                    : "bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400"
                              }`}
                            >
                              {txn.status}
                            </span>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center text-gray-500">
                          No recent transactions found
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Pending Verifications */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 mb-6">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        Pending KYC Verifications
                      </h2>
                      <div className="flex items-center gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <Filter size={16} className="text-gray-500" />
                        </button>
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                          <Download size={16} className="text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            User
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Verification Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 dark:text-gray-300">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {pendingVerifications.length > 0 ? (
                          pendingVerifications.map((item) => (
                            <tr
                              key={item.id}
                              className="hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                                    <User
                                      className="text-blue-600 dark:text-blue-400"
                                      size={14}
                                    />
                                  </div>
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {item.name}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.type}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                  {item.date}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => handleApproveKYC(item.id)}
                                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-all"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectKYC(item.id)}
                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-all"
                                  >
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="4"
                              className="px-4 py-8 text-center text-gray-500"
                            >
                              No pending verifications
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reject KYC Modal */}
                {showRejectModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
                      <div className="flex items-center gap-3 text-red-600 mb-4">
                        <XCircle size={24} />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Reject KYC Verification
                        </h3>
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        Please provide a reason for rejecting this KYC
                        application:
                      </p>

                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason (e.g., unclear document, mismatched information, etc.)"
                        rows={4}
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                        autoFocus
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={confirmRejectKYC}
                          disabled={!rejectReason.trim()}
                          className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject KYC
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectModal(false);
                            setRejectKycId(null);
                            setRejectReason("");
                          }}
                          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Health */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                        <CheckCircle
                          className="text-green-600 dark:text-green-400"
                          size={20}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          System Status
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          All systems operational
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          API Status
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          ● {systemHealth.apiStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Database
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          ● {systemHealth.databaseStatus}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Payment Gateway
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          ● {systemHealth.paymentGateway}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                        <Activity
                          className="text-blue-600 dark:text-blue-400"
                          size={20}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Activity
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Last 24 hours
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Total Transactions
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {systemHealth.totalTransactions24h.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          New Users
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {systemHealth.newUsers24h}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Support Tickets
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {systemHealth.supportTickets}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                        <Globe
                          className="text-purple-600 dark:text-purple-400"
                          size={20}
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          Quick Stats
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Overview
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Success Rate
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          {systemHealth.successRate}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Avg Response
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {systemHealth.avgResponse}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600 dark:text-gray-400">
                          Uptime
                        </span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {systemHealth.uptime}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>

        {/* Fixed Bottom Navigation (Mobile) */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
          <div className="grid grid-cols-5 h-16">
            <Link
              to="/admin/dashboard"
              className="flex flex-col items-center justify-center gap-1"
            >
              <div className="w-14 h-14 -mt-8 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <LayoutDashboard size={24} className="text-white" />
              </div>
              <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                Dashboard
              </span>
            </Link>
            <Link
              to="/admin/users"
              className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Users size={20} />
              <span className="text-[10px] font-medium">Users</span>
            </Link>
            <Link
              to="/admin/transactions"
              className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <ArrowLeftRight size={20} />
              <span className="text-[10px] font-medium">Transactions</span>
            </Link>
            <Link
              to="/admin/chat"
              className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <MessageSquare size={20} />
              <span className="text-[10px] font-medium">Live Chat</span>
            </Link>
            <Link
              to="/admin/settings"
              className="flex flex-col items-center justify-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            >
              <Settings size={20} />
              <span className="text-[10px] font-medium">Settings</span>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDashboard;
