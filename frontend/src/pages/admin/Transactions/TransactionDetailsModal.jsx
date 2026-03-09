// src/components/admin/TransactionDetailsModal.jsx
import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Copy,
  ArrowLeft,
  Edit,
} from "lucide-react";

const TransactionDetailsModal = ({ transaction, onClose, onEdit }) => {
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

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm dark:text-white">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between dark:text-white">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} className="dark:text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Status Header */}
          <div
            className={`flex items-center gap-4 p-4 rounded-xl ${getStatusBg(transaction.status)}`}
          >
            <div className={getStatusColor(transaction.status)}>
              {getStatusIcon(transaction.status)}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900 dark:text-white">
                {transaction.status?.charAt(0).toUpperCase() +
                  transaction.status?.slice(1)}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {formatDate(transaction.createdAt)}
              </p>
            </div>
            <button
              onClick={() => {
                const text = `Transaction ID: ${transaction._id}\nAmount: $${Math.abs(transaction.amount)}\nStatus: ${transaction.status}\nDate: ${formatDate(transaction.createdAt)}`;
                handleCopy(text);
              }}
              className="p-2 hover:bg-white/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              title="Copy details"
            >
              {copied ? (
                <CheckCircle size={18} className="text-green-500" />
              ) : (
                <Copy size={18} className="text-gray-500 dark:text-white" />
              )}
            </button>
          </div>

          {/* Transaction Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailCard
              label="Transaction ID"
              value={transaction._id}
              copyable
            />
            <DetailCard label="Type" value={transaction.type} capitalize />
            <DetailCard
              label="Amount"
              value={`$${Math.abs(transaction.amount).toLocaleString(
                undefined,
                {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                },
              )}`}
              highlight={
                transaction.amount > 0 ? "text-green-600" : "text-red-600"
              }
            />
            <DetailCard
              label="Reference"
              value={transaction.reference || "N/A"}
            />
            <DetailCard
              label="Currency"
              value={transaction.currency || "USD"}
            />
            <DetailCard
              label="Method"
              value={transaction.method || "N/A"}
              capitalize
            />
          </div>

          {/* Description */}
          {transaction.description && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-white mb-2">
                Description
              </p>
              <p className="text-sm text-gray-600 dark:text-white bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                {transaction.description}
              </p>
            </div>
          )}

          {/* Balance Information */}
          {(transaction.balanceBefore !== undefined ||
            transaction.balanceAfter !== undefined) && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-white mb-3">
                Balance Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                {transaction.balanceBefore !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Before
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${transaction.balanceBefore.toLocaleString()}
                    </p>
                  </div>
                )}
                {transaction.balanceAfter !== undefined && (
                  <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                      After
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      ${transaction.balanceAfter.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata */}
          {transaction.metadata &&
            Object.keys(transaction.metadata).length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <p className="text-sm font-medium text-gray-700 dark:text-white mb-3">
                  Additional Information
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(transaction.metadata).map(([key, value]) => (
                    <div
                      key={key}
                      className="bg-gray-50 dark:bg-gray-700/30 p-2 rounded"
                    >
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white truncate">
                        {String(value)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>

        {/* Footer - Updated with Edit button */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(transaction)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Edit size={16} />
              Edit Transaction
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 text-sm font-medium transition-colors"
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
        <p
          className={`text-sm font-medium truncate ${highlight || "text-gray-900 dark:text-white"} ${capitalize ? "capitalize" : ""}`}
        >
          {value}
        </p>
        {copyable && value !== "N/A" && (
          <button
            onClick={handleCopy}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex-shrink-0 transition-colors"
            title="Copy"
          >
            {copied ? (
              <CheckCircle size={14} className="text-green-500" />
            ) : (
              <Copy size={14} className="text-gray-500 dark:text-white" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default TransactionDetailsModal;
