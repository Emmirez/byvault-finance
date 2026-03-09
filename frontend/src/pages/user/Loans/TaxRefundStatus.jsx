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
  Mail,
  MapPin,
  Shield,
  Home,
  RefreshCw,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { taxRefundService } from "../../../services/taxRefundService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const TaxRefundStatus = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRefund, setSelectedRefund] = useState(null);

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    try {
      setLoading(true);
      const response = await taxRefundService.getUserTaxRefunds();
      if (response.success) {
        setRefunds(response.refunds || []);
        if (response.refunds && response.refunds.length > 0) {
          setSelectedRefund(response.refunds[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching tax refunds:", error);
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
            Loading your refund status...
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
        pageTitle="Tax Refund Status"
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
                Tax Refund Status
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Track your IRS tax refund request
              </p>
            </div>

            {refunds.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  No Refund Requests Found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  You haven't submitted any tax refund requests yet.
                </p>
                <button
                  onClick={() => navigate("/irs-tax-refund")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                >
                  <FileText size={18} />
                  Apply for Refund
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sidebar with refund list */}
                <div className="lg:col-span-1">
                  <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h2 className="font-semibold text-gray-900 dark:text-white">
                        Your Requests
                      </h2>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {refunds.map((refund) => (
                        <button
                          key={refund._id}
                          onClick={() => setSelectedRefund(refund)}
                          className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                            selectedRefund?._id === refund._id
                              ? "bg-blue-50 dark:bg-blue-900/20"
                              : ""
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {formatDate(refund.applicationDate)}
                            </span>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(refund.status)}`}
                            >
                              {getStatusText(refund.status)}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            ID: {refund._id.slice(-8).toUpperCase()}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Main content with refund details */}
                <div className="lg:col-span-2">
                  {selectedRefund && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
                      {/* Status Timeline */}
                      <div className="mb-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                          Status Timeline
                        </h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">
                                Request Submitted
                              </p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(selectedRefund.applicationDate)}
                              </p>
                            </div>
                          </div>

                          {selectedRefund.reviewDate && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <RefreshCw className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Under Review
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(selectedRefund.reviewDate)}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedRefund.approvalDate && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Approved
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(selectedRefund.approvalDate)}
                                </p>
                                {selectedRefund.refundAmount > 0 && (
                                  <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                                    Amount: $
                                    {selectedRefund.refundAmount.toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {selectedRefund.disbursementDate && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <DollarSign className="w-4 h-4 text-green-600 dark:text-green-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Disbursed
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {formatDate(selectedRefund.disbursementDate)}
                                </p>
                              </div>
                            </div>
                          )}

                          {selectedRefund.status === "rejected" && (
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-white">
                                  Rejected
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                  {selectedRefund.rejectionReason ||
                                    "No reason provided"}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Application Details */}
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                          Application Details
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Full Name
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedRefund.fullName}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              SSN
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedRefund.ssn}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              ID.me Email
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedRefund.idmeEmail}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                              Country
                            </p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedRefund.country}
                            </p>
                          </div>
                          {selectedRefund.notes && (
                            <div className="col-span-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                                Notes
                              </p>
                              <p className="text-sm text-gray-900 dark:text-white">
                                {selectedRefund.notes}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 mb-20 flex gap-3">
                        <button
                          onClick={() => navigate("/irs-tax-refund")}
                          className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors "
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

export default TaxRefundStatus;
