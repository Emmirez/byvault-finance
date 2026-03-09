/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// pages/admin/UserDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  DollarSign,
  Shield,
  Key,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Ban,
  UserCheck,
  PauseCircle,
  Trash2,
  Edit,
  Save,
  X,
  RefreshCw,
  FileText,
  CreditCard,
  ArrowLeftRight,
  Activity,
  Sun,
  Moon,
  Bell,
} from "lucide-react";
import adminApi from "../../../services/adminApi";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import TransactionsTable from "../Transactions/TransactionsTable";
import TransactionDetailsModal from "../Transactions/TransactionDetailsModal";
import KYCTab from "../KYC/KYCTab";
import CardsTab from "../Card/CardTab";
import ActivityTab from "../ActivityTab/ActivityTab";
import { kycService } from "../../../services/kycService";
import { useDarkMode } from "../../../hooks/useDarkMode";
import AdminHeader from "../Components/AdminHeader";
import EditTransactionModal from "../Transactions/EditTransactionModal";

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

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [updating, setUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [suspendData, setSuspendData] = useState({ reason: "", duration: "" });
  const [showTimestampModal, setShowTimestampModal] = useState(false);
  const [newTimestamp, setNewTimestamp] = useState("");
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceData, setBalanceData] = useState({ type: "", amount: "" });
  const [toasts, setToasts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showEditTransactionModal, setShowEditTransactionModal] =
    useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState(null);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.getUserDetails(id);

      if (response) {
        let userData;
        if (response.user) {
          userData = response.user;
        } else if (response.data) {
          userData = response.data;
        } else {
          userData = response;
        }

        // Fetch KYC data to get the status
        try {
          const kycResponse = await kycService.getKYCByUserId(id);
          if (kycResponse?.kyc) {
            // Add KYC status to user data
            userData.kycStatus = kycResponse.kyc.status;
            userData.kycData = kycResponse.kyc; // Store full KYC data if needed
          } else {
            userData.kycStatus = "not_submitted";
          }
        } catch (kycError) {
          console.error("Error fetching KYC status:", kycError);
          userData.kycStatus = "not_submitted";
        }

        setUser(userData);

        // Set transactions if they exist in the response
        if (response.transactions) {
          setTransactions(response.transactions);
        }
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      if (err.message === "Unauthorized") {
        setError("Session expired. Please login again.");
        setTimeout(() => navigate("/admin/login"), 2000);
      } else {
        setError(err.message || "Failed to load user details");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const handleEditTransaction = (transaction) => {
    setTransactionToEdit(transaction);
    setShowEditTransactionModal(true);
  };

  // Add this handler function
  const handleTransactionUpdated = (updatedTransaction) => {
    console.log("Transaction updated from API:", updatedTransaction);

    // Map transactionDate to createdAt if needed
    const processedTransaction = {
      ...updatedTransaction,
      createdAt:
        updatedTransaction.createdAt || updatedTransaction.transactionDate,
    };

    console.log(
      "Processed transaction with createdAt:",
      processedTransaction.createdAt,
    );

    // Update the transaction in the transactions list
    setTransactions((prevTransactions) =>
      prevTransactions.map((tx) =>
        tx._id === processedTransaction._id ? processedTransaction : tx,
      ),
    );

    // Update the selected transaction if the modal is open
    if (selectedTransaction?._id === processedTransaction._id) {
      setSelectedTransaction(processedTransaction);
    }

    addToast("Transaction updated successfully", "success");
  };

  const handleTimestampUpdate = async () => {
    try {
      setUpdating(true);

      await adminApi.updateUserTimestamp(id, newTimestamp);

      await fetchUserDetails();

      setShowTimestampModal(false);
      addToast("Account creation date updated successfully!", "success");
    } catch (err) {
      console.error("❌ Timestamp update error:", err);
      addToast(`Failed to update timestamp: ${err.message}`, "error");
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    if (!user) return;

    setEditForm((prev) => ({
      ...prev,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }));
  }, [user?.createdAt, user?.updatedAt]);

  const handleEdit = () => {
    let bankDetails = {};

    if (user.bankDetails) {
      if (typeof user.bankDetails === "string") {
        try {
          bankDetails = JSON.parse(user.bankDetails);
        } catch (e) {
          console.error("Error parsing bank details string:", e);
          bankDetails = {};
        }
      } else if (typeof user.bankDetails === "object") {
        bankDetails = user.bankDetails;
      }
    }

    const formData = {
      // Personal Information
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      middleName: user.middleName || "",
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().split("T")[0]
        : "",

      // Account Information
      accountId: user.accountId || "",
      accountNumber: user.accountNumber || user.accountId || "",
      accountType: user.accountType || "savings",
      currency: user.currency || "USD",

      // Balances
      balanceFiat: user.balanceFiat || 0,
      balanceBTC: user.balanceBTC || 0,

      // Role and Status
      role: user.role || "user",
      isVerified: user.isVerified || false,
      status: user.status || "pending",

      // Security
      twoFactorEnabled: user.twoFactorEnabled || false,

      // Bank Details - Use the exact field names from your database
      bankName: bankDetails.bankName || "",
      bankAccountName: bankDetails.accountName || "",
      bankAccountNumber: bankDetails.accountNumber || "",
      routingNumber: bankDetails.routingNumber || "",
      swiftCode: bankDetails.swiftCode || "",
      iban: bankDetails.iban || "",
      bankAddress: bankDetails.bankAddress || "",

      // Crypto
      btcDepositAddress: user.btcDepositAddress || "",

      // Metadata
      createdAt: user.createdAt || "",
      updatedAt: user.updatedAt || "",
    };

    setEditForm(formData);
    setEditing(true);
  };

  const handleSaveEdit = async () => {
    try {
      setUpdating(true);

      const updateData = {
        // Personal info
        firstName: editForm.firstName,
        lastName: editForm.lastName,
        middleName: editForm.middleName,
        username: editForm.username,
        email: editForm.email,
        phone: editForm.phone,
        address: editForm.address,
        dateOfBirth: editForm.dateOfBirth,

        // Account settings
        accountType: editForm.accountType,
        currency: editForm.currency,

        // Balances
        balanceFiat: editForm.balanceFiat,
        balanceBTC: editForm.balanceBTC,

        // Role and status
        role: editForm.role,
        isVerified: editForm.isVerified,
        status: editForm.status,

        // Security
        twoFactorEnabled: editForm.twoFactorEnabled,

        // BTC Address
        btcDepositAddress: editForm.btcDepositAddress,

        // Bank details
        bankDetails: {
          bankName: editForm.bankName,
          accountName: editForm.bankAccountName,
          accountNumber: editForm.bankAccountNumber,
          routingNumber: editForm.routingNumber,
          swiftCode: editForm.swiftCode,
          iban: editForm.iban,
          bankAddress: editForm.bankAddress,
        },
      };

      // Remove undefined or empty values
      Object.keys(updateData).forEach((key) => {
        if (updateData[key] === undefined || updateData[key] === "") {
          delete updateData[key];
        }
      });

      if (updateData.bankDetails) {
        const hasBankDetails = Object.values(updateData.bankDetails).some(
          (val) => val && val !== "",
        );
        if (!hasBankDetails) {
          delete updateData.bankDetails;
        }
      }

      const response = await adminApi.updateUser(id, updateData);

      await fetchUserDetails();
      setEditing(false);

      addToast("User updated successfully!", "success");
    } catch (err) {
      console.error("❌ Update error:", err);
      addToast(`Failed to update user: ${err.message}`, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleBalanceUpdate = (type) => {
    setBalanceData({ type, amount: "" });
    setShowBalanceModal(true);
  };

  const executeBalanceUpdate = async () => {
    if (!balanceData.amount) return;
    try {
      setUpdating(true);
      await adminApi.updateUserBalance(
        id,
        parseFloat(balanceData.amount),
        balanceData.type,
      );
      await fetchUserDetails();
      setShowBalanceModal(false);
      setBalanceData({ type: "", amount: "" });
      addToast("Balance updated successfully!", "success");
    } catch (err) {
      addToast(`Failed to update balance: ${err.message}`, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleStatusAction = async (action) => {
    if (action === "delete") {
      setShowDeleteConfirm(true);
      return;
    }

    if (action === "suspend") {
      setPendingAction("suspend");
      setShowSuspendModal(true);
      return;
    }

    if (action === "block") {
      setPendingAction("block");
      setShowReasonModal(true);
      return;
    }

    await executeStatusAction(action);
  };

  const executeStatusAction = async (action, reason = "", duration = null) => {
    try {
      setUpdating(true);

      switch (action) {
        case "block":
          await adminApi.blockUser(id, reason);
          break;
        case "unblock":
          await adminApi.unblockUser(id);
          break;
        case "suspend":
          await adminApi.suspendUser(id, reason, duration);
          break;
        case "unsuspend":
          await adminApi.unsuspendUser(id);
          break;
        case "activate":
          await adminApi.activateUser(id);
          break;
        case "delete":
          await adminApi.deleteUser(id);
          navigate("/admin/users", {
            state: { message: "User deleted successfully" },
          });
          return;
        default:
          break;
      }

      await fetchUserDetails();
      setShowReasonModal(false);
      setShowSuspendModal(false);
      setPendingAction(null);
      setActionReason("");
      setSuspendData({ reason: "", duration: "" });
    } catch (err) {
      addToast(`Failed to ${action} user: ${err.message}`, "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleSuspend = () => {
    const duration = suspendData.duration
      ? parseInt(suspendData.duration)
      : null;
    executeStatusAction("suspend", suspendData.reason, duration);
  };

  const getStatusBadge = (status) => {
    const map = {
      active: {
        bg: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
        icon: CheckCircle,
      },
      pending: {
        bg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400",
        icon: Clock,
      },
      blocked: {
        bg: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
        icon: Ban,
      },
      suspended: {
        bg: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400",
        icon: PauseCircle,
      },
      inactive: {
        bg: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
        icon: AlertCircle,
      },
    };
    const s = map[status?.toLowerCase()] || map.inactive;
    const Icon = s.icon;

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${s.bg}`}
      >
        <Icon size={12} />
        {status || "inactive"}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const map = {
      superadmin:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
      admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      user: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${map[role] || map.user}`}
      >
        {role || "user"}
      </span>
    );
  };

  if (loading) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center px-4">
            <RefreshCw
              size={40}
              className="animate-spin text-blue-500 mx-auto mb-4"
            />
            <p className="text-gray-500 dark:text-gray-400">
              Loading user details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6 sm:p-8 max-w-md w-full text-center">
            <AlertCircle className="text-red-500 mx-auto mb-4" size={48} />
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
              Failed to Load User
            </h3>
            <p className="text-red-600 dark:text-red-400 text-sm mb-6 break-words">
              {error}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={fetchUserDetails}
                className="px-6 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => navigate("/admin/users")}
                className="px-6 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isBlocked = user.isBlocked || user.status === "blocked";
  const isSuspended = user.isSuspended || user.status === "suspended";
  const isActive = !isBlocked && !isSuspended;

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 lg:pb-0 overflow-x-hidden">
        {/* Header */}
        <AdminHeader
          title="User Profile"
          showBackButton={true}
          showDarkMode={true}
          showNotifications={true}
          showProfile={true}
        />

        <div className="px-3 sm:px-4 lg:px-8 py-4 sm:py-6 max-w-7xl mx-auto w-full">
          {/* User Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl sm:text-2xl font-bold shadow-lg flex-shrink-0">
                  {(user.name || user.email || "U").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white break-words">
                      {user.name || "No name provided"}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {getStatusBadge(user.status)}
                      {getRoleBadge(user.role)}
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1 break-all">
                      <Mail size={14} className="flex-shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </span>
                    {user.phone && (
                      <span className="flex items-center gap-1">
                        <Phone size={14} className="flex-shrink-0" />{" "}
                        {user.phone}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="flex-shrink-0" />
                      Joined{" "}
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-2 lg:flex-shrink-0">
                <button
                  onClick={handleEdit}
                  className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium flex items-center gap-2"
                >
                  <Edit size={16} />{" "}
                  <span className="hidden xs:inline">Edit</span>
                </button>
                <button
                  onClick={() => handleStatusAction("delete")}
                  className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 size={16} />{" "}
                  <span className="hidden xs:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tabs - Horizontal scroll on mobile */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto">
            <nav className="flex gap-4 sm:gap-6 min-w-max px-1">
              {[
                { id: "overview", label: "Overview", icon: UserIcon },
                {
                  id: "transactions",
                  label: "Transactions",
                  icon: ArrowLeftRight,
                },
                { id: "kyc", label: "KYC", icon: FileText },
                { id: "cards", label: "Cards", icon: CreditCard },
                { id: "activity", label: "Activity", icon: Activity },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 px-1 text-xs sm:text-sm font-medium border-b-2 transition-colors flex items-center gap-1 sm:gap-2 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600 dark:text-blue-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  <tab.icon size={14} className="sm:size-16" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                      <DollarSign
                        size={14}
                        className="sm:size-16 text-green-600 dark:text-green-400"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Balance
                    </span>
                  </div>
                  <p className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate">
                    ${(user.balanceFiat || user.balance || 0).toLocaleString()}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                      <Key
                        size={14}
                        className="sm:size-16 text-blue-600 dark:text-blue-400"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      KYC
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white capitalize truncate">
                    {user.kycStatus || "Not submitted"}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-purple-100 dark:bg-purple-900/40 rounded-lg flex items-center justify-center">
                      <Shield
                        size={14}
                        className="sm:size-16 text-purple-600 dark:text-purple-400"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      2FA
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white">
                    {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 sm:gap-3 mb-2">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-orange-100 dark:bg-orange-900/40 rounded-lg flex items-center justify-center">
                      <Clock
                        size={14}
                        className="sm:size-16 text-orange-600 dark:text-orange-400"
                      />
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Last Login
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">
                    {user.lastLogin
                      ? new Date(user.lastLogin).toLocaleDateString()
                      : "Never"}
                  </p>
                </div>
              </div>

              {/* Edit Form or View Mode */}
              {editing ? (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Edit User Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Account Information - Read-only fields */}
                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                        Account Information (Read-only)
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account ID
                      </label>
                      <input
                        type="text"
                        value={editForm.accountId || ""}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Account ID cannot be edited
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={editForm.accountNumber || ""}
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Account number cannot be edited
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setNewTimestamp(
                          user.createdAt
                            ? new Date(user.createdAt)
                                .toISOString()
                                .slice(0, 16)
                            : "",
                        );
                        setShowTimestampModal(true);
                      }}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Clock size={16} /> Edit Creation Date
                    </button>

                    {/* Time creation */}
                    {showTimestampModal && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            Edit Account Creation Date
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                            Warning: Changing this date affects account age and
                            may impact system calculations.
                          </p>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                New Creation Date
                              </label>
                              <input
                                type="datetime-local"
                                value={newTimestamp}
                                onChange={(e) =>
                                  setNewTimestamp(e.target.value)
                                }
                                max={new Date().toISOString().slice(0, 16)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Current:{" "}
                                {user.createdAt
                                  ? new Date(user.createdAt).toLocaleString()
                                  : "N/A"}
                              </p>
                            </div>

                            {/* Update the button in the modal */}
                            <div className="flex gap-3 mt-6">
                              <button
                                onClick={handleTimestampUpdate}
                                disabled={!newTimestamp || updating}
                                className="flex-1 px-4 py-2.5 bg-purple-600 text-white rounded-xl hover:bg-purple-700 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                              >
                                {updating ? (
                                  <>
                                    <RefreshCw
                                      size={16}
                                      className="animate-spin"
                                    />
                                    Updating...
                                  </>
                                ) : (
                                  "Update Date"
                                )}
                              </button>
                              <button
                                onClick={() => setShowTimestampModal(false)}
                                disabled={updating}
                                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium disabled:opacity-50 darK:text-white"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Updated
                      </label>
                      <input
                        type="text"
                        value={
                          editForm.updatedAt
                            ? new Date(editForm.updatedAt).toLocaleString()
                            : ""
                        }
                        readOnly
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white cursor-not-allowed"
                      />
                    </div>

                    {/* Personal Information - Editable */}
                    <div className="col-span-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                        Personal Information
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            firstName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="First name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, lastName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Last name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        value={editForm.middleName || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            middleName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Middle name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Username
                      </label>
                      <input
                        type="text"
                        value={editForm.username || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, username: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Username"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={editForm.email || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Email address"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, phone: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Phone number"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <textarea
                        value={editForm.address || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, address: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={2}
                        placeholder="Full address"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        value={editForm.dateOfBirth || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            dateOfBirth: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    {/* Account Settings - Editable */}
                    <div className="col-span-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                        Account Settings
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Type
                      </label>
                      <select
                        value={editForm.accountType || "savings"}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            accountType: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="savings">Savings</option>
                        <option value="checking">Checking</option>
                        <option value="business">Business</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Currency
                      </label>
                      <select
                        value={editForm.currency || "USD"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, currency: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="JPY">JPY - Japanese Yen</option>
                        <option value="CAD">CAD - Canadian Dollar</option>
                        <option value="AUD">AUD - Australian Dollar</option>
                        <option value="CHF">CHF - Swiss Franc</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Balance (Fiat)
                      </label>
                      <input
                        type="number"
                        value={editForm.balanceFiat}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            balanceFiat: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        BTC Balance
                      </label>
                      <input
                        type="number"
                        value={editForm.balanceBTC}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            balanceBTC: parseFloat(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00000000"
                        step="0.00000001"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        BTC Deposit Address
                      </label>
                      <input
                        type="text"
                        value={editForm.btcDepositAddress || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            btcDepositAddress: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="BTC deposit address"
                      />
                    </div>

                    {/* Role and Status */}
                    <div className="col-span-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                        Role & Status
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Role
                      </label>
                      <select
                        value={editForm.role || "user"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="superadmin">Super Admin</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Verification Status
                      </label>
                      <select
                        value={editForm.isVerified ? "verified" : "pending"}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            isVerified: e.target.value === "verified",
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Status
                      </label>
                      <select
                        value={editForm.status || "pending"}
                        onChange={(e) =>
                          setEditForm({ ...editForm, status: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="active">Active</option>
                        <option value="pending">Pending</option>
                        <option value="blocked">Blocked</option>
                        <option value="suspended">Suspended</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Two-Factor Auth
                      </label>
                      <select
                        value={
                          editForm.twoFactorEnabled ? "enabled" : "disabled"
                        }
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            twoFactorEnabled: e.target.value === "enabled",
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="disabled">Disabled</option>
                        <option value="enabled">Enabled</option>
                      </select>
                    </div>

                    {/* Bank Details */}
                    <div className="col-span-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">
                        Bank Details
                      </h4>
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bank Name
                      </label>
                      <input
                        type="text"
                        value={editForm.bankName || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, bankName: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Bank name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Name
                      </label>
                      <input
                        type="text"
                        value={editForm.bankAccountName || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bankAccountName: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Account holder name"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Account Number
                      </label>
                      <input
                        type="text"
                        value={editForm.bankAccountNumber || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bankAccountNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Bank account number"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Routing Number
                      </label>
                      <input
                        type="text"
                        value={editForm.routingNumber || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            routingNumber: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Routing number"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        SWIFT Code
                      </label>
                      <input
                        type="text"
                        value={editForm.swiftCode || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            swiftCode: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="SWIFT code"
                      />
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        IBAN
                      </label>
                      <input
                        type="text"
                        value={editForm.iban || ""}
                        onChange={(e) =>
                          setEditForm({ ...editForm, iban: e.target.value })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="IBAN"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Bank Address
                      </label>
                      <textarea
                        value={editForm.bankAddress || ""}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            bankAddress: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        rows={2}
                        placeholder="Bank address"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      onClick={handleSaveEdit}
                      disabled={updating}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      {updating ? (
                        <RefreshCw size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium dark:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account Actions
                  </h3>
                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    {isActive && (
                      <>
                        <button
                          onClick={() => handleStatusAction("block")}
                          className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-xs sm:text-sm font-medium flex items-center gap-2"
                        >
                          <Ban size={16} /> Block
                        </button>
                        <button
                          onClick={() => handleStatusAction("suspend")}
                          className="px-3 sm:px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-xs sm:text-sm font-medium flex items-center gap-2"
                        >
                          <PauseCircle size={16} /> Suspend
                        </button>
                      </>
                    )}

                    {isBlocked && (
                      <button
                        onClick={() => executeStatusAction("unblock")}
                        className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm font-medium flex items-center gap-2"
                      >
                        <UserCheck size={16} /> Unblock
                      </button>
                    )}

                    {isSuspended && (
                      <button
                        onClick={() => executeStatusAction("unsuspend")}
                        className="px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-xs sm:text-sm font-medium flex items-center gap-2"
                      >
                        <UserCheck size={16} /> Reactivate
                      </button>
                    )}

                    <button
                      onClick={() => handleBalanceUpdate("add")}
                      className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs sm:text-sm font-medium"
                    >
                      + Add Funds
                    </button>

                    <button
                      onClick={() => handleBalanceUpdate("deduct")}
                      className="px-3 sm:px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-xs sm:text-sm font-medium"
                    >
                      - Deduct
                    </button>

                    <button
                      onClick={() => handleBalanceUpdate("set")}
                      className="px-3 sm:px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-xs sm:text-sm font-medium"
                    >
                      Set Balance
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab */}
          {activeTab === "transactions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Transaction History
                </h3>
                {transactions.length > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Last {transactions.length} transactions
                  </span>
                )}
              </div>

              <TransactionsTable
                transactions={transactions}
                loading={loading}
                onRefresh={fetchUserDetails}
                onViewDetails={(tx) => {
                  setSelectedTransaction(tx);
                  setShowTransactionModal(true);
                }}
                onEditTransaction={handleEditTransaction}
              />

              {transactions.length === 10 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => {
                      navigate(`/admin/users/${id}/transactions`);
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center justify-center gap-1 mx-auto"
                  >
                    View all transactions <ArrowLeftRight size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* KYC Tab  */}
          {activeTab === "kyc" && (
            <KYCTab userId={id} onRefresh={fetchUserDetails} />
          )}

          {/* Cards Tab  */}
          {activeTab === "cards" && <CardsTab userId={id} />}

          {/* Activity Tab */}
          {activeTab === "activity" && <ActivityTab userId={id} />}
        </div>

        <AdminBottomNav />
      </div>

      {/* Reason Modal */}
      {showReasonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {pendingAction === "block" ? "Block User" : "Action Required"}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              Please provide a reason for blocking this user:
            </p>
            <textarea
              value={actionReason}
              onChange={(e) => setActionReason(e.target.value)}
              placeholder="Enter reason..."
              rows={4}
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => executeStatusAction(pendingAction, actionReason)}
                disabled={updating || !actionReason}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Processing..." : "Block User"}
              </button>
              <button
                onClick={() => {
                  setShowReasonModal(false);
                  setPendingAction(null);
                  setActionReason("");
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Suspend Modal */}
      {showSuspendModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Suspend User
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              Provide reason and duration for suspension:
            </p>

            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Reason
                </label>
                <textarea
                  value={suspendData.reason}
                  onChange={(e) =>
                    setSuspendData({ ...suspendData, reason: e.target.value })
                  }
                  placeholder="Enter suspension reason..."
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration (hours) - leave empty for permanent
                </label>
                <input
                  type="number"
                  value={suspendData.duration}
                  onChange={(e) =>
                    setSuspendData({ ...suspendData, duration: e.target.value })
                  }
                  placeholder="e.g., 24, 48, 168"
                  min="1"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSuspend}
                disabled={updating || !suspendData.reason}
                className="flex-1 px-4 py-2.5 bg-orange-500 text-white rounded-xl hover:bg-orange-600 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? "Suspending..." : "Suspend User"}
              </button>
              <button
                onClick={() => {
                  setShowSuspendModal(false);
                  setPendingAction(null);
                  setSuspendData({ reason: "", duration: "" });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Balance Update Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-2 capitalize">
              {balanceData.type} Balance
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              {balanceData.type === "add" &&
                "Enter the amount to add to this account."}
              {balanceData.type === "deduct" &&
                "Enter the amount to deduct from this account."}
              {balanceData.type === "set" &&
                "Enter the new balance amount for this account."}
            </p>
            <input
              type="number"
              value={balanceData.amount}
              onChange={(e) =>
                setBalanceData({ ...balanceData, amount: e.target.value })
              }
              placeholder="Enter amount..."
              min="0"
              step="0.01"
              className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={executeBalanceUpdate}
                disabled={updating || !balanceData.amount}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <RefreshCw size={16} className="animate-spin" />{" "}
                    Processing...
                  </>
                ) : (
                  "Confirm"
                )}
              </button>
              <button
                onClick={() => {
                  setShowBalanceModal(false);
                  setBalanceData({ type: "", amount: "" });
                }}
                disabled={updating}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-4 sm:p-6">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Delete User
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => executeStatusAction("delete")}
                className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 text-sm font-medium"
              >
                Delete Permanently
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Details Modal */}
      {showTransactionModal && selectedTransaction && (
        <TransactionDetailsModal
          transaction={selectedTransaction}
          onClose={() => {
            setShowTransactionModal(false);
            setSelectedTransaction(null);
          }}
        />
      )}

      {/* Edit Transaction Modal */}
      {showEditTransactionModal && transactionToEdit && (
        <EditTransactionModal
          transaction={transactionToEdit}
          onClose={() => {
            setShowEditTransactionModal(false);
            setTransactionToEdit(null);
          }}
          onSave={handleTransactionUpdated}
        />
      )}
    </div>
  );
};

export default UserDetails;
