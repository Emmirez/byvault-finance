/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/admin/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
  Key,
  Clock,
  Edit,
  Save,
  X,
  RefreshCw,
  Sun,
  Moon,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Camera,
  Lock,
  Globe,
  Briefcase,
  Award,
  BadgeCheck,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import adminApi from "../../../services/adminApi";
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
        {toast.type === "success" && <CheckCircle size={16} className="flex-shrink-0" />}
        {toast.type === "error" && <XCircle size={16} className="flex-shrink-0" />}
        {toast.type === "info" && <AlertCircle size={16} className="flex-shrink-0" />}
        {toast.type === "warning" && <AlertCircle size={16} className="flex-shrink-0" />}
        <span className="flex-1">{toast.message}</span>
        <button onClick={() => removeToast(toast.id)} className="flex-shrink-0 hover:opacity-70">
          <X size={14} />
        </button>
      </div>
    ))}
  </div>
);

const Profile = () => {
  const navigate = useNavigate();
  const { user: authUser, updateUser } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({});
  const [toasts, setToasts] = useState([]);
  const [copied, setCopied] = useState(false);

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const addToast = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    addToast("Copied to clipboard", "success");
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      // You might need to add this method to your adminApi
      const response = await adminApi.getProfile();
      setProfile(response.user || response);
      setFormData({
        firstName: response.firstName || response.user?.firstName || "",
        lastName: response.lastName || response.user?.lastName || "",
        email: response.email || response.user?.email || "",
        phone: response.phone || response.user?.phone || "",
        address: response.address || response.user?.address || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
      addToast("Failed to load profile", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveProfile = async () => {
  try {
    setSaving(true);
    console.log("Saving profile with data:", formData);
    
    // Update profile API call
    const response = await adminApi.updateProfile(formData);
    console.log("Update response:", response);
    
    // Update auth context if available
    if (updateUser && response.user) {
      updateUser(response.user);
    }
    
    // Update local profile state
    setProfile(prev => ({
      ...prev,
      ...formData
    }));
    
    setEditing(false);
    addToast("Profile updated successfully", "success");
  } catch (error) {
    console.error("Error updating profile:", error);
    console.error("Error response:", error.response);
    addToast(error.message || "Failed to update profile", "error");
  } finally {
    setSaving(false);
  }
};

  const handleChangePassword = async () => {
    // Validate passwords
    if (!passwordData.currentPassword) {
      addToast("Current password is required", "error");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      addToast("New password must be at least 8 characters", "error");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      addToast("Passwords do not match", "error");
      return;
    }

    try {
      setSaving(true);
      await adminApi.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      addToast("Password changed successfully", "success");
    } catch (error) {
      console.error("Error changing password:", error);
      addToast(error.message || "Failed to change password", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setSaving(true);
      // Toggle 2FA API call
      await adminApi.toggleTwoFactor(!profile?.twoFactorEnabled);
      
      setProfile({
        ...profile,
        twoFactorEnabled: !profile?.twoFactorEnabled,
      });
      
      setShow2FAModal(false);
      addToast(
        `Two-factor authentication ${!profile?.twoFactorEnabled ? "enabled" : "disabled"} successfully`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling 2FA:", error);
      addToast(error.message || "Failed to toggle 2FA", "error");
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      superadmin: "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400",
      admin: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400",
      user: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400",
    };
    return badges[role] || badges.user;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <RefreshCw size={40} className="animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div >
      <Toast toasts={toasts} removeToast={removeToast} />

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
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate flex-1 ml-10">
                Admin Profile
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

        <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-4xl mx-auto w-full">
          {/* Profile Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {profile?.firstName?.charAt(0) || authUser?.firstName?.charAt(0) || "A"}
                  {profile?.lastName?.charAt(0) || authUser?.lastName?.charAt(0) || ""}
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 shadow-lg">
                  <Camera size={14} />
                </button>
              </div>

              {/* Profile Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {profile?.firstName} {profile?.lastName}
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadge(profile?.role || authUser?.role)}`}>
                    {profile?.role || authUser?.role}
                  </span>
                  {profile?.twoFactorEnabled && (
                    <span className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                      <Shield size={12} />
                      2FA Enabled
                    </span>
                  )}
                </div>
                
                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 text-sm text-gray-600 dark:text-gray-400">
                  <span className="flex items-center gap-2">
                    <Mail size={16} className="flex-shrink-0" />
                    <span className="truncate">{profile?.email || authUser?.email}</span>
                    <button
                      onClick={() => handleCopy(profile?.email || authUser?.email)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <Copy size={14} className="text-gray-500" />
                    </button>
                  </span>
                  {profile?.phone && (
                    <span className="flex items-center gap-2">
                      <Phone size={16} className="flex-shrink-0" />
                      <span>{profile.phone}</span>
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <Calendar size={16} className="flex-shrink-0" />
                    Joined {new Date(profile?.createdAt || authUser?.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Edit Button */}
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium flex items-center gap-2 self-start sm:self-center"
              >
                <Edit size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User size={18} />
                  Personal Information
                </h3>

                {editing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          First Name
                        </label>
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Last Name
                        </label>
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <textarea
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Your address"
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSaveProfile}
                        disabled={saving}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium flex items-center gap-2"
                      >
                        {saving ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                      </button>
                      <button
                        onClick={() => setEditing(false)}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <InfoRow icon={User} label="Full Name" value={`${profile?.firstName} ${profile?.lastName}`} />
                    <InfoRow icon={Mail} label="Email" value={profile?.email} copyable onCopy={handleCopy} />
                    <InfoRow icon={Phone} label="Phone" value={profile?.phone || "Not provided"} />
                    <InfoRow icon={MapPin} label="Address" value={profile?.address || "Not provided"} />
                  </div>
                )}
              </div>

              {/* Account Information */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase size={18} />
                  Account Information
                </h3>
                <div className="space-y-3">
                  <InfoRow icon={Award} label="Account ID" value={profile?.accountId || "N/A"} copyable onCopy={handleCopy} />
                  <InfoRow icon={BadgeCheck} label="Account Type" value={profile?.accountType || "Standard"} />
                  <InfoRow icon={Globe} label="Currency" value={profile?.currency || "USD"} />
                  <InfoRow icon={Calendar} label="Member Since" value={new Date(profile?.createdAt || authUser?.createdAt).toLocaleDateString()} />
                </div>
              </div>
            </div>

            {/* Right Column - Security & Actions */}
            <div className="space-y-6">
              {/* Security */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Shield size={18} />
                  Security
                </h3>
                
                <div className="space-y-4">
                  {/* Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Lock size={16} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Password</p>
                        <p className="text-xs text-gray-500">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-xs font-medium"
                    >
                      Change
                    </button>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <Shield size={16} className="text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Auth</p>
                        <p className="text-xs text-gray-500">
                          {profile?.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShow2FAModal(true)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg ${
                        profile?.twoFactorEnabled
                          ? "bg-red-600 text-white hover:bg-red-700"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {profile?.twoFactorEnabled ? "Disable" : "Enable"}
                    </button>
                  </div>

                  {/* Last Login */}
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Clock size={14} />
                      <span>Last login: {new Date(profile?.lastLogin || authUser?.lastLogin).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Account Actions</h3>
                <div className="space-y-2">
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    View Activity Log
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                    Download Account Data
                  </button>
                  <button className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AdminBottomNav />
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Change Password
            </h3>

            <div className="space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showCurrentPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleChangePassword}
                disabled={saving}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 text-sm font-medium disabled:opacity-50"
              >
                {saving ? "Changing..." : "Change Password"}
              </button>
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2FA Modal */}
      {show2FAModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {profile?.twoFactorEnabled ? "Disable" : "Enable"} Two-Factor Authentication
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {profile?.twoFactorEnabled
                ? "Are you sure you want to disable two-factor authentication? This will make your account less secure."
                : "Two-factor authentication adds an extra layer of security to your account."}
            </p>

            {!profile?.twoFactorEnabled && (
              <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-4">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Setup Instructions:</p>
                <ol className="text-xs text-gray-600 dark:text-gray-400 list-decimal list-inside space-y-1">
                  <li>Download an authenticator app (Google Authenticator, Authy)</li>
                  <li>Scan the QR code or enter the secret key</li>
                  <li>Enter the verification code from the app</li>
                </ol>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleToggle2FA}
                disabled={saving}
                className={`flex-1 px-4 py-2.5 text-white rounded-xl text-sm font-medium disabled:opacity-50 ${
                  profile?.twoFactorEnabled
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {saving ? "Processing..." : profile?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
              </button>
              <button
                onClick={() => setShow2FAModal(false)}
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

// Helper component for info rows
const InfoRow = ({ icon: Icon, label, value, copyable, onCopy }) => (
  <div className="flex items-start py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
    <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
      <Icon size={16} className="text-gray-600 dark:text-gray-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-900 dark:text-white truncate">{value}</p>
        {copyable && onCopy && (
          <button
            onClick={() => onCopy(value)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex-shrink-0"
            title="Copy"
          >
            <Copy size={12} className="text-gray-500" />
          </button>
        )}
      </div>
    </div>
  </div>
);

export default Profile;