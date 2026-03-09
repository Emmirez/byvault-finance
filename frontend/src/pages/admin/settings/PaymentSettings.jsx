/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save,
  RefreshCw,
  CreditCard,
  Building2,
  Wallet,
  DollarSign,
  Bitcoin,
  ArrowLeft,
  Sun,
  Moon,
} from "lucide-react";
import { useDarkMode } from "../../../hooks/useDarkMode";
import adminApi from "../../../services/adminApi";
import SuperAdminProfile from "../Components/SuperAdmin";
import AdminBottomNav from "../Components/AdminBottomNav";
import AdminAlertBell from "../Notification/AdminAlertBell";

const TABS = [
  {
    key: "bankTransfer",
    label: "Bank Transfer",
    icon: Building2,
    color: "blue",
  },
  { key: "paypal", label: "PayPal", icon: DollarSign, color: "indigo" },
  { key: "usdt", label: "USDT", icon: Wallet, color: "green" },
  {
    key: "creditCard",
    label: "Credit Card",
    icon: CreditCard,
    color: "purple",
  },
  { key: "crypto", label: "Crypto (BTC)", icon: Bitcoin, color: "orange" },
];

const FIELDS = {
  bankTransfer:[
    { name: "bankName", label: "Bank Name" },
    { name: "accountName", label: "Account Name" },
    { name: "accountNumber", label: "Account Number" },
    { name: "routingNumber", label: "Routing Number" },
    { name: "swiftCode", label: "Swift Code" },
    { name: "bankAddress", label: "Bank Address" },
  ],
  paypal: [
    { name: "accountName", label: "Account Name" },
    { name: "email", label: "PayPal Email" },
  ],
  usdt: [
    { name: "address", label: "Wallet Address" },
    { name: "networkType", label: "Network Type" },
  ],
  creditCard: [
    { name: "cardType", label: "Card Type" },
    { name: "cardNumber", label: "Card Number" },
    { name: "cardholderName", label: "Cardholder Name" },
    { name: "expiryDate", label: "Expiry Date" },
  ],
  crypto: [
    { name: "address", label: "Wallet Address" },
    { name: "networkType", label: "Network Type" },
  ],
};

const PaymentSettingsPage = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [activeTab, setActiveTab] = useState("bankTransfer");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await adminApi.getPaymentSettings();
        setSettings(res.settings);
      } catch (err) {
        showToast("Failed to load settings", "error");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleChange = (tab, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [tab]: { ...prev[tab], [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminApi.updatePaymentSettings({
        [activeTab]: settings[activeTab],
      });
      showToast(
        `${TABS.find((t) => t.key === activeTab)?.label} settings saved!`,
      );
    } catch (err) {
      showToast("Failed to save settings", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );

  const activeTabData = TABS.find((t) => t.key === activeTab);

  return (
    <div>
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 overflow-x-hidden pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-2 sm:mr-4 flex-shrink-0"
              >
                <ArrowLeft size={20} className="dark:text-white" />
              </button>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate flex-1 ml-5">
                Payment Settings
              </h1>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={18} className="dark:text-white" /> : <Moon size={18} className="dark:text-white" />}
                </button>
                <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-3xl mx-auto w-full">
          {/* Page Title */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Payment Settings
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage deposit payment method details shown to users
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap mb-6">
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <activeTabData.icon
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  {activeTabData.label} Details
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  These details are shown to users when depositing
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {FIELDS[activeTab].map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    {field.label}
                  </label>
                  <input
                    type="text"
                    value={settings?.[activeTab]?.[field.name] || ""}
                    onChange={(e) =>
                      handleChange(activeTab, field.name, e.target.value)
                    }
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:border-blue-500 focus:ring-0 outline-none"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              {saving ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {saving ? "Saving..." : `Save ${activeTabData.label} Settings`}
            </button>
          </div>
        </div>

        <AdminBottomNav />
      </div>
    </div>
  );
};

export default PaymentSettingsPage;