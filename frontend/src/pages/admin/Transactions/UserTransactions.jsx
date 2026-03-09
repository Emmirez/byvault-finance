// src/pages/admin/UserTransactions.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  User,
  Mail,
  Calendar,
  Sun,
  Moon,
  X,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  Download
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import TransactionsTable from "./TransactionsTable";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";

// Transaction Details Modal Component
const TransactionDetailsModal = ({ transaction, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!transaction) return null;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const map = {
      completed: "text-green-600 dark:text-green-400",
      pending: "text-yellow-600 dark:text-yellow-400",
      failed: "text-red-600 dark:text-red-400",
      cancelled: "text-gray-600 dark:text-gray-400",
    };
    return map[status?.toLowerCase()] || "text-gray-600";
  };

  const getStatusIcon = (status) => {
    const map = {
      completed: CheckCircle,
      pending: Clock,
      failed: XCircle,
      cancelled: XCircle,
    };
    const Icon = map[status?.toLowerCase()] || AlertCircle;
    return <Icon size={20} />;
  };

  const getStatusBg = (status) => {
    const map = {
      completed: "bg-green-50 dark:bg-green-900/20",
      pending: "bg-yellow-50 dark:bg-yellow-900/20",
      failed: "bg-red-50 dark:bg-red-900/20",
      cancelled: "bg-gray-50 dark:bg-gray-700/30",
    };
    return map[status?.toLowerCase()] || "bg-gray-50 dark:bg-gray-700/30";
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Details
          </h3>
          <button 
            onClick={onClose} 
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Status Header */}
          <div className={`flex items-center gap-4 p-4 rounded-xl ${getStatusBg(transaction.status)}`}>
            <div className={getStatusColor(transaction.status)}>
              {getStatusIcon(transaction.status)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {transaction.status?.charAt(0).toUpperCase() + transaction.status?.slice(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => {
                const text = `Transaction ID: ${transaction._id}\nAmount: $${Math.abs(transaction.amount)}\nStatus: ${transaction.status}\nDate: ${new Date(transaction.createdAt).toLocaleString()}`;
                handleCopy(text);
              }}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              title="Copy details"
            >
              {copied ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-500" />
              )}
            </button>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailCard label="Transaction ID" value={transaction._id} copyable />
            <DetailCard label="Type" value={transaction.type} capitalize />
            <DetailCard 
              label="Amount" 
              value={`$${Math.abs(transaction.amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}`}
              highlight={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}
            />
            <DetailCard label="Reference" value={transaction.reference || 'N/A'} />
            <DetailCard label="Currency" value={transaction.currency || 'USD'} />
            <DetailCard label="Method" value={transaction.method || 'N/A'} capitalize />
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
              {transaction.description || 'No description provided'}
            </p>
          </div>

          {/* Balance Information */}
          {(transaction.balanceBefore !== undefined || transaction.balanceAfter !== undefined) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Balance Information</p>
              <div className="grid grid-cols-2 gap-4">
                {transaction.balanceBefore !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Before</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${transaction.balanceBefore.toLocaleString()}
                    </p>
                  </div>
                )}
                {transaction.balanceAfter !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">After</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${transaction.balanceAfter.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          {transaction.metadata && Object.keys(transaction.metadata).length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Additional Information</p>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(transaction.metadata).map(([key, value]) => (
                  <div key={key} className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">{key}</p>
                    <p className="text-sm text-gray-900 dark:text-white truncate">{String(value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper component for detail cards
const DetailCard = ({ label, value, copyable, capitalize, highlight }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-medium truncate ${highlight || 'text-gray-900 dark:text-white'} ${capitalize ? 'capitalize' : ''}`}>
          {value}
        </p>
        {copyable && value !== 'N/A' && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex-shrink-0 transition-colors"
            title="Copy"
          >
            {copied ? (
              <CheckCircle size={14} className="text-green-500" />
            ) : (
              <Copy size={14} className="text-gray-500" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const UserTransactions = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      // You'll need to add this endpoint to your adminApi
      // For now, we'll use the existing getUserDetails which returns last 10
      const response = await adminApi.getUserDetails(id);
      if (response.transactions) {
        setTransactions(response.transactions);
      } else if (response.user?.transactions) {
        setTransactions(response.user.transactions);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserDetails = async () => {
    try {
      const response = await adminApi.getUserDetails(id);
      if (response.user) {
        setUser(response.user);
      } else if (response.data) {
        setUser(response.data);
      } else {
        setUser(response);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    fetchAllTransactions();
    fetchUserDetails();
  }, [id]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
              >
                <ArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                  {user ? `${user.name || user.firstName}'s Transactions` : 'All Transactions'}
                </h1>
                {user && (
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <Mail size={12} />
                    <span className="truncate">{user.email}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  aria-label="Toggle dark mode"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Transaction History
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {transactions.length} transactions found
              </p>
            </div>
            <button
              onClick={() => {
                // Export functionality
                const csv = transactions.map(t => 
                  `${t._id},${t.type},${t.amount},${t.status},${new Date(t.createdAt).toLocaleString()}`
                ).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `transactions-${user?.email || 'user'}.csv`;
                a.click();
              }}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
            >
              <Download size={16} />
              Export CSV
            </button>
          </div>

          <TransactionsTable
            transactions={transactions}
            loading={loading}
            onRefresh={fetchAllTransactions}
            onViewDetails={(tx) => {
              setSelectedTransaction(tx);
              setShowTransactionModal(true);
            }}
          />
        </div>

        <AdminBottomNav />
      </div>

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.15s ease-out; }
      `}</style>
    </div>
  );
};

export default UserTransactions;