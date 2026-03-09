/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Announcements.jsx
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
  AlertCircle,
  Sun,
  Moon,
  Bell,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  Plus,
  Edit,
  Trash2,
  X,
  Send,
  Calendar,
  Users,
  Flag,
  Info,
  AlertTriangle,
  Check,
  Archive,
  Globe,
} from "lucide-react";
import { announcementService } from "../../../services/announcementService";
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

const Announcements = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState([]);
  const [stats, setStats] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [toasts, setToasts] = useState([]);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    type: "info",
    priority: "medium",
    targetAudience: ["all"],
    scheduledAt: "",
    expiresAt: "",
  });

  // Filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    status: "all",
    type: "all",
    priority: "all",
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

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await announcementService.getAllAnnouncements({
        page: filters.page,
        limit: filters.limit,
        status: filters.status,
        type: filters.type,
        priority: filters.priority,
        search: filters.search,
      });

      setAnnouncements(response.announcements || []);
      setPagination(response.pagination || { page: 1, total: 0, pages: 1 });
      setStats(response.stats || null);
    } catch (error) {
      console.error("Error fetching announcements:", error);
      addToast("Failed to fetch announcements", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, [filters.page, filters.status, filters.type, filters.priority]);

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ ...filters, page: 1 });
    fetchAnnouncements();
  };

  const handleCreate = async () => {
    if (!formData.title || !formData.content) {
      addToast("Title and content are required", "error");
      return;
    }

    try {
      setProcessing(true);
      await announcementService.createAnnouncement(formData);
      await fetchAnnouncements();
      setShowCreateModal(false);
      setFormData({
        title: "",
        content: "",
        type: "info",
        priority: "medium",
        targetAudience: ["all"],
        scheduledAt: "",
        expiresAt: "",
      });
      addToast("Announcement created successfully", "success");
    } catch (error) {
      console.error("Error creating announcement:", error);
      addToast("Failed to create announcement", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handlePublish = async (id) => {
    try {
      setProcessing(true);
      await announcementService.publishAnnouncement(id);
      await fetchAnnouncements();
      addToast("Announcement published", "success");
    } catch (error) {
      console.error("Error publishing announcement:", error);
      addToast("Failed to publish", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleArchive = async (id) => {
    try {
      setProcessing(true);
      await announcementService.archiveAnnouncement(id);
      await fetchAnnouncements();
      addToast("Announcement archived", "success");
    } catch (error) {
      console.error("Error archiving announcement:", error);
      addToast("Failed to archive", "error");
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedAnnouncement) return;

    try {
      setProcessing(true);
      await announcementService.deleteAnnouncement(selectedAnnouncement._id);
      await fetchAnnouncements();
      setShowDeleteConfirm(false);
      setSelectedAnnouncement(null);
      addToast("Announcement deleted", "success");
    } catch (error) {
      console.error("Error deleting announcement:", error);
      addToast("Failed to delete", "error");
    } finally {
      setProcessing(false);
    }
  };

  const getTypeIcon = (type) => {
    const map = {
      info: { icon: Info, color: "text-blue-600", bg: "bg-blue-100" },
      warning: {
        icon: AlertTriangle,
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      },
      success: {
        icon: CheckCircle,
        color: "text-green-600",
        bg: "bg-green-100",
      },
      error: { icon: XCircle, color: "text-red-600", bg: "bg-red-100" },
      maintenance: {
        icon: Clock,
        color: "text-purple-600",
        bg: "bg-purple-100",
      },
    };
    const m = map[type] || map.info;
    const Icon = m.icon;
    return <Icon size={16} className={m.color} />;
  };

  const getPriorityBadge = (priority) => {
    const map = {
      low: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
      medium:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      high: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
      critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
    };
    return map[priority] || map.medium;
  };

  const getStatusBadge = (status) => {
    const map = {
      draft: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400",
      published:
        "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      scheduled:
        "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      archived:
        "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
    };
    return map[status] || map.draft;
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString() : "N/A";
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

              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-1">
                Announcements
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
                title="Total"
                value={stats.total || 0}
                icon={Globe}
                color="blue"
              />
              <StatCard
                title="Published"
                value={stats.published || 0}
                icon={CheckCircle}
                color="green"
              />
              <StatCard
                title="Scheduled"
                value={stats.scheduled || 0}
                icon={Calendar}
                color="purple"
              />
              <StatCard
                title="Drafts"
                value={stats.draft || 0}
                icon={Edit}
                color="gray"
              />
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
            >
              <Plus size={16} />
              New Announcement
            </button>

            <button
              onClick={fetchAnnouncements}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search announcements..."
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
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>

                {/* Type Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value, page: 1 })
                  }
                >
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                  <option value="success">Success</option>
                  <option value="error">Error</option>
                  <option value="maintenance">Maintenance</option>
                </select>

                {/* Priority Filter */}
                <select
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  value={filters.priority}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      priority: e.target.value,
                      page: 1,
                    })
                  }
                >
                  <option value="all">All Priorities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
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

          {/* Announcements Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700/60">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Priority
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Audience
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
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
                  ) : announcements.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-4 py-8 text-center text-gray-500"
                      >
                        <Info size={40} className="mx-auto mb-3 opacity-50" />
                        <p>No announcements found</p>
                      </td>
                    </tr>
                  ) : (
                    announcements.map((ann) => (
                      <tr
                        key={ann._id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700/30"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(ann.type)}
                            <span className="text-xs capitalize">
                              {ann.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {ann.title}
                          </p>
                          <p className="text-xs text-gray-500 truncate max-w-xs">
                            {ann.content.substring(0, 50)}...
                          </p>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadge(ann.priority)}`}
                          >
                            {ann.priority}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(ann.status)}`}
                          >
                            {ann.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Users size={14} className="text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {ann.targetAudience.join(", ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(ann.createdAt)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {ann.status === "draft" && (
                              <>
                                <button
                                  onClick={() => handlePublish(ann._id)}
                                  className="p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                                  title="Publish"
                                >
                                  <Send size={16} className="text-green-600" />
                                </button>
                              </>
                            )}
                            {ann.status === "published" && (
                              <button
                                onClick={() => handleArchive(ann._id)}
                                className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/20 rounded"
                                title="Archive"
                              >
                                <Archive
                                  size={16}
                                  className="text-yellow-600"
                                />
                              </button>
                            )}
                            {/* DELETE */}
                            <button
                              onClick={() => {
                                setSelectedAnnouncement(ann);
                                setShowDeleteConfirm(true);
                              }}
                              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-red-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
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

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Announcement
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Announcement title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  rows={5}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Announcement content..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="success">Success</option>
                    <option value="error">Error</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Target Audience
                </label>
                <div className="space-y-2">
                  {["all", "verified", "admins", "users"].map((audience) => (
                    <label key={audience} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.targetAudience.includes(audience)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              targetAudience: [
                                ...formData.targetAudience,
                                audience,
                              ],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              targetAudience: formData.targetAudience.filter(
                                (a) => a !== audience,
                              ),
                            });
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
                        {audience === "all" ? "All Users" : audience}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Schedule (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.scheduledAt}
                    onChange={(e) =>
                      setFormData({ ...formData, scheduledAt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Expires (optional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.expiresAt}
                    onChange={(e) =>
                      setFormData({ ...formData, expiresAt: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={processing || !formData.title || !formData.content}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {processing ? "Creating..." : "Create Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Delete Announcement
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete "{selectedAnnouncement.title}"?
              This action cannot be undone.
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
                  setSelectedAnnouncement(null);
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-white "
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

export default Announcements;
