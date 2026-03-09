import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Calendar,
  FileText,
  DollarSign,
  User,
  ChevronDown,
  Send,
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  X,
  Home,
  Sparkles,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { grantService } from "../../../services/grantService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const CompanyGrantApplication = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Form state
  const [formData, setFormData] = useState({
    legalName: "",
    taxId: "",
    organizationType: "",
    foundingYear: "",
    mailingAddress: "",
    contactPhone: "",
    contactPerson: "",
    missionStatement: "",
    dateOfIncorporation: "",
    projectTitle: "",
    projectDescription: "",
    expectedOutcomes: "",
    requestedAmount: "",
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = {
      legalName: "Legal Name",
      taxId: "Tax ID",
      organizationType: "Organization Type",
      foundingYear: "Founding Year",
      mailingAddress: "Mailing Address",
      contactPhone: "Contact Phone",
      contactPerson: "Contact Person",
      missionStatement: "Mission Statement",
      dateOfIncorporation: "Date of Incorporation",
      projectTitle: "Project Title",
      projectDescription: "Project Description",
      expectedOutcomes: "Expected Outcomes",
      requestedAmount: "Requested Amount",
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        showNotification("error", `${label} is required`);
        return;
      }
    }

    if (parseFloat(formData.requestedAmount) <= 0) {
      showNotification("error", "Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const response = await grantService.applyCompanyGrant(formData);

      if (response.success) {
        setSubmittedApplication(response.grant);
        setApplicationSuccess(true);
      }
    } catch (error) {
      if (error.status !== 403 && error.status !== 401) {
        console.error("Error submitting grant application:", error);
      }

      const code = error.data?.code || "";
      const message = error.message || "";

      if (
        code === "VERIFICATION_REQUIRED" ||
        message.includes("verification") ||
        message.includes("KYC")
      ) {
        showNotification(
          "error",
          "Your account is not yet verified. Please complete KYC verification to apply for a grant.",
        );
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

      if (
        message.includes("already") ||
        message.includes("pending") ||
        message.includes("duplicate")
      ) {
        showNotification(
          "error",
          "You already have a pending grant application.",
        );
        return;
      }

      if (message.includes("eligible") || message.includes("qualify")) {
        showNotification("error", message);
        return;
      }

      showNotification(
        "error",
        message || "Failed to submit application. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/grant-applications");
  };

  const organizationTypes = [
    { value: "", label: "Select an option" },
    { value: "nonprofit", label: "Non-Profit Organization" },
    { value: "forprofit", label: "For-Profit Company" },
    { value: "educational", label: "Educational Institution" },
    { value: "government", label: "Government Agency" },
    { value: "community", label: "Community Organization" },
    { value: "religious", label: "Religious Organization" },
    { value: "foundation", label: "Foundation" },
    { value: "cooperative", label: "Cooperative" },
    { value: "other", label: "Other" },
  ];

  // Success Screen
  if (applicationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-green-100 dark:border-gray-700 relative">
          {/* Close button */}
          <button
            onClick={() => navigate("/grants")}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-200 dark:bg-green-900/30 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="text-white" size={48} />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Application Submitted!
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your company grant application is pending review
          </p>

          {/* Application Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Company
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {formData.legalName}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Requested Amount
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                ${parseFloat(formData.requestedAmount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Application ID
              </span>
              <span className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {submittedApplication?.id?.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-yellow-500" />
              Expected processing time: 7-10 business days
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/grant-status")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <FileText size={18} />
              Check Status
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Company Grant"
        isMobile={true}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="grants"
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-3xl mx-auto p-4 lg:p-8">
            {/* Notification */}
            {notification.show && (
              <div className="mb-6 fixed top-20 right-4 z-[100] animate-slide-in-right">
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
                    <CheckCircle size={20} />
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

            <form onSubmit={handleSubmit}>
              {/* Application Type Header */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Apply as Company
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Please provide the following information about your
                  organization:
                </p>
              </div>

              {/* Organization Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                {/* Legal Name */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Legal Name of Organization{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="legalName"
                    value={formData.legalName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Tax ID / EIN */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Tax ID / EIN <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="taxId"
                    value={formData.taxId}
                    onChange={handleInputChange}
                    placeholder="XX-XXXXXXX"
                    required
                    maxLength="10"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Format: XX-XXXXXXX
                  </p>
                </div>

                {/* Organization Type */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Organization Type <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      name="organizationType"
                      value={formData.organizationType}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      {organizationTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Founding Year */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Founding Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    name="foundingYear"
                    value={formData.foundingYear}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                    required
                    min="1800"
                    max="2026"
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Full Mailing Address */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Full Mailing Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="mailingAddress"
                    value={formData.mailingAddress}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  />
                </div>

                {/* Contact Phone Number */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Contact Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    placeholder="(555) 123-4567"
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Contact Person */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    value={formData.contactPerson}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                </div>

                {/* Mission Statement */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Mission Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="missionStatement"
                    value={formData.missionStatement}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Describe your organization's core mission and purpose
                  </p>
                </div>

                {/* Date of Incorporation */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Date of Incorporation{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfIncorporation"
                      value={formData.dateOfIncorporation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Project Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                {/* Project Title */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Project Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="projectTitle"
                    value={formData.projectTitle}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    A concise title for your grant-funded project
                  </p>
                </div>

                {/* Project Description */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Project Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="projectDescription"
                    value={formData.projectDescription}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Detailed description of the project for which funding is
                    requested
                  </p>
                </div>

                {/* Expected Outcomes */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Expected Outcomes <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="expectedOutcomes"
                    value={formData.expectedOutcomes}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Describe the specific goals and measurable outcomes you
                    expect to achieve
                  </p>
                </div>

                {/* Requested Amount */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Requested Amount <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="requestedAmount"
                      value={formData.requestedAmount}
                      onChange={handleInputChange}
                      placeholder="5000"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    Enter the amount you would like to request for your project
                  </p>
                </div>
              </div>

              {/* Important Information */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6 border border-blue-200 dark:border-blue-800">
                <div className="flex gap-3">
                  <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                      Important Information
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      By submitting this application, you acknowledge that the
                      final approved amount will be determined during our review
                      process based on your eligibility and requested amount.
                      You'll receive notification once your application has been
                      processed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-20 lg:mb-8">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Application
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>

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

export default CompanyGrantApplication;
