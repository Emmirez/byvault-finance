/* eslint-disable no-unused-vars */
// components/admin/AdminAlertBell.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  AlertTriangle,
  X,
  CheckCircle,
  Clock,
  ChevronRight,
  BellRing,
  AlertOctagon,
  Info,
  CheckCheck,
  Trash2,
  RefreshCw,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { adminAlertService } from "../../../services/adminAlertService";
import { formatDistanceToNow } from "date-fns";

const AdminAlertBell = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [counts, setCounts] = useState({ new: 0, critical: 0 });
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all"); // all | critical | unread
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchAlertCounts();
    const interval = setInterval(fetchAlertCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showDropdown) fetchRecentAlerts();
  }, [showDropdown, filter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchAlertCounts = async () => {
    try {
      const data = await adminAlertService.getAlertCounts();
      setCounts(data);
    } catch (error) {
      console.error("Error fetching alert counts:", error);
    }
  };

  const fetchRecentAlerts = async () => {
    try {
      setLoading(true);
      const params = { limit: 8 };
      if (filter === "critical") params.severity = "critical";
      if (filter === "unread") params.status = "new";
      const data = await adminAlertService.getAlerts(params);
      setAlerts(data.alerts || []);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async (id, e) => {
    e.stopPropagation();
    try {
      await adminAlertService.acknowledgeAlert(id);
      setAlerts((prev) => prev.map((a) => a._id === id ? { ...a, status: "acknowledged" } : a));
      setCounts((prev) => ({ ...prev, new: Math.max(0, prev.new - 1) }));
    } catch (error) {
      console.error("Error acknowledging alert:", error);
    }
  };

  const handleAcknowledgeAll = async () => {
    try {
      await Promise.all(
        alerts.filter((a) => a.status === "new").map((a) => adminAlertService.acknowledgeAlert(a._id))
      );
      setAlerts((prev) => prev.map((a) => ({ ...a, status: "acknowledged" })));
      setCounts((prev) => ({ ...prev, new: 0 }));
    } catch (error) {
      console.error("Error acknowledging all:", error);
    }
  };

  const getSeverityConfig = (severity) => {
    const map = {
      critical: {
        dot: "bg-red-500",
        iconBg: "bg-red-100 dark:bg-red-500/15",
        icon: <AlertOctagon size={15} className="text-red-500" />,
        badge: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
        bar: "bg-red-500",
        ring: "ring-red-200 dark:ring-red-500/20",
      },
      warning: {
        dot: "bg-amber-500",
        iconBg: "bg-amber-100 dark:bg-amber-500/15",
        icon: <AlertTriangle size={15} className="text-amber-500" />,
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
        bar: "bg-amber-500",
        ring: "ring-amber-200 dark:ring-amber-500/20",
      },
      success: {
        dot: "bg-emerald-500",
        iconBg: "bg-emerald-100 dark:bg-emerald-500/15",
        icon: <CheckCircle size={15} className="text-emerald-500" />,
        badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
        bar: "bg-emerald-500",
        ring: "ring-emerald-200 dark:ring-emerald-500/20",
      },
      info: {
        dot: "bg-blue-500",
        iconBg: "bg-blue-100 dark:bg-blue-500/15",
        icon: <Info size={15} className="text-blue-500" />,
        badge: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400",
        bar: "bg-blue-500",
        ring: "ring-blue-200 dark:ring-blue-500/20",
      },
    };
    return map[severity] || map.info;
  };

  const totalNew = counts.new;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-xl transition-all duration-200 ${
          showDropdown
            ? "bg-blue-50 dark:bg-blue-500/10"
            : "hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
        aria-label="Admin alerts"
      >
        <Bell
          size={20}
          className={`transition-all duration-200 ${
            counts.critical > 0
              ? "text-red-500 animate-[wiggle_0.5s_ease-in-out_infinite]"
              : showDropdown
              ? "text-blue-500"
              : "text-gray-600 dark:text-white"
          }`}
        />

        {/* Badge */}
        {totalNew > 0 && (
          <span
            className={`absolute -top-1 -right-1 min-w-[18px] h-[18px] text-white text-[10px] font-bold flex items-center justify-center rounded-full px-1 ${
              counts.critical > 0 ? "bg-red-500" : "bg-blue-500"
            }`}
          >
            {totalNew > 99 ? "99+" : totalNew}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {showDropdown && (
        <div
          className="fixed sm:absolute left-1/2 sm:left-auto -translate-x-1/2 sm:translate-x-0 sm:right-0 top-16 sm:top-full sm:mt-2 w-[92vw] sm:w-[400px] rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 z-[9999] overflow-hidden"
          style={{ animation: "slideDown 0.18s ease-out" }}
        >
          {/* Header */}
          <div className="px-5 pt-4 pb-3 border-b border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-xl flex items-center justify-center">
                  <BellRing size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    Notifications
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500">
                    {counts.new} unread · {counts.critical} critical
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={fetchRecentAlerts}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Refresh"
                >
                  <RefreshCw
                    size={13}
                    className={`text-gray-400 dark:text-gray-500 ${loading ? "animate-spin" : ""}`}
                  />
                </button>
                {counts.new > 0 && (
                  <button
                    onClick={handleAcknowledgeAll}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Mark all read"
                  >
                    <CheckCheck size={13} className="text-blue-500" />
                  </button>
                )}
                <button
                  onClick={() => setShowDropdown(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <X size={13} className="text-gray-400 dark:text-gray-500" />
                </button>
              </div>
            </div>

            {/* Critical Banner */}
            {counts.critical > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-500/10 rounded-xl border border-red-100 dark:border-red-500/20 mb-3">
                <Zap size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {counts.critical} critical alert{counts.critical > 1 ? "s" : ""} need immediate attention
                </p>
              </div>
            )}

            {/* Filter Tabs */}
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-700/60 rounded-xl p-1">
              {["all", "unread", "critical"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 text-[11px] py-1.5 rounded-lg font-medium transition-all capitalize ${
                    filter === f
                      ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                >
                  {f}
                  {f === "unread" && counts.new > 0 && (
                    <span className="ml-1 bg-blue-500 text-white text-[9px] px-1 py-0.5 rounded-full">
                      {counts.new}
                    </span>
                  )}
                  {f === "critical" && counts.critical > 0 && (
                    <span className="ml-1 bg-red-500 text-white text-[9px] px-1 py-0.5 rounded-full">
                      {counts.critical}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Alert List */}
          <div className="max-h-[380px] overflow-y-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3">
                <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <p className="text-xs text-gray-400">Loading alerts...</p>
              </div>
            ) : alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3">
                  <Bell size={28} className="text-gray-300 dark:text-gray-600" />
                </div>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  All clear!
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  No {filter !== "all" ? filter : ""} notifications right now
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                {alerts.map((alert) => {
                  const config = getSeverityConfig(alert.severity);
                  const isNew = alert.status === "new";

                  return (
                    <div
                      key={alert._id}
                      className={`relative flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/40 ${
                        isNew ? "bg-blue-50/40 dark:bg-blue-500/5" : ""
                      }`}
                    >
                      {/* Left severity bar */}
                      {isNew && (
                        <div className={`absolute left-0 top-3 bottom-3 w-0.5 rounded-r-full ${config.bar}`} />
                      )}

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ring-2 ${config.iconBg} ${config.ring}`}>
                        {config.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-0.5">
                          <Link
                            to={alert.actionUrl || "#"}
                            onClick={() => setShowDropdown(false)}
                            className={`text-xs font-semibold leading-tight hover:text-blue-500 transition-colors ${
                              isNew
                                ? "text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          >
                            {alert.title}
                          </Link>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium flex-shrink-0 ${config.badge}`}>
                            {alert.severity}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-1.5">
                          {alert.message}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                            <Clock size={9} />
                            {formatDistanceToNow(new Date(alert.createdAt), { addSuffix: true })}
                          </span>

                          {isNew && (
                            <button
                              onClick={(e) => handleAcknowledge(alert._id, e)}
                              className="flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors font-medium"
                            >
                              <CheckCircle size={10} />
                              Acknowledge
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Unread dot */}
                      {isNew && (
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${config.dot}`} />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-700/20">
            <Link
              to="/admin/alerts"
              onClick={() => setShowDropdown(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 bg-white dark:bg-gray-800 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all group border border-gray-200 dark:border-gray-700"
            >
              <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                View all notifications
              </span>
              <ChevronRight
                size={14}
                className="text-gray-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5 duration-150"
              />
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)  scale(1);    }
        }
        @keyframes wiggle {
          0%,100% { transform: rotate(0deg); }
          25%      { transform: rotate(8deg); }
          75%      { transform: rotate(-8deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminAlertBell;