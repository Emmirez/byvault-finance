/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Calendar,
  DollarSign,
  User,
  Building2,
  Home,
  RefreshCw,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { grantService } from "../../../services/grantService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const GrantStatus = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [grants, setGrants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGrant, setSelectedGrant] = useState(null);
  const [filter, setFilter] = useState("all"); // all, individual, company

  useEffect(() => {
    fetchGrants();
  }, []);

  const fetchGrants = async () => {
    try {
      setLoading(true);
      const response = await grantService.getUserGrants();
      if (response.success) {
        setGrants(response.grants || []);
        if (response.grants && response.grants.length > 0) {
          setSelectedGrant(response.grants[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching grants:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case "under_review":
        return <RefreshCw className="w-5 h-5 text-blue-500" />;
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "disbursed":
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case "rejected":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "cancelled":
        return <XCircle className="w-5 h-5 text-gray-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "under_review":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "disbursed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "cancelled":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Pending Review";
      case "under_review":
        return "Under Review";
      case "approved":
        return "Approved";
      case "disbursed":
        return "Disbursed";
      case "rejected":
        return "Rejected";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const getGrantIcon = (type) => {
    return type === "company" ? (
      <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
    ) : (
      <User className="w-5 h-5 text-green-600 dark:text-green-400" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filteredGrants = grants.filter((grant) =>
    filter === "all" ? true : grant.grantType === filter,
  );

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your grant applications...
          </p>
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
        pageTitle="Grant Status"
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
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Grant Application Status
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your individual and company grant applications
              </p>
            </div>

            {/* Filter Tabs */}
            {grants.length > 0 && (
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  All ({grants.length})
                </button>
                <button
                  onClick={() => setFilter("individual")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "individual"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Individual (
                  {grants.filter((g) => g.grantType === "individual").length})
                </button>
                <button
                  onClick={() => setFilter("company")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === "company"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  Company (
                  {grants.filter((g) => g.grantType === "company").length})
                </button>
              </div>
            )}

            {grants.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Grant Applications Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You haven't submitted any grant applications yet.
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => navigate("/grants/individual")}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Apply Individual
                  </button>
                  <button
                    onClick={() => navigate("/grants/company")}
                    className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Apply Company
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar with grant list */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Your Applications
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
                      {filteredGrants.map((grant) => (
                        <button
                          key={grant._id}
                          onClick={() => setSelectedGrant(grant)}
                          className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            selectedGrant?._id === grant._id
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {getGrantIcon(grant.grantType)}
                            <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                              {grant.grantType} Grant
                            </span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {formatDate(grant.applicationDate)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(grant.status)}`}
                            >
                              {getStatusText(grant.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Amount: ${grant.requestedAmount?.toLocaleString()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main content with grant details */}
                <div className="lg:col-span-2">
                  {selectedGrant && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      {/* Grant Type Badge */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {getGrantIcon(selectedGrant.grantType)}
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize">
                            {selectedGrant.grantType} Grant Application
                          </h3>
                        </div>
                        <span
                          className={`text-sm px-3 py-1 rounded-full ${getStatusColor(selectedGrant.status)}`}
                        >
                          {getStatusText(selectedGrant.status)}
                        </span>
                      </div>

                      {/* Status Timeline */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Status Timeline
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Application Submitted
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {formatDate(selectedGrant.applicationDate)}
                              </p>
                            </div>
                          </div>

                          {selectedGrant.reviewDate && (
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Under Review
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(selectedGrant.reviewDate)}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedGrant.approvalDate && (
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Approved
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(selectedGrant.approvalDate)}
                                </p>
                                {selectedGrant.approvedAmount > 0 && (
                                  <p className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1">
                                    Amount: $
                                    {selectedGrant.approvedAmount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedGrant.disbursementDate && (
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-3 h-3 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Disbursed
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {formatDate(selectedGrant.disbursementDate)}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedGrant.status === "rejected" && (
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-3 h-3 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  Rejected
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {selectedGrant.rejectionReason ||
                                    "No reason provided"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                          Application Details
                        </h4>

                        {selectedGrant.grantType === "company" ? (
                          // Company Grant Details
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Company Name
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {selectedGrant.companyDetails?.legalName}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Tax ID
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {selectedGrant.companyDetails?.taxId}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Project Title
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {selectedGrant.companyDetails?.projectTitle}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Requested Amount
                                </p>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  $
                                  {selectedGrant.requestedAmount?.toLocaleString()}
                                </p>
                              </div>
                            </div>
                            {selectedGrant.notes && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Notes
                                </p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {selectedGrant.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        ) : (
                          // Individual Grant Details
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Applicant
                                </p>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {user?.firstName} {user?.lastName}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Requested Amount
                                </p>
                                <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                                  $
                                  {selectedGrant.requestedAmount?.toLocaleString()}
                                </p>
                              </div>
                            </div>

                            {/* Funding Purposes */}
                            {selectedGrant.individualDetails
                              ?.fundingPurposes && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                  Funding Purposes:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {Object.entries(
                                    selectedGrant.individualDetails
                                      .fundingPurposes,
                                  )
                                    .filter(([_, value]) => value)
                                    .map(([key]) => (
                                      <span
                                        key={key}
                                        className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full"
                                      >
                                        {key
                                          .replace(/([A-Z])/g, " $1")
                                          .replace(/^./, (str) =>
                                            str.toUpperCase(),
                                          )}
                                      </span>
                                    ))}
                                </div>
                              </div>
                            )}

                            {selectedGrant.notes && (
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                  Notes
                                </p>
                                <p className="text-sm text-gray-900 dark:text-white">
                                  {selectedGrant.notes}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex gap-3 mb-24">
                        <button
                          onClick={() => navigate("/grants")}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                        >
                          Apply for Another
                        </button>
                        <button
                          onClick={() => navigate("/dashboard")}
                          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                        >
                          Dashboard
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default GrantStatus;
