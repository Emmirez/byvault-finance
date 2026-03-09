/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  Check,
  CheckCheck,
  X,
  Clock,
  DollarSign,
  CreditCard,
  Shield,
  AlertCircle,
  ChevronRight,
  Info,
  LogIn,
  Lock,
  FileText,
  Users,
  Gift,
  RefreshCw,
} from "lucide-react";
import { notificationService } from "../../../services/notificationService";


const NotificationBell = ({
  iconSize = 20,
  showCount = true,
  maxDisplay = 5,
  position = "right-0",
  onNotificationClick,
  className = "",
}) => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();

    // Set up polling for real-time updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationService.getUserNotifications(1, false);
      if (response.success) {
        setNotifications(response.notifications || []);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.count);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = (notification) => {
    console.log("Notification clicked:", notification);
    console.log("Action URL:", notification.actionUrl);

    // Mark as read if unread
    if (!notification.read) {
      handleMarkAsRead(notification._id);
    }

    // Navigate to action URL if exists
    if (notification.actionUrl) {
      console.log("Navigating to:", notification.actionUrl);

      // Use setTimeout to ensure any state updates complete
      setTimeout(() => {
        navigate(notification.actionUrl);
      }, 100);
    }

    // Close the dropdown
    setShowDropdown(false);
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      // Account & Security
      login_success: <LogIn size={16} className="text-green-500" />,
      login_new_device: <Shield size={16} className="text-yellow-500" />,
      password_changed: <Lock size={16} className="text-blue-500" />,
      profile_updated: <Info size={16} className="text-blue-500" />,
      two_factor_enabled: <Shield size={16} className="text-green-500" />,
      two_factor_disabled: <Shield size={16} className="text-red-500" />,
      account_locked: <Lock size={16} className="text-red-500" />,

      // Transactions
      transfer_sent: <DollarSign size={16} className="text-orange-500" />,
      transfer_received: <DollarSign size={16} className="text-green-500" />,
      transfer_failed: <AlertCircle size={16} className="text-red-500" />,
      transfer_on_hold: <Clock size={16} className="text-yellow-500" />,
      large_transaction: <AlertCircle size={16} className="text-red-500" />,
      limit_approaching: <Clock size={16} className="text-yellow-500" />,

      // Cards
      card_application_submitted: (
        <CreditCard size={16} className="text-blue-500" />
      ),
      card_approved: <CreditCard size={16} className="text-green-500" />,
      card_dispatched: <CreditCard size={16} className="text-purple-500" />,
      card_activated: <CreditCard size={16} className="text-green-500" />,
      card_blocked: <CreditCard size={16} className="text-red-500" />,
      card_unblocked: <CreditCard size={16} className="text-green-500" />,
      card_expiring_soon: <Clock size={16} className="text-yellow-500" />,
      card_suspicious_activity: (
        <AlertCircle size={16} className="text-red-500" />
      ),

      // Loans
      loan_application_submitted: (
        <FileText size={16} className="text-blue-500" />
      ),
      loan_under_review: <Clock size={16} className="text-yellow-500" />,
      loan_approved: <Check size={16} className="text-green-500" />,
      loan_rejected: <X size={16} className="text-red-500" />,
      loan_disbursed: <DollarSign size={16} className="text-green-500" />,
      loan_payment_due: <Clock size={16} className="text-yellow-500" />,
      loan_payment_received: <Check size={16} className="text-green-500" />,
      loan_payment_late: <AlertCircle size={16} className="text-red-500" />,

      // Grants
      grant_application_submitted: <Gift size={16} className="text-blue-500" />,
      grant_under_review: <Clock size={16} className="text-yellow-500" />,
      grant_approved: <Check size={16} className="text-green-500" />,
      grant_rejected: <X size={16} className="text-red-500" />,
      grant_disbursed: <DollarSign size={16} className="text-green-500" />,

      // Tax Refunds
      tax_refund_submitted: <FileText size={16} className="text-blue-500" />,
      tax_refund_under_review: <Clock size={16} className="text-yellow-500" />,
      tax_refund_approved: <Check size={16} className="text-green-500" />,
      tax_refund_rejected: <X size={16} className="text-red-500" />,
      tax_refund_disbursed: <DollarSign size={16} className="text-green-500" />,

      // Support
      ticket_submitted: <FileText size={16} className="text-blue-500" />,
      ticket_admin_reply: <RefreshCw size={16} className="text-purple-500" />,
      ticket_status_changed: <Info size={16} className="text-blue-500" />,
      ticket_resolved: <Check size={16} className="text-green-500" />,

      // KYC
      kyc_documents_uploaded: <FileText size={16} className="text-blue-500" />,
      kyc_under_review: <Clock size={16} className="text-yellow-500" />,
      kyc_verified: <Check size={16} className="text-green-500" />,
      kyc_rejected: <X size={16} className="text-red-500" />,

      // System
      new_feature: <Info size={16} className="text-purple-500" />,
      maintenance_scheduled: <Clock size={16} className="text-yellow-500" />,
      security_alert: <Shield size={16} className="text-red-500" />,
      promotional_offer: <Gift size={16} className="text-pink-500" />,
      statement_available: <FileText size={16} className="text-blue-500" />,
    };

    return iconMap[type] || <Info size={16} className="text-gray-500" />;
  };

  const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);

    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w ago`;
    const months = Math.floor(days / 30);
    return `${months}mo ago`;
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Bell Button */}
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative transition-colors"
        aria-label="Notifications"
      >
        <Bell size={iconSize} className="text-gray-600 dark:text-gray-300" />
        {showCount && unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            {unreadCount > 9 ? (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                9+
              </span>
            ) : (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div
          className={`absolute ${position} mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-fadeIn`}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell size={16} />
              Notifications
              {unreadCount > 0 && (
                <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Loading...
                </p>
              </div>
            ) : notifications.length > 0 ? (
              notifications.slice(0, maxDisplay).map((notification) => (
                <div
                  key={notification._id}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleNotificationClick(notification);
                  }}
                  className={`p-4 border-b border-gray-100 dark:border-gray-700 last:border-0 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    !notification.read
                      ? "bg-blue-50/50 dark:bg-blue-900/10"
                      : ""
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        !notification.read
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-gray-100 dark:bg-gray-700"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p
                          className={`text-sm font-medium ${
                            !notification.read
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-gray-500 dark:text-gray-500 whitespace-nowrap">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                      {notification.actionText && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                          {notification.actionText}
                          <ChevronRight size={12} />
                        </div>
                      )}
                    </div>
                    {!notification.read && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification._id);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full self-start"
                        aria-label="Mark as read"
                      >
                        <Check size={12} className="text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell
                    size={24}
                    className="text-gray-400 dark:text-gray-500"
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  No notifications
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  You're all caught up!
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700 text-center">
              <button
                onClick={() => {
                  navigate("/notifications");
                  setShowDropdown(false);
                }}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all notifications
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotificationBell;
