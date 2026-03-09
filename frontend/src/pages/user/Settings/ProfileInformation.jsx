/* eslint-disable no-unused-vars */
// src/pages/user/Settings/ProfileInformation.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Hash,
  MapPin,
  Copy,
  Check,
  Info,
  Shield,
  BadgeCheck,
  Clock,
  XCircle,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { kycService } from "../../../services/kycService";
import { userService } from "../../../services/userService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const ProfileInformation = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copiedField, setCopiedField] = useState("");
  const [kycStatus, setKycStatus] = useState("unverified");
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    fetchUserData();
    fetchKYCStatus();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await userService.getUserProfile();

      if (response?.success && response?.user) {
        setUserDetails(response.user);
      } else if (response?.data?.user) {
        setUserDetails(response.data.user);
      } else if (response?.data) {
        setUserDetails(response.data);
      } else if (response?.id) {
        setUserDetails(response);
      } else {
        console.error("Unexpected response structure:", response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchKYCStatus = async () => {
    try {
      const response = await kycService.getKYCStatus();
      if (response.success) {
        setKycStatus(response.status);
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getKYCStatusBadge = () => {
    switch (kycStatus) {
      case "verified":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 rounded-full">
            <BadgeCheck
              size={16}
              className="text-green-600 dark:text-green-400"
            />
            <span className="text-xs font-semibold text-green-700 dark:text-green-400">
              Verified
            </span>
          </div>
        );
      case "pending":
      case "under_review":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full">
            <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-semibold text-yellow-700 dark:text-yellow-400">
              Pending
            </span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 rounded-full">
            <XCircle size={16} className="text-red-600 dark:text-red-400" />
            <span className="text-xs font-semibold text-red-700 dark:text-red-400">
              Rejected
            </span>
          </div>
        );
      default:
        return (
          <button
            onClick={() => navigate("/kyc/submit")}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full transition-colors"
          >
            <Shield size={16} className="text-gray-600 dark:text-gray-400" />
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              Verify Now
            </span>
          </button>
        );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const userData = userDetails || user;
  const userEmail = userData?.email || "user@email.com";
  const userName = userData?.firstName
    ? `${userData.firstName} ${userData.lastName}`
    : "User";
  const firstName = userData?.firstName || "";
  const lastName = userData?.lastName || "";
  const accountNumber = userData?.accountNumber || "**** ****";
  const accountId = userData?.accountId || "";
  const phoneNumber = userData?.phone || "Not provided";
  const address = userData?.address || "Not provided";
  const memberSince = userData?.createdAt
    ? formatDate(userData.createdAt)
    : "N/A";

  // Format Date of Birth
  const dateOfBirth = userData?.dateOfBirth
    ? new Date(userData.dateOfBirth).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not provided";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Profile Information"
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

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Header Card with KYC Status */}
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <User size={32} className="text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-1">
                      Profile Information
                    </h2>
                    <p className="text-white/90 text-sm">
                      Member since {memberSince}
                    </p>
                  </div>
                </div>
                {getKYCStatusBadge()}
              </div>
            </div>

            {/* Profile Form */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="space-y-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={firstName}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Last Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={lastName}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Middle Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Middle Name
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={userData?.middleName || "Not provided"}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Username */}
                {userData?.username && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Username
                    </label>
                    <div className="relative">
                      <Hash
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        value={`${userData.username}`}
                        readOnly
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                      />
                    </div>
                  </div>
                )}

                {/* Account ID */}
                {accountId && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Account ID
                    </label>
                    <div className="relative">
                      <Hash
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                      <input
                        type="text"
                        value={accountId}
                        readOnly
                        className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                      />
                      <button
                        onClick={() => handleCopy(accountId, "accountId")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {copiedField === "accountId" ? (
                          <Check size={20} />
                        ) : (
                          <Copy size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Your unique account identifier
                    </p>
                  </div>
                )}

                {/* Email Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="email"
                      value={userEmail}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                    <button
                      onClick={() => handleCopy(userEmail, "email")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      {copiedField === "email" ? (
                        <Check size={20} />
                      ) : (
                        <Copy size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      value={phoneNumber}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Date of Birth - NEW FIELD */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={dateOfBirth}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-4 text-gray-400"
                      size={20}
                    />
                    <textarea
                      value={address}
                      readOnly
                      rows={3}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed resize-none"
                    />
                  </div>
                </div>

                {/* Member Since */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Member Since
                  </label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      value={memberSince}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* KYC Information */}
            {kycStatus === "verified" && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-20 lg:mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                    <BadgeCheck
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                      Identity Verified
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Your identity has been verified. You have full access to
                      all features.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Information Notice */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-20 lg:mb-8">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Info
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Account Information
                  </h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    To update your personal information, please contact our
                    customer support team.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ProfileInformation;
