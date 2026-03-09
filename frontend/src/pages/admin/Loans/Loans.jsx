/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Loans.jsx
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
  DollarSign,
  Calendar,
  User,
  Mail,
  Phone,
  Sun,
  Moon,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  AlertCircle,
  X,
  TrendingUp,
  TrendingDown,
  FileText,
  Briefcase,
  Home,
  Car,
  Heart,
  GraduationCap,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "../Notification/AdminAlertBell";

const LoanUsers = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [loans, setLoans] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loanToDelete, setLoanToDelete] = useState(null);
  const [statusNote, setStatusNote] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    loanType: "all",
    search: "",
    startDate: "",
    endDate: "",
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

  const fetchLoans = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllLoans({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        loanType: filters.loanType,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
      
      setLoans(response.loans || []);
      setPagination({
        page: response.currentPage || 1,
        total: response.total || 0,
        pages: response.totalPages || 1,
      });
      
      // Calculate stats
      const loansList = response.loans || [];
      setStats({
        total: response.total || 0,
        pending: loansList.filter(l => l.status === 'pending').length,
        underReview: loansList.filter(l => l.status === 'under_review').length,
        approved: loansList.filter(l => l.status === 'approved').length,
        rejected: loansList.filter(l => l.status === 'rejected').length,
        disbursed: loansList.filter(l => l.status === 'disbursed').length,
        completed: loansList.filter(l => l.status === 'completed').length,
        totalAmount: loansList.reduce((sum, l) => sum + l.amount, 0),
      });
    } catch (error) {
      console.error("Error fetching loans:", error);
      addToast("Failed to fetch loans", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [filters.page, filters.status, filters.loanType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchLoans();
  };

  const handleStatusUpdate = async (loanId, newStatus) => {
    try {
      setProcessing(true);
      
      const statusData = {
        status: newStatus,
        notes: statusNote,
      };
      
      if (newStatus === 'rejected') {
        statusData.rejectionReason = rejectionReason;
      }
      
      await adminApi.updateLoanStatus(loanId, statusData);
      await fetchLoans();
      setShowStatusModal(false);
      setStatusNote("");
      setRejectionReason("");
      setSelectedLoan(null);
      addToast(`Loan ${newStatus} successfully`, "success");
    } catch (error) {
      console.error("Error updating loan status:", error);
      addToast("Failed to update loan status", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteLoan = async (loanId) => {
    try {
      setProcessing(true);
      await adminApi.deleteLoan(loanId);
      await fetchLoans();
      setShowDeleteConfirm(false);
      setLoanToDelete(null);
      addToast("Loan deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting loan:", error);
      addToast("Failed to delete loan", "error");
    } finally {
      setProcessing(false);
    }
  };

  const openStatusModal = (loan) => {
    setSelectedLoan(loan);
    setShowStatusModal(true);
  };

  const openDeleteConfirm = (loan) => {
    setLoanToDelete(loan);
    setShowDeleteConfirm(true);
  };

  const getLoanTypeIcon = (type) => {
    const icons = {
      personal: { icon: User, color: "text-blue-600", bg: "bg-blue-100" },
      home: { icon: Home, color: "text-green-600", bg: "bg-green-100" },
      auto: { icon: Car, color: "text-orange-600", bg: "bg-orange-100" },
      business: { icon: Briefcase, color: "text-purple-600", bg: "bg-purple-100" },
      health: { icon: Heart, color: "text-red-600", bg: "bg-red-100" },
      education: { icon: GraduationCap, color: "text-indigo-600", bg: "bg-indigo-100" },
    };
    const defaultIcon = { icon: FileText, color: "text-gray-600", bg: "bg-gray-100" };
    const item = icons[type] || defaultIcon;
    const Icon = item.icon;
    return <Icon size={16} className={item.color} />;
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
      completed: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
        label: "Completed",
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
    <div className={darkMode ? "dark" : ""}>
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
                Loan Management
              </h1>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20} className="dark:text-white"/> : <Moon size={20} />}
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
                title="Total Loans"
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
                    placeholder="Search by name or purpose..."
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
                  <option value="completed">Completed</option>
                </select>

                {/* Loan Type Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.loanType}
                  onChange={(e) => setFilters({ ...filters, loanType: e.target.value, page: 1 })}
                >
                  <option value="all">All Types</option>
                  <option value="personal">Personal</option>
                  <option value="home">Home</option>
                  <option value="auto">Auto</option>
                  <option value="business">Business</option>
                  <option value="health">Health</option>
                  <option value="education">Education</option>
                </select>

                {/* Date Range */}
                <div className="flex gap-2 ">
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.startDate}
                    onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                    placeholder="Start"
                  />
                  <input
                    type="date"
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={filters.endDate}
                    onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                    placeholder="End"
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
                      loanType: "all",
                      search: "",
                      startDate: "",
                      endDate: "",
                    });
                    fetchLoans();
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

          {/* Loans Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applicant</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loan Details</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
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
                  ) : loans.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                        <FileText size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No loan applications found</p>
                      </td>
                    </tr>
                  ) : (
                    loans.map((loan) => {
                      const user = loan.user || {};
                      return (
                        <tr key={loan._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
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
                            <div className="flex items-center gap-2 mb-1">
                              {getLoanTypeIcon(loan.loanType)}
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {loan.loanType}
                              </span>
                            </div>
                            <p className="text-xs text-gray-500">{loan.loanProduct}</p>
                            <p className="text-xs text-gray-500 mt-1">{loan.term} months @ {loan.interestRate}%</p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm font-bold text-gray-900 dark:text-white">
                              {formatCurrency(loan.amount)}
                            </p>
                            <p className="text-xs text-gray-500">
                              Monthly: {formatCurrency(loan.monthlyPayment)}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(loan.status)}
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {formatDate(loan.applicationDate)}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setSelectedLoan(loan);
                                  setShowDetails(true);
                                }}
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="View Details"
                              >
                                <Eye size={16} className="text-gray-500" />
                              </button>
                              
                              {['pending', 'under_review'].includes(loan.status) && (
                                <button
                                  onClick={() => openStatusModal(loan)}
                                  className="p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                                  title="Update Status"
                                >
                                  <Edit size={16} className="text-blue-500" />
                                </button>
                              )}
                              
                              <button
                                onClick={() => openDeleteConfirm(loan)}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                title="Delete"
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

      {/* Loan Details Modal */}
      {showDetails && selectedLoan && (
        <LoanDetailsModal
          loan={selectedLoan}
          onClose={() => {
            setShowDetails(false);
            setSelectedLoan(null);
          }}
          onUpdateStatus={() => {
            setShowDetails(false);
            openStatusModal(selectedLoan);
          }}
        />
      )}

      {/* Update Status Modal */}
      {showStatusModal && selectedLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Update Loan Status
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedLoan.user?.firstName} {selectedLoan.user?.lastName} • ${selectedLoan.amount}
            </p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleStatusUpdate(selectedLoan._id, "under_review")}
                  disabled={processing}
                  className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Under Review
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedLoan._id, "approved")}
                  disabled={processing}
                  className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedLoan._id, "disbursed")}
                  disabled={processing}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium"
                >
                  Disburse
                </button>
                <button
                  onClick={() => {
                    setRejectionReason("");
                    // Show rejection reason input
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                >
                  Reject
                </button>
              </div>

              {/* Rejection reason input */}
              {rejectionReason !== undefined && (
                <div>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter rejection reason..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => handleStatusUpdate(selectedLoan._id, "rejected")}
                    disabled={processing || !rejectionReason.trim()}
                    className="mt-2 w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium"
                  >
                    Confirm Rejection
                  </button>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Notes (optional)
                </label>
                <textarea
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="Add notes about this status change..."
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
                  setRejectionReason(undefined);
                  setSelectedLoan(null);
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
      {showDeleteConfirm && loanToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Loan Application
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this loan application for ${loanToDelete.amount}?
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDeleteLoan(loanToDelete._id)}
                disabled={processing}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {processing ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setLoanToDelete(null);
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

// Loan Details Modal Component
const LoanDetailsModal = ({ loan, onClose, onUpdateStatus }) => {
  const user = loan.user || {};

  const getStatusColor = (status) => {
    const map = {
      pending: "text-yellow-600",
      under_review: "text-blue-600",
      approved: "text-green-600",
      rejected: "text-red-600",
      disbursed: "text-purple-600",
      completed: "text-green-600",
      cancelled: "text-gray-600",
    };
    return map[status] || "text-gray-600";
  };

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
            Loan Application Details
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
              <p className="text-sm text-gray-500 mb-1">Application ID</p>
              <p className="text-sm font-mono text-gray-900 dark:text-white">{loan._id}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              loan.status === 'approved' ? 'bg-green-100 text-green-700' :
              loan.status === 'rejected' ? 'bg-red-100 text-red-700' :
              loan.status === 'disbursed' ? 'bg-purple-100 text-purple-700' :
              loan.status === 'completed' ? 'bg-green-100 text-green-700' :
              loan.status === 'under_review' ? 'bg-blue-100 text-blue-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {loan.status?.replace('_', ' ')}
            </span>
          </div>

          {/* Applicant Info */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Applicant Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Name" value={`${user.firstName} ${user.lastName}`} />
              <DetailRow label="Email" value={user.email} />
              <DetailRow label="Phone" value={user.phone} />
              <DetailRow label="Employment" value={loan.employmentStatus} />
              <DetailRow label="Annual Income" value={formatCurrency(loan.annualIncome)} />
            </div>
          </div>

          {/* Loan Details */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Loan Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Loan Type" value={loan.loanType} capitalize />
              <DetailRow label="Product" value={loan.loanProduct} />
              <DetailRow label="Amount" value={formatCurrency(loan.amount)} />
              <DetailRow label="Term" value={`${loan.term} months`} />
              <DetailRow label="Interest Rate" value={`${loan.interestRate}%`} />
              <DetailRow label="Monthly Payment" value={formatCurrency(loan.monthlyPayment)} />
              <DetailRow label="Total Repayment" value={formatCurrency(loan.totalRepayment)} />
              <DetailRow label="Purpose" value={loan.purpose} />
            </div>
          </div>

          {/* Timeline */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Timeline</h4>
            <div className="space-y-2">
              <TimelineItem label="Applied" date={loan.applicationDate} />
              {loan.reviewDate && <TimelineItem label="Reviewed" date={loan.reviewDate} />}
              {loan.approvalDate && <TimelineItem label="Approved" date={loan.approvalDate} />}
              {loan.disbursementDate && <TimelineItem label="Disbursed" date={loan.disbursementDate} />}
              {loan.completionDate && <TimelineItem label="Completed" date={loan.completionDate} />}
            </div>
          </div>

          {/* Rejection Reason */}
          {loan.rejectionReason && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800 dark:text-red-300 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-400">
                    {loan.rejectionReason}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {loan.notes && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-3 rounded-lg">
                {loan.notes}
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
          {['pending', 'under_review'].includes(loan.status) && (
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

export default LoanUsers;