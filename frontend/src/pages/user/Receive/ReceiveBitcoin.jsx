// src/pages/user/Receive/ReceiveBitcoin.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bitcoin,
  Copy,
  Check,
  Download,
  Share2,
  AlertCircle,
  Clock,
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  Loader,
  XCircle,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { depositService } from "../../../services/depositService";
import { paymentService } from "../../../services/paymentService";
import btcQRCode from "../../../assets/images/btc.jpeg";
import { useDarkMode } from "../../../hooks/useDarkMode";

const ReceiveBitcoin = () => {
  const navigate = useNavigate();
  const { user, logout, loading: authLoading } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadPreview, setUploadPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [depositHistory, setDepositHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      5000,
    );
  };

  // Fetch BTC address and deposit history on mount
  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        setIsLoading(true);

        // Fetch BTC address
        const paymentSettings = await depositService.getPaymentSettings();
        if (paymentSettings?.crypto?.address) {
          setWalletAddress(paymentSettings.crypto.address);
        } else {
          setWalletAddress("bc1qyf5ae8kzuxh8y7axd9yxnmmyh3q3g4eqs3j9ag");
        }

        // Fetch deposit history
        const historyData = await paymentService.getDepositHistory();
       

        if (historyData?.history) {
          setDepositHistory(historyData.history);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setWalletAddress("bc1qyf5ae8kzuxh8y7axd9yxnmmyh3q3g4eqs3j9ag");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const handleCopy = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Bitcoin Address",
        text: `Send Bitcoin to: ${walletAddress}`,
      });
    } else {
      handleCopy();
    }
  };

  const handleDownloadQR = () => {
    const link = document.createElement("a");
    link.href = btcQRCode;
    link.download = "bitcoin-qr-code.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // File upload handlers
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadSuccess(false);
    } else {
      showNotification("Please upload an image file (JPG, PNG, etc.)");
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setUploadedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setUploadSuccess(false);
    } else {
      showNotification("Please upload an image file (JPG, PNG, etc.)");
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadPreview(null);
    setUploadSuccess(false);
    setAmount("");
  };

  const handleSubmitPayment = async () => {
    if (!uploadedFile) return;
    if (!amount || parseFloat(amount) < 0.0001) {
      showNotification("Please enter a valid amount (minimum 0.0001 BTC)");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("paymentProof", uploadedFile);
    formData.append("walletAddress", walletAddress);
    formData.append("amount", amount);

    try {
      const response = await paymentService.uploadPaymentProof(formData);
    

      // Check if upload was successful - your backend returns { success: true }
      if (response?.success === true) {
        setUploadSuccess(true);

        // Refresh deposit history
        const historyData = await paymentService.getDepositHistory();
        if (historyData?.history) {
          setDepositHistory(historyData.history);
        }

        // Clear the form after 3 seconds
        setTimeout(() => {
          handleRemoveFile();
          setUploadSuccess(false);
        }, 3000);
      } else {
        showNotification("Failed to upload payment proof. Please try again.");
      }
    } catch (error) {
      if (error.status !== 403 && error.status !== 401) {
        console.error("Upload error:", error);
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
          "Your account is not yet verified. Please complete KYC verification to make deposits.",
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
        message.includes("file") ||
        message.includes("upload") ||
        message.includes("proof")
      ) {
        showNotification(
          "error",
          "Failed to upload payment proof. Please try again with a valid image.",
        );
        return;
      }

      showNotification(
        "error",
        message || "An error occurred. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="text-green-500" size={16} />;
      case "pending":
        return <Loader className="text-yellow-500 animate-spin" size={16} />;
      case "rejected":
      case "cancelled":
        return <XCircle className="text-red-500" size={16} />;
      default:
        return <Clock className="text-gray-500" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "rejected":
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading your Bitcoin address...
          </p>
        </div>
      </div>
    );
  }

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] max-w-sm w-full">
          <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg ${
              notification.type === "success"
                ? "bg-green-600 text-white"
                : notification.type === "error"
                  ? "bg-red-600 text-white"
                  : "bg-yellow-600 text-white"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            )}
            <p className="font-medium text-sm flex-1">{notification.message}</p>
            <button
              onClick={() =>
                setNotification({ show: false, type: "", message: "" })
              }
              className="hover:bg-white/20 rounded-full p-1 flex-shrink-0"
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
        onBackClick={() => navigate(-1)}
        pageTitle="Receive Bitcoin"
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
            {/* Header Card */}
            <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-2xl p-8 mb-6 text-white">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <Bitcoin size={40} className="text-white" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-center mb-2">
                Receive Bitcoin
              </h2>
              <p className="text-center text-white/90 text-sm">
                Send Bitcoin to the address below and upload your payment proof
              </p>
            </div>

            {/* QR Code Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                Scan QR Code
              </h3>

              <div className="flex justify-center mb-4">
                <div className="w-64 h-64 bg-white p-4 rounded-xl border-2 border-gray-300 dark:border-gray-600">
                  <img
                    src={btcQRCode}
                    alt="Bitcoin QR Code"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              <p className="text-xs text-center text-gray-600 dark:text-gray-400 mb-4">
                Scan this QR code with your Bitcoin wallet to send funds
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleDownloadQR}
                  className="py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  <span className="text-sm">Download</span>
                </button>
                <button
                  onClick={handleShare}
                  className="py-3 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </div>

            {/* Address Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Your Bitcoin Address
              </h3>

              <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 mb-4">
                <p className="text-sm font-mono text-gray-900 dark:text-white break-all">
                  {walletAddress}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <Check size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy Address
                  </>
                )}
              </button>
            </div>

            {/* Upload Payment Proof Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Upload Payment Proof
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                After sending Bitcoin, upload a screenshot of your transaction
                to speed up verification
              </p>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Amount (BTC) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="0.0001"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.001"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:border-orange-500 focus:ring-0 text-gray-900 dark:text-white"
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Minimum: 0.0001 BTC
                </p>
              </div>

              {!uploadedFile ? (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    isDragging
                      ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                      : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900"
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                      <Upload
                        className="text-orange-600 dark:text-orange-400"
                        size={32}
                      />
                    </div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, JPEG up to 10MB
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview */}
                  <div className="relative bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                    <button
                      onClick={handleRemoveFile}
                      className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 rounded-full text-white transition-all"
                    >
                      <X size={16} />
                    </button>
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 bg-white dark:bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={uploadPreview}
                          alt="Payment proof preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <ImageIcon className="text-gray-400" size={24} />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmitPayment}
                    disabled={isUploading || uploadSuccess || !amount}
                    className={`w-full py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                      uploadSuccess
                        ? "bg-green-500 text-white cursor-default"
                        : isUploading
                          ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                          : !amount
                            ? "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
                    }`}
                  >
                    {uploadSuccess ? (
                      <>
                        <CheckCircle size={18} />
                        Payment Proof Uploaded!
                      </>
                    ) : isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={18} />
                        Submit Payment Proof
                      </>
                    )}
                  </button>
                </div>
              )}

              {uploadSuccess && (
                <div className="mt-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle
                      className="text-green-600 dark:text-green-400"
                      size={20}
                    />
                    <p className="text-sm text-green-800 dark:text-green-200 font-medium">
                      Your payment proof has been submitted successfully. We'll
                      verify it shortly.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Important Information */}
            <div className="bg-blue-50 dark:bg-gray-800 rounded-xl p-4 border border-blue-200 dark:border-gray-700 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <AlertCircle
                    className="text-blue-600 dark:text-blue-400"
                    size={20}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">
                    Important Information
                  </h4>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc ml-4">
                    <li>Only send Bitcoin (BTC) to this address</li>
                    <li>
                      Sending other cryptocurrencies will result in permanent
                      loss
                    </li>
                    <li>Minimum deposit: 0.0001 BTC</li>
                    <li>Allow up to 24 hours for verification</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Deposits */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Recent Deposits
              </h3>

              {depositHistory.length > 0 ? (
                <div className="space-y-3">
                  {depositHistory.slice(0, 5).map((deposit) => (
                    <div
                      key={deposit.id || deposit._id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                          <Bitcoin
                            size={18}
                            className="text-orange-600 dark:text-orange-400"
                          />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {deposit.amount} BTC
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(deposit.date || deposit.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(deposit.status)}`}
                        >
                          {getStatusIcon(deposit.status)}
                          {deposit.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock
                      size={32}
                      className="text-gray-400 dark:text-gray-500"
                    />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                    No Recent Deposits
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Your deposit history will appear here
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full mt-6 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2 mb-20 lg:mb-8"
            >
              <ArrowLeft size={18} />
              Back to Dashboard
            </button>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default ReceiveBitcoin;
