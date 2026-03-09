// pages/admin/SystemLogs.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Terminal,
  RefreshCw,
  Filter,
  Trash2,
  Clock,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AdminBottomNav from "../Components/AdminBottomNav";

const SystemLogs = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  // Mock data for now - you can replace with real API call later
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setLogs([
        {
          id: 1,
          type: "error",
          message: "Database connection timeout",
          timestamp: new Date(Date.now() - 5 * 60000),
          details: "MongoDB connection failed after 5 retries",
        },
        {
          id: 2,
          type: "warning",
          message: "High memory usage detected",
          timestamp: new Date(Date.now() - 15 * 60000),
          details: "Memory usage at 85%",
        },
        {
          id: 3,
          type: "info",
          message: "Server started successfully",
          timestamp: new Date(Date.now() - 60 * 60000),
          details: "Server version 1.0.0",
        },
        {
          id: 4,
          type: "error",
          message: "Failed login attempts spike",
          timestamp: new Date(Date.now() - 120 * 60000),
          details: "15 failed attempts from IP 192.168.1.100",
        },
      ]);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const getTypeColor = (type) => {
    switch (type) {
      case "error":
        return "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400 border-l-4 border-red-500";
      case "warning":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400 border-l-4 border-yellow-500";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400 border-l-4 border-blue-500";
    }
  };

  const filteredLogs = logs.filter((log) =>
    filter === "all" ? true : log.type === filter,
  );

  const handleRefresh = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {" "}
      {/* ✅ Added pb-20 for bottom nav */}
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header with >_ symbol */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft
                size={20}
                className="text-gray-700 dark:text-gray-300"
              />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2 ml-8">
                System Logs
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Monitor system events and errors
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Refresh"
            >
              <RefreshCw
                size={18}
                className={`text-gray-600 dark:text-gray-400 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Clear Logs"
            >
              <Trash2 size={18} className="text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilter("error")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "error"
                ? "bg-red-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Errors
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "warning"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Warnings
          </button>
          <button
            onClick={() => setFilter("info")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "info"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            Info
          </button>
        </div>

        {/* Logs Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading system logs...
              </p>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mb-3">
                <Terminal
                  size={28}
                  className="text-gray-400 dark:text-gray-500"
                />
              </div>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                No logs found
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                System is running smoothly
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <div key={log.id} className={`p-4 ${getTypeColor(log.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize bg-white/20">
                        {log.type}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {log.message}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock size={12} />
                      {formatDistanceToNow(log.timestamp, { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                    {log.details}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Health Card */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              System Status
            </p>
            <p className="text-lg font-semibold text-green-600 dark:text-green-400">
              ● Healthy
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Uptime
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              99.9%
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              Last Error
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              2h ago
            </p>
          </div>
        </div>
      </div>
      {/* ✅ Added Bottom Navigation */}
      <AdminBottomNav />
    </div>
  );
};

export default SystemLogs;
