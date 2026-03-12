// src/pages/user/Transfers/LocalTransfer.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Users,
  DollarSign,
  Building2,
  Hash,
  User,
  Eye,
  EyeOff,
  Lock,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  MapPin,
  X,
  Mail,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { transferService } from "../../../services/transferService";
import { dashboardService } from "../../../services/dashhboardService";
import { useDarkMode } from "../../../hooks/useDarkMode";
import { beneficiaryService } from "../../../services/beneficiaryService";

const LocalTransfer = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  // Data fetching states
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [accountData, setAccountData] = useState(null);

  // UI states
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    routingNumber: "",
    address: "",
    email: "",
    amount: "",
    description: "",
    pin: "",
  });
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState([]);
  const [balance, setBalance] = useState(0);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const quickAmounts = [100, 500, 1000, "All"];

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  // Fetch account data from server
  useEffect(() => {
    const fetchAccountData = async () => {
      if (!user) return;

      try {
        setIsDataLoading(true);
        setDataError(null);

        console.log("Fetching account data for transfer...");
        const data = await dashboardService.getDashboardData();

        setAccountData(data);
        setBalance(data.fiatBalance || user?.balanceFiat || 0);
      } catch (error) {
        console.error("Failed to fetch account data:", error);
        setDataError(
          "Failed to load your account data. Please refresh the page.",
        );

        // Fallback to user data from auth context
        setBalance(user?.balanceFiat || 0);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAccountData();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    beneficiaryService
      .getBeneficiaries()
      .then(setSavedBeneficiaries)
      .catch(console.error);
  }, [user]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleQuickAmount = (value) => {
    if (value === "All") {
      setFormData({ ...formData, amount: balance.toString() });
    } else {
      setFormData({ ...formData, amount: value.toString() });
    }
  };

  const handleTransfer = async () => {
    if (!formData.accountName) {
      showNotification("error", "Please enter account holder name");
      return;
    }
    if (!formData.accountNumber) {
      showNotification("error", "Please enter account number");
      return;
    }
    if (!formData.bankName) {
      showNotification("error", "Please enter bank name");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      showNotification("error", "Please enter a valid amount");
      return;
    }
    if (parseFloat(formData.amount) > balance) {
      showNotification("error", "Insufficient balance for this transfer");
      return;
    }
    if (!formData.pin || formData.pin.length < 4) {
      showNotification("error", "Please enter your transaction PIN");
      return;
    }

    setIsLoading(true);
    showNotification("success", "Processing your transfer...");

    try {
      const response = await transferService.localTransfer({
        accountNumber: formData.accountNumber,
        amount: formData.amount,
        accountName: formData.accountName,
        bankName: formData.bankName,
        description:
          formData.description || `Transfer to ${formData.accountName}`,
        pin: formData.pin,
        transferType: "local",
      });

      showNotification("success", "Transfer initiated successfully!");

      setTimeout(() => {
        navigate("/transfer/hold", {
          state: {
            type: "local",
            amount: formData.amount,
            recipient: formData.accountName,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            transactionId: response.transaction?.id || `TXN${Date.now()}`,
            status: response.transaction?.status || "pending",
          },
        });
      }, 1000);
    } catch (error) {
      console.error("Transfer error:", error);

      // Check error code from backend (set on err.data by apiService)
      const code = error.data?.code || "";
      const message = error.message || "";

      if (
        code === "VERIFICATION_REQUIRED" ||
        message.includes("KYC") ||
        message.includes("verification")
      ) {
        showNotification(
          "error",
          "KYC verification required. Please complete your KYC verification before making transfers.",
        );
        // Do NOT navigate — stay on page so user sees the message
        return;
      }

      if (code === "ACCOUNT_BLOCKED" || message.includes("blocked")) {
        showNotification(
          "error",
          "Your account has been blocked. Please contact support.",
        );
        return;
      }

      if (code === "ACCOUNT_SUSPENDED" || message.includes("suspended")) {
        showNotification(
          "error",
          "Your account is temporarily suspended. Please contact support.",
        );
        return;
      }

      if (message.includes("PIN") || message.includes("pin")) {
        showNotification("error", "Invalid transaction PIN. Please try again.");
        return;
      }

      if (message.includes("balance") || message.includes("Insufficient")) {
        showNotification("error", "Insufficient balance for this transfer.");
        return;
      }

      if (message.includes("limit") || message.includes("Limit")) {
        showNotification("error", message); // show the specific limit message
        return;
      }

      // Only navigate to hold for genuine network/server errors, not blocked transfers
      showNotification("warning", "Transfer placed on hold for verification.");
      setTimeout(() => {
        navigate("/transfer/hold", {
          state: {
            type: "local",
            amount: formData.amount,
            recipient: formData.accountName,
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            transactionId: `TXN${Date.now()}`,
            status: "pending",
            error: message,
          },
        });
      }, 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const saveBeneficiary = async () => {
    if (
      !formData.accountName ||
      !formData.accountNumber ||
      !formData.bankName
    ) {
      showNotification("error", "Please complete beneficiary details first");
      return;
    }
    try {
      const saved = await beneficiaryService.saveBeneficiary({
        type: "local",
        name: formData.accountName,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
        routingNumber: formData.routingNumber || "",
        address: formData.address || "",
        email: formData.email || "",
      });
      setSavedBeneficiaries((prev) => [...prev, { ...saved, id: saved._id }]);
      showNotification(
        "success",
        `${formData.accountName} saved successfully!`,
      );
    } catch (error) {
      showNotification("error", error.message || "Failed to save beneficiary");
    }
  };

  const selectBeneficiary = (beneficiary) => {
    setFormData({
      ...formData,
      accountName: beneficiary.name,
      accountNumber: beneficiary.accountNumber,
      bankName: beneficiary.bankName,
      routingNumber: beneficiary.routingNumber || "",
      address: beneficiary.address || "",
      email: beneficiary.email || "",
    });
    setShowBeneficiaryModal(false);
    showNotification("success", `Selected ${beneficiary.name}`);
  };

  const deleteBeneficiary = async (id, e) => {
    e.stopPropagation();
    const beneficiary = savedBeneficiaries.find(
      (b) => b._id === id || b.id === id,
    );
    try {
      await beneficiaryService.deleteBeneficiary(id);
      setSavedBeneficiaries((prev) =>
        prev.filter((b) => b._id !== id && b.id !== id),
      );
      showNotification(
        "success",
        `Deleted ${beneficiary?.name || "beneficiary"}`,
      );
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      showNotification("error", "Failed to delete beneficiary");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  // Show loading state
  if (authLoading || isDataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your account data...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (dataError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center max-w-md px-4">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{dataError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!user) {
    return null;
  }

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : notification.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-yellow-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="font-medium text-sm">{notification.message}</p>
            <button
              onClick={() =>
                setNotification({ show: false, type: "", message: "" })
              }
              className="ml-2 hover:bg-white/20 rounded-full p-1"
            >
              <X size={16} />
            </button>
          </div>
        </div>
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
        pageTitle="Local Transfer"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="local-transfer"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Info Card */}
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={20} />
                    <span className="text-sm font-semibold">
                      LOCAL TRANSFER
                    </span>
                  </div>
                  <p className="text-sm opacity-90">Send money instantly</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                  <Zap size={16} className="mx-auto mb-1" />
                  <span className="text-xs font-semibold">Instant</span>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                  <DollarSign size={16} className="mx-auto mb-1" />
                  <span className="text-xs font-semibold">Free</span>
                </div>
                <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                  <Building2 size={16} className="mx-auto mb-1" />
                  <span className="text-xs font-semibold">All Local</span>
                </div>
              </div>
            </div>

            {/* Quick Transfer Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Quick Transfer
                </h2>
                <button
                  onClick={() => setShowBeneficiaryModal(true)}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  <RefreshCw size={14} />
                  View All ({savedBeneficiaries.length})
                </button>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                  {/* Add New Button */}
                  <button
                    onClick={() => {
                      setFormData({
                        accountName: "",
                        accountNumber: "",
                        bankName: "",
                        routingNumber: "",
                        address: "",
                        email: "",
                        amount: "",
                        description: "",
                        pin: "",
                      });
                      showNotification(
                        "success",
                        "Form cleared - ready for new beneficiary",
                      );
                    }}
                    className="flex flex-col items-center gap-2 flex-shrink-0"
                  >
                    <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                      <Users
                        size={24}
                        className="text-gray-400 dark:text-gray-500"
                      />
                    </div>
                    <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      Add New
                    </span>
                  </button>

                  {/* Saved Beneficiaries */}
                  {savedBeneficiaries.length > 0 ? (
                    savedBeneficiaries.slice(0, 5).map((beneficiary) => (
                      <button
                        key={beneficiary.id}
                        onClick={() => selectBeneficiary(beneficiary)}
                        className="flex flex-col items-center gap-2 flex-shrink-0 group relative"
                      >
                        <div className="w-16 h-16 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/30 group-hover:ring-2 group-hover:ring-blue-500 transition-all">
                          <User
                            size={24}
                            className="text-blue-600 dark:text-blue-400"
                          />
                        </div>
                        <span className="text-xs text-gray-900 dark:text-white font-medium whitespace-nowrap">
                          {beneficiary.name.split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {beneficiary.bankName.substring(0, 8)}...
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="flex flex-col items-center gap-2 mx-auto py-2">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        <User
                          size={24}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        No saved beneficiaries
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Available Balance */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Available Balance
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Building2
                      className="text-blue-600 dark:text-blue-400"
                      size={24}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Account Balance
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      USD Currency
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    $
                    {balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      Available for transfer
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Transfer Amount */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <DollarSign
                  className="text-blue-600 dark:text-blue-400"
                  size={20}
                />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Transfer Amount
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-3">
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                    $
                  </span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-3 text-2xl font-bold bg-gray-50 dark:bg-gray-900 rounded-lg border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    Quick amounts:
                  </p>
                  <div className="flex gap-2">
                    {quickAmounts.map((value, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAmount(value)}
                        className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
                          value === "All"
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        }`}
                      >
                        {value === "All" ? (
                          <span className="flex items-center justify-center gap-1">
                            <DollarSign size={12} />
                            All
                          </span>
                        ) : (
                          `$${value}`
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Beneficiary Details */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <User className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Beneficiary Details
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Account Holder Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="accountName"
                      value={formData.accountName}
                      onChange={handleInputChange}
                      placeholder="Enter full name as on bank account"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="accountNumber"
                      value={formData.accountNumber}
                      onChange={handleInputChange}
                      placeholder="Enter account number"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name
                  </label>
                  <div className="relative">
                    <Building2
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      placeholder="Enter bank name"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Routing Number
                  </label>
                  <div className="relative">
                    <Hash
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="routingNumber"
                      value={formData.routingNumber}
                      onChange={handleInputChange}
                      placeholder="Enter routing number (optional)"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Bank Address
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Enter bank address (optional)"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter email address (optional)"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="text-blue-600 dark:text-blue-400" size={20} />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Additional Information
                </h2>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Description/Memo
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className="absolute left-3 top-3 text-gray-400"
                      size={18}
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Enter transaction description or purpose of payment (optional)"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    ></textarea>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Transaction PIN
                  </label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPin ? "text" : "password"}
                      name="pin"
                      value={formData.pin}
                      onChange={handleInputChange}
                      placeholder="Enter your transaction PIN"
                      maxLength="6"
                      className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} />
                    This is your transaction PIN, not your login password
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleTransfer}
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing Transfer...
                  </>
                ) : (
                  <>
                    <Zap size={18} />
                    Complete Transfer
                  </>
                )}
              </button>

              <button
                onClick={saveBeneficiary}
                className="w-full py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
              >
                <Users size={18} />
                Save Beneficiary
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
              >
                <ArrowLeft size={18} />
                Back to Dashboard
              </button>
            </div>

            {/* Security Notice */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Lock
                  size={16}
                  className="text-green-600 dark:text-green-400"
                />
                Bank-Level Security
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                All transfers are protected with 256-bit SSL encryption and
                processed through secure banking channels. Your financial
                information is never stored on our servers and all transactions
                are monitored for fraud protection.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1 text-xs font-semibold text-green-600 dark:text-green-400">
                  <CheckCircle2 size={12} />
                  SSL Encrypted
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                  <CheckCircle2 size={12} />
                  Zero Data Storage
                </span>
                <span className="flex items-center gap-1 text-xs font-semibold text-purple-600 dark:text-purple-400">
                  <CheckCircle2 size={12} />
                  24/7 Monitoring
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Beneficiary Modal */}
      {showBeneficiaryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Users size={20} className="text-blue-600" />
                Saved Beneficiaries
              </h3>
              <button
                onClick={() => setShowBeneficiaryModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {savedBeneficiaries.length > 0 ? (
                <div className="space-y-3">
                  {savedBeneficiaries.map((beneficiary) => (
                    <div key={beneficiary.id} className="relative group">
                      <button
                        onClick={() => selectBeneficiary(beneficiary)}
                        className="w-full p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                            <User
                              className="text-blue-600 dark:text-blue-400"
                              size={20}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {beneficiary.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {beneficiary.bankName} •{" "}
                              {beneficiary.accountNumber.slice(-4)}
                            </p>
                            {beneficiary.email && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                                📧 {beneficiary.email}
                              </p>
                            )}
                            {beneficiary.address && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                                📍 {beneficiary.address}
                              </p>
                            )}
                          </div>
                        </div>
                      </button>

                      <button
                        onClick={(e) => deleteBeneficiary(beneficiary.id, e)}
                        className="absolute top-2 right-2 p-2 bg-red-100 dark:bg-red-900/30 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Delete beneficiary"
                      >
                        <X
                          size={16}
                          className="text-red-600 dark:text-red-400"
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users
                      size={32}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">
                    No saved beneficiaries
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    Save beneficiaries for quick transfers
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowBeneficiaryModal(false)}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>

      <style>{`
        @keyframes slide-in-right {
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
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default LocalTransfer;
