/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/KYCManagement.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
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
  Trash2,
  X,
  Bell
} from "lucide-react";
import { kycService } from "../../../services/kycService";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

// Toast Notification Component
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

const KYCManagement = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [filters, setFilters] = useState({
    status: "",
    search: "",
  });
  const [toasts, setToasts] = useState([]);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [kycToDelete, setKycToDelete] = useState(null);
  const [processing, setProcessing] = useState(false);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchKYCApplications = async () => {
    try {
      setLoading(true);
      const response = await kycService.getAllKYC(filters.status, pagination.page);
      
      // Handle the response structure based on your API
      if (response && response.applications) {
        setApplications(response.applications);
        setPagination({
          page: response.currentPage || 1,
          total: response.total || 0,
          totalPages: response.totalPages || 1,
        });
      } else if (Array.isArray(response)) {
        setApplications(response);
      }
    } catch (error) {
      console.error("Error fetching KYC applications:", error);
      addToast("Failed to fetch KYC applications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKYCApplications();
  }, [pagination.page, filters.status]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchKYCApplications();
  };

  const handleDeleteKYC = async () => {
    if (!kycToDelete) return;
    
    try {
      setProcessing(true);
      await kycService.deleteKYC(kycToDelete._id);
      await fetchKYCApplications();
      setShowDeleteConfirm(false);
      setKycToDelete(null);
      addToast("KYC application deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting KYC:", error);
      addToast("Failed to delete KYC application", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openDeleteConfirm = (kyc) => {
    setKycToDelete(kyc);
    setShowDeleteConfirm(true);
  };

  const getStatusBadge = (status) => {
    const map = {
      verified: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
        label: "Verified",
      },
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
      rejected: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: XCircle,
        label: "Rejected",
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
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const StatCard = ({ label, value, color, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/40`}>
          <Icon size={16} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
    </div>
  );

  // Calculate stats from applications
  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending' || a.status === 'under_review').length,
    verified: applications.filter(a => a.status === 'verified').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

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
                <ArrowLeft size={24} className="dark:text-white" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-6">
                KYC Verification
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Applications"
              value={stats.total}
              color="blue"
              icon={FileText}
            />
            <StatCard
              label="Pending Review"
              value={stats.pending}
              color="yellow"
              icon={Clock}
            />
            <StatCard
              label="Verified"
              value={stats.verified}
              color="green"
              icon={CheckCircle}
            />
            <StatCard
              label="Rejected"
              value={stats.rejected}
              color="red"
              icon={XCircle}
            />
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <select
                className="px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm dark:text-white"
                value={filters.status}
                onChange={(e) => {
                  setFilters({ ...filters, status: e.target.value });
                  setPagination({ ...pagination, page: 1 });
                }}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Applications Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Document Type</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
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
                  ) : applications.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        <FileText size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No KYC applications found</p>
                      </td>
                    </tr>
                  ) : (
                    applications.map((app) => {
                      const user = app.user || {};
                      const firstDocument = app.documents?.[0];
                      
                      return (
                        <tr key={app._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
                                  {(user.firstName?.charAt(0) || 'U')}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900 dark:text-white">
                                {user.firstName} {user.lastName}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {user.email}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(app.submittedAt)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400 capitalize">
                            {firstDocument?.type?.replace(/_/g, ' ') || 'N/A'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => navigate(`/admin/kyc/${app._id}`)}
                                className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                                title="Review KYC"
                              >
                                <Eye size={16} className="text-blue-600" />
                              </button>
                              <button
                                onClick={() => openDeleteConfirm(app)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                title="Delete KYC"
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
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Page {pagination.page} of {pagination.totalPages}
                </p>
                <div className="flex gap-1">
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    disabled={pagination.page === 1}
                    className="p-1 rounded border border-gray-300 disabled:opacity-40"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    disabled={pagination.page === pagination.totalPages}
                    className="p-1 rounded border border-gray-300 disabled:opacity-40"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && kycToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete KYC Application
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this KYC application for{" "}
              <span className="font-medium text-gray-900 dark:text-white">
                {kycToDelete.user?.firstName} {kycToDelete.user?.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDeleteKYC}
                disabled={processing}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {processing ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setKycToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium dark:text-white"
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

export default KYCManagement;