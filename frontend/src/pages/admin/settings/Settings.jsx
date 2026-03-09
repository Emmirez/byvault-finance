/* eslint-disable react-hooks/exhaustive-deps */
// src/pages/admin/Settings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  RefreshCw,
  Sun,
  Moon,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  X,
  Eye,
  EyeOff,
  Shield,
  Lock,
  DollarSign,
  Mail,
  Globe,
  Settings as SettingsIcon,
  Users,
  CreditCard,
  Key,
  Clock,
  Database,
  Server,
  RefreshCcw,
} from "lucide-react";
import { settingsService } from "../../../services/settingsService";
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

const Settings = () => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({});
  const [activeTab, setActiveTab] = useState("general");
  const [toasts, setToasts] = useState([]);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  const tabs = [
    { id: "general", label: "General", icon: Globe },
    { id: "security", label: "Security", icon: Shield },
    { id: "limits", label: "Limits", icon: Lock },
    { id: "fees", label: "Fees", icon: DollarSign },
    { id: "kyc", label: "KYC", icon: Users },
    { id: "email", label: "Email", icon: Mail },
    // { id: "maintenance", label: "Maintenance", icon: Server },
  ];

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAllSettings(activeTab);
      setSettings(response.groupedSettings || {});

      // Initialize edited values
      const initialEdits = {};
      Object.values(response.groupedSettings || {}).forEach((group) => {
        group.forEach((setting) => {
          initialEdits[setting.key] = setting.value;
        });
      });
      setEditedValues(initialEdits);
    } catch (error) {
      console.error("Error fetching settings:", error);
      addToast("Failed to load settings", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [activeTab]);

  const handleSave = async (key) => {
    try {
      setSaving(true);
      await settingsService.updateSetting(key, editedValues[key]);
      await fetchSettings();
      addToast("Setting updated successfully", "success");
    } catch (error) {
      console.error("Error saving setting:", error);
      addToast("Failed to update setting", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const promises = Object.keys(editedValues).map((key) =>
        settingsService.updateSetting(key, editedValues[key]),
      );
      await Promise.all(promises);
      await fetchSettings();
      addToast("All settings updated successfully", "success");
    } catch (error) {
      console.error("Error saving settings:", error);
      addToast("Failed to update some settings", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      await settingsService.resetSettings();
      await fetchSettings();
      setShowResetConfirm(false);
      addToast("Settings reset to defaults", "success");
    } catch (error) {
      console.error("Error resetting settings:", error);
      addToast("Failed to reset settings", "error");
    } finally {
      setLoading(false);
    }
  };

  const renderSettingInput = (setting) => {
    const value = editedValues[setting.key] ?? setting.value;

    switch (setting.type) {
      case "boolean":
        return (
          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setEditedValues({ ...editedValues, [setting.key]: true })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                value === true
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() =>
                setEditedValues({ ...editedValues, [setting.key]: false })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                value === false
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              }`}
            >
              No
            </button>
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) =>
              setEditedValues({
                ...editedValues,
                [setting.key]: parseFloat(e.target.value),
              })
            }
            min={setting.validation?.min}
            max={setting.validation?.max}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );

      case "string":
        if (setting.options) {
          return (
            <select
              value={value}
              onChange={(e) =>
                setEditedValues({
                  ...editedValues,
                  [setting.key]: e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {setting.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          );
        }
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setEditedValues({
                ...editedValues,
                [setting.key]: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );

      default:
        return (
          <input
            type="text"
            value={value}
            onChange={(e) =>
              setEditedValues({
                ...editedValues,
                [setting.key]: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div>
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white pb-20">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 ">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center h-16">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors mr-4"
              >
                <ArrowLeft size={20} />
              </button>

              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex-1 ml-8">
                Settings
              </h1>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <RefreshCcw size={18} />
                 
                </button>
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                </button>
                <AdminAlertBell />
                <SuperAdminProfile />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6 overflow-x-auto">
            <nav className="flex gap-4 min-w-max">
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

          {/* Settings Form */}
          <div className="space-y-6">
            {settings[activeTab]?.map((setting) => (
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
                      onClick={() => handleSave(setting.key)}
                      disabled={saving}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2"
                    >
                      <Save size={14} />
                      Save
                    </button>
                  )}
                </div>

                <div className="max-w-md">{renderSettingInput(setting)}</div>

                {setting.validation && (
                  <div className="mt-2 text-xs text-gray-500">
                    {setting.validation.min !== undefined &&
                      `Min: ${setting.validation.min} `}
                    {setting.validation.max !== undefined &&
                      `Max: ${setting.validation.max}`}
                  </div>
                )}
              </div>
            ))}

            {/* Save All Button */}
            {Object.keys(editedValues).some(
              (key) =>
                editedValues[key] !==
                settings[activeTab]?.find((s) => s.key === key)?.value,
            ) && (
              <div className="flex justify-end">
                <button
                  onClick={handleSaveAll}
                  disabled={saving}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                >
                  <Save size={16} />
                  Save All Changes
                </button>
              </div>
            )}
          </div>
        </div>

        <AdminBottomNav />
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center gap-3 text-orange-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Reset All Settings
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Are you sure you want to reset all settings to their default
              values? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-xl hover:bg-orange-700 text-sm font-medium"
              >
                Reset to Defaults
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
