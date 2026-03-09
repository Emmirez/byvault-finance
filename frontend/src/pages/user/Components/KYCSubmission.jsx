/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload,
  Shield,
  CheckCircle,
  AlertCircle,
  X,
  Camera,
  User,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Globe,
  ChevronRight,
  FileText,
  Loader,
  Info,
  Home,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { kycService } from "../../../services/kycService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const KYCSubmission = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [existingKYC, setExistingKYC] = useState(null);

  // File states
  const [frontFile, setFrontFile] = useState(null);
  const [frontPreview, setFrontPreview] = useState(null);
  const [backFile, setBackFile] = useState(null);
  const [backPreview, setBackPreview] = useState(null);
  const [selfieFile, setSelfieFile] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);

  // Form data
  const [formData, setFormData] = useState({
    documentType: "passport",
    documentNumber: "",
    personalInfo: {
      fullName: user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : "",
      dateOfBirth: "",
      nationality: "",
      gender: "",
    },
    addressInfo: {
      streetAddress: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    },
    employmentInfo: {
      employmentStatus: "",
      occupation: "",
      employerName: "",
      annualIncome: "",
      sourceOfFunds: "",
    },
  });

  useEffect(() => {
    checkExistingKYC();
  }, []);

  const checkExistingKYC = async () => {
    try {
      const response = await kycService.getKYCStatus();
      if (response.success && response.status !== "not_submitted") {
        setExistingKYC(response);
        if (response.status === "verified") {
          navigate("/kyc/status", { replace: true });
        }
      }
    } catch (error) {
      console.error("Error checking KYC:", error);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setError("");
  };

  const handleDocumentChange = (type, file) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        switch (type) {
          case "front":
            setFrontFile(file);
            setFrontPreview(reader.result);
            break;
          case "back":
            setBackFile(file);
            setBackPreview(reader.result);
            break;
          case "selfie":
            setSelfieFile(file);
            setSelfiePreview(reader.result);
            break;
          default:
            break;
        }
      };
      reader.readAsDataURL(file);
    } else {
      setError("Please upload a valid image file (JPG, PNG)");
    }
  };

  const handleRemoveFile = (type) => {
    switch (type) {
      case "front":
        setFrontFile(null);
        setFrontPreview(null);
        break;
      case "back":
        setBackFile(null);
        setBackPreview(null);
        break;
      case "selfie":
        setSelfieFile(null);
        setSelfiePreview(null);
        break;
      default:
        break;
    }
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!frontFile || !selfieFile) {
          setError("Please upload front of ID and selfie");
          return false;
        }
        if (!formData.documentNumber) {
          setError("Please enter document number");
          return false;
        }
        return true;
      case 2:
        if (!formData.personalInfo.fullName || !formData.personalInfo.dateOfBirth || !formData.personalInfo.nationality) {
          setError("Please fill in all personal information fields");
          return false;
        }
        return true;
      case 3:
        if (!formData.addressInfo.streetAddress || !formData.addressInfo.city || !formData.addressInfo.postalCode || !formData.addressInfo.country) {
          setError("Please fill in all address fields");
          return false;
        }
        return true;
      case 4:
        if (!formData.employmentInfo.employmentStatus || !formData.employmentInfo.sourceOfFunds) {
          setError("Please fill in employment information");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep((prev) => prev + 1);
      setError("");
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => prev - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep()) return;

    setLoading(true);
    setUploadProgress(0);

    const submitData = new FormData();
    submitData.append("frontImage", frontFile);
    if (backFile) submitData.append("backImage", backFile);
    submitData.append("selfie", selfieFile);
    submitData.append("documentType", formData.documentType);
    submitData.append("documentNumber", formData.documentNumber);
    submitData.append("personalInfo", JSON.stringify(formData.personalInfo));
    submitData.append("addressInfo", JSON.stringify(formData.addressInfo));
    submitData.append("employmentInfo", JSON.stringify(formData.employmentInfo));

    try {
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      const response = await kycService.submitKYC(submitData);
      
      clearInterval(interval);
      setUploadProgress(100);

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate("/kyc/status");
        }, 2000);
      }
    } catch (error) {
      console.error("Error submitting KYC:", error);
      setError(error.message || "Failed to submit KYC. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFileUpload = (type, label, required = true) => {
    const file = type === "front" ? frontFile : type === "back" ? backFile : selfieFile;
    const preview = type === "front" ? frontPreview : type === "back" ? backPreview : selfiePreview;

    return (
      <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {!file ? (
          <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleDocumentChange(type, e.target.files[0])}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Camera className="mx-auto mb-2 text-gray-400" size={32} />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click to upload {label.toLowerCase()}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              JPG, PNG up to 5MB
            </p>
          </div>
        ) : (
          <div className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleRemoveFile(type)}
              className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-colors z-10"
            >
              <X size={14} />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                <img src={preview} alt={label} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <CheckCircle className="text-green-500" size={20} />
            </div>
          </div>
        )}
      </div>
    );
  };

  const steps = [
    { number: 1, title: "Documents", icon: FileText },
    { number: 2, title: "Personal Info", icon: User },
    { number: 3, title: "Address", icon: MapPin },
    { number: 4, title: "Employment", icon: Briefcase },
  ];

  if (existingKYC?.status === "verified") {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600 dark:text-green-400" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Already Verified
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your identity has already been verified.
          </p>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-green-200 dark:bg-green-900/30 rounded-full animate-ping opacity-20"></div>
            </div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="text-white" size={48} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            KYC Submitted!
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Your documents have been submitted for verification
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-900 dark:text-white font-semibold mb-1">
              What's Next?
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Our team will review your documents within 24-48 hours. You'll receive
              a notification once your identity is verified.
            </p>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Redirecting to status page...
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
        userName={`${user?.firstName || ""} ${user?.lastName || ""}`}
        userEmail={user?.email || ""}
        showBackButton={true}
        onBackClick={() => navigate("/dashboard")}
        pageTitle="KYC Verification"
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
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Progress Steps */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {steps.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.number} className="flex items-center">
                      <div className="relative">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.number < currentStep
                              ? "bg-green-500 text-white"
                              : step.number === currentStep
                              ? "bg-blue-600 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          }`}
                        >
                          {step.number < currentStep ? (
                            <CheckCircle size={18} />
                          ) : (
                            <Icon size={18} />
                          )}
                        </div>
                      </div>
                      {step.number < steps.length && (
                        <div
                          className={`w-12 sm:w-20 h-1 mx-2 rounded ${
                            step.number < currentStep
                              ? "bg-green-500"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between px-1">
                {steps.map((step) => (
                  <span
                    key={step.number}
                    className={`text-xs font-medium ${
                      step.number === currentStep
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Upload Progress Bar */}
            {loading && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-600 dark:text-gray-400">Uploading...</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Document Upload */}
              {currentStep === 1 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Upload Documents
                  </h2>

                  {/* Document Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Document Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.documentType}
                      onChange={(e) => setFormData({ ...formData, documentType: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID Card</option>
                    </select>
                  </div>

                  {/* Document Number */}
                  <div className="mb-4">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      Document Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.documentNumber}
                      onChange={(e) => setFormData({ ...formData, documentNumber: e.target.value })}
                      placeholder="Enter document number"
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* Front of ID */}
                  {renderFileUpload("front", "Front of ID", true)}

                  {/* Back of ID (optional) */}
                  {renderFileUpload("back", "Back of ID (optional)", false)}

                  {/* Selfie with ID */}
                  {renderFileUpload("selfie", "Selfie with ID", true)}

                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mt-4">
                    <div className="flex items-start gap-2">
                      <Info size={18} className="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Make sure all text is clearly visible. Selfie should clearly show your face.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Personal Information */}
              {currentStep === 2 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Personal Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.personalInfo.fullName}
                        onChange={(e) => handleInputChange("personalInfo", "fullName", e.target.value)}
                        placeholder="As it appears on your ID"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Date of Birth <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.personalInfo.dateOfBirth}
                        onChange={(e) => handleInputChange("personalInfo", "dateOfBirth", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nationality <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.personalInfo.nationality}
                        onChange={(e) => handleInputChange("personalInfo", "nationality", e.target.value)}
                        placeholder="Your country of citizenship"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Gender
                      </label>
                      <select
                        value={formData.personalInfo.gender}
                        onChange={(e) => handleInputChange("personalInfo", "gender", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer_not_to_say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Address Information */}
              {currentStep === 3 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Address Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Street Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.addressInfo.streetAddress}
                        onChange={(e) => handleInputChange("addressInfo", "streetAddress", e.target.value)}
                        placeholder="Your residential address"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          City <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.addressInfo.city}
                          onChange={(e) => handleInputChange("addressInfo", "city", e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          State/Province
                        </label>
                        <input
                          type="text"
                          value={formData.addressInfo.state}
                          onChange={(e) => handleInputChange("addressInfo", "state", e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Postal Code <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.addressInfo.postalCode}
                          onChange={(e) => handleInputChange("addressInfo", "postalCode", e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                          Country <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={formData.addressInfo.country}
                          onChange={(e) => handleInputChange("addressInfo", "country", e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Employment Information */}
              {currentStep === 4 && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                    Employment Information
                  </h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Employment Status <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={formData.employmentInfo.employmentStatus}
                        onChange={(e) => handleInputChange("employmentInfo", "employmentStatus", e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select status</option>
                        <option value="employed">Employed</option>
                        <option value="self-employed">Self-Employed</option>
                        <option value="unemployed">Unemployed</option>
                        <option value="retired">Retired</option>
                        <option value="student">Student</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Occupation
                      </label>
                      <input
                        type="text"
                        value={formData.employmentInfo.occupation}
                        onChange={(e) => handleInputChange("employmentInfo", "occupation", e.target.value)}
                        placeholder="Your job title or profession"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Employer Name
                      </label>
                      <input
                        type="text"
                        value={formData.employmentInfo.employerName}
                        onChange={(e) => handleInputChange("employmentInfo", "employerName", e.target.value)}
                        placeholder="Name of your employer"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Annual Income (USD)
                      </label>
                      <input
                        type="number"
                        value={formData.employmentInfo.annualIncome}
                        onChange={(e) => handleInputChange("employmentInfo", "annualIncome", e.target.value)}
                        placeholder="Your yearly income"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Source of Funds <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={formData.employmentInfo.sourceOfFunds}
                        onChange={(e) => handleInputChange("employmentInfo", "sourceOfFunds", e.target.value)}
                        placeholder="e.g., Salary, Business, Investments"
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 mt-6 mb-24">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors"
                  >
                    Previous
                  </button>
                )}
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader className="animate-spin" size={18} />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Shield size={18} />
                        Submit for Verification
                      </>
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default KYCSubmission;