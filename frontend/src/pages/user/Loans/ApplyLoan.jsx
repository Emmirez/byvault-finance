/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DollarSign,
  Calendar,
  Building2,
  MessageSquare,
  Wallet,
  Send,
  X,
  ArrowLeft,
  ChevronDown,
  AlertCircle,
  CheckCircle,
  CreditCard,
  Home,
  Sparkles,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { loanService } from "../../../services/loanService";
import { useDarkMode } from "../../../hooks/useDarkMode";

const ApplyLoan = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loanProducts, setLoanProducts] = useState([]);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  // Notification state
  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  // Get loan type from URL query params
  const queryParams = new URLSearchParams(location.search);
  const preselectedLoan = queryParams.get("type");

  // Form state
  const [formData, setFormData] = useState({
    loanAmount: "",
    duration: "12",
    loanProduct: "",
    purpose: "",
    monthlyIncome: "",
    agreeToTerms: false,
  });

  // Calculated values
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [totalRepayment, setTotalRepayment] = useState(null);

  useEffect(() => {
    fetchLoanProducts();
  }, []);

  useEffect(() => {
    if (preselectedLoan && loanProducts.length > 0) {
      const matchingProduct = loanProducts.find((p) =>
        p.name.toLowerCase().includes(preselectedLoan.toLowerCase()),
      );
      if (matchingProduct) {
        setFormData((prev) => ({
          ...prev,
          loanProduct: matchingProduct.name,
        }));
      }
    }
  }, [preselectedLoan, loanProducts]);

  // Calculate loan repayment when amount, duration, or product changes
  useEffect(() => {
    if (formData.loanAmount && formData.duration && formData.loanProduct) {
      const product = loanProducts.find((p) => p.name === formData.loanProduct);
      if (product) {
        const amount = parseFloat(formData.loanAmount);
        const term = parseInt(formData.duration);
        const monthlyRate = product.interestRate / 100 / 12;

        // Standard loan amortization formula
        if (monthlyRate === 0) {
          const monthly = amount / term;
          setMonthlyPayment(monthly.toFixed(2));
          setTotalRepayment(amount.toFixed(2));
        } else {
          const x = Math.pow(1 + monthlyRate, term);
          const monthly = (amount * monthlyRate * x) / (x - 1);
          setMonthlyPayment(monthly.toFixed(2));
          setTotalRepayment((monthly * term).toFixed(2));
        }
      }
    }
  }, [
    formData.loanAmount,
    formData.duration,
    formData.loanProduct,
    loanProducts,
  ]);

  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => {
      setNotification({ show: false, type: "", message: "" });
    }, 3000);
  };

  const fetchLoanProducts = async () => {
    try {
      const response = await loanService.getLoanProducts();
      if (response.success) {
        setLoanProducts(response.products || []);
      }
    } catch (error) {
      console.error("Error fetching loan products:", error);
      showNotification("error", "Failed to load loan products");
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      showNotification("error", "Please agree to the terms and conditions");
      return;
    }

    if (!formData.loanProduct) {
      showNotification("error", "Please select a loan type");
      return;
    }

    if (!formData.loanAmount || parseFloat(formData.loanAmount) <= 0) {
      showNotification("error", "Please enter a valid loan amount");
      return;
    }

    if (!formData.monthlyIncome || parseFloat(formData.monthlyIncome) <= 0) {
      showNotification("error", "Please enter your monthly income");
      return;
    }

    setLoading(true);

    try {
      const selectedProduct = loanProducts.find(
        (p) => p.name === formData.loanProduct,
      );

      const applicationData = {
        loanType: selectedProduct?.type || "personal",
        loanProduct: formData.loanProduct,
        amount: parseFloat(formData.loanAmount),
        term: parseInt(formData.duration),
        purpose: formData.purpose,
        employmentStatus: "employed",
        annualIncome: parseFloat(formData.monthlyIncome) * 12 || 0,
      };

      const response = await loanService.applyForLoan(applicationData);

      if (response.success) {
        setSubmittedApplication({
          ...response.loan,
          productName: formData.loanProduct,
          interestRate: selectedProduct?.interestRate,
        });
        setApplicationSuccess(true);
      }
    } catch (error) {
      if (error.status !== 403 && error.status !== 401) {
        console.error("Error submitting loan application:", error);
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
          "Your account is not yet verified. Please complete KYC verification to apply for a loan.",
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

      if (message.includes("already") || message.includes("pending")) {
        showNotification(
          "error",
          "You already have a pending loan application.",
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

  const handleCancel = () => {
    navigate("/loan-services");
  };

  const getSelectedProduct = () => {
    return loanProducts.find((p) => p.name === formData.loanProduct);
  };

  const selectedProduct = getSelectedProduct();

  // Success Screen
  if (applicationSuccess && submittedApplication) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-green-100 dark:border-gray-700 relative">
          {/* Close button */}
          <button
            onClick={() => navigate("/loan-services")}
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
            Your {submittedApplication.productName} application is pending
            review
          </p>

          {/* Application Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Loan Amount
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                ${submittedApplication.amount?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Term
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {submittedApplication.term} months
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Interest Rate
              </span>
              <span className="font-bold text-gray-900 dark:text-white">
                {submittedApplication.interestRate}% APR
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Monthly Payment
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                ${submittedApplication.monthlyPayment}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Application ID
              </span>
              <span className="text-xs font-mono bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                {submittedApplication.id?.slice(-8).toUpperCase()}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
              <Sparkles size={18} className="text-yellow-500" />
              Expected decision: 24-48 hours
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/loan-services")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Home size={18} />
              Back to Loan Services
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <CreditCard size={18} />
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Notification */}
      {notification.show && (
        <div className="fixed top-4 right-4 z-[100] animate-slide-in-right">
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
        pageTitle="Apply for Loan"
        isMobile={true}
      />

      <div className="flex">
        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage="loans"
          onLogout={handleLogout}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-3xl mx-auto p-4 lg:p-8">
            {/* Back Button */}
            {/* <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back</span>
            </button> */}

            {/* Loan Calculator Preview (if product selected) */}
            {selectedProduct && formData.loanAmount && monthlyPayment && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 mb-6 text-white">
                <h3 className="text-lg font-semibold mb-4">Loan Summary</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-blue-100 text-sm">Monthly Payment</p>
                    <p className="text-2xl font-bold">${monthlyPayment}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Total Repayment</p>
                    <p className="text-2xl font-bold">${totalRepayment}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Interest Rate</p>
                    <p className="text-xl font-semibold">
                      {selectedProduct.interestRate}% APR
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Term</p>
                    <p className="text-xl font-semibold">
                      {formData.duration} months
                    </p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Loan Details Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Loan Details
                  </h2>
                </div>

                {/* Loan Amount */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Loan Amount (USD) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="loanAmount"
                      value={formData.loanAmount}
                      onChange={handleInputChange}
                      placeholder="Enter loan amount"
                      required
                      min={selectedProduct?.minAmount || 0}
                      max={selectedProduct?.maxAmount || 1000000}
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Min: ${selectedProduct.minAmount.toLocaleString()} • Max:
                      ${selectedProduct.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Duration (Months) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <select
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      {Array.from({ length: 60 }, (_, i) => i + 1).map(
                        (month) => (
                          <option key={month} value={month}>
                            {month} {month === 1 ? "Month" : "Months"}
                          </option>
                        ),
                      )}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Min: {selectedProduct.minTerm} months • Max:{" "}
                      {selectedProduct.maxTerm} months
                    </p>
                  )}
                </div>

                {/* Credit Facility */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Credit Facility <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                    <select
                      name="loanProduct"
                      value={formData.loanProduct}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-12 pr-10 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none appearance-none"
                    >
                      <option value="">Select Loan/Credit Facility</option>
                      {loanProducts.map((product) => (
                        <option key={product.name} value={product.name}>
                          {product.name} ({product.interestRate}% APR)
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Purpose of Loan */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Purpose of Loan <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                    <textarea
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleInputChange}
                      placeholder="Please describe the purpose of this loan..."
                      required
                      rows={4}
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Financial Information Section */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Financial Information
                  </h2>
                </div>

                {/* Monthly Net Income */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Monthly Net Income (USD){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="number"
                      name="monthlyIncome"
                      value={formData.monthlyIncome}
                      onChange={handleInputChange}
                      placeholder="Enter your monthly net income"
                      required
                      min="0"
                      step="0.01"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white rounded-xl focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    className="w-5 h-5 mt-0.5 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">
                      I agree to the terms and conditions
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      By submitting this application, I confirm that all
                      information provided is accurate and complete. I authorize
                      Byvault Finance to verify my information and credit
                      history.
                    </p>
                  </div>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mb-20 lg:mb-8">
                <button
                  type="submit"
                  disabled={!formData.agreeToTerms || loading}
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
                      Submit Loan Application
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="w-5 h-5" />
                  Cancel
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

export default ApplyLoan;
