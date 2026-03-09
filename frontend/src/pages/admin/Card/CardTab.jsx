/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// src/components/admin/CardsTab.jsx
import React, { useState, useEffect } from "react";
import {
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Eye,
  RefreshCw,
  Shield,
  Calendar,
  Download,
  Copy,
  X,
  AlertCircle,
  Fingerprint,
  Hash,
  User,
  Lock,
} from "lucide-react";
import { cardService } from "../../../services/cardService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const CardsTab = ({ userId }) => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [copiedField, setCopiedField] = useState(null);
  const [darkMode, toggleDarkMode] = useDarkMode();

  const fetchUserCards = async () => {
    try {
      setLoading(true);
      const response = await cardService.getAllCards();
      const allCards = response.cards || response || [];
      const userCards = allCards.filter(
        (card) => card.user?._id === userId || card.user === userId,
      );
      setCards(userCards);
    } catch (error) {
      console.error("Error fetching user cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCards();
  }, [userId]);

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const getStatusBadge = (status) => {
    const map = {
      active: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
        label: "Active",
      },
      pending: {
        bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
        icon: Clock,
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
      blocked: {
        bg: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
        icon: Ban,
        label: "Blocked",
      },
      expired: {
        bg: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
        icon: Clock,
        label: "Expired",
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

  const getCardTypeIcon = (type) => {
    const colors = {
      visa: "text-blue-600",
      mastercard: "text-orange-600",
      amex: "text-indigo-600",
      discover: "text-purple-600",
    };
    return (
      <span
        className={`text-xs font-bold uppercase ${colors[type] || "text-gray-600"}`}
      >
        {type}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-center items-center">
          <RefreshCw size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">
            Loading cards...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {cards.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8 text-center">
          <CreditCard
            size={48}
            className="mx-auto mb-3 text-gray-300 dark:text-gray-600"
          />
          <p className="text-gray-500 dark:text-gray-400">
            No cards found for this user
          </p>
        </div>
      ) : (
        cards.map((card) => (
          <div
            key={card._id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-mono font-medium text-gray-900 dark:text-white">
                    {card.maskedNumber}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {card.cardholderName}
                  </p>
                </div>
              </div>
              {getStatusBadge(card.status)}
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Type
                </p>
                <div className="flex items-center gap-2">
                  {getCardTypeIcon(card.cardType)}
                  <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
                    {card.cardBrand}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  Expiry
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {card.expiryMonth}/{card.expiryYear}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                  CVV
                </p>
                <p className="text-sm text-gray-900 dark:text-white">
                  {card.status === "active" ? card.cvv : "***"}
                </p>
              </div>
            </div>

            {card.status === "active" && (
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Daily Limit
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${card.dailyLimit?.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Monthly Limit
                    </p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      ${card.monthlyLimit?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {card.status === "rejected" && card.metadata?.rejectionReason && (
              <div className="mt-3 p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-xs text-red-600 dark:text-red-400">
                  Rejection reason: {card.metadata.rejectionReason}
                </p>
              </div>
            )}

            <div className="mt-3 flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedCard(card);
                  setShowDetails(true);
                }}
                className="p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors group"
                title="View Card Details"
              >
                <Eye size={18} className="text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
              </button>
            </div>
          </div>
        ))
      )}

      {/* Enhanced Card Details Modal */}
      {showDetails && selectedCard && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Card Details
                </h3>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Virtual Card Design */}
              <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
                <div className="absolute top-4 right-4">
                  {selectedCard.cardBrand === "virtual" ? (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Virtual</span>
                  ) : (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Physical</span>
                  )}
                </div>
                <div className="mb-6">
                  <Shield size={32} className="opacity-80" />
                </div>
                <p className="text-xl font-mono tracking-wider mb-4">
                  {selectedCard.maskedNumber}
                </p>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-xs opacity-80 mb-1">Cardholder</p>
                    <p className="font-medium">{selectedCard.cardholderName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs opacity-80 mb-1">Expires</p>
                    <p className="font-medium">
                      {selectedCard.expiryMonth}/{selectedCard.expiryYear}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status and Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Card Status</p>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(selectedCard.status)}
                  </div>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Card Type</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                      {selectedCard.cardType} • {selectedCard.cardBrand}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Details Grid */}
              <div className="grid grid-cols-2 gap-4">
                <DetailCard
                  icon={Hash}
                  label="Card Number"
                  value={selectedCard.status === "active" ? selectedCard.cardNumber : selectedCard.maskedNumber}
                  onCopy={() => handleCopy(selectedCard.cardNumber, "number")}
                  copied={copiedField === "number"}
                  masked={selectedCard.status !== "active"}
                />
                <DetailCard
                  icon={Fingerprint}
                  label="CVV"
                  value={selectedCard.status === "active" ? selectedCard.cvv : "***"}
                  onCopy={() => handleCopy(selectedCard.cvv, "cvv")}
                  copied={copiedField === "cvv"}
                  masked={selectedCard.status !== "active"}
                />
              </div>

              {/* Limits Section */}
              {selectedCard.status === "active" && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Spending Limits</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Daily Limit</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${selectedCard.dailyLimit?.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Monthly Limit</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        ${selectedCard.monthlyLimit?.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline Section */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Card Timeline</h4>
                <div className="space-y-3">
                  <TimelineItem
                    icon={Calendar}
                    label="Applied On"
                    date={selectedCard.createdAt}
                  />
                  {selectedCard.activatedAt && (
                    <TimelineItem
                      icon={CheckCircle}
                      label="Activated On"
                      date={selectedCard.activatedAt}
                      color="text-green-600"
                    />
                  )}
                  {selectedCard.metadata?.reviewedAt && (
                    <TimelineItem
                      icon={Shield}
                      label="Reviewed On"
                      date={selectedCard.metadata.reviewedAt}
                    />
                  )}
                </div>
              </div>

              {/* Rejection Reason */}
              {selectedCard.status === "rejected" && selectedCard.metadata?.rejectionReason && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 dark:text-white">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                        Rejection Reason
                      </p>
                      <p className="text-sm text-red-700 dark:text-red-400">
                        {selectedCard.metadata.rejectionReason}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 dark:text-white">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors dark:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper component for detail cards with copy
const DetailCard = ({ icon: Icon, label, value, onCopy, copied, masked }) => (
  <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
    <div className="flex items-center gap-2 mb-2">
      <Icon size={16} className="text-gray-500" />
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    </div>
    <div className="flex items-center justify-between">
      <p className={`text-sm font-mono ${masked ? 'text-gray-500' : 'text-gray-900 dark:text-white'}`}>
        {value}
      </p>
      {!masked && (
        <button
          onClick={onCopy}
          className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
          title="Copy to clipboard"
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

// Timeline item component
const TimelineItem = ({ icon: Icon, label, date, color = "text-gray-500" }) => (
  <div className="flex items-start gap-3">
    <Icon size={16} className={`${color} flex-shrink-0 mt-0.5`} />
    <div>
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className="text-sm text-gray-900 dark:text-white">{formatDate(date)}</p>
    </div>
  </div>
);

// Helper function for date formatting
const formatDate = (date) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const InfoItem = ({ label, value, capitalize, uppercase }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p
      className={`text-sm text-gray-900 dark:text-white ${
        capitalize ? "capitalize" : uppercase ? "uppercase" : ""
      }`}
    >
      {value}
    </p>
  </div>
);

export default CardsTab;