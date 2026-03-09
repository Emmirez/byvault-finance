/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Grants.jsx
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
  Building,
  Briefcase,
  Users,
  Edit,
  Trash2,
  Send,
  Ban,
  Globe,
  MapPin,
  Hash,
  FileDigit,
  Award,
} from "lucide-react";
import { grantService } from "../../../services/grantService";
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

const Grants = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [grants, setGrants] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [grantToDelete, setGrantToDelete] = useState(null);
  const [approvedAmount, setApprovedAmount] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [notes, setNotes] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    type: "all",
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

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const response = await grantService.getAllGrants(
        filters.status,
        filters.type,
        filters.page
      );
      
      setGrants(response.grants || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.total || 0,
        pages: response.totalPages || 1,
      });

      // Calculate stats
      const grantsList = response.grants || [];
      setStats({
        total: response.total || 0,
        pending: grantsList.filter(g => g.status === 'pending').length,
        underReview: grantsList.filter(g => g.status === 'under_review').length,
        approved: grantsList.filter(g => g.status === 'approved').length,
        rejected: grantsList.filter(g => g.status === 'rejected').length,
        disbursed: grantsList.filter(g => g.status === 'disbursed').length,
        totalAmount: grantsList.reduce((sum, g) => sum + (g.requestedAmount || 0), 0),
      });
    } catch (error) {
      console.error("Error fetching grants:", error);
      addToast("Failed to fetch grants", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrants();
  }, [filters.page, filters.status, filters.type]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchGrants();
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!selectedGrant) return;

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

    if (newStatus === 'approved' && approvedAmount) {
      statusData.approvedAmount = parseFloat(approvedAmount);
    }

    if (newStatus === 'disbursed') {
      statusData.approvedAmount = selectedGrant.approvedAmount || selectedGrant.requestedAmount;
    }

    try {
      setProcessing(true);
      await grantService.updateGrantStatus(selectedGrant._id, statusData);
      await fetchGrants();
      setShowStatusModal(false);
      setApprovedAmount("");
      setRejectionReason("");
      setNotes("");
      setSelectedGrant(null);
      addToast(`Grant ${newStatus} successfully`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      addToast("Failed to update status", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteGrant = async () => {
    if (!grantToDelete) return;
    
    try {
      setProcessing(true);
      await grantService.deleteGrant(grantToDelete._id);
      await fetchGrants();
      setShowDeleteConfirm(false);
      setGrantToDelete(null);
      addToast("Grant application deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting grant:", error);
      addToast("Failed to delete grant", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openDeleteConfirm = (grant) => {
    setGrantToDelete(grant);
    setShowDeleteConfirm(true);
  };

  const openStatusModal = (grant) => {
    setSelectedGrant(grant);
    setApprovedAmount(grant.approvedAmount || grant.requestedAmount);
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

  const getGrantTypeIcon = (type) => {
    if (type === 'individual') {
      return <Users size={16} className="text-blue-600" />;
    }
    return <Building size={16} className="text-purple-600" />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString() || 0}`;
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
          <div className="px-4 sm:px-6 lg:px-8 dark:text-white">
            <div className="flex items-center h-16 ">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4 "
              >
                <ArrowLeft size={20} />
              </button>
              
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">
                Grant Applications
              </h1>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20}  className="text-white"  /> : <Moon size={20} className="text-gray-700" />}
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
                title="Total Applications"
                value={stats.total}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Pending Review"
                value={stats.pending + stats.underReview}
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
                title="Total Amount"
                value={formatCurrency(stats.totalAmount)}
                icon={DollarSign}
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
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search by name or organization..."
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

                {/* Type Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.type}
                  onChange={(e) => setFilters({ ...filters, type: e.target.value, page: 1 })}
                >
                  <option value="all">All Types</option>
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
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

          {/* Grants Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Requested</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Approved</th>
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
                  ) : grants.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-8 text-center text-gray-500">
                        <FileText size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No grant applications found</p>
                      </td>
                    </tr>
                  ) : (
                    grants.map((grant) => {
                      const user = grant.user || {};
                      return (
                        <tr key={grant._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
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
                            <div className="flex items-center gap-2">
                              {getGrantTypeIcon(grant.grantType)}
                              <span className="text-sm capitalize text-gray-900 dark:text-white">
                                {grant.grantType}
                              </span>
                            </div>
                            {grant.grantType === 'company' && grant.companyDetails?.legalName && (
                              <p className="text-xs text-gray-500 mt-1">{grant.companyDetails.legalName}</p>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatCurrency(grant.requestedAmount)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-medium text-green-600">
                              {grant.approvedAmount ? formatCurrency(grant.approvedAmount) : '-'}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(grant.applicationDate)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(grant.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedGrant(grant);
                                  setShowDetails(true);
                                }}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                                title="View Details"
                              >
                                <Eye size={16} className="text-blue-600" />
                              </button>
                              {['pending', 'under_review', 'approved'].includes(grant.status) && (
                                <button
                                  onClick={() => openStatusModal(grant)}
                                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                  title="Update Status"
                                >
                                  <Edit size={16} className="text-green-600" />
                                </button>
                              )}
                              <button
                                onClick={() => openDeleteConfirm(grant)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                title="Delete Grant"
                              >
                                <Trash2 size={16} className="text-red-600" />
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

      {/* Grant Details Modal */}
      {showDetails && selectedGrant && (
        <GrantDetailsModal
          grant={selectedGrant}
          onClose={() => {
            setShowDetails(false);
            setSelectedGrant(null);
          }}
          onStatusUpdate={() => {
            setShowDetails(false);
            openStatusModal(selectedGrant);
          }}
          onDelete={() => {
            setShowDetails(false);
            openDeleteConfirm(selectedGrant);
          }}
        />
      )}

      {/* Status Update Modal */}
      {showStatusModal && selectedGrant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Update Grant Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedGrant.user?.firstName} {selectedGrant.user?.lastName} • {selectedGrant.grantType} Grant
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

              {selectedGrant.status === 'approved' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Approved Amount
                  </label>
                  <input
                    type="number"
                    value={approvedAmount}
                    onChange={(e) => setApprovedAmount(e.target.value)}
                    placeholder="Enter approved amount"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleStatusUpdate('disbursed')}
                    disabled={processing}
                    className="mt-2 w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                  >
                    Disburse Funds
                  </button>
                </div>
              )}

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
                  setApprovedAmount("");
                  setRejectionReason("");
                  setNotes("");
                  setSelectedGrant(null);
                }}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && grantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Grant Application
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this grant application for{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {grantToDelete.user?.firstName} {grantToDelete.user?.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteGrant}
                disabled={processing}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {processing ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setGrantToDelete(null);
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

// Grant Details Modal Component
const GrantDetailsModal = ({ grant, onClose, onStatusUpdate, onDelete }) => {
  const user = grant.user || {};
  const isIndividual = grant.grantType === 'individual';
  const details = isIndividual ? grant.individualDetails : grant.companyDetails;

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleString() : 'N/A';
  };

  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString() || 0}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Grant Application Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Application ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{grant._id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              grant.status === 'approved' ? 'bg-green-100 text-green-700' :
              grant.status === 'rejected' ? 'bg-red-100 text-red-700' :
              grant.status === 'disbursed' ? 'bg-purple-100 text-purple-700' :
              grant.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {grant.status?.replace('_', ' ')}
            </span>
          </div>

          {/* Applicant Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Applicant Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Name" value={`${user.firstName} ${user.lastName}`} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Phone" value={user.phone} />
              <DetailRow label="Type" value={grant.grantType} capitalize />
            </div>
          </div>

          {/* Grant Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Grant Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Requested Amount" value={formatCurrency(grant.requestedAmount)} />
              <DetailRow label="Approved Amount" value={grant.approvedAmount ? formatCurrency(grant.approvedAmount) : 'Pending'} />
            </div>
          </div>

          {/* Individual Specific Fields */}
          {isIndividual && details?.fundingPurposes && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Funding Purposes</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(details.fundingPurposes).map(([key, value]) => (
                  value && (
                    <div key={key} className="flex items-center gap-2">
                      <CheckCircle size={14} className="text-green-600" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </div>
                  )
                ))}
              </div>
            </div>
          )}

          {/* Company Specific Fields */}
          {!isIndividual && details && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Company Information</h4>
              <div className="grid grid-cols-2 gap-4">
                <DetailRow label="Legal Name" value={details.legalName} />
                <DetailRow label="Tax ID" value={details.taxId} />
                <DetailRow label="Organization Type" value={details.organizationType} />
                <DetailRow label="Founding Year" value={details.foundingYear} />
                <DetailRow label="Contact Person" value={details.contactPerson} />
                <DetailRow label="Contact Phone" value={details.contactPhone} />
                <DetailRow label="Mailing Address" value={details.mailingAddress} />
                <DetailRow label="Date of Incorporation" value={details.dateOfIncorporation ? formatDate(details.dateOfIncorporation) : 'N/A'} />
              </div>
            </div>
          )}

          {/* Project Details (Company) */}
          {!isIndividual && details?.projectTitle && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Project Details</h4>
              <div className="space-y-3">
                <DetailRow label="Project Title" value={details.projectTitle} />
                <DetailRow label="Description" value={details.projectDescription} />
                <DetailRow label="Expected Outcomes" value={details.expectedOutcomes} />
                <DetailRow label="Mission Statement" value={details.missionStatement} />
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Timeline</h4>
            <div className="space-y-2">
              <TimelineItem label="Applied" date={grant.applicationDate} />
              {grant.reviewDate && <TimelineItem label="Reviewed" date={grant.reviewDate} />}
              {grant.approvalDate && <TimelineItem label="Approved" date={grant.approvalDate} />}
              {grant.disbursementDate && <TimelineItem label="Disbursed" date={grant.disbursementDate} />}
            </div>
          </div>

          {/* Rejection Reason */}
          {grant.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {grant.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {grant.notes && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                {grant.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3 dark:text-white">
          {['pending', 'under_review', 'approved'].includes(grant.status) && (
            <button
              onClick={onStatusUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
            >
              Update Status
            </button>
          )}
          <button
            onClick={onDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
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
    <p className={`text-sm text-gray-900 dark:text-white ${capitalize ? 'capitalize' : ''}`}>
      {value || 'N/A'}
    </p>
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

export default Grants;