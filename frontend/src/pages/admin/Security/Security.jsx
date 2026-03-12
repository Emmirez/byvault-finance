/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Security.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  RefreshCw,
  Sun,
  Moon,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Shield,
  Lock,
  Key,
  Clock,
  Globe,
  Smartphone,
  Laptop,
  Tablet,
  Users,
  Eye,
  EyeOff,
  Download,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Flag,
  Activity,
  UserCheck,
  UserX,
  LogOut
} from "lucide-react";
import { securityService } from "../../../services/securityService";
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

const Security = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toasts, setToasts] = useState([]);
  const [editedValues, setEditedValues] = useState({});

  // Logs filters
  const [logFilters, setLogFilters] = useState({
    page: 1,
    limit: 50,
    type: "all",
    search: "",
  });

  const [logPagination, setLogPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
  });

  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "logs", label: "Security Logs", icon: Clock },
    { id: "settings", label: "Settings", icon: Shield },
    { id: "sessions", label: "Active Sessions", icon: Laptop },
  ];

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchStats = async () => {
    try {
      const response = await securityService.getSecurityStats();
      setStats(response.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await securityService.getSecurityLogs({
        page: logFilters.page,
        limit: logFilters.limit,
        type: logFilters.type,
      });
      setLogs(response.logs || []);
      setLogPagination(response.pagination || { page: 1, total: 0, pages: 1 });
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await securityService.getSecuritySettings();
      setSettings(response.settings || []);
      
      // Initialize edited values
      const initialEdits = {};
      response.settings?.forEach(setting => {
        initialEdits[setting.key] = setting.value;
      });
      setEditedValues(initialEdits);
    } catch (error) {
      console.error("Error fetching settings:", error);
    }
  };

  const fetchSessions = async () => {
    try {
      const response = await securityService.getActiveSessions();
      setSessions(response.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchLogs(),
        fetchSettings(),
        fetchSessions(),
      ]);
      setLoading(false);
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (activeTab === "logs") {
      fetchLogs();
    } else if (activeTab === "settings") {
      fetchSettings();
    } else if (activeTab === "sessions") {
      fetchSessions();
    }
  }, [activeTab, logFilters.page, logFilters.type]);

  const handleSaveSetting = async (key) => {
    try {
      await securityService.updateSecuritySetting(key, editedValues[key]);
      await fetchSettings();
      addToast("Setting updated successfully", "success");
    } catch (error) {
      console.error("Error saving setting:", error);
      addToast("Failed to update setting", "error");
    }
  };

  const handleRevokeSession = async (userId, sessionId) => {
    try {
      await securityService.revokeSession(userId, sessionId);
      await fetchSessions();
      addToast("Session revoked successfully", "success");
    } catch (error) {
      console.error("Error revoking session:", error);
      addToast("Failed to revoke session", "error");
    }
  };

  const getDeviceIcon = (device) => {
    if (device?.toLowerCase().includes("mobile")) return <Smartphone size={16} />;
    if (device?.toLowerCase().includes("tablet")) return <Tablet size={16} />;
    return <Laptop size={16} />;
  };

  const getLogIcon = (type) => {
    const icons = {
      login: { icon: UserCheck, color: "text-green-600", bg: "bg-green-100" },
      login_failed: { icon: UserX, color: "text-red-600", bg: "bg-red-100" },
      logout: { icon: LogOut, color: "text-gray-600", bg: "bg-gray-100" },
      two_factor_enabled: { icon: Shield, color: "text-blue-600", bg: "bg-blue-100" },
      two_factor_disabled: { icon: Shield, color: "text-orange-600", bg: "bg-orange-100" },
      password_change: { icon: Key, color: "text-purple-600", bg: "bg-purple-100" },
    };
    const defaultIcon = { icon: Activity, color: "text-gray-600", bg: "bg-gray-100" };
    const item = icons[type] || defaultIcon;
    const Icon = item.icon;
    return <Icon size={14} className={item.color} />;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const StatCard = ({ title, value, icon: Icon, color, suffix = "" }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-2">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${color}-100 dark:bg-${color}-900/20`}>
          <Icon size={16} className={`text-${color}-600 dark:text-${color}-400`} />
        </div>
        <span className="text-xs text-gray-500 dark:text-gray-400">{title}</span>
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-white">
        {value}{suffix}
      </p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

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
                <ArrowLeft size={20} className="dark:text-white" />
              </button>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-10">
                Security
              </h1>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleDarkMode }
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

        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
          <nav className="flex gap-4 min-w-max px-4 sm:px-6 lg:px-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && stats && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="2FA Adoption"
                  value={stats.twoFAPercentage}
                  icon={Shield}
                  color="green"
                  suffix="%"
                />
                <StatCard
                  title="Login Attempts (24h)"
                  value={stats.loginAttempts24h}
                  icon={Activity}
                  color="blue"
                />
                <StatCard
                  title="Failed Logins (24h)"
                  value={stats.failedLogins24h}
                  icon={UserX}
                  color="red"
                />
                <StatCard
                  title="Success Rate"
                  value={stats.successRate24h}
                  icon={CheckCircle}
                  color="green"
                  suffix="%"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  title="Unique IPs (24h)"
                  value={stats.uniqueIPs24h}
                  icon={Globe}
                  color="purple"
                />
                <StatCard
                  title="Blocked Accounts"
                  value={stats.blockedAccounts}
                  icon={Lock}
                  color="red"
                />
                <StatCard
                  title="Suspended Accounts"
                  value={stats.suspendedAccounts}
                  icon={Clock}
                  color="orange"
                />
                <StatCard
                  title="Total Users"
                  value={stats.totalUsers}
                  icon={Users}
                  color="blue"
                />
              </div>

              {/* Top IPs */}
              {stats.topIPs?.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Top IP Addresses
                  </h3>
                  <div className="space-y-3">
                    {stats.topIPs.map((ip, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {ip._id || 'Unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            Last seen: {new Date(ip.lastSeen).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                          {ip.count} attempts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === "logs" && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex flex-wrap gap-3">
                  <select
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    value={logFilters.type}
                    onChange={(e) => setLogFilters({ ...logFilters, type: e.target.value, page: 1 })}
                  >
                    <option value="all">All Events</option>
                    <option value="login">Login Success</option>
                    <option value="login_failed">Login Failed</option>
                    <option value="logout">Logout</option>
                    <option value="two_factor_enabled">2FA Enabled</option>
                    <option value="two_factor_disabled">2FA Disabled</option>
                    <option value="password_change">Password Change</option>
                  </select>
                </div>
              </div>

              {/* Logs Table */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700/60">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {logs.map((log) => (
                        <tr key={log._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {formatDate(log.createdAt)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">
                                  {log.user?.firstName?.charAt(0) || 'U'}
                                </span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {log.user?.firstName} {log.user?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{log.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getLogIcon(log.type)}
                              <span className="text-sm text-gray-900 dark:text-white capitalize">
                                {log.type?.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                            {log.ip || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getDeviceIcon(log.device)}
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {log.device || 'Unknown'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              log.type === 'login_failed' 
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              {log.type === 'login_failed' ? 'Failed' : 'Success'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {logPagination.pages > 1 && (
                  <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                      Page {logPagination.page} of {logPagination.pages}
                    </p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setLogFilters({ ...logFilters, page: logFilters.page - 1 })}
                        disabled={logFilters.page === 1}
                        className="p-1 rounded border border-gray-300 disabled:opacity-40"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                        {logFilters.page}
                      </span>
                      <button
                        onClick={() => setLogFilters({ ...logFilters, page: logFilters.page + 1 })}
                        disabled={logFilters.page === logPagination.pages}
                        className="p-1 rounded border border-gray-300 disabled:opacity-40"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              {settings.map((setting) => (
                <div
                  key={setting._id}
                  className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {setting.key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </h3>
                      {setting.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          {setting.description}
                        </p>
                      )}
                    </div>
                    {editedValues[setting.key] !== setting.value && (
                      <button
                        onClick={() => handleSaveSetting(setting.key)}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                      >
                        Save
                      </button>
                    )}
                  </div>

                  <div className="max-w-md">
                    {setting.type === "boolean" ? (
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setEditedValues({ ...editedValues, [setting.key]: true })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            editedValues[setting.key] === true
                              ? "bg-green-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setEditedValues({ ...editedValues, [setting.key]: false })}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                            editedValues[setting.key] === false
                              ? "bg-red-600 text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <input
                        type="number"
                        value={editedValues[setting.key] || ''}
                        onChange={(e) => setEditedValues({ ...editedValues, [setting.key]: parseInt(e.target.value) })}
                        min={setting.validation?.min}
                        max={setting.validation?.max}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Sessions Tab */}
          {activeTab === "sessions" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-700/60">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                    {sessions.map((session, index) => (
                      <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 text-sm font-medium">
                                {session.name?.charAt(0) || 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {session.name}
                              </p>
                              <p className="text-xs text-gray-500">{session.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {getDeviceIcon(session.device)}
                            <div>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {session.device || 'Unknown'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {session.browser} • {session.os}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {session.ip}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">
                          {new Date(session.lastActive).toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => handleRevokeSession(session.userId, `session-${index}`)}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs font-medium"
                          >
                            Revoke
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <AdminBottomNav />
      </div>
    </div>
  );
};

export default Security;