/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/admin/Cards.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  CreditCard,
  Sun,
  Moon,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  User,
  Mail,
  Calendar,
  DollarSign,
  Shield,
  AlertCircle,
  X,
  Smartphone,
  Globe,
  Trash2, // Added Trash2 import
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

const Cards = () => {
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [cards, setCards] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [rejectReason, setRejectReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [cardToDelete, setCardToDelete] = useState(null);
  
  // Toast state
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    cardType: "all",
    cardBrand: "all",
    search: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const fetchCards = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllCards({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        cardType: filters.cardType,
        cardBrand: filters.cardBrand,
        search: filters.search,
      });
      
      setCards(response.cards || []);
      setPagination(response.pagination || { page: 1, total: 0, pages: 1 });
      setStats(response.stats || {});
    } catch (error) {
      console.error("Error fetching cards:", error);
      addToast("Failed to fetch cards", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.getAllCards({ limit: 1000 });
      const cardsList = response.cards || [];
      
      setStats({
        total: cardsList.length,
        pending: cardsList.filter(c => c.status === 'pending').length,
        active: cardsList.filter(c => c.status === 'active').length,
        blocked: cardsList.filter(c => c.status === 'blocked').length,
        rejected: cardsList.filter(c => c.status === 'rejected').length,
      });
    } catch (error) {
      console.error("Error fetching card stats:", error);
    }
  };

  useEffect(() => {
    fetchCards();
    fetchStats();
  }, [filters.page, filters.status, filters.cardType, filters.cardBrand]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchCards();
  };

  const handleApprove = async (cardId) => {
    try {
      setProcessing(true);
      await adminApi.approveCard(cardId);
      await fetchCards();
      await fetchStats();
      setShowActionModal(false);
      setSelectedCard(null);
      addToast("Card approved successfully", "success");
    } catch (error) {
      console.error("Error approving card:", error);
      addToast("Failed to approve card", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (cardId) => {
    if (!rejectReason.trim()) return;
    try {
      setProcessing(true);
      await adminApi.rejectCard(cardId, rejectReason);
      await fetchCards();
      await fetchStats();
      setShowActionModal(false);
      setRejectReason("");
      setSelectedCard(null);
      addToast("Card rejected successfully", "success");
    } catch (error) {
      console.error("Error rejecting card:", error);
      addToast("Failed to reject card", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleBlock = async (cardId) => {
    try {
      setProcessing(true);
      await adminApi.toggleBlockCard(cardId);
      await fetchCards();
      await fetchStats();
      addToast("Card status updated", "success");
    } catch (error) {
      console.error("Error toggling card block:", error);
      addToast("Failed to update card", "error");
    } finally {
      setProcessing(false);
    }
  };

  // New delete function
  const handleDeleteCard = async (cardId) => {
    try {
      setProcessing(true);
      await adminApi.deleteCard(cardId);
      await fetchCards();
      await fetchStats();
      setShowDeleteConfirm(false);
      setCardToDelete(null);
      addToast("Card deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting card:", error);
      addToast("Failed to delete card", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openDeleteConfirm = (card) => {
    setCardToDelete(card);
    setShowDeleteConfirm(true);
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
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg}`}>
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
      <span className={`text-xs font-bold uppercase ${colors[type] || "text-gray-600"}`}>
        {type}
      </span>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon size={16} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );

  // Toast Component
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
          {toast.type === "success" && <CheckCircle size={16} className="flex-shrink-0" />}
          {toast.type === "error" && <XCircle size={16} className="flex-shrink-0" />}
          {toast.type === "info" && <AlertCircle size={16} className="flex-shrink-0" />}
          {toast.type === "warning" && <AlertCircle size={16} className="flex-shrink-0" />}
          <span className="flex-1">{toast.message}</span>
          <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-70">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
              >
                <ArrowLeft size={20} className="text-gray-700 dark:text-gray-300" />
              </button>
              
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                Card Management
              </h1>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20} style={{ color: darkMode ? 'white' : '#374151' }} /> : <Moon size={20} />}
                </button>
                 <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard
                title="Total Cards"
                value={stats.total || 0}
                icon={CreditCard}
                color="blue"
              />
              <StatCard
                title="Pending"
                value={stats.pending || 0}
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Active"
                value={stats.active || 0}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Blocked"
                value={stats.blocked || 0}
                icon={Ban}
                color="gray"
              />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or card number..."
                    className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </div>

                {/* Status Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="blocked">Blocked</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Card Type Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.cardType}
                  onChange={(e) => setFilters({ ...filters, cardType: e.target.value, page: 1 })}
                >
                  <option value="all">All Card Types</option>
                  <option value="visa">Visa</option>
                  <option value="mastercard">Mastercard</option>
                  <option value="amex">American Express</option>
                  <option value="discover">Discover</option>
                </select>

                {/* Card Brand Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.cardBrand}
                  onChange={(e) => setFilters({ ...filters, cardBrand: e.target.value, page: 1 })}
                >
                  <option value="all">All Brands</option>
                  <option value="virtual">Virtual</option>
                  <option value="physical">Physical</option>
                </select>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      page: 1,
                      limit: 20,
                      status: "all",
                      cardType: "all",
                      cardBrand: "all",
                      search: "",
                    });
                    fetchCards();
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

          {/* Cards Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Card</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Expiry</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Limits</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                  ) : cards.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        <CreditCard size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No cards found</p>
                      </td>
                    </tr>
                  ) : (
                    cards.map((card) => {
                      const user = card.user || {};
                      return (
                        <tr key={card._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                  {user.firstName?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user.firstName} {user.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{user.email}</p>
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
                              <span className="text-xs text-gray-600 dark:text-gray-300 capitalize">
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
                          <td className="px-4 py-3">
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Daily: ${card.dailyLimit?.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Monthly: ${card.monthlyLimit?.toLocaleString()}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedCard(card);
                                  setShowDetails(true);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="View Details"
                              >
                                <Eye size={16} className="text-gray-500" />
                              </button>
                              
                              {card.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => openActionModal(card, 'approve')}
                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                    title="Approve"
                                  >
                                    <CheckCircle size={16} className="text-green-600" />
                                  </button>
                                  <button
                                    onClick={() => openActionModal(card, 'reject')}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                    title="Reject"
                                  >
                                    <XCircle size={16} className="text-red-600" />
                                  </button>
                                </>
                              )}
                              
                              {card.status === 'active' && (
                                <button
                                  onClick={() => handleToggleBlock(card._id)}
                                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                  title="Block Card"
                                >
                                  <Ban size={16} className="text-gray-500" />
                                </button>
                              )}
                              
                              {card.status === 'blocked' && (
                                <button
                                  onClick={() => handleToggleBlock(card._id)}
                                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                  title="Unblock Card"
                                >
                                  <CheckCircle size={16} className="text-green-600" />
                                </button>
                              )}

                              {/* Delete button - visible to all admins */}
                              <button
                                onClick={() => openDeleteConfirm(card)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                title="Delete Card"
                              >
                                <Trash2 size={16} className="text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={filters.page === 1}
                    className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                    {filters.page}
                  </span>
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
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

      {/* Card Details Modal */}
      {showDetails && selectedCard && (
        <CardDetailsModal
          card={selectedCard}
          onClose={() => {
            setShowDetails(false);
            setSelectedCard(null);
          }}
          onAction={(action) => {
            setShowDetails(false);
            openActionModal(selectedCard, action);
          }}
        />
      )}

      {/* Action Modal (Approve/Reject) */}
      {showActionModal && selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {actionType === 'approve' ? 'Approve Card' : 'Reject Card'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {actionType === 'approve' 
                ? `Approve card ending in ${selectedCard.maskedNumber?.slice(-4)}?`
                : 'Please provide a reason for rejection'}
            </p>

            {actionType === 'reject' && (
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
                onClick={() => actionType === 'approve' 
                  ? handleApprove(selectedCard._id)
                  : handleReject(selectedCard._id)
                }
                disabled={processing || (actionType === 'reject' && !rejectReason.trim())}
                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 ${
                  actionType === 'approve' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                {processing ? 'Processing...' : actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
              <button
                onClick={() => {
                  setShowActionModal(false);
                  setRejectReason("");
                  setSelectedCard(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Card
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this card ending in {cardToDelete.maskedNumber?.slice(-4)}? 
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteCard(cardToDelete._id)}
                disabled={processing}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {processing ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setCardToDelete(null);
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

// Card Details Modal Component
const CardDetailsModal = ({ card, onClose, onAction }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusColor = (status) => {
    const map = {
      active: "text-green-600",
      pending: "text-yellow-600",
      rejected: "text-red-600",
      blocked: "text-gray-600",
    };
    return map[status] || "text-gray-600";
  };

  const user = card.user || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Card Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={18} className="dark:text-white"/>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Virtual Card Design */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white shadow-xl">
            <div className="absolute top-4 right-4">
              <span className="text-xs bg-white/20 px-2 py-1 rounded-full capitalize">
                {card.cardBrand}
              </span>
            </div>
            <div className="mb-6">
              <Shield size={32} className="opacity-80" />
            </div>
            <p className="text-xl font-mono tracking-wider mb-4">
              {card.maskedNumber}
            </p>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80 mb-1">Cardholder</p>
                <p className="font-medium">{card.cardholderName}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80 mb-1">Expires</p>
                <p className="font-medium">
                  {card.expiryMonth}/{card.expiryYear}
                </p>
              </div>
            </div>
          </div>

          {/* Status and Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Card Status</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${getStatusColor(card.status)}`}>
                  {card.status}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Card Type</p>
              <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                {card.cardType} • {card.cardBrand}
              </p>
            </div>
          </div>

          {/* User Information */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Cardholder Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Name" value={`${user.firstName} ${user.lastName}`} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Account ID" value={user.accountId} />
            </div>
          </div>

          {/* Card Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Card Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Card Number" value={card.status === 'active' ? card.cardNumber : card.maskedNumber} />
              <DetailRow label="CVV" value={card.status === 'active' ? card.cvv : '***'} />
            </div>
          </div>

          {/* Limits */}
          {card.status === 'active' && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Spending Limits</h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Daily Limit" value={`$${card.dailyLimit?.toLocaleString()}`} />
                <DetailRow label="Monthly Limit" value={`$${card.monthlyLimit?.toLocaleString()}`} />
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Timeline</h4>
            <div className="space-y-2">
              <TimelineItem label="Applied" date={card.createdAt} />
              {card.activatedAt && <TimelineItem label="Activated" date={card.activatedAt} />}
            </div>
          </div>

          {/* Rejection Reason */}
          {card.status === 'rejected' && card.metadata?.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {card.metadata.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          {card.status === 'pending' && (
            <>
              <button
                onClick={() => onAction('approve')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
              >
                Approve
              </button>
              <button
                onClick={() => onAction('reject')}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
              >
                Reject
              </button>
            </>
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

// Helper Components
const DetailRow = ({ label, value }) => (
  <div>
    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
    <p className="text-sm text-gray-900 dark:text-white">{value || 'N/A'}</p>
  </div>
);

const TimelineItem = ({ label, date }) => (
  <div className="flex items-center gap-2 text-sm">
    <Calendar size={14} className="text-gray-400" />
    <span className="text-gray-500 dark:text-gray-400">{label}:</span>
    <span className="text-gray-900 dark:text-white">
      {new Date(date).toLocaleDateString()}
    </span>
  </div>
);

export default Cards;