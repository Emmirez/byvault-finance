/* eslint-disable no-unused-vars */
// pages/admin/Users.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  Ban,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Users as UsersIcon,
  PauseCircle,
  CheckCircle,
  X,
  Trash2,
  Bell,
  Moon,
  Sun,
  ArrowLeft,
  Clock,
  XCircle,
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import { useDebounce } from "../../../hooks/useDebounce";
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

// Confirm Action Modal
const ConfirmModal = ({ action, user, onConfirm, onCancel }) => {
  const config = {
    block: {
      color: "red",
      icon: Ban,
      label: "Block",
      desc: `Block ${user?.name || user?.email}? They won't be able to access their account.`,
    },
    unblock: {
      color: "green",
      icon: UserCheck,
      label: "Unblock",
      desc: `Unblock ${user?.name || user?.email}? They'll regain access to their account.`,
    },
    suspend: {
      color: "orange",
      icon: PauseCircle,
      label: "Suspend",
      desc: `Suspend ${user?.name || user?.email}? They'll be temporarily restricted.`,
    },
    unsuspend: {
      color: "green",
      icon: CheckCircle,
      label: "Reactivate",
      desc: `Reactivate ${user?.name || user?.email}? They'll regain access to their account.`,
    },
    delete: {
      color: "red",
      icon: Trash2,
      label: "Delete",
      desc: `Permanently delete ${user?.name || user?.email}? This cannot be undone.`,
    },
  };
  const c = config[action];
  if (!c) return null;
  const Icon = c.icon;

  const colorMap = {
    red: {
      bg: "bg-red-100 dark:bg-red-900/30",
      icon: "text-red-600 dark:text-red-400",
      btn: "bg-red-600 hover:bg-red-700",
    },
    green: {
      bg: "bg-green-100 dark:bg-green-900/30",
      icon: "text-green-600 dark:text-green-400",
      btn: "bg-green-600 hover:bg-green-700",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-900/30",
      icon: "text-orange-600 dark:text-orange-400",
      btn: "bg-orange-500 hover:bg-orange-600",
    },
  };
  const cm = colorMap[c.color];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-fade-in">
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-11 h-11 rounded-full ${cm.bg} flex items-center justify-center flex-shrink-0`}
          >
            <Icon size={20} className={cm.icon} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {c.label} User
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {c.desc}
            </p>
            {action === "suspend" && user?.suspendedUntil && (
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                Suspended until:{" "}
                {new Date(user.suspendedUntil).toLocaleString()}
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2.5 rounded-xl ${cm.btn} text-white text-sm font-medium transition-colors flex items-center justify-center gap-2`}
          >
            <Icon size={14} /> {c.label}
          </button>
        </div>
      </div>
    </div>
  );
};

// Updated Status Badge component that checks both status and flags
const StatusBadge = ({ user }) => {
  // Determine status based on available fields
  let status = "active";
  let expiryInfo = null;

  if (user.isBlocked) {
    status = "blocked";
  } else if (user.isSuspended) {
    status = "suspended";
    if (user.suspendedUntil) {
      const expiryDate = new Date(user.suspendedUntil);
      const now = new Date();
      if (expiryDate > now) {
        const hoursLeft = Math.round((expiryDate - now) / (1000 * 60 * 60));
        expiryInfo = `${hoursLeft}h left`;
      }
    }
  } else if (user.status) {
    status = user.status;
  } else if (user.isVerified === false) {
    status = "pending";
  }

  const map = {
    active: {
      cls: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
      dot: "bg-green-500",
      label: "Active",
    },
    pending: {
      cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
      dot: "bg-yellow-500",
      label: "Pending",
    },
    blocked: {
      cls: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
      dot: "bg-red-500",
      label: "Blocked",
    },
    suspended: {
      cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
      dot: "bg-orange-500",
      label: "Suspended",
    },
    inactive: {
      cls: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
      dot: "bg-gray-400",
      label: "Inactive",
    },
  };

  const s = map[status] || map.inactive;

  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.cls}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
        {s.label}
      </span>
      {expiryInfo && (
        <span className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1">
          <Clock size={12} />
          {expiryInfo}
        </span>
      )}
    </div>
  );
};

//  Main Component
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [confirmModal, setConfirmModal] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendData, setSuspendData] = useState({
    userId: null,
    reason: "",
    duration: "",
  });
  const [toasts, setToasts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    blocked: 0,
    suspended: 0,
    pending: 0,
  });

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [filters, setFilters] = useState({ status: "", search: "", role: "" });
  const debouncedSearch = useDebounce(filters.search, 500);

  // Reset to page 1 whenever filters or search change
  const setFiltersAndReset = (newFilters) => {
    setFilters(newFilters);
    setPagination((p) => ({ ...p, page: 1 }));
  };

  // Fetch global stats from backend (unaffected by current filters)
  const fetchStats = useCallback(async () => {
    try {
      const [allRes, blockedRes, suspendedRes, pendingRes] = await Promise.all([
        adminApi.getUsers({ page: 1, limit: 1 }),
        adminApi.getUsers({ page: 1, limit: 1, status: "blocked" }),
        adminApi.getUsers({ page: 1, limit: 1, status: "suspended" }),
        adminApi.getUsers({ page: 1, limit: 1, status: "pending" }),
      ]);

      const getTotal = (res) => {
        if (res?.pagination?.total !== undefined) return res.pagination.total;
        if (Array.isArray(res)) return res.length;
        if (res?.data) return res.data.length;
        return 0;
      };

      const total = getTotal(allRes);
      const blocked = getTotal(blockedRes);
      const suspended = getTotal(suspendedRes);
      const pending = getTotal(pendingRes);

      setStats({
        total,
        active: Math.max(0, total - blocked - suspended - pending),
        blocked,
        suspended,
        pending,
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...(filters.status && { status: filters.status }),
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(filters.role && { role: filters.role }),
      };
      const response = await adminApi.getUsers(params);
      if (response) {
        if (Array.isArray(response)) {
          setUsers(response);
          setPagination((p) => ({
            ...p,
            total: response.length,
            pages: Math.ceil(response.length / 10),
          }));
        } else if (response.users && Array.isArray(response.users)) {
          setUsers(response.users);
          setPagination({
            page: response.pagination?.page || 1,
            limit: response.pagination?.limit || 10,
            total: response.pagination?.total || response.users.length,
            pages:
              response.pagination?.pages ||
              Math.ceil(response.users.length / 10),
          });
        } else if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
          setPagination((p) => ({
            ...p,
            total: response.data.length,
            pages: Math.ceil(response.data.length / 10),
          }));
        } else {
          setUsers([]);
        }
      }
    } catch (err) {
      if (err.message === "Unauthorized") {
        setError("Session expired. Please login again.");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        setError(err.message || "Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    filters.status,
    filters.role,
    debouncedSearch,
  ]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  // Handle suspend with reason and duration
  const handleSuspend = async () => {
    const { userId, reason, duration } = suspendData;

    try {
      setLoading(true);
      const durationHours = duration ? parseInt(duration) : null;
      await adminApi.suspendUser(userId, reason, durationHours);
      await Promise.all([fetchUsers(), fetchStats()]);
      setShowSuspendModal(false);
      setSuspendData({ userId: null, reason: "", duration: "" });
      addToast("User suspended successfully.", "success");
    } catch (err) {
      console.error("Failed to suspend user:", err);
      addToast(`Failed to suspend user: ${err.message}`, "error");
    } finally {
      setLoading(false);
    }
  };

  // Execute action based on modal
  const executeAction = async () => {
    const { action, user } = confirmModal;
    const userId = user._id;

    if (!userId) {
      addToast("Error: User ID not found", "error");
      setConfirmModal(null);
      return;
    }

    try {
      if (action === "block") {
        await adminApi.blockUser(userId);
        addToast("User blocked successfully.", "success");
      } else if (action === "unblock") {
        await adminApi.unblockUser(userId);
        addToast("User unblocked successfully.", "success");
      } else if (action === "suspend") {
        setConfirmModal(null);
        setSuspendData({ ...suspendData, userId });
        setShowSuspendModal(true);
        return;
      } else if (action === "unsuspend") {
        await adminApi.unsuspendUser(userId);
        addToast("User reactivated successfully.", "success");
      } else if (action === "delete") {
        await adminApi.deleteUser(userId);
        addToast("User deleted successfully.", "success");
      }

      await Promise.all([fetchUsers(), fetchStats()]);
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
      addToast(`Failed to ${action} user: ${err.message}`, "error");
    } finally {
      setConfirmModal(null);
    }
  };

  const openConfirm = (action, user) => {
    setConfirmModal({ action, user });
  };

  if (error) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
          <div className="p-6 flex items-center justify-center">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-8 max-w-md w-full text-center">
              <AlertCircle className="text-red-500 mx-auto mb-4" size={40} />
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
                Failed to Load Users
              </h3>
              <p className="text-red-600 dark:text-red-400 text-sm mb-6">
                {error}
              </p>
              <button
                onClick={fetchUsers}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
          <AdminBottomNav />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0">
        {/* Custom Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              {/* Left */}
              <div className="flex items-center flex-shrink-0">
                <button
                  onClick={() => window.history.back()}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft
                    size={24}
                    className="text-gray-700 dark:text-gray-300"
                  />
                </button>
              </div>

              {/* Center */}
              <div className="flex-1 flex justify-center px-4 pr-12 min-w-0 ml-8">
                <h1 className="text-xl font-bold text-gray-900 dark:text-white truncate">
                  Users Panel
                </h1>
              </div>

              {/* Right */}
              <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                <button
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark mode"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {darkMode ? (
                    <Sun size={20} className="text-gray-600 dark:text-white" />
                  ) : (
                    <Moon size={20} className="text-gray-600 dark:text-white" />
                  )}
                </button>

                <AdminAlertBell />

                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-screen-xl mx-auto">
          {/* Page info & refresh */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {stats.total.toLocaleString()} total users on the platform
            </p>
            <button
              onClick={fetchUsers}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
            >
              <RefreshCw
                size={15}
                className={
                  loading ? "animate-spin text-blue-500" : "text-gray-500"
                }
              />
              Refresh
            </button>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
            {[
              {
                label: "Total",
                value: stats.total,
                color: "blue",
                icon: UsersIcon,
                filterValue: "",
              },
              {
                label: "Active",
                value: stats.active,
                color: "green",
                icon: CheckCircle,
                filterValue: "active",
              },
              {
                label: "Pending",
                value: stats.pending,
                color: "yellow",
                icon: Clock,
                filterValue: "pending",
              },
              {
                label: "Blocked",
                value: stats.blocked,
                color: "red",
                icon: Ban,
                filterValue: "blocked",
              },
              {
                label: "Suspended",
                value: stats.suspended,
                color: "orange",
                icon: PauseCircle,
                filterValue: "suspended",
              },
            ].map(({ label, value, color, icon: Icon, filterValue }) => (
              <button
                key={label}
                onClick={() =>
                  setFiltersAndReset({ ...filters, status: filterValue })
                }
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 border shadow-sm text-left transition-all
                  ${
                    filters.status === filterValue
                      ? "border-blue-500 ring-2 ring-blue-300 dark:ring-blue-700"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    {label}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center
                    ${color === "blue" ? "bg-blue-100 dark:bg-blue-900/40" : ""}
                    ${color === "green" ? "bg-green-100 dark:bg-green-900/40" : ""}
                    ${color === "yellow" ? "bg-yellow-100 dark:bg-yellow-900/40" : ""}
                    ${color === "red" ? "bg-red-100 dark:bg-red-900/40" : ""}
                    ${color === "orange" ? "bg-orange-100 dark:bg-orange-900/40" : ""}
                  `}
                  >
                    <Icon
                      size={15}
                      className={
                        color === "blue"
                          ? "text-blue-600 dark:text-blue-400"
                          : color === "green"
                            ? "text-green-600 dark:text-green-400"
                            : color === "yellow"
                              ? "text-yellow-600 dark:text-yellow-400"
                              : color === "red"
                                ? "text-red-600 dark:text-red-400"
                                : "text-orange-500 dark:text-orange-400"
                      }
                    />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </p>
              </button>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 mb-4 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search by name, email, or ID..."
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  value={filters.search}
                  onChange={(e) =>
                    setFiltersAndReset({ ...filters, search: e.target.value })
                  }
                />
                {filters.search && (
                  <button
                    onClick={() =>
                      setFiltersAndReset({ ...filters, search: "" })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <select
                className="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.status}
                onChange={(e) =>
                  setFiltersAndReset({ ...filters, status: e.target.value })
                }
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="blocked">Blocked</option>
                <option value="suspended">Suspended</option>
                <option value="inactive">Inactive</option>
              </select>

              {/* Role filter */}
              <select
                className="px-3 py-2.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={filters.role}
                onChange={(e) =>
                  setFiltersAndReset({ ...filters, role: e.target.value })
                }
              >
                <option value="">All Roles</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/60 border-b border-gray-200 dark:border-gray-700">
                    {[
                      "User",
                      "Status",
                      "Role",
                      "Balance",
                      "Joined",
                      "Actions",
                    ].map((h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider ${i === 5 ? "text-right" : "text-left"}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                  {loading
                    ? [...Array(5)].map((_, i) => (
                        <tr key={i}>
                          {[...Array(6)].map((_, j) => (
                            <td key={j} className="px-5 py-4">
                              <div
                                className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
                                style={{
                                  width:
                                    j === 0
                                      ? "160px"
                                      : j === 5
                                        ? "80px"
                                        : "80px",
                                }}
                              />
                            </td>
                          ))}
                        </tr>
                      ))
                    : (() => {
                        const displayedUsers =
                          filters.status === "active"
                            ? users.filter(
                                (u) =>
                                  !u.isBlocked &&
                                  !u.isSuspended &&
                                  u.status !== "blocked" &&
                                  u.status !== "suspended" &&
                                  u.status !== "pending",
                              )
                            : filters.status === "pending"
                              ? users.filter(
                                  (u) =>
                                    u.status === "pending" ||
                                    (!u.isVerified &&
                                      !u.isBlocked &&
                                      !u.isSuspended &&
                                      u.status !== "active" &&
                                      u.status !== "blocked" &&
                                      u.status !== "suspended"),
                                )
                              : users;

                        if (displayedUsers.length === 0) {
                          return (
                            <tr>
                              <td
                                colSpan="6"
                                className="px-5 py-16 text-center"
                              >
                                <UsersIcon
                                  size={36}
                                  className="mx-auto mb-3 text-gray-300 dark:text-gray-600"
                                />
                                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                                  No users found
                                </p>
                                <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                                  Try adjusting your filters
                                </p>
                              </td>
                            </tr>
                          );
                        }

                        return displayedUsers.map((user) => {
                          const userId = user._id;
                          if (!userId) return null;

                          const isBlocked =
                            user.isBlocked || user.status === "blocked";
                          const isSuspended =
                            user.isSuspended || user.status === "suspended";

                          return (
                            <tr
                              key={userId}
                              className="hover:bg-gray-50/60 dark:hover:bg-gray-700/30 transition-colors group"
                            >
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm">
                                    <span className="text-white text-sm font-semibold">
                                      {(user.name || user.email || "U")
                                        .charAt(0)
                                        .toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                                      {user.name || "—"}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                      {user.email}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <StatusBadge user={user} />
                              </td>
                              <td className="px-5 py-4">
                                <span
                                  className={`text-xs font-medium px-2 py-1 rounded-md
                              ${
                                user.role === "superadmin"
                                  ? "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400"
                                  : user.role === "admin"
                                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400"
                                    : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                              }
                            `}
                                >
                                  {user.role || "user"}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                  $
                                  {(
                                    user.balanceFiat ||
                                    user.balance ||
                                    0
                                  ).toLocaleString()}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                  {user.createdAt
                                    ? new Date(
                                        user.createdAt,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "—"}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center justify-end gap-1">
                                  <button
                                    onClick={() =>
                                      (window.location.href = `/admin/users/${userId}`)
                                    }
                                    className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                    title="View Details"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  {isBlocked ? (
                                    <button
                                      onClick={() =>
                                        openConfirm("unblock", user)
                                      }
                                      className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                      title="Unblock User"
                                    >
                                      <UserCheck size={15} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => openConfirm("block", user)}
                                      className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                      title="Block User"
                                    >
                                      <Ban size={15} />
                                    </button>
                                  )}
                                  {isSuspended ? (
                                    <button
                                      onClick={() =>
                                        openConfirm("unsuspend", user)
                                      }
                                      className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors"
                                      title="Reactivate User"
                                    >
                                      <CheckCircle size={15} />
                                    </button>
                                  ) : (
                                    !isBlocked && (
                                      <button
                                        onClick={() =>
                                          openConfirm("suspend", user)
                                        }
                                        className="p-2 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                                        title="Suspend User"
                                      >
                                        <PauseCircle size={15} />
                                      </button>
                                    )
                                  )}
                                  <button
                                    onClick={() => openConfirm("delete", user)}
                                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                                    title="Delete User"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/20">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Showing{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {(pagination.page - 1) * pagination.limit + 1}
                  </span>{" "}
                  –{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium text-gray-900 dark:text-white">
                    {pagination.total}
                  </span>{" "}
                  users
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page - 1 }))
                    }
                    disabled={pagination.page === 1}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  {[...Array(Math.min(pagination.pages, 5))].map((_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setPagination((p) => ({ ...p, page }))}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                          pagination.page === page
                            ? "bg-blue-600 text-white shadow-sm"
                            : "border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <button
                    onClick={() =>
                      setPagination((p) => ({ ...p, page: p.page + 1 }))
                    }
                    disabled={pagination.page === pagination.pages}
                    className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
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

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Suspend User
              </h3>
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setSuspendData({ userId: null, reason: "", duration: "" });
                }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason for suspension
                </label>
                <textarea
                  value={suspendData.reason}
                  onChange={(e) =>
                    setSuspendData({ ...suspendData, reason: e.target.value })
                  }
                  placeholder="Enter suspension reason..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (hours) - leave empty for permanent
                </label>
                <input
                  type="number"
                  value={suspendData.duration}
                  onChange={(e) =>
                    setSuspendData({ ...suspendData, duration: e.target.value })
                  }
                  placeholder="e.g., 24 for 1 day, 168 for 1 week"
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Leave empty for permanent suspension
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSuspend}
                  disabled={!suspendData.reason || loading}
                  className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Suspending..." : "Suspend User"}
                </button>
                <button
                  onClick={() => {
                    setShowSuspendModal(false);
                    setSuspendData({ userId: null, reason: "", duration: "" });
                  }}
                  className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {confirmModal && (
        <ConfirmModal
          action={confirmModal.action}
          user={confirmModal.user}
          onConfirm={executeAction}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.96) translateY(-4px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.15s ease-out; }
      `}</style>
    </div>
  );
};

export default Users;
