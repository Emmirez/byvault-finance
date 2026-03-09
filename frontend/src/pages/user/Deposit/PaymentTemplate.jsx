// src/pages/user/Deposit/PaymentTemplate.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Upload, CheckCircle, Info, Copy, AlertCircle, X } from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { depositService } from "../../../services/depositService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const PaymentTemplate = ({
  method,
  methodName,
  icon: Icon,
  gradientFrom,
  gradientTo,
  bgColor,
  textColor,
  details,
  fee = "0%",
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedField, setCopiedField] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const { amount } = location.state || { amount: "0" };
  const numericAmount = parseFloat(amount.toString().replace(/[$,]/g, "")) || 0;

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(
      () => setNotification({ show: false, type: "", message: "" }),
      5000,
    );
  };

  // Calculate fee amount
  const calculateFee = () => {
    if (fee.includes("%")) {
      const percentage = parseFloat(fee) / 100;
      return (numericAmount * percentage).toFixed(2);
    }
    return 0;
  };

  // Calculate total
  const calculateTotal = () => {
    const feeAmount = parseFloat(calculateFee());
    return (numericAmount + feeAmount).toFixed(2);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setUploadedFile(file);
    } else {
      showNotification("File size must be less than 9MB");
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      showNotification("Please upload payment proof");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();

      formData.append("amount", numericAmount);
      formData.append("method", method);
      formData.append("receipt", uploadedFile);

      // Simulate network delay for better UX (2 seconds)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await depositService.submitDeposit(formData);

      // Small delay before navigation for success feeling
      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/deposit/success", {
        state: {
          amount: numericAmount,
          method: methodName,
          transactionId: response.depositRequest.transactionId,
          fee: calculateFee(),
          total: calculateTotal(),
        },
      });
    } catch (error) {
      if (error.status !== 403 && error.status !== 401) {
        console.error("Submit error:", error);
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
        message.includes("receipt")
      ) {
        showNotification(
          "error",
          "Failed to upload payment proof. Please try again with a valid file.",
        );
        return;
      }
      if (
        message.includes("amount") ||
        message.includes("minimum") ||
        message.includes("maximum")
      ) {
        showNotification("error", message);
        return;
      }

      showNotification(
        "error",
        message || "Failed to submit deposit. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render payment details based on method
  const renderDetails = () => {
    switch (method) {
      case "bank-transfer":
        return (
          <div className="space-y-4">
            {Object.entries(details).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white font-medium pr-12"
                  />
                  <button
                    onClick={() => handleCopy(value, key)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copiedField === key ? (
                      <CheckCircle size={18} className="text-green-600" />
                    ) : (
                      <Copy size={18} className="text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        );

      case "paypal":
        return (
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
              Send payment to the PayPal account below
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Account Name
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {details.accountName}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  PayPal Email
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  {details.email}
                </span>
              </div>
            </div>
          </div>
        );

      case "credit-card":
        return (
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-3">
              Use the card details below to make payment
            </p>
            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Card Type</span>
                <span className="font-semibold text-purple-600">
                  {details.cardType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Card Number</span>
                <span className="font-semibold">{details.cardNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Cardholder Name</span>
                <span className="font-semibold">{details.cardholderName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Expiry Date</span>
                <span className="font-semibold">{details.expiryDate}</span>
              </div>
            </div>
          </div>
        );

      case "usdt":
      case "bitcoin":
        return (
          <div className="space-y-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-100 dark:border-green-800">
              <p className="text-xs text-gray-600 dark:text-gray-400 break-all font-mono">
                {details.address}
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Info size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Network Type:</span>{" "}
                {details.networkType}
              </span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
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
        pageTitle="Make Payment"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="deposit"
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            {/* Payment Method Header */}
            <div
              className={`bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-2xl p-6 mb-6 text-white relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">
                      Payment Method: {methodName}
                    </h2>
                    <p className="text-sm text-white/80">
                      Secure payment processing for your deposit
                    </p>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <p className="text-sm text-white/80 mb-1">Amount</p>
                  <p className="text-3xl font-bold">
                    ${numericAmount.toFixed(2)} USD
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6 border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Info
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                    Payment Instructions
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    You are to make payment of{" "}
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      ${numericAmount.toFixed(2)}
                    </span>{" "}
                    using your selected payment method. Screenshot and upload
                    the proof of payment.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 ${bgColor} rounded-lg flex items-center justify-center`}
                >
                  <Icon size={20} className={textColor} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                  {methodName} Details
                </h3>
              </div>

              {renderDetails()}
            </div>

            {/* Fee Calculation Summary */}
            {numericAmount > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  Payment Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Amount:
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${numericAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Fee ({fee}):
                    </span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${calculateFee()}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-3 mt-3">
                    <div className="flex justify-between items-center font-bold">
                      <span className="text-gray-900 dark:text-white">
                        Total to Pay:
                      </span>
                      <span className="text-blue-600 dark:text-blue-400 text-xl">
                        ${calculateTotal()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Payment Proof */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Upload Payment Proof
              </h3>

              <div className="border-2 border-dashed border-cyan-300 dark:border-cyan-700 rounded-xl p-8 text-center">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/png, image/jpeg, application/pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mb-4">
                    <Upload
                      size={32}
                      className="text-cyan-600 dark:text-cyan-400"
                    />
                  </div>
                  {uploadedFile ? (
                    <div className="text-center">
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400 mb-1">
                        ✓ File uploaded successfully
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {uploadedFile.name}
                      </p>
                      <button
                        type="button"
                        className="text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline"
                      >
                        Change file
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-cyan-600 dark:text-cyan-400 mb-1">
                        Click to upload{" "}
                        <span className="text-gray-500 dark:text-gray-400">
                          or drag and drop
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG or PDF (max. 5MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!uploadedFile || isSubmitting}
              className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 mb-20 lg:mb-8"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Processing Payment...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Submit Payment
                </>
              )}
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

export default PaymentTemplate;
