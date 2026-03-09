// src/pages/admin/CardManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  Mail,
  Calendar,
  Sun,
  Moon,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  User,
  Ban,
  Shield,
  MoreVertical,
  Download,
} from "lucide-react";
import { cardService } from "../../../services/cardService";

import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import SuperAdminProfile from "../Components/SuperAdmin";

const CardManagement = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [filter, setFilter] = useState("all"); // all, pending, active, rejected, blocked
  const [search, setSearch] = useState("");
  const [selectedCard, setSelectedCard] = useState(null);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchCards = async () => {
    try {
      setLoading(true);
      // You might need to add a method to get all cards for admin
      // For now, we'll use getPendingCards and you can add getAllCards later
      const response = await cardService.getPendingCards();
      setCards(response.cards || []);
    } catch (error) {
      console.error("Error fetching cards:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleApprove = async (cardId) => {
    try {
      setSubmitting(true);
      await cardService.approveCard(cardId);
      await fetchCards();
      setShowActionModal(false);
    } catch (error) {
      console.error("Error approving card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleReject = async (cardId) => {
    if (!rejectReason.trim()) return;
    try {
      setSubmitting(true);
      await cardService.rejectCard(cardId, rejectReason);
      await fetchCards();
      setShowActionModal(false);
      setRejectReason("");
    } catch (error) {
      console.error("Error rejecting card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleBlock = async (cardId) => {
    try {
      setSubmitting(true);
      await cardService.toggleBlockCard(cardId);
      await fetchCards();
    } catch (error) {
      console.error("Error toggling card block:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const openActionModal = (card, action) => {
    setSelectedCard(card);
    setActionType(action);
    setShowActionModal(true);
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

  const filteredCards = cards.filter((card) => {
    if (filter !== "all" && card.status !== filter) return false;
    if (search) {
      const user = card.user || {};
      const searchLower = search.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(searchLower) ||
        user.lastName?.toLowerCase().includes(searchLower) ||
        user.email?.toLowerCase().includes(searchLower) ||
        card.maskedNumber?.includes(search)
      );
    }
    return true;
  });

  const stats = {
    total: cards.length,
    pending: cards.filter((c) => c.status === "pending").length,
    active: cards.filter((c) => c.status === "active").length,
    blocked: cards.filter((c) => c.status === "blocked").length,
  };

  return (
    <div>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 dark:text-white ">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 dark:text-white">
          <div className="px-4 sm:px-6 lg:px-8 dark:text-white">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                Card Management
              </h1>
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white"
                 
                >
                  {darkMode ? (
                    <Sun size={20} style={{ color: darkMode ? 'white' : '#374151' }} />
                  ) : (
                    <Moon size={20} className="text-gray-700 dark:text-white" />
                  )}
                </button>
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Cards"
              value={stats.total}
              color="blue"
              icon={CreditCard}
            />
            <StatCard
              label="Pending"
              value={stats.pending}
              color="yellow"
              icon={Clock}
            />
            <StatCard
              label="Active"
              value={stats.active}
              color="green"
              icon={CheckCircle}
            />
            <StatCard
              label="Blocked"
              value={stats.blocked}
              color="gray"
              icon={Ban}
            />
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name, email or card number..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="all">All Cards</option>
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="blocked">Blocked</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={fetchCards}
                className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
              >
                <RefreshCw
                  size={16}
                  className={loading ? "animate-spin" : ""}
                />
              </button>
            </div>
          </div>

          {/* Cards Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Card
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Expiry
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
                        {[...Array(6)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredCards.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <CreditCard
                          size={40}
                          className="mx-auto mb-3 opacity-50"
                        />
                        <p>No cards found</p>
                      </td>
                    </tr>
                  ) : (
                    filteredCards.map((card) => {
                      const user = card.user || {};
                      return (
                        <tr
                          key={card._id}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                  {user.firstName?.charAt(0) || "U"}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-mono text-gray-900 dark:text-white">
                              {card.maskedNumber}
                            </p>
                            <p className="text-xs text-gray-500">
                              {card.cardholderName}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getCardTypeIcon(card.cardType)}
                              <span className="text-xs text-gray-500 capitalize">
                                {card.cardBrand}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(card.status)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-900 dark:text-white">
                              {card.expiryMonth}/{card.expiryYear}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() =>
                                  navigate(`/admin/users/${user._id}?tab=cards`)
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="View User"
                              >
                                <User size={16} className="text-gray-500" />
                              </button>
                              {card.status === "pending" && (
                                <>
                                  <button
                                    onClick={() =>
                                      openActionModal(card, "approve")
                                    }
                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                    title="Approve"
                                  >
                                    <CheckCircle
                                      size={16}
                                      className="text-green-600"
                                    />
                                  </button>
                                  <button
                                    onClick={() =>
                                      openActionModal(card, "reject")
                                    }
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                    title="Reject"
                                  >
                                    <XCircle
                                      size={16}
                                      className="text-red-600"
                                    />
                                  </button>
                                </>
                              )}
                              {card.status === "active" && (
                                <button
                                  onClick={() => handleToggleBlock(card._id)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                  title="Block Card"
                                >
                                  <Ban size={16} className="text-gray-500" />
                                </button>
                              )}
                              {card.status === "blocked" && (
                                <button
                                  onClick={() => handleToggleBlock(card._id)}
                                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                  title="Unblock Card"
                                >
                                  <CheckCircle
                                    size={16}
                                    className="text-green-600"
                                  />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AdminBottomNav />
      </div>

      {/* Action Modal */}
      {showActionModal && selectedCard && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {actionType === "approve" ? "Approve Card" : "Reject Card"}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {actionType === "approve"
                ? "Are you sure you want to approve this card application?"
                : "Please provide a reason for rejecting this card application."}
            </p>

            {actionType === "reject" && (
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
                autoFocus
              />
            )}

            <div className="flex gap-3">
              <button
                onClick={() =>
                  actionType === "approve"
                    ? handleApprove(selectedCard._id)
                    : handleReject(selectedCard._id)
                }
                disabled={
                  submitting ||
                  (actionType === "reject" && !rejectReason.trim())
                }
                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 ${
                  actionType === "approve"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {submitting
                  ? "Processing..."
                  : actionType === "approve"
                    ? "Approve"
                    : "Reject"}
              </button>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color, icon: Icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between mb-2">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/40`}
      >
        <Icon
          size={16}
          className={`text-${color}-600 dark:text-${color}-400`}
        />
      </div>
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default CardManagement;
