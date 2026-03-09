/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Transactions.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Bell,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  AlertCircle,
  MoreVertical,
  FileText,
  X,
  Copy,
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import AdminHeader from "../Components/AdminHeader";

const Transactions = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusNote, setStatusNote] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(
      () => setToasts((prev) => prev.filter((t) => t.id !== id)),
      3500,
    );
  };

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    type: "all",
    search: "",
    startDate: "",
    endDate: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getTransactions({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        type: filters.type,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      setTransactions(response.transactions || []);
      setPagination(response.pagination || { page: 1, total: 0, pages: 1 });
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.getTransactionStats("30days");
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchStats();
  }, [filters.page, filters.status, filters.type]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchTransactions();
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedTransaction) return;

    try {
      setProcessing(true);
      await adminApi.updateTransactionStatus(
        selectedTransaction._id,
        status,
        statusNote,
      );
      // await fetchTransactions();
      setShowStatusModal(false);
      setStatusNote("");
      setSelectedTransaction(null);

      // ✅ Show toast
      if (status === "completed") {
        showToast("Transfer approved successfully!", "success");
      } else {
        showToast("Transfer rejected.", "error");
      }

      fetchTransactions();
    } catch (error) {
      console.error("Error updating transaction status:", error);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      completed: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
        label: "Completed",
      },
      pending: {
        bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
        icon: Clock,
        label: "Pending",
      },
      failed: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: XCircle,
        label: "Failed",
      },
    };
    const s = map[status] || map.pending;
    const Icon = s.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg}`}
      >
        <Icon size={12} />
        {s.label}
      </span>
    );
  };

  const getTypeIcon = (type) => {
    const map = {
      deposit: {
        icon: TrendingDown,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      withdraw: {
        icon: TrendingUp,
        color: "text-orange-600",
        bg: "bg-orange-100",
      },
      transfer: { icon: ArrowLeft, color: "text-blue-600", bg: "bg-blue-100" },
    };
    const t = map[type] || map.deposit;
    const Icon = t.icon;
    return <Icon size={14} className={t.color} />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount, type) => {
    const isNegative = type === "withdraw" || type === "transfer";
    return (
      <span className={isNegative ? "text-red-600" : "text-green-600"}>
        {isNegative ? "-" : "+"}${Math.abs(amount).toLocaleString()}
      </span>
    );
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/20`}
        >
          <Icon
            size={16}
            className={`text-${color}-600 dark:text-${color}-400`}
          />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {title}
        </span>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );

  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <AdminHeader
          title="Transactions"
          showBackButton={true}
          showDarkMode={true}
          showNotifications={true}
          showProfile={true}
          rightActions={
            [
              // {
              //   icon: <Filter size={20} />,
              //   label: "Filter",
              //   onClick: () => setShowFilters(!showFilters)
              // }
            ]
          }
        />

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Volume"
                value={`$${stats.totalAmount?.toLocaleString() || 0}`}
                icon={DollarSign}
                color="blue"
              />
              <StatCard
                title="Average"
                value={`$${stats.avgAmount?.toFixed(2) || 0}`}
                icon={TrendingUp}
                color="green"
              />
              <StatCard
                title="Min Amount"
                value={`$${stats.minAmount?.toLocaleString() || 0}`}
                icon={TrendingDown}
                color="orange"
              />
              <StatCard
                title="Max Amount"
                value={`$${stats.maxAmount?.toLocaleString() || 0}`}
                icon={TrendingUp}
                color="purple"
              />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search by ID or description..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.search}
                    onChange={(e) =>
                      setFilters({ ...filters, search: e.target.value })
                    }
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value, page: 1 })
                  }
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>

                {/* Type Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value, page: 1 })
                  }
                >
                  <option value="all">All Types</option>
                  <option value="deposit">Deposit</option>
                  <option value="withdraw">Withdrawal</option>
                  <option value="transfer">Transfer</option>
                </select>

                {/* Date Range */}
                <div className="flex gap-2">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.startDate}
                    onChange={(e) =>
                      setFilters({ ...filters, startDate: e.target.value })
                    }
                  />
                  <input
                    type="date"
                    className="flex-1 px-0 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.endDate}
                    onChange={(e) =>
                      setFilters({ ...filters, endDate: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      page: 1,
                      limit: 20,
                      status: "all",
                      type: "all",
                      search: "",
                      startDate: "",
                      endDate: "",
                    });
                    fetchTransactions();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
                >
                  Clear Filters
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Transactions Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(7)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <FileText
                          size={40}
                          className="mx-auto mb-3 opacity-50"
                        />
                        <p>No transactions found</p>
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr
                        key={tx._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                          {formatDate(tx.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                {tx.user?.firstName?.charAt(0) || "U"}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {tx.user?.firstName} {tx.user?.lastName}
                              </p>
                              <p className="text-xs text-gray-500">
                                {tx.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(tx.type)}
                            <span className="text-sm capitalize text-gray-900 dark:text-white">
                              {tx.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-right">
                          {formatAmount(tx.amount, tx.type)}
                        </td>
                        <td className="px-4 py-3">
                          {getStatusBadge(tx.status)}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                          {tx.description || "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setSelectedTransaction(tx);
                                setShowDetails(true);
                              }}
                              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                              title="View Details"
                            >
                              <Eye size={16} className="text-gray-500" />
                            </button>
                            {tx.status === "pending" && (
                              <button
                                onClick={() => {
                                  setSelectedTransaction(tx);
                                  setShowStatusModal(true);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Update Status"
                              >
                                <Clock size={16} className="text-yellow-500" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.pages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page - 1 })
                    }
                    disabled={filters.page === 1}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    {filters.page}
                  </span>
                  <button
                    onClick={() =>
                      setFilters({ ...filters, page: filters.page + 1 })
                    }
                    disabled={filters.page === pagination.pages}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminBottomNav />
      </div>

      {/* Transaction Details Modal */}
      {showDetails && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowDetails(false);
            setSelectedTransaction(null);
          }}
          onUpdateStatus={() => {
            setShowDetails(false);
            setShowStatusModal(true);
          }}
        />
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedTransaction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Update Transaction Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Transaction: ${selectedTransaction.amount} •{" "}
              {selectedTransaction.type}
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => handleStatusUpdate("completed")}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <CheckCircle size={16} />
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate("failed")}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium flex items-center justify-center gap-2"
                >
                  <XCircle size={16} />
                  Reject
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Note (optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add a note about this status change..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setStatusNote("");
                  setSelectedTransaction(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} />
    </div>
  );
};

// Transaction Details Modal Component
const TransactionDetailsModal = ({ transaction, onClose, onUpdateStatus }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const map = {
      completed: "text-green-600",
      pending: "text-yellow-600",
      failed: "text-red-600",
    };
    return map[status] || "text-gray-600";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={18} className="dark:text-white" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  transaction.type === "deposit"
                    ? "bg-green-100"
                    : transaction.type === "withdraw"
                      ? "bg-orange-100"
                      : "bg-blue-100"
                }`}
              >
                {transaction.type === "deposit" && (
                  <TrendingDown size={24} className="text-green-600" />
                )}
                {transaction.type === "withdraw" && (
                  <TrendingUp size={24} className="text-orange-600" />
                )}
                {transaction.type === "transfer" && (
                  <ArrowLeft size={24} className="text-blue-600" />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-mono text-gray-900 dark:text-white">
                    {transaction._id}
                  </p>
                  <button
                    onClick={() => handleCopy(transaction._id)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    <Copy size={14} className="text-gray-500" />
                  </button>
                </div>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : transaction.status === "pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
              }`}
            >
              {transaction.status}
            </span>
          </div>

          {/* Amount */}
          <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Amount</p>
            <p
              className={`text-3xl font-bold ${getStatusColor(transaction.status)}`}
            >
              {transaction.type === "withdraw" ||
              transaction.type === "transfer"
                ? "-"
                : "+"}
              ${Math.abs(transaction.amount).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {transaction.currency?.toUpperCase()}
            </p>
          </div>

          {/* User Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              User Information
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow
                label="Name"
                value={`${transaction.user?.firstName} ${transaction.user?.lastName}`}
              />
              <DetailRow label="Email" value={transaction.user?.email} />
              <DetailRow
                label="Account ID"
                value={transaction.user?.accountId}
              />
            </div>
          </div>

          {/* Transaction Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Transaction Details
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Type" value={transaction.type} capitalize />
              <DetailRow
                label="Date"
                value={new Date(transaction.createdAt).toLocaleString()}
              />
              <DetailRow
                label="Description"
                value={transaction.description || "-"}
              />
              {transaction.metadata?.recipientAccount && (
                <DetailRow
                  label="Recipient"
                  value={transaction.metadata.recipientAccount}
                />
              )}
            </div>
          </div>

          {/* Balance Info */}
          {(transaction.balanceBefore !== undefined ||
            transaction.balanceAfter !== undefined) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Balance Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {transaction.balanceBefore !== undefined && (
                  <DetailRow
                    label="Before"
                    value={`$${transaction.balanceBefore.toLocaleString()}`}
                  />
                )}
                {transaction.balanceAfter !== undefined && (
                  <DetailRow
                    label="After"
                    value={`$${transaction.balanceAfter.toLocaleString()}`}
                  />
                )}
              </div>
            </div>
          )}

          {/* Review Info */}
          {transaction.metadata?.reviewedBy && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Review Information
              </h4>
              <div className="space-y-2">
                <DetailRow
                  label="Reviewed By"
                  value={`${transaction.metadata.reviewedBy.firstName} ${transaction.metadata.reviewedBy.lastName}`}
                />
                <DetailRow
                  label="Reviewed At"
                  value={new Date(
                    transaction.metadata.reviewedAt,
                  ).toLocaleString()}
                />
                {transaction.metadata.reviewNote && (
                  <DetailRow
                    label="Note"
                    value={transaction.metadata.reviewNote}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          {transaction.status === "pending" && (
            <button
              onClick={onUpdateStatus}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Update Status
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-white"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, capitalize }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p
      className={`text-sm text-gray-900 dark:text-white ${capitalize ? "capitalize" : ""}`}
    >
      {value || "N/A"}
    </p>
  </div>
);

const Toast = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium
          transition-all duration-500 animate-slide-in pointer-events-auto
          ${t.type === "success" ? "bg-green-500" : "bg-red-500"}`}
        style={{ animation: "slideIn 0.3s ease" }}
      >
        {t.type === "success" ? (
          <CheckCircle size={18} className="shrink-0" />
        ) : (
          <XCircle size={18} className="shrink-0" />
        )}
        {t.message}
      </div>
    ))}
  </div>
);

export default Transactions;
