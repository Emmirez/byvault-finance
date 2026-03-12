/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Filter,
  Download,
  Receipt,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  Eye,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { dashboardService } from "../../../services/dashhboardService";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useDarkMode } from "../../../hooks/useDarkMode";

const Transactions = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterDate, setFilterDate] = useState("all");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const exportRef = useRef(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getRecentTransactions(100);
      setTransactions(response || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
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

  const handleExport = async () => {
    const element = exportRef.current;
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297;
    while (heightLeft > 0) {
      position -= 297;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }
    pdf.save(`Byvault_Statement_${Date.now()}.pdf`);
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      transaction.amount?.toString().includes(searchQuery) ||
      transaction._id?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesType = true;
    if (filterType !== "all") {
      if (filterType === "sent") {
        matchesType =
          transaction.type === "withdraw" || transaction.type === "transfer";
      } else if (filterType === "received") {
        matchesType = transaction.type === "deposit";
      } else if (filterType === "pending") {
        matchesType = transaction.status === "pending";
      }
    }

    let matchesDate = true;
    if (filterDate !== "all") {
      const now = new Date();
      const txDate = new Date(transaction.createdAt);
      if (filterDate === "today") {
        matchesDate = txDate.toDateString() === now.toDateString();
      } else if (filterDate === "week") {
        const weekAgo = new Date(now.setDate(now.getDate() - 7));
        matchesDate = txDate >= weekAgo;
      } else if (filterDate === "month") {
        const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
        matchesDate = txDate >= monthAgo;
      }
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const formatAmount = (amount) => {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
    return `$${amount.toLocaleString()}`;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case "pending":
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case "failed":
        return <XCircle className="w-3 h-3 text-red-500" />;
      default:
        return <CheckCircle className="w-3 h-3 text-green-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden">
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Transactions"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="transactions"
          onLogout={handleLogout}
        />

        <main className="flex-1 min-w-0 overflow-x-hidden lg:ml-64">
          <div className="max-w-4xl mx-auto p-4 lg:p-8">

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Total</p>
                <p className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                  {transactions.length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Deposits</p>
                <p className="text-base sm:text-lg font-bold text-green-600 truncate">
                  {formatAmount(
                    transactions
                      .filter((t) => t.type === "deposit")
                      .reduce((s, t) => s + t.amount, 0),
                  )}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700 min-w-0">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Withdrawals</p>
                <p className="text-base sm:text-lg font-bold text-red-600 truncate">
                  {formatAmount(
                    transactions
                      .filter((t) => t.type !== "deposit")
                      .reduce((s, t) => s + t.amount, 0),
                  )}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-3 border-2 rounded-xl font-medium transition-colors ${
                  showFilters
                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-500 text-blue-600 dark:text-blue-400"
                    : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Filter size={18} />
                <span className="text-sm">Filter</span>
              </button>
              <button
                onClick={handleExport}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors text-sm font-medium"
              >
                <Download size={18} />
                <span>Export PDF</span>
              </button>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mb-6 space-y-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-lg focus:border-blue-500 focus:outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Type
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["all", "sent", "received", "pending"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                          filterType === type
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">
                    Period
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["all", "today", "week", "month"].map((date) => (
                      <button
                        key={date}
                        onClick={() => setFilterDate(date)}
                        className={`py-2 px-2 rounded-lg text-xs font-medium transition-colors ${
                          filterDate === date
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        {date.charAt(0).toUpperCase() + date.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Transaction List */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Receipt className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No transactions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {searchQuery || filterType !== "all" || filterDate !== "all"
                    ? "Try adjusting your search or filter parameters"
                    : "Your transaction history will appear here"}
                </p>
              </div>
            ) : (
              <div
                ref={exportRef}
                className="relative bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-xl overflow-hidden"
              >
                {/* Watermark */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  style={{ opacity: 0.05 }}
                >
                  <h1 className="text-4xl sm:text-6xl font-black uppercase tracking-widest text-gray-900 dark:text-white rotate-[-30deg]">
                    Byvault Finance
                  </h1>
                </div>

                {/* Statement Header */}
                <div className="relative z-10 mb-6 border-b border-gray-200 dark:border-gray-700 pb-5">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div>
                      <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Byvault Finance
                      </h1>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Transaction Statement
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Generated on {new Date().toLocaleDateString()}
                      </p>
                    </div>
                    <div className="sm:text-right text-sm">
                      <p className="font-semibold text-gray-900 dark:text-white">{userName}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs break-all">{userEmail}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs capitalize">
                        {user?.accountType || "Savings"} Account
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transaction Rows */}
                <div className="relative z-10 space-y-2 pb-6">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction._id}
                      className="border border-gray-100 dark:border-gray-700 rounded-lg px-3 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      {/* Type Icon */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                          transaction.type === "deposit"
                            ? "bg-green-100 dark:bg-green-900/40"
                            : "bg-red-100 dark:bg-red-900/40"
                        }`}
                      >
                        {transaction.type === "deposit" ? (
                          <ArrowDownLeft className="w-4 h-4 text-green-600 dark:text-green-400" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 text-red-500 dark:text-red-400" />
                        )}
                      </div>

                      {/* Description + date */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                          {transaction.description ||
                            (transaction.type === "deposit"
                              ? "Deposit"
                              : transaction.type === "withdraw"
                                ? "Withdrawal"
                                : "Transfer")}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {new Date(transaction.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>

                      {/* Amount + status */}
                      <div className="text-right flex-shrink-0 w-24">
                        <p
                          className={`text-sm font-bold ${
                            transaction.type === "deposit"
                              ? "text-green-600 dark:text-green-400"
                              : "text-red-600 dark:text-red-400"
                          }`}
                        >
                          {transaction.type === "deposit" ? "+" : "-"}$
                          {Math.abs(transaction.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                        <div className="flex items-center justify-end gap-1 mt-0.5">
                          {getStatusIcon(transaction.status)}
                          <p className="text-xs capitalize text-gray-400 dark:text-gray-500">
                            {transaction.status || "completed"}
                          </p>
                        </div>
                      </div>

                      {/* ── Eye button ── */}
                      <button
                        onClick={() =>
                          navigate(`/transaction/${transaction._id}`)
                        }
                        title="View details"
                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors group"
                      >
                        <Eye
                          size={16}
                          className="text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default Transactions;