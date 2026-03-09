/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/TaxRefund.jsx
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
  FileText,
  Sun,
  Moon,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  X,
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  MapPin,
  Shield,
  Lock,
  Key,
  Globe,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  Send,
  Ban,
} from "lucide-react";
import { taxRefundService } from "../../../services/taxRefundService";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell"; 

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

const TaxRefund = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [refunds, setRefunds] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [refundAmount, setRefundAmount] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    search: "",
  });

  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const response = await taxRefundService.getAllTaxRefunds(
        filters.status,
        filters.page
      );
      
      setRefunds(response.refunds || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.total || 0,
        pages: response.totalPages || 1,
      });

      // Calculate stats
      const refundsList = response.refunds || [];
      setStats({
        total: response.total || 0,
        pending: refundsList.filter(r => r.status === 'pending').length,
        underReview: refundsList.filter(r => r.status === 'under_review').length,
        approved: refundsList.filter(r => r.status === 'approved').length,
        rejected: refundsList.filter(r => r.status === 'rejected').length,
        disbursed: refundsList.filter(r => r.status === 'disbursed').length,
        cancelled: refundsList.filter(r => r.status === 'cancelled').length,
      });
    } catch (error) {
      console.error("Error fetching tax refunds:", error);
      addToast("Failed to fetch tax refunds", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRefunds();
  }, [filters.page, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchRefunds();
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedRefund) return;

    const statusData = {
      status: newStatus,
      notes: notes,
    };

    if (newStatus === 'rejected') {
      if (!rejectionReason.trim()) {
        addToast("Rejection reason is required", "error");
        return;
      }
      statusData.rejectionReason = rejectionReason;
    }

    if (newStatus === 'disbursed') {
      if (!refundAmount || parseFloat(refundAmount) <= 0) {
        addToast("Valid refund amount is required", "error");
        return;
      }
      statusData.refundAmount = parseFloat(refundAmount);
    }

    try {
      setProcessing(true);
      await taxRefundService.updateTaxRefundStatus(selectedRefund._id, statusData);
      await fetchRefunds();
      setShowStatusModal(false);
      setRefundAmount("");
      setRejectionReason("");
      setNotes("");
      setSelectedRefund(null);
      addToast(`Tax refund ${newStatus} successfully`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      addToast("Failed to update status", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openStatusModal = (refund) => {
    setSelectedRefund(refund);
    setRefundAmount(refund.refundAmount || "");
    setShowStatusModal(true);
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: {
        bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
        icon: Clock,
        label: "Pending",
      },
      under_review: {
        bg: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
        icon: Clock,
        label: "Under Review",
      },
      approved: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
        label: "Approved",
      },
      rejected: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: XCircle,
        label: "Rejected",
      },
      disbursed: {
        bg: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
        icon: DollarSign,
        label: "Disbursed",
      },
      cancelled: {
        bg: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
        icon: XCircle,
        label: "Cancelled",
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const maskSSN = (ssn) => {
    if (!ssn) return "N/A";
    return `***-**-${ssn.slice(-4)}`;
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

  return (
    <div >
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
                <ArrowLeft size={20}  className="dark:text-white" />
              </button>
              
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-8">
                Tax Refund 
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20} className="dark:text-white" /> : <Moon size={20} />}
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
                title="Total Requests"
                value={stats.total}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Pending"
                value={stats.pending}
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Approved"
                value={stats.approved}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Disbursed"
                value={stats.disbursed}
                icon={DollarSign}
                color="purple"
              />
            </div>
          )}

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or email..."
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
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="disbursed">Disbursed</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </form>
          </div>

          {/* Refunds Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">SSN</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID.me Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
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
                  ) : refunds.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        <FileText size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No tax refund requests found</p>
                      </td>
                    </tr>
                  ) : (
                    refunds.map((refund) => {
                      const user = refund.user || {};
                      return (
                        <tr key={refund._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
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
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {maskSSN(refund.ssn)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {refund.idmeEmail}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {refund.country}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(refund.applicationDate)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(refund.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedRefund(refund);
                                  setShowDetails(true);
                                }}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                                title="View Details"
                              >
                                <Eye size={16} className="text-blue-600" />
                              </button>
                              {['pending', 'under_review', 'approved'].includes(refund.status) && (
                                <button
                                  onClick={() => openStatusModal(refund)}
                                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                  title="Update Status"
                                >
                                  <Edit size={16} className="text-green-600" />
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

      {/* Refund Details Modal */}
      {showDetails && selectedRefund && (
        <RefundDetailsModal
          refund={selectedRefund}
          onClose={() => {
            setShowDetails(false);
            setSelectedRefund(null);
          }}
          onStatusUpdate={() => {
            setShowDetails(false);
            openStatusModal(selectedRefund);
          }}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedRefund && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Update Tax Refund Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedRefund.user?.firstName} {selectedRefund.user?.lastName}
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusUpdate('under_review')}
                  disabled={processing}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleStatusUpdate('approved')}
                  disabled={processing}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Approve
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Refund Amount (for disbursement)
                </label>
                <input
                  type="number"
                  value={refundAmount}
                  onChange={(e) => setRefundAmount(e.target.value)}
                  placeholder="Enter amount to disburse"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleStatusUpdate('disbursed')}
                  disabled={processing || !refundAmount}
                  className="mt-2 w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Disburse
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rejection Reason
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleStatusUpdate('rejected')}
                  disabled={processing || !rejectionReason.trim()}
                  className="mt-2 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Reject
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setRefundAmount("");
                  setRejectionReason("");
                  setNotes("");
                  setSelectedRefund(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium"
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

// Refund Details Modal Component
const RefundDetailsModal = ({ refund, onClose, onStatusUpdate }) => {
  const user = refund.user || {};

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  const maskSSN = (ssn) => {
    if (!ssn) return "N/A";
    return `***-**-${ssn.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tax Refund Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={18} className="dark:text-white"/>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Request ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{refund._id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              refund.status === 'approved' ? 'bg-green-100 text-green-700' :
              refund.status === 'rejected' ? 'bg-red-100 text-red-700' :
              refund.status === 'disbursed' ? 'bg-purple-100 text-purple-700' :
              refund.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {refund.status?.replace('_', ' ')}
            </span>
          </div>

          {/* User Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Applicant Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Full Name" value={refund.fullName} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="SSN" value={maskSSN(refund.ssn)} />
              <DetailRow label="Country" value={refund.country} />
            </div>
          </div>

          {/* ID.me Account */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">ID.me Account</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Email" value={refund.idmeEmail} />
              <DetailRow label="Password" value="••••••••" />
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Timeline</h4>
            <div className="space-y-2">
              <TimelineItem label="Applied" date={refund.applicationDate} />
              {refund.reviewDate && <TimelineItem label="Reviewed" date={refund.reviewDate} />}
              {refund.approvalDate && <TimelineItem label="Approved" date={refund.approvalDate} />}
              {refund.disbursementDate && <TimelineItem label="Disbursed" date={refund.disbursementDate} />}
            </div>
          </div>

          {/* Rejection Reason */}
          {refund.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {refund.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {refund.notes && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                {refund.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          {['pending', 'under_review', 'approved'].includes(refund.status) && (
            <button
              onClick={onStatusUpdate}
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
      {new Date(date).toLocaleString()}
    </span>
  </div>
);

export default TaxRefund;