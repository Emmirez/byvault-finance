import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  User,
  MapPin,
  Briefcase,
  Camera,
  ChevronRight,
  RefreshCw,
  Home,
  Mail,
  Phone,
  Calendar,
  Download,
  Eye,
  X,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { kycService } from "../../../services/kycService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const KYCStatus = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [kyc, setKyc] = useState(null);
  const [status, setStatus] = useState("not_submitted");
  const [selectedImage, setSelectedImage] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchKYCStatus();
  }, []);

  const fetchKYCStatus = async () => {
    try {
      setLoading(true);
      const response = await kycService.getKYCStatus();
      if (response.success) {
        setStatus(response.status);
        if (response.kyc) {
          setKyc(response.kyc);
        }
      }
    } catch (error) {
      console.error("Error fetching KYC status:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchKYCStatus();
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-12 h-12 text-green-500" />;
      case "pending":
      case "under_review":
        return <Clock className="w-12 h-12 text-yellow-500" />;
      case "rejected":
        return <XCircle className="w-12 h-12 text-red-500" />;
      default:
        return <AlertCircle className="w-12 h-12 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "verified":
        return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400";
      case "pending":
      case "under_review":
        return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400";
      case "rejected":
        return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "verified":
        return "Verified";
      case "pending":
        return "Pending Review";
      case "under_review":
        return "Under Review";
      case "rejected":
        return "Rejected";
      default:
        return "Not Submitted";
    }
  };

  const getStatusMessage = (status) => {
    switch (status) {
      case "verified":
        return "Your identity has been successfully verified. You now have full access to all features.";
      case "pending":
      case "under_review":
        return "Your documents are being reviewed by our team. This usually takes 24-48 hours.";
      case "rejected":
        return "Your verification was rejected. Please check the reason below and resubmit your documents.";
      default:
        return "You haven't submitted your KYC verification yet. Complete it to unlock all features.";
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading KYC status...</p>
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
        userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
        userEmail={user?.email || ""}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="KYC Status"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
          userEmail={user?.email || ""}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-3xl mx-auto p-4 lg:p-8">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  KYC Verification Status
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Track your identity verification progress
                </p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={18} className={`text-gray-600 dark:text-gray-400 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Status Card */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border mb-6 ${getStatusColor(status)}`}>
              <div className="flex items-start gap-4">
                {getStatusIcon(status)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">
                      {getStatusText(status)}
                    </h2>
                    {kyc?.submittedAt && (
                      <span className="text-xs bg-white/50 dark:bg-gray-700/50 px-2 py-1 rounded">
                        Submitted: {formatDate(kyc.submittedAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm opacity-90">
                    {getStatusMessage(status)}
                  </p>
                  {kyc?.rejectionReason && (
                    <div className="mt-3 p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                      <p className="text-xs font-semibold mb-1">Rejection Reason:</p>
                      <p className="text-sm">{kyc.rejectionReason}</p>
                    </div>
                  )}
                  {kyc?.reviewedAt && (
                    <p className="text-xs mt-3 opacity-75">
                      Reviewed: {formatDate(kyc.reviewedAt)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {status === "not_submitted" ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-gray-200 dark:border-gray-700">
                <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield size={40} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Start Your Verification
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                  Verify your identity to unlock higher limits and additional features.
                </p>
                <button
                  onClick={() => navigate("/kyc/submit")}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors inline-flex items-center gap-2"
                >
                  Start Verification
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Timeline */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Verification Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Documents Submitted</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(kyc?.submittedAt)}
                        </p>
                      </div>
                    </div>

                    {kyc?.verificationHistory?.map((history, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          history.status === "verified"
                            ? "bg-green-100 dark:bg-green-900/30"
                            : history.status === "rejected"
                            ? "bg-red-100 dark:bg-red-900/30"
                            : "bg-yellow-100 dark:bg-yellow-900/30"
                        }`}>
                          {history.status === "verified" ? (
                            <CheckCircle size={16} className="text-green-600 dark:text-green-400" />
                          ) : history.status === "rejected" ? (
                            <XCircle size={16} className="text-red-600 dark:text-red-400" />
                          ) : (
                            <Clock size={16} className="text-yellow-600 dark:text-yellow-400" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white capitalize">
                            {history.status.replace("_", " ")}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(history.timestamp)}
                          </p>
                          {history.comment && (
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {history.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submitted Documents */}
                {kyc?.documents && kyc.documents.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Submitted Documents
                    </h3>
                    <div className="space-y-4">
                      {kyc.documents.map((doc, index) => (
                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <FileText size={18} className="text-blue-500" />
                              <span className="font-medium text-gray-900 dark:text-white capitalize">
                                {doc.type.replace("_", " ")}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {doc.documentNumber}
                            </span>
                          </div>
                          <div className="grid grid-cols-3 gap-3">
                            {doc.frontImage && (
                              <button
                                onClick={() => setSelectedImage(doc.frontImage.url)}
                                className="relative group"
                              >
                                <img
                                  src={doc.frontImage.url}
                                  alt="Front"
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <Eye size={20} className="text-white" />
                                </div>
                              </button>
                            )}
                            {doc.backImage && (
                              <button
                                onClick={() => setSelectedImage(doc.backImage.url)}
                                className="relative group"
                              >
                                <img
                                  src={doc.backImage.url}
                                  alt="Back"
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <Eye size={20} className="text-white" />
                                </div>
                              </button>
                            )}
                            {doc.selfieImage && (
                              <button
                                onClick={() => setSelectedImage(doc.selfieImage.url)}
                                className="relative group"
                              >
                                <img
                                  src={doc.selfieImage.url}
                                  alt="Selfie"
                                  className="w-full h-20 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                  <Eye size={20} className="text-white" />
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Personal Information */}
                {kyc?.personalInfo && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Full Name</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {kyc.personalInfo.fullName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date of Birth</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(kyc.personalInfo.dateOfBirth).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Nationality</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {kyc.personalInfo.nationality}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gender</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {kyc.personalInfo.gender || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Address Information */}
                {kyc?.addressInfo && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Address Information
                    </h3>
                    <div className="space-y-2">
                      <p className="text-gray-900 dark:text-white">
                        {kyc.addressInfo.streetAddress}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {kyc.addressInfo.city}, {kyc.addressInfo.state || ""} {kyc.addressInfo.postalCode}
                      </p>
                      <p className="text-gray-900 dark:text-white">
                        {kyc.addressInfo.country}
                      </p>
                    </div>
                  </div>
                )}

                {/* Employment Information */}
                {kyc?.employmentInfo && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Employment Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {kyc.employmentInfo.employmentStatus?.replace("-", " ")}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Occupation</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {kyc.employmentInfo.occupation || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Employer</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {kyc.employmentInfo.employerName || "Not specified"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Annual Income</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {kyc.employmentInfo.annualIncome ? `$${kyc.employmentInfo.annualIncome.toLocaleString()}` : "Not specified"}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Source of Funds</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {kyc.employmentInfo.sourceOfFunds}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3">
                  {status === "rejected" && (
                    <button
                      onClick={() => navigate("/kyc/submit")}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                    >
                      Resubmit Documents
                    </button>
                  )}
                  <button
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-3xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
            >
              <X size={24} />
            </button>
            <img
              src={selectedImage}
              alt="Document preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default KYCStatus;