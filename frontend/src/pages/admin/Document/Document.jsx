/* eslint-disable no-unused-vars */
// src/pages/admin/Documents.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  RefreshCw,
  Eye,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Image,
  Sun,
  Moon,
  Filter,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  User,
  Trash2,
  X,
  Calendar,
  Mail,
  Phone,
  Bell,
} from "lucide-react";
import { documentService } from "../../../services/documentService";
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
        {toast.type === "success" && (
          <CheckCircle size={16} className="flex-shrink-0" />
        )}
        {toast.type === "error" && (
          <XCircle size={16} className="flex-shrink-0" />
        )}
        {toast.type === "info" && (
          <AlertCircle size={16} className="flex-shrink-0" />
        )}
        {toast.type === "warning" && (
          <AlertCircle size={16} className="flex-shrink-0" />
        )}
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={() => removeToast(toast.id)}
          className="flex-shrink-0 hover:opacity-70"
        >
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

const Documents = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processing, setProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [toasts, setToasts] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    documentType: "all",
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

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await documentService.getAllDocuments({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        documentType: filters.documentType,
        search: filters.search,
        startDate: filters.startDate,
        endDate: filters.endDate,
      });

      setDocuments(response.documents || []);
      setPagination(response.pagination || { page: 1, total: 0, pages: 1 });
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching documents:", error);
      addToast("Failed to fetch documents", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await documentService.getDocumentStats();
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchStats();
  }, [filters.page, filters.status, filters.documentType]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchDocuments();
  };

  const handleVerify = async (status) => {
    if (!selectedDocument) return;

    try {
      setProcessing(true);
      await documentService.verifyDocument(
        selectedDocument._id,
        status,
        status === "rejected" ? rejectionReason : "",
      );
      await fetchDocuments();
      await fetchStats();
      setShowVerifyModal(false);
      setRejectionReason("");
      setSelectedDocument(null);
      addToast(`Document ${status} successfully`, "success");
    } catch (error) {
      console.error("Error verifying document:", error);
      addToast("Failed to verify document", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!documentToDelete) return;

    try {
      setProcessing(true);
      await documentService.deleteDocumentAdmin(documentToDelete._id);
      await fetchDocuments();
      await fetchStats();
      setShowDeleteConfirm(false);
      setDocumentToDelete(null);
      addToast("Document deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting document:", error);
      addToast("Failed to delete document", "error");
    } finally {
      setProcessing(false);
    }
  };

  const downloadFile = (url, filename) => {
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
      rejected: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: XCircle,
        label: "Rejected",
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

  const getDocumentTypeIcon = (type) => {
    if (
      type.includes("image") ||
      type.includes("jpg") ||
      type.includes("png")
    ) {
      return <Image size={16} className="text-blue-500" />;
    }
    return <FileText size={16} className="text-orange-500" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
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
                <ArrowLeft size={20} className="dark:text-white" />
              </button>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-8">
                Documents
              </h1>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? (
                    <Sun size={20} className="dark:text-white" />
                  ) : (
                    <Moon size={20} />
                  )}
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
                title="Total Documents"
                value={stats.total || 0}
                icon={FileText}
                color="blue"
              />
              <StatCard
                title="Pending"
                value={stats.pending || 0}
                icon={Clock}
                color="yellow"
              />
              <StatCard
                title="Verified"
                value={stats.verified || 0}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Rejected"
                value={stats.rejected || 0}
                icon={XCircle}
                color="red"
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
                    placeholder="Search by filename or description..."
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
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>

                {/* Document Type Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.documentType}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      documentType: e.target.value,
                      page: 1,
                    })
                  }
                >
                  <option value="all">All Types</option>
                  <option value="profile_image">Profile Image</option>
                  <option value="passport">Passport</option>
                  <option value="drivers_license">Driver's License</option>
                  <option value="national_id">National ID</option>
                  <option value="utility_bill">Utility Bill</option>
                  <option value="bank_statement">Bank Statement</option>
                  <option value="contract">Contract</option>
                  <option value="tax_document">Tax Document</option>
                  <option value="proof_of_address">Proof of Address</option>
                  <option value="proof_of_income">Proof of Income</option>
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
                    className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
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
                      documentType: "all",
                      search: "",
                      startDate: "",
                      endDate: "",
                    });
                    fetchDocuments();
                  }}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
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

          {/* Documents Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      User
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Document
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Uploaded
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
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
                  ) : documents.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <FileText
                          size={40}
                          className="mx-auto mb-3 opacity-50"
                        />
                        <p>No documents found</p>
                      </td>
                    </tr>
                  ) : (
                    documents.map((doc) => {
                      const user = doc.user || {};
                      return (
                        <tr
                          key={doc._id}
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
                            <div className="flex items-center gap-2">
                              {getDocumentTypeIcon(doc.mimeType)}
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">
                                  {doc.fileName}
                                </p>
                                {doc.description && (
                                  <p className="text-xs text-gray-500">
                                    {doc.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-sm text-gray-900 dark:text-white capitalize">
                              {doc.documentType?.replace(/_/g, " ")}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatFileSize(doc.fileSize)}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(doc.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            {getStatusBadge(doc.status)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() =>
                                  window.open(doc.fileUrl, "_blank")
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="View"
                              >
                                <Eye size={16} className="text-gray-500" />
                              </button>
                              <button
                                onClick={() =>
                                  downloadFile(doc.fileUrl, doc.fileName)
                                }
                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                title="Download"
                              >
                                <Download size={16} className="text-gray-500" />
                              </button>
                              {doc.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setSelectedDocument(doc);
                                      setShowVerifyModal(true);
                                    }}
                                    className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                    title="Verify"
                                  >
                                    <CheckCircle
                                      size={16}
                                      className="text-green-600"
                                    />
                                  </button>
                                  <button
                                    onClick={() => {
                                      setDocumentToDelete(doc);
                                      setShowDeleteConfirm(true);
                                    }}
                                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                                    title="Delete"
                                  >
                                    <Trash2
                                      size={16}
                                      className="text-red-600"
                                    />
                                  </button>
                                </>
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

      {/* Verify Modal */}
      {showVerifyModal && selectedDocument && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Verify Document
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {selectedDocument.fileName}
            </p>

            <div className="space-y-4">
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify("verified")}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    if (!rejectionReason.trim()) {
                      alert("Please enter a rejection reason");
                      return;
                    }
                    handleVerify("rejected");
                  }}
                  disabled={processing}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50"
                >
                  Reject
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rejection Reason (required for reject)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason for rejection..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowVerifyModal(false);
                  setRejectionReason("");
                  setSelectedDocument(null);
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
      {showDeleteConfirm && documentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Document
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this document? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                disabled={processing}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50"
              >
                {processing ? "Deleting..." : "Delete Permanently"}
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDocumentToDelete(null);
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

export default Documents;
