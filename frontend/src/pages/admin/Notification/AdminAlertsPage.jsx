/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// pages/admin/AdminAlertsPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Bell, AlertTriangle, CheckCircle, XCircle, Clock,
  Filter, Search, X, CheckCheck, Trash2, Eye, ChevronLeft,
  ChevronRight, RefreshCw, Info, Shield, DollarSign, UserPlus,
  ArrowLeftRight, AlertCircle, AlertOctagon, Sun, Moon, Zap,
} from "lucide-react";
import { adminAlertService } from "../../../services/adminAlertService";
import { formatDistanceToNow } from "date-fns";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminAlertBell from "./AdminAlertBell";


const Toast = ({ toasts, removeToast }) => (
  <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map((toast) => (
      <div key={toast.id} className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white max-w-sm
        ${toast.type === "success" ? "bg-green-600" : toast.type === "error" ? "bg-red-600" : toast.type === "warning" ? "bg-orange-500" : "bg-blue-600"}`}>
        {toast.type === "success" && <CheckCircle size={16} className="flex-shrink-0" />}
        {toast.type === "error"   && <XCircle     size={16} className="flex-shrink-0" />}
        {(toast.type === "info" || toast.type === "warning") && <AlertCircle size={16} className="flex-shrink-0" />}
        <span className="flex-1">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-70"><X size={14} /></button>
      </div>
    ))}
  </div>
);


const ConfirmModal = ({ open, title, message, confirmLabel, danger, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${danger ? "bg-red-100 dark:bg-red-900/30" : "bg-blue-100 dark:bg-blue-900/30"}`}>
          {danger ? <Trash2 size={22} className="text-red-500" /> : <AlertCircle size={22} className="text-blue-500" />}
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel}
            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors ${danger ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>
            {confirmLabel || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

const getSeverityConfig = (severity) => {
  const map = {
    critical: { icon: <AlertOctagon size={14} className="text-red-500" />,    badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",             dot: "bg-red-500" },
    warning:  { icon: <AlertTriangle size={14} className="text-amber-500" />, badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",       dot: "bg-amber-500" },
    success:  { icon: <CheckCircle size={14} className="text-emerald-500" />, badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400", dot: "bg-emerald-500" },
    info:     { icon: <Info size={14} className="text-blue-500" />,           badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",             dot: "bg-blue-500" },
  };
  return map[severity] || map.info;
};

const getTypeIcon = (type) => {
  switch (type) {
    case "deposit_request":
    case "large_deposit":         return <DollarSign    size={13} className="text-green-500" />;
    case "kyc_pending":           return <Shield        size={13} className="text-yellow-500" />;
    case "failed_login_attempts": return <AlertTriangle size={13} className="text-red-500" />;
    case "user_blocked":          return <UserPlus      size={13} className="text-red-500" />;
    case "large_transfer":        return <ArrowLeftRight size={13} className="text-purple-500" />;
    default:                      return <Bell          size={13} className="text-blue-500" />;
  }
};

const StatCard = ({ title, value, icon: Icon, iconColor, iconBg }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  </div>
);

const AdminAlertsPage = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [toasts, setToasts]   = useState([]);
  const [alerts, setAlerts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAlerts, setSelectedAlerts] = useState([]);
  const [filters, setFilters] = useState({ status: "all", severity: "", type: "", search: "" });
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1, new: 0, critical: 0 });
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [confirmModal, setConfirmModal] = useState({ open: false, title: "", message: "", confirmLabel: "", danger: false, onConfirm: null });

  const closeConfirm = () => setConfirmModal((c) => ({ ...c, open: false }));
  const openConfirm  = (opts) => setConfirmModal({ open: true, ...opts });

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  };
  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));


  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const params = { page: pagination.page, limit: 20 };

      // "unread" tab — send both read=false AND status=new to cover both API conventions
      if (filters.status === "unread") {
        params.read   = false;
        params.status = "new";
      } else if (filters.status && filters.status !== "all") {
        params.status = filters.status;
      }
      // "all" — send no status param so backend returns everything

      if (filters.severity) params.severity = filters.severity;
      if (filters.type)     params.type     = filters.type;
      if (filters.search)   params.search   = filters.search;

      const response = await adminAlertService.getAlerts(params);
      setAlerts(response.alerts || []);

      const pag = response.pagination || {};
      setPagination({
        total:    pag.total    ?? response.total    ?? response.count   ?? (response.alerts?.length ?? 0),
        page:     pag.page     ?? pagination.page,
        pages:    pag.pages    ?? pag.totalPages    ?? 1,
        new:      pag.new      ?? pag.unread        ?? response.unread  ?? response.new ?? 0,
        critical: pag.critical ?? response.critical ?? 0,
      });
    } catch {
      addToast("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAlerts(); }, [filters.status, filters.severity, filters.type, pagination.page]);


  const handleMarkAsRead = async (id) => {
    try { await adminAlertService.markAsRead(id); fetchAlerts(); addToast("Marked as read", "success"); }
    catch { addToast("Failed", "error"); }
  };

  const handleMarkAllRead = async () => {
    try { await adminAlertService.markAllAsRead(); fetchAlerts(); addToast("All marked as read", "success"); }
    catch { addToast("Failed", "error"); }
  };

  const handleBulkRead = async () => {
    try { await adminAlertService.bulkAcknowledge(selectedAlerts); setSelectedAlerts([]); fetchAlerts(); addToast("Marked as read", "success"); }
    catch { addToast("Failed", "error"); }
  };

  const handleDelete = (id) => {
    openConfirm({
      title: "Delete Notification",
      message: "Are you sure you want to delete this notification? This cannot be undone.",
      confirmLabel: "Delete",
      danger: true,
      onConfirm: async () => {
        closeConfirm();
        try { await adminAlertService.deleteAlert(id); fetchAlerts(); addToast("Notification deleted", "success"); }
        catch { addToast("Failed to delete", "error"); }
      },
    });
  };

  const handleClearAll = () => {
    openConfirm({
      title: "Clear All Notifications",
      message: "This will permanently delete ALL notifications. This action cannot be undone.",
      confirmLabel: "Clear All",
      danger: true,
      onConfirm: async () => {
        closeConfirm();
        try { await adminAlertService.clearAllAlerts(); fetchAlerts(); addToast("All notifications cleared", "success"); }
        catch { addToast("Failed to clear", "error"); }
      },
    });
  };

  const handleSelectAll   = () => setSelectedAlerts(selectedAlerts.length === alerts.length ? [] : alerts.map((a) => a._id));
  const handleSelectAlert = (id) => setSelectedAlerts((prev) => prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]);

  const STATUS_TABS = ["all", "unread", "read"];

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />
      <ConfirmModal {...confirmModal} onCancel={closeConfirm} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">

        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4">
                <ArrowLeft size={20} className="text-gray-700 dark:text-white" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1">Notifications</h1>
              <div className="flex items-center gap-2">
                <button onClick={fetchAlerts} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <RefreshCw size={18} className={`text-gray-600 dark:text-white ${loading ? "animate-spin" : ""}`} />
                </button>
                <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  {darkMode ? <Sun size={20} className="text-white" /> : <Moon size={20} className="text-gray-700" />}
                </button>
                <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">

          {/* Stat Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <StatCard title="Total"    value={pagination.total}                  icon={Bell}        iconBg="bg-blue-100 dark:bg-blue-900/30"    iconColor="text-blue-600 dark:text-blue-400" />
            <StatCard title="Unread"   value={pagination.new}                    icon={Clock}       iconBg="bg-yellow-100 dark:bg-yellow-900/30" iconColor="text-yellow-600 dark:text-yellow-400" />
            <StatCard title="Resolved" value={pagination.total - pagination.new} icon={CheckCircle} iconBg="bg-green-100 dark:bg-green-900/30"  iconColor="text-green-600 dark:text-green-400" />
          </div>

          {/* Critical Banner */}
          {pagination.critical > 0 && (
            <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl mb-6">
              <Zap size={16} className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                {pagination.critical} critical notification{pagination.critical > 1 ? "s" : ""} require immediate attention
              </p>
            </div>
          )}

          {/* Main Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">

            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
              <div className="flex gap-1 bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1 self-start">
                {STATUS_TABS.map((tab) => (
                  <button key={tab}
                    onClick={() => { setFilters({ ...filters, status: tab }); setPagination((p) => ({ ...p, page: 1 })); }}
                    className={`px-3 py-1.5 text-xs rounded-lg font-medium transition-all capitalize ${
                      filters.status === tab
                        ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                    }`}>
                    {tab}
                    {tab === "unread" && pagination.new > 0 && (
                      <span className="ml-1.5 bg-blue-500 text-white text-[9px] px-1.5 py-0.5 rounded-full">{pagination.new}</span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {selectedAlerts.length > 0 && (
                  <button onClick={handleBulkRead} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg font-medium">
                    <CheckCheck size={13} /> Mark {selectedAlerts.length} read
                  </button>
                )}
                {pagination.new > 0 && (
                  <button onClick={handleMarkAllRead} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs rounded-lg font-medium">
                    <CheckCheck size={13} /> Mark all read
                  </button>
                )}
                <button onClick={handleClearAll} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg font-medium">
                  <Trash2 size={13} /> Clear all
                </button>
                <button onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`p-2 rounded-lg border transition-colors ${showFilterPanel ? "bg-blue-50 border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30" : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"}`}>
                  <Filter size={15} className={showFilterPanel ? "text-blue-500" : "text-gray-500 dark:text-gray-400"} />
                </button>
              </div>
            </div>

            {/* Filter Panel */}
            {showFilterPanel && (
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                    <input type="text" placeholder="Search notifications..." value={filters.search}
                      onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400" />
                  </div>
                  <select value={filters.severity} onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Severities</option>
                    <option value="critical">Critical</option>
                    <option value="warning">Warning</option>
                    <option value="info">Info</option>
                    <option value="success">Success</option>
                  </select>
                  <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                    className="px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Types</option>
                    <option value="kyc_pending">KYC Pending</option>
                    <option value="large_deposit">Large Deposit</option>
                    <option value="large_transfer">Large Transfer</option>
                    <option value="failed_login_attempts">Failed Logins</option>
                    <option value="user_blocked">User Blocked</option>
                    <option value="deposit_request">Deposit Request</option>
                  </select>
                </div>
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3">
                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">Loading notifications...</p>
                </div>
              ) : alerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3">
                    <Bell size={28} className="text-gray-300 dark:text-gray-600" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">No notifications found</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {filters.status !== "all" ? "Try the 'All' tab to see everything" : "You're all caught up!"}
                  </p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/60">
                    <tr>
                      <th className="w-10 px-4 py-3">
                        <input type="checkbox" checked={selectedAlerts.length === alerts.length && alerts.length > 0}
                          onChange={handleSelectAll} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      </th>
                      {["Severity", "Type", "Title", "Message", "Time", "Status", "Actions"].map((h) => (
                        <th key={h} className={`px-4 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide ${h === "Actions" ? "text-right" : "text-left"}`}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {alerts.map((alert) => {
                      const config = getSeverityConfig(alert.severity);
                      const isNew  = alert.status === "new" || alert.status === "unread" || alert.read === false;
                      return (
                        <tr key={alert._id} className={`transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40 ${isNew ? "bg-blue-50/40 dark:bg-blue-500/5" : ""}`}>
                          <td className="px-4 py-3">
                            <input type="checkbox" checked={selectedAlerts.includes(alert._id)} onChange={() => handleSelectAlert(alert._id)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-medium ${config.badge}`}>
                              {config.icon}<span className="capitalize">{alert.severity}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className="inline-flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                              {getTypeIcon(alert.type)}
                              <span className="capitalize">{alert.type?.replace(/_/g, " ")}</span>
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {isNew && <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />}
                              <span className={`text-sm font-medium ${isNew ? "text-gray-900 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}>
                                {alert.title}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 max-w-[200px]">
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{alert.message}</p>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
                              <Clock size={11} />
                              {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium ${
                              isNew ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400"
                                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                            }`}>
                              {isNew ? "unread" : "read"}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              {isNew && (
                                <button onClick={() => handleMarkAsRead(alert._id)}
                                  className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 rounded-lg transition-colors" title="Mark as read">
                                  <CheckCheck size={14} className="text-emerald-600" />
                                </button>
                              )}
                              {alert.actionUrl && (
                                <Link to={alert.actionUrl}
                                  className="p-1.5 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View">
                                  <Eye size={14} className="text-blue-600" />
                                </Link>
                              )}
                              <button onClick={() => handleDelete(alert._id)}
                                className="p-1.5 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                <Trash2 size={14} className="text-red-500" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Page {pagination.page} of {pagination.pages} · {pagination.total} total
                </p>
                <div className="flex items-center gap-1">
                  <button onClick={() => setPagination((p) => ({ ...p, page: Math.max(1, p.page - 1) }))}
                    disabled={pagination.page === 1}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
                    <ChevronLeft size={15} className="dark:text-white" />
                  </button>
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg font-medium">{pagination.page}</span>
                  <button onClick={() => setPagination((p) => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                    disabled={pagination.page === pagination.pages}
                    className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 transition-colors">
                    <ChevronRight size={15} className="dark:text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <AdminBottomNav />
      </div>
    </div>
  );
};

export default AdminAlertsPage;