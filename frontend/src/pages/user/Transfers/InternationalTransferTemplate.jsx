/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/user/Transfers/InternationalTransferTemplate.jsx
import React, { useState, useEffect, useCallback } from "react";
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
  Globe,
  Mail,
  Phone,
  Key,
  FileText,
  Shield,
  Copy,
  AlertTriangle,
  Wallet,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { transferService } from "../../../services/transferService";
import { dashboardService } from "../../../services/dashhboardService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const InternationalTransferTemplate = ({
  type,
  title,
  icon: Icon,
  gradientFrom,
  gradientTo,
  accentColor,
  fields,
  validationRules = {},
  customRender = null,
  onBack,
}) => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();

  // Data fetching states
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [accountData, setAccountData] = useState(null);

  // UI states
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showBeneficiaryModal, setShowBeneficiaryModal] = useState(false);
  const [savedBeneficiaries, setSavedBeneficiaries] = useState([]);
  const [balance, setBalance] = useState(0);
  const [copiedField, setCopiedField] = useState(null);
  const [fieldOptions, setFieldOptions] = useState({});

  const buildInitialFormData = useCallback(() => {
    const data = {
      amount: "",
      description: "",
      pin: "",
      currency: type === "crypto" ? "btc" : "fiat",
    };

    fields.forEach((field) => {
      data[field.name] = field.defaultValue ?? "";
    });

    return data;
  }, [fields]);

  const [formData, setFormData] = useState(buildInitialFormData);
  const [notification, setNotification] = useState({
    show: false,
    type: "", // 'success', 'error', 'warning'
    message: "",
  });

  const quickAmounts =
    type === "crypto" ? [0.001, 0.01, 0.1, "All"] : [100, 500, 1000, "All"];

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

        
        const data = await dashboardService.getDashboardData();
       

        setAccountData(data);
        setBalance(
          type === "crypto"
            ? data.btcBalance || user?.balanceBTC || 0
            : data.fiatBalance || user?.balanceFiat || 0,
        );
      } catch (error) {
        console.error("Failed to fetch account data:", error);
        setDataError(
          "Failed to load your account data. Please refresh the page.",
        );

        // Fallback to user data from auth context
        setBalance(
          type === "crypto" ? user?.balanceBTC || 0 : user?.balanceFiat || 0,
        );
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchAccountData();
  }, [user]);

  useEffect(() => {
    setFormData(buildInitialFormData());
  }, [buildInitialFormData]);

  // Load saved beneficiaries from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`${type}Beneficiaries`);
    if (saved) {
      try {
        setSavedBeneficiaries(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved beneficiaries:", e);
      }
    }
  }, [type]);

  // Handle dynamic options for fields like network (for crypto)
  useEffect(() => {
    const newOptions = {};

    fields.forEach((field) => {
      if (field.dependsOn && field.options) {
        const dependentValue = formData[field.dependsOn];
        if (dependentValue && typeof field.options === "function") {
          newOptions[field.name] = field.options(dependentValue);
        } else if (field.options) {
          newOptions[field.name] = field.options;
        }
      }
    });

    setFieldOptions(newOptions);
  }, [formData, fields]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ?? "",
    }));
  };

  const handleQuickAmount = (value) => {
    if (value === "All") {
      setFormData({ ...formData, amount: balance.toString() });
    } else {
      setFormData({ ...formData, amount: value.toString() });
    }
  };

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const normalize = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : "";

  const getBeneficiaryName = (beneficiary) => {
    if (beneficiary.fullName) return beneficiary.fullName;
    if (beneficiary.accountName) return beneficiary.accountName;
    if (beneficiary.email) return beneficiary.email.split("@")[0];
    if (beneficiary.phone) return beneficiary.phone.slice(-4);
    if (beneficiary.cashtag) return beneficiary.cashtag;
    return "Beneficiary";
  };

  const getRecipientName = () => {
    const nameFields = [
      "accountName",
      "fullName",
      "name",
      "email",
      "phone",
      "cashtag",
      "username",
      "walletAddress",
    ];

    for (const field of nameFields) {
      if (formData[field]) {
        if (field === "email") return formData[field].split("@")[0];
        if (field === "walletAddress")
          return formData[field].substring(0, 12) + "...";
        return formData[field];
      }
    }

    return "Recipient";
  };

  // Validate form
  const validateForm = () => {
    for (const field of fields) {
      if (field.required && !formData[field.name]) {
        showNotification("error", `${field.label} is required`);
        return false;
      }
    }

    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      showNotification("error", "Please enter a valid amount");
      return false;
    }

    if (type !== "crypto" && amount < 1) {
      showNotification("error", "Minimum transfer amount is $1.00");
      return false;
    }

    if (amount > balance) {
      showNotification("error", "Insufficient funds for this transfer");
      return false;
    }

    if (!formData.pin || formData.pin.length < 4) {
      showNotification("error", "Please enter your transaction PIN");
      return false;
    }

    for (const key in validationRules) {
      const rule = validationRules[key];
      if (formData[key]) {
        const result = rule(formData[key]);
        if (result !== true) {
          showNotification("error", result);
          return false;
        }
      }
    }

    return true;
  };

  // Handle transfer
const handleTransfer = async () => {
  const transferAmount = parseFloat(formData.amount);
  if (!validateForm()) return;

  setIsLoading(true);
  showNotification("success", "Processing your transfer...");

  try {
    const payload = {
      type,
      ...formData,
      amount: transferAmount,
      currency: type === "crypto" ? "btc" : "fiat",
      transferType: "international",
      beneficiaryName:
        formData.accountName ||
        formData.fullName ||
        formData.email ||
        "Recipient",
    };

    const response = await transferService.internationalTransfer(payload);

    showNotification("success", "Transfer initiated successfully!");

    setTimeout(() => {
      navigate("/transfer/hold", {
        state: {
          type: title,
          amount: transferAmount,
          recipient: getRecipientName(),
          method: title,
          transactionId: response.transactionId || `TXN${Date.now()}`,
          status: response.status || "pending",
        },
      });
    }, 1000);

  } catch (error) {
    if (error.status !== 403 && error.status !== 401) {
      console.error("Transfer error:", error);
    }

    const code = error.data?.code || "";
    const message = error.message || "";

    if (code === "VERIFICATION_REQUIRED" || message.includes("verification") || message.includes("KYC")) {
      showNotification("error", "Your account is not yet verified. Please complete KYC verification before making transfers.");
      return;
    }

    if (code === "ACCOUNT_BLOCKED" || message.includes("blocked")) {
      showNotification("error", "Your account has been blocked. Please contact support.");
      return;
    }

    if (code === "ACCOUNT_SUSPENDED" || message.includes("suspended")) {
      showNotification("error", "Your account is temporarily suspended. Please contact support.");
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
      showNotification("error", message);
      return;
    }

    // Only navigate to hold for genuine unknown/network errors
    showNotification("warning", "Transfer placed on hold for verification.");
    setTimeout(() => {
      navigate("/transfer/hold", {
        state: {
          type: title,
          amount: transferAmount,
          recipient: getRecipientName(),
          method: title,
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

  // Save beneficiary
  const saveBeneficiary = () => {
    const hasIdentifier = fields.some(
      (field) =>
        formData[field.name] &&
        !["amount", "pin", "description"].includes(field.name),
    );

    if (!hasIdentifier) {
      showNotification("error", "Please complete beneficiary details first");
      return;
    }

    const isDuplicate = savedBeneficiaries.some((existing) => {
      if (
        formData.email &&
        normalize(existing.email) === normalize(formData.email)
      )
        return true;

      if (
        formData.phone &&
        normalize(existing.phone) === normalize(formData.phone)
      )
        return true;

      if (
        formData.cashtag &&
        normalize(existing.cashtag) === normalize(formData.cashtag)
      )
        return true;

      if (
        formData.walletAddress &&
        normalize(existing.walletAddress) === normalize(formData.walletAddress)
      )
        return true;

      if (
        formData.accountNumber &&
        formData.bankName &&
        normalize(existing.accountNumber) ===
          normalize(formData.accountNumber) &&
        normalize(existing.bankName) === normalize(formData.bankName)
      )
        return true;

      return false;
    });

    if (isDuplicate) {
      showNotification("warning", "Beneficiary already saved");
      return;
    }

    const newBeneficiary = {
      id: Date.now(),
      type,

      fullName: formData.fullName || formData.accountName || "",
      email: formData.email || "",
      phone: formData.phone || "",
      address: formData.address || formData.bankAddress || "",

      bankName: formData.bankName || "",
      accountName: formData.accountName || "",
      accountNumber: formData.accountNumber || "",
      routingNumber: formData.routingNumber || "",
      swiftCode: formData.swiftCode || "",
      walletAddress: formData.walletAddress || "",
      cashtag: formData.cashtag || "",

      raw: { ...formData },
    };

    const updated = [...savedBeneficiaries, newBeneficiary];
    setSavedBeneficiaries(updated);
    localStorage.setItem(`${type}Beneficiaries`, JSON.stringify(updated));

    showNotification(
      "success",
      `${newBeneficiary.fullName || "Beneficiary"} saved successfully!`,
    );
  };

  // Select beneficiary
  const selectBeneficiary = (beneficiary) => {
    if (beneficiary.raw) {
      setFormData((prev) => ({
        ...prev,
        ...beneficiary.raw,
        amount: "",
        pin: "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        ...beneficiary,

        bankAddress: beneficiary.address || beneficiary.bankAddress || "",
        amount: "",
        pin: "",
      }));
    }

    setShowBeneficiaryModal(false);

    const beneficiaryName = getBeneficiaryName(beneficiary);
    showNotification("success", `Selected ${beneficiaryName}`);
  };

  // Delete beneficiary
  const deleteBeneficiary = (id, e) => {
    e.stopPropagation();
    const beneficiary = savedBeneficiaries.find((b) => b.id === id);
    const updated = savedBeneficiaries.filter((b) => b.id !== id);
    setSavedBeneficiaries(updated);
    localStorage.setItem(`${type}Beneficiaries`, JSON.stringify(updated));

    const beneficiaryName = getBeneficiaryName(beneficiary);
    showNotification("success", `Deleted ${beneficiaryName}`);
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

  // Handle back navigation
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  // Render field based on type
  const renderField = (field) => {
    if (
      customRender &&
      customRender(field, formData, handleInputChange, copiedField, handleCopy)
    ) {
      return customRender(
        field,
        formData,
        handleInputChange,
        copiedField,
        handleCopy,
      );
    }

    const commonClasses =
      "w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500";

    switch (field.type) {
      case "select": {
        const options = fieldOptions[field.name] || field.options || [];
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              {field.icon && (
                <field.icon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}
              <select
                name={field.name}
                value={formData[field.name] ?? ""}
                onChange={handleInputChange}
                className={`${commonClasses} appearance-none pr-10`}
              >
                <option value="">Select {field.label}</option>
                {options.map((opt) => (
                  <option key={opt.value || opt} value={opt.value || opt}>
                    {opt.label || opt}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        );
      }

      case "textarea":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              {field.icon && (
                <field.icon
                  className="absolute left-3 top-3 text-gray-400"
                  size={18}
                />
              )}
              <textarea
                name={field.name}
                value={formData[field.name] ?? ""}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                rows={field.rows || 3}
                className={`${commonClasses} resize-none pl-10`}
              />
            </div>
          </div>
        );

      case "radio-group":
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {field.label}
            </label>
            <div className="flex gap-2">
              {field.options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    handleInputChange({
                      target: { name: field.name, value: opt.value },
                    })
                  }
                  className={`flex-1 py-3 px-4 rounded-xl font-medium transition-colors ${
                    formData[field.name] === opt.value
                      ? `${colorClasses[accentColor]?.button} text-white`
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  {opt.icon && <opt.icon className="w-5 h-5 inline mr-2" />}
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div key={field.name} className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {field.label}{" "}
              {field.required && <span className="text-red-500">*</span>}
            </label>
            <div className="relative">
              {field.icon && (
                <field.icon
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
              )}
              <input
                type={field.type || "text"}
                name={field.name}
                value={formData[field.name] ?? ""}
                onChange={handleInputChange}
                placeholder={field.placeholder}
                className={commonClasses}
              />
              {formData[field.name] && field.copyable && (
                <button
                  type="button"
                  onClick={() => handleCopy(formData[field.name], field.name)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  {copiedField === field.name ? (
                    <CheckCircle2 size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-gray-400" />
                  )}
                </button>
              )}
            </div>
            {field.helpText && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                {field.helpText}
              </p>
            )}
          </div>
        );
    }
  };

  const colorClasses = {
    blue: {
      gradient: "from-blue-500 to-cyan-500",
      bg: "bg-blue-100 dark:bg-blue-900/30",
      text: "text-blue-600 dark:text-blue-400",
      button: "bg-blue-600 hover:bg-blue-700",
      lightBg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    purple: {
      gradient: "from-purple-600 to-indigo-600",
      bg: "bg-purple-100 dark:bg-purple-900/30",
      text: "text-purple-600 dark:text-purple-400",
      button: "bg-purple-600 hover:bg-purple-700",
      lightBg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
    },
    green: {
      gradient: "from-green-500 to-emerald-500",
      bg: "bg-green-100 dark:bg-green-900/30",
      text: "text-green-600 dark:text-green-400",
      button: "bg-green-600 hover:bg-green-700",
      lightBg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
    },
    orange: {
      gradient: "from-orange-500 to-amber-500",
      bg: "bg-orange-100 dark:bg-orange-900/30",
      text: "text-orange-600 dark:text-orange-400",
      button: "bg-orange-600 hover:bg-orange-700",
      lightBg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
    },
    emerald: {
      gradient: "from-emerald-500 to-green-600",
      bg: "bg-emerald-100 dark:bg-emerald-900/30",
      text: "text-emerald-600 dark:text-emerald-400",
      button: "bg-emerald-600 hover:bg-emerald-700",
      lightBg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-200 dark:border-emerald-800",
    },
  };

  const colors = colorClasses[accentColor] || colorClasses.blue;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        onBackClick={handleBack}
        pageTitle={title}
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="international-transfer"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Info Card */}
            <div
              className={`bg-gradient-to-br ${colors.gradient} rounded-2xl p-6 mb-6 text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{title}</h2>
                    <p className="text-sm text-white/80">
                      Send money internationally
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-4">
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                    <Globe size={16} className="mx-auto mb-1" />
                    <span className="text-xs font-semibold">Worldwide</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                    <Zap size={16} className="mx-auto mb-1" />
                    <span className="text-xs font-semibold">Fast</span>
                  </div>
                  <div className="bg-white/20 backdrop-blur rounded-lg p-3 text-center">
                    <Shield size={16} className="mx-auto mb-1" />
                    <span className="text-xs font-semibold">Secure</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Transfer / Saved Beneficiaries */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Quick Transfer
                </h2>
                <button
                  onClick={() => setShowBeneficiaryModal(true)}
                  className={`text-sm ${colors.text} hover:underline flex items-center gap-1`}
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
                      const resetData = {};
                      fields.forEach(
                        (f) => (resetData[f.name] = f.defaultValue || ""),
                      );
                      resetData.amount = "";
                      resetData.description = "";
                      resetData.pin = "";
                      setFormData(resetData);
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
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center ${colors.bg} group-hover:ring-2 group-hover:ring-${accentColor}-500 transition-all`}
                        >
                          <User size={24} className={colors.text} />
                        </div>
                        <span className="text-xs text-gray-900 dark:text-white font-medium whitespace-nowrap">
                          {getBeneficiaryName(beneficiary).split(" ")[0]}
                        </span>
                        <span className="text-[10px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {beneficiary.bankName?.substring(0, 8) ||
                            beneficiary.email?.substring(0, 12) ||
                            beneficiary.phone?.slice(-4) ||
                            beneficiary.cashtag?.substring(0, 8) ||
                            type}
                          ...
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
                <DollarSign className={`${colors.text}`} size={20} />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Available Balance
                </h2>
              </div>

              <div
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 border ${colors.border}`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center`}
                  >
                    {type === "crypto" ? (
                      <Wallet className={colors.text} size={24} />
                    ) : (
                      <DollarSign className={colors.text} size={24} />
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Account Balance
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {type === "crypto" ? "Bitcoin (BTC)" : "USD Currency"}
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {type === "crypto"
                      ? `₿ ${balance.toLocaleString(undefined, { minimumFractionDigits: 6, maximumFractionDigits: 8 })}`
                      : `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
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
                <DollarSign className={`${colors.text}`} size={20} />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Transfer Amount
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 mb-3">
                <div className="relative mb-3">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400">
                    {type === "crypto" ? "₿" : "$"}
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
                            ? `${colors.button} text-white`
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        }`}
                      >
                        {value === "All" ? (
                          <span className="flex items-center justify-center gap-1">
                            <DollarSign size={12} />
                            All
                          </span>
                        ) : type === "crypto" ? (
                          `₿${value}`
                        ) : (
                          `$${value}`
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Fields */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Building2 className={`${colors.text}`} size={20} />
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Recipient Details
                </h2>
              </div>

              <div className="space-y-1">{fields.map(renderField)}</div>
            </div>

            {/* Additional Information */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Lock className={`${colors.text}`} size={20} />
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
                      value={formData.description || ""}
                      onChange={handleInputChange}
                      placeholder="Enter transaction description (optional)"
                      rows="3"
                      className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white resize-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Transaction PIN
                  </label>
                  <div className="relative">
                    <Key
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type={showPin ? "text" : "password"}
                      name="pin"
                      value={formData.pin || ""}
                      onChange={handleInputChange}
                      placeholder="Enter your transaction PIN"
                      maxLength="6"
                      className="w-full pl-10 pr-12 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0 text-gray-900 dark:text-white"
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
                className={`w-full py-4 ${colors.button} text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Processing...
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
            <div
              className={`mt-6 ${colors.lightBg} rounded-xl p-4 border ${colors.border} mb-20 lg:mb-8`}
            >
              <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Shield size={16} className={colors.text} />
                Bank-Level Security
              </h3>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                All international transfers are protected with 256-bit SSL
                encryption and processed through secure banking channels.
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
                <Users size={20} className={colors.text} />
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
                          <div
                            className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <User className={colors.text} size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 dark:text-white truncate">
                              {getBeneficiaryName(beneficiary)}
                            </p>

                            {/* Bank/Account Info */}
                            {(beneficiary.bankName ||
                              beneficiary.accountNumber) && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {beneficiary.bankName &&
                                beneficiary.accountNumber
                                  ? `${beneficiary.bankName} • ${beneficiary.accountNumber.slice(-4)}`
                                  : beneficiary.bankName ||
                                    beneficiary.accountNumber?.slice(-4)}
                              </p>
                            )}

                            {/* Wallet Address (for crypto) */}
                            {beneficiary.walletAddress && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {beneficiary.walletAddress.substring(0, 20)}...
                              </p>
                            )}

                            {/* Cashtag (for Cash App) */}
                            {beneficiary.cashtag && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {beneficiary.cashtag}
                              </p>
                            )}

                            {/* Phone (if applicable) */}
                            {beneficiary.phone &&
                              !beneficiary.bankName &&
                              !beneficiary.walletAddress &&
                              !beneficiary.cashtag && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                  {beneficiary.phone}
                                </p>
                              )}

                            {/* Email */}
                            {beneficiary.email && (
                              <p className="text-xs text-gray-400 dark:text-gray-500 truncate mt-1">
                                📧 {beneficiary.email}
                              </p>
                            )}

                            {/* Address */}
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
                className={`w-full py-3 ${colors.button} text-white font-semibold rounded-xl transition-colors`}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

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

export default InternationalTransferTemplate;
