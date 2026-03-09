// src/pages/user/PayBills/TvBill.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tv,
  AlertCircle,
  Loader,
  DollarSign,
  FileText,
  Film,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import BillHold from "./BillHold";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const TvBill = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    provider: "",
    subscriptionPlan: "",
    smartCardNumber: "",
    amount: "",
    subscriberName: "",
  });

  const providers = [
    "SkyView Satellite TV",
    "CableVision Premium",
    "StreamMax Television",
    "DigitalTV Services",
    "HomeCable Networks",
  ];

  const subscriptionPlans = [
    { name: "Basic Package - $15/month", value: "15" },
    { name: "Standard Package - $30/month", value: "30" },
    { name: "Premium Package - $50/month", value: "50" },
    { name: "Sports Package - $40/month", value: "40" },
    { name: "Movies & Series - $45/month", value: "45" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    // Auto-fill amount when subscription plan is selected
    if (name === "subscriptionPlan" && value) {
      setFormData((prev) => ({
        ...prev,
        amount: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.provider) {
      setError("Please select your TV provider");
      return;
    }
    if (!formData.subscriptionPlan) {
      setError("Please select a subscription plan");
      return;
    }
    if (!formData.smartCardNumber || formData.smartCardNumber.length < 8) {
      setError("Please enter a valid smart card number");
      return;
    }
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setShowHold(true);
    }, 2000);
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

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
        pageTitle="TV Subscription"
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
            <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Tv size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">TV Subscription</h2>
                  <p className="text-white/90 text-sm">Renew your cable & streaming services</p>
                </div>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-red-600 dark:text-red-400 flex-shrink-0" size={20} />
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    TV Provider
                  </label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select your provider</option>
                    {providers.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Subscription Plan
                  </label>
                  <select
                    name="subscriptionPlan"
                    value={formData.subscriptionPlan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select your plan</option>
                    {subscriptionPlans.map((plan) => (
                      <option key={plan.value} value={plan.value}>
                        {plan.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Smart Card Number
                  </label>
                  <div className="relative">
                    <Film
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="smartCardNumber"
                      value={formData.smartCardNumber}
                      onChange={handleChange}
                      placeholder="Enter smart card number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Subscriber Name (Optional)
                  </label>
                  <input
                    type="text"
                    name="subscriberName"
                    value={formData.subscriberName}
                    onChange={handleChange}
                    placeholder="Enter subscriber name"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Amount
                  </label>
                  <div className="relative">
                    <DollarSign
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                      step="0.01"
                      disabled={formData.subscriptionPlan}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>
                  {formData.subscriptionPlan && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Amount is set by selected subscription plan
                    </p>
                  )}
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="text-indigo-600 dark:text-indigo-400 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        Subscription Benefits
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Instant subscription activation</li>
                        <li>• 30-day validity period</li>
                        <li>• Confirmation SMS & email</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Tv size={20} />
                      Renew Subscription
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      {/* Hold Modal */}
      {showHold && (
        <BillHold
          billDetails={{
            type: "tv",
            provider: formData.provider,
            amount: formData.amount,
            accountNumber: formData.smartCardNumber,
            accountName: formData.subscriberName || formData.smartCardNumber,
            meterLabel: "Smart Card Number",
            email: userEmail,
            subscriptionPlan: formData.subscriptionPlan,
          }}
          onClose={() => setShowHold(false)}
        />
      )}

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default TvBill;