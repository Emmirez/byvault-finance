/* eslint-disable react-hooks/exhaustive-deps */
// src/components/admin/ActivityTab.jsx
import React, { useState, useEffect } from "react";
import {
  Activity,
  LogIn,
  LogOut,
  RefreshCw,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  User,
  Shield,
  CreditCard,
  FileText,
  Settings,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Globe,
  MapPin,
  DollarSign,
  Ban,
  UserCheck,
  PauseCircle,
} from "lucide-react";
import { activityService } from "../../../services/activityService";


const ActivityTab = ({ userId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [dateRange, setDateRange] = useState("30days");
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 20
  });
  const [stats, setStats] = useState({
    logins: 0,
    transactions: 0,
    updates: 0,
    security: 0
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching activities for user:", userId);
      
      const response = await activityService.getUserActivities(userId, {
        page: pagination.page,
        limit: pagination.limit,
        filter,
        dateRange,
      });
      
      console.log("📥 Activities response:", response);
      
      // Handle the response structure
      if (response && response.success) {
        setActivities(response.activities || []);
        setPagination(response.pagination || { 
          page: 1, 
          total: 0, 
          pages: 1,
          limit: 20 
        });
        setStats(response.stats || {});
      } else if (response && response.activities) {
        setActivities(response.activities);
        setPagination(response.pagination || { 
          page: 1, 
          total: response.activities.length, 
          pages: 1,
          limit: 20 
        });
      }
    } catch (error) {
      console.error("❌ Error fetching activities:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchActivities();
    }
  }, [userId, pagination.page, filter, dateRange]);

  const getActivityIcon = (type) => {
    const icons = {
      login: { 
        icon: LogIn, 
        color: "text-green-500", 
        bg: "bg-green-100 dark:bg-green-900/20",
        label: "Login"
      },
      logout: { 
        icon: LogOut, 
        color: "text-gray-500", 
        bg: "bg-gray-100 dark:bg-gray-700/30",
        label: "Logout"
      },
      deposit: { 
        icon: DollarSign, 
        color: "text-blue-500", 
        bg: "bg-blue-100 dark:bg-blue-900/20",
        label: "Deposit"
      },
      withdraw: { 
        icon: DollarSign, 
        color: "text-orange-500", 
        bg: "bg-orange-100 dark:bg-orange-900/20",
        label: "Withdrawal"
      },
      transfer: { 
        icon: RefreshCw, 
        color: "text-purple-500", 
        bg: "bg-purple-100 dark:bg-purple-900/20",
        label: "Transfer"
      },
      profile_update: { 
        icon: User, 
        color: "text-indigo-500", 
        bg: "bg-indigo-100 dark:bg-indigo-900/20",
        label: "Profile Update"
      },
      admin_block: { 
        icon: Ban, 
        color: "text-red-500", 
        bg: "bg-red-100 dark:bg-red-900/20",
        label: "Blocked"
      },
      admin_unblock: { 
        icon: UserCheck, 
        color: "text-green-500", 
        bg: "bg-green-100 dark:bg-green-900/20",
        label: "Unblocked"
      },
    };
    return icons[type] || { 
      icon: Activity, 
      color: "text-gray-500", 
      bg: "bg-gray-100 dark:bg-gray-700/30",
      label: type || 'Activity'
    };
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return activityDate.toLocaleDateString();
  };

  const StatCard = ({ label, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color.bg}`}>
          <Icon size={18} className={color.text} />
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
        </div>
      </div>
    </div>
  );

  if (loading && activities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-8">
        <div className="flex justify-center items-center">
          <RefreshCw size={24} className="animate-spin text-blue-500" />
          <span className="ml-2 text-gray-500 dark:text-gray-400">Loading activity log...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Logins"
          value={stats.logins || 0}
          icon={LogIn}
          color={{ bg: "bg-green-100 dark:bg-green-900/20", text: "text-green-600 dark:text-green-400" }}
        />
        <StatCard
          label="Transactions"
          value={stats.transactions || 0}
          icon={DollarSign}
          color={{ bg: "bg-blue-100 dark:bg-blue-900/20", text: "text-blue-600 dark:text-blue-400" }}
        />
        <StatCard
          label="Profile Updates"
          value={stats.updates || 0}
          icon={User}
          color={{ bg: "bg-purple-100 dark:bg-purple-900/20", text: "text-purple-600 dark:text-purple-400" }}
        />
        <StatCard
          label="Security Events"
          value={stats.security || 0}
          icon={Shield}
          color={{ bg: "bg-indigo-100 dark:bg-indigo-900/20", text: "text-indigo-600 dark:text-indigo-400" }}
        />
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2">
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Activities</option>
              <option value="login">Logins</option>
              <option value="transaction">Transactions</option>
              <option value="profile">Profile Updates</option>
              <option value="security">Security</option>
              <option value="card">Card Activities</option>
              <option value="kyc">KYC Activities</option>
              <option value="admin">Admin Actions</option>
            </select>

            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPagination({ ...pagination, page: 1 });
              }}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7days">Last 7 days</option>
              <option value="30days">Last 30 days</option>
              <option value="90days">Last 90 days</option>
              <option value="year">Last year</option>
              <option value="all">All time</option>
            </select>
          </div>

          <button
            onClick={fetchActivities}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            title="Refresh"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {activities.length === 0 ? (
            <div className="p-12 text-center">
              <Activity size={48} className="mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">No activities found</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                Try adjusting your filters
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const iconData = getActivityIcon(activity.type);
              const Icon = iconData.icon;
              return (
                <div key={activity._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconData.bg}`}>
                      <Icon size={16} className={iconData.color} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.title || iconData.label}
                        </p>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {getRelativeTime(activity.createdAt)}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        {activity.description}
                      </p>

                      {/* Additional details */}
                      <div className="flex flex-wrap gap-3 text-xs">
                        {activity.ip && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Globe size={12} />
                            {activity.ip}
                          </span>
                        )}
                        {activity.device && (
                          <span className="flex items-center gap-1 text-gray-500">
                            <Smartphone size={12} />
                            {activity.device} • {activity.browser} • {activity.os}
                          </span>
                        )}
                        {activity.amount && (
                          <span className="flex items-center gap-1 font-medium text-gray-900 dark:text-white">
                            ${typeof activity.amount === 'number' ? activity.amount.toLocaleString() : activity.amount}
                          </span>
                        )}
                      </div>

                      {/* Full timestamp */}
                      <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                        {formatDateTime(activity.createdAt)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-700/20">
            <p className="text-sm text-gray-500">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                disabled={pagination.page === 1}
                className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                {pagination.page}
              </span>
              <button
                onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                disabled={pagination.page === pagination.pages}
                className="p-1 rounded border border-gray-300 dark:border-gray-600 disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export Button */}
      {activities.length > 0 && (
        <div className="flex justify-end">
          <button
            onClick={() => {
              const headers = ['Date', 'Type', 'Title', 'Description', 'IP', 'Amount'];
              const csvRows = [
                headers.join(','),
                ...activities.map(a => [
                  new Date(a.createdAt).toISOString(),
                  a.type,
                  `"${a.title || ''}"`,
                  `"${a.description || ''}"`,
                  a.ip || '',
                  a.amount || ''
                ].join(','))
              ];
              const csv = csvRows.join('\n');
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `user-${userId}-activities.csv`;
              a.click();
              window.URL.revokeObjectURL(url);
            }}
            className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <Download size={16} />
            Export Activity Log
          </button>
        </div>
      )}
    </div>
  );
};

export default ActivityTab;