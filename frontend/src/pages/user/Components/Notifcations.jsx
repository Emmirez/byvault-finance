/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
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
  Filter,
  Trash2,
  ArrowLeft,
  Home,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { notificationService } from "../../../services/notificationService";
import { useDarkMode } from "../../../hooks/useDarkMode";

// ✅ Toast/Notification Component
const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-orange-500",
    info: "bg-blue-600",
  }[type] || "bg-blue-600";

  const Icon = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }[type] || Info;

  return (
    <div className={`fixed top-4 right-4 z-[9999] flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white ${bgColor} animate-slide-in-right`}>
      <Icon size={16} className="flex-shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">
        <X size={14} />
      </button>
    </div>
  );
};

const Notifications = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, unread, read
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  
  // ✅ Toast state
  const [toast, setToast] = useState(null);

  // ✅ Show toast function
  const showToast = (message, type = "info") => {
    setToast({ message, type });
  };

  useEffect(() => {
    fetchNotifications();
  }, [filter, currentPage]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const readParam = filter === "all" ? null : filter === "unread" ? false : true;
      const response = await notificationService.getUserNotifications(currentPage, readParam);
      
      if (response.success) {
        setNotifications(response.notifications || []);
        setTotalPages(response.totalPages || 1);
        setTotal(response.total || 0);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      showToast("Failed to load notifications", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      showToast("Notification marked as read", "success");
    } catch (error) {
      console.error("Error marking as read:", error);
      showToast("Failed to mark as read", "error");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      showToast("All notifications marked as read", "success");
    } catch (error) {
      console.error("Error marking all as read:", error);
      showToast("Failed to mark all as read", "error");
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
      setTotal(prev => prev - 1);
      showToast("Notification deleted", "success");
    } catch (error) {
      console.error("Error deleting notification:", error);
      showToast("Failed to delete notification", "error");
    }
  };

  const handleClearAll = async () => {
    if (notifications.length === 0) return;
    
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      setTotal(0);
      showToast("All notifications cleared", "success");
    } catch (error) {
      console.error("Error clearing notifications:", error);
      showToast("Failed to clear notifications", "error");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getNotificationIcon = (type) => {
    const iconMap = {
      // Account & Security
      login_success: <LogIn size={20} className="text-green-500" />,
      login_new_device: <Shield size={20} className="text-yellow-500" />,
      password_changed: <Lock size={20} className="text-blue-500" />,
      profile_updated: <Info size={20} className="text-blue-500" />,
      two_factor_enabled: <Shield size={20} className="text-green-500" />,
      two_factor_disabled: <Shield size={20} className="text-red-500" />,
      account_locked: <Lock size={20} className="text-red-500" />,
      
      // Transactions
      transfer_sent: <DollarSign size={20} className="text-orange-500" />,
      transfer_received: <DollarSign size={20} className="text-green-500" />,
      transfer_failed: <AlertCircle size={20} className="text-red-500" />,
      transfer_on_hold: <Clock size={20} className="text-yellow-500" />,
      large_transaction: <AlertCircle size={20} className="text-red-500" />,
      limit_approaching: <Clock size={20} className="text-yellow-500" />,
      
      // Cards
      card_application_submitted: <CreditCard size={20} className="text-blue-500" />,
      card_approved: <CreditCard size={20} className="text-green-500" />,
      card_dispatched: <CreditCard size={20} className="text-purple-500" />,
      card_activated: <CreditCard size={20} className="text-green-500" />,
      card_blocked: <CreditCard size={20} className="text-red-500" />,
      card_unblocked: <CreditCard size={20} className="text-green-500" />,
      card_expiring_soon: <Clock size={20} className="text-yellow-500" />,
      card_suspicious_activity: <AlertCircle size={20} className="text-red-500" />,
      
      // Loans
      loan_application_submitted: <FileText size={20} className="text-blue-500" />,
      loan_under_review: <Clock size={20} className="text-yellow-500" />,
      loan_approved: <Check size={20} className="text-green-500" />,
      loan_rejected: <X size={20} className="text-red-500" />,
      loan_disbursed: <DollarSign size={20} className="text-green-500" />,
      loan_payment_due: <Clock size={20} className="text-yellow-500" />,
      loan_payment_received: <Check size={20} className="text-green-500" />,
      loan_payment_late: <AlertCircle size={20} className="text-red-500" />,
      
      // Grants
      grant_application_submitted: <Gift size={20} className="text-blue-500" />,
      grant_under_review: <Clock size={20} className="text-yellow-500" />,
      grant_approved: <Check size={20} className="text-green-500" />,
      grant_rejected: <X size={20} className="text-red-500" />,
      grant_disbursed: <DollarSign size={20} className="text-green-500" />,
      
      // Tax Refunds
      tax_refund_submitted: <FileText size={20} className="text-blue-500" />,
      tax_refund_under_review: <Clock size={20} className="text-yellow-500" />,
      tax_refund_approved: <Check size={20} className="text-green-500" />,
      tax_refund_rejected: <X size={20} className="text-red-500" />,
      tax_refund_disbursed: <DollarSign size={20} className="text-green-500" />,
      
      // Support
      ticket_submitted: <FileText size={20} className="text-blue-500" />,
      ticket_admin_reply: <RefreshCw size={20} className="text-purple-500" />,
      ticket_status_changed: <Info size={20} className="text-blue-500" />,
      ticket_resolved: <Check size={20} className="text-green-500" />,
      
      // KYC
      kyc_documents_uploaded: <FileText size={20} className="text-blue-500" />,
      kyc_under_review: <Clock size={20} className="text-yellow-500" />,
      kyc_verified: <Check size={20} className="text-green-500" />,
      kyc_rejected: <X size={20} className="text-red-500" />,
      
      // System
      new_feature: <Info size={20} className="text-purple-500" />,
      maintenance_scheduled: <Clock size={20} className="text-yellow-500" />,
      security_alert: <Shield size={20} className="text-red-500" />,
      promotional_offer: <Gift size={20} className="text-pink-500" />,
      statement_available: <FileText size={20} className="text-blue-500" />,
    };

    return iconMap[type] || <Info size={20} className="text-gray-500" />;
  };

  const getTypeLabel = (type) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* ✅ Toast Notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Notifications"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64 pb-24">
          <div className="max-w-3xl mx-auto p-4 lg:p-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Stay updated with your account activity
                </p>
              </div>
              <div className="flex items-center gap-2">
                {/* Filter Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowFilterMenu(!showFilterMenu)}
                    className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Filter size={18} className="text-gray-600 dark:text-gray-400" />
                  </button>
                  
                  {showFilterMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
                      <button
                        onClick={() => { setFilter("all"); setShowFilterMenu(false); setCurrentPage(1); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          filter === "all" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        All Notifications
                      </button>
                      <button
                        onClick={() => { setFilter("unread"); setShowFilterMenu(false); setCurrentPage(1); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          filter === "unread" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Unread
                      </button>
                      <button
                        onClick={() => { setFilter("read"); setShowFilterMenu(false); setCurrentPage(1); }}
                        className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                          filter === "read" ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        Read
                      </button>
                    </div>
                  )}
                </div>

                {/* Mark All as Read */}
                <button
                  onClick={handleMarkAllAsRead}
                  className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm text-gray-700 dark:text-gray-300"
                >
                  <CheckCheck size={16} />
                  <span className="hidden sm:inline">Mark all read</span>
                </button>

                {/* Clear All */}
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-sm text-red-600 dark:text-red-400"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Clear all</span>
                  </button>
                )}
              </div>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{total}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Unread</p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {notifications.filter(n => !n.read).length}
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">Read</p>
                <p className="text-xl font-bold text-green-600 dark:text-green-400">
                  {notifications.filter(n => n.read).length}
                </p>
              </div>
            </div>

            {/* Notifications List */}
            {loading ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all ${
                      !notification.read ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        !notification.read 
                          ? 'bg-blue-100 dark:bg-blue-900/30' 
                          : 'bg-gray-100 dark:bg-gray-700'
                      }`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-semibold ${
                                !notification.read 
                                  ? 'text-gray-900 dark:text-white' 
                                  : 'text-gray-600 dark:text-gray-400'
                              }`}>
                                {notification.title}
                              </h3>
                              {notification.priority === 'high' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-medium rounded-full">
                                  High Priority
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-gray-500 dark:text-gray-500">
                                {formatDate(notification.createdAt)}
                              </span>
                              <span className="text-gray-400 dark:text-gray-600">•</span>
                              <span className="text-gray-500 dark:text-gray-500 capitalize">
                                {getTypeLabel(notification.type)}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-1">
                            {!notification.read && (
                              <button
                                onClick={() => handleMarkAsRead(notification._id)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                title="Mark as read"
                              >
                                <Check size={16} className="text-gray-500" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteNotification(notification._id)}
                              className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={16} className="text-gray-500 hover:text-red-500" />
                            </button>
                          </div>
                        </div>

                        {/* Action Link */}
                        {notification.actionUrl && (
                          <button
                            onClick={() => navigate(notification.actionUrl)}
                            className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {notification.actionText || 'View Details'}
                            <ChevronRight size={12} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-6">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 text-sm"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg disabled:opacity-50 text-sm"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bell size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Notifications
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You don't have any {filter !== 'all' ? filter : ''} notifications at the moment.
                </p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <Home size={18} />
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      {/* animation styles */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default Notifications;