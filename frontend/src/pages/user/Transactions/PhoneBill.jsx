// src/pages/user/PayBills/PhoneBill.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Phone,
  AlertCircle,
  Loader,
  DollarSign,
  FileText,
  Smartphone,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import BillHold from "./BillHold";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const PhoneBill = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showHold, setShowHold] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    provider: "",
    serviceType: "",
    phoneNumber: "",
    amount: "",
    dataBundle: "",
  });

  const providers = [
    "TelcoNet Mobile",
    "PhoneLink Communications",
    "WirelessPlus Services",
    "MobileConnect Ltd",
    "GlobalTel Networks",
  ];

  const serviceTypes = [
    "Airtime Recharge",
    "Data Bundle",
    "Monthly Bill Payment",
    "International Plan",
  ];

  const dataBundles = [
    { name: "1GB - $5", value: "5" },
    { name: "5GB - $20", value: "20" },
    { name: "10GB - $35", value: "35" },
    { name: "20GB - $60", value: "60" },
    { name: "50GB - $120", value: "120" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");

    // Auto-fill amount when data bundle is selected
    if (name === "dataBundle" && value) {
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
      setError("Please select your mobile provider");
      return;
    }
    if (!formData.serviceType) {
      setError("Please select service type");
      return;
    }
    if (!formData.phoneNumber || formData.phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
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
        pageTitle="Phone & Mobile"
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
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                  <Phone size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold mb-1">Mobile Services</h2>
                  <p className="text-white/90 text-sm">Airtime, data & bill payments</p>
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
                    Mobile Provider
                  </label>
                  <select
                    name="provider"
                    value={formData.provider}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
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
                    Service Type
                  </label>
                  <select
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                  >
                    <option value="">Select service type</option>
                    {serviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.serviceType === "Data Bundle" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Select Data Bundle
                    </label>
                    <select
                      name="dataBundle"
                      value={formData.dataBundle}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                    >
                      <option value="">Choose a data bundle</option>
                      {dataBundles.map((bundle) => (
                        <option key={bundle.value} value={bundle.value}>
                          {bundle.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all"
                    />
                  </div>
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
                      disabled={formData.serviceType === "Data Bundle" && formData.dataBundle}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>
                  {formData.serviceType === "Data Bundle" && formData.dataBundle && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Amount is set by selected data bundle
                    </p>
                  )}
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <FileText className="text-green-600 dark:text-green-400 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        Quick & Easy
                      </h4>
                      <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <li>• Instant recharge activation</li>
                        <li>• Real-time balance update</li>
                        <li>• SMS confirmation included</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Phone size={20} />
                      {formData.serviceType === "Airtime Recharge" ? "Recharge Now" : "Pay Bill"}
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
            type: "mobile",
            provider: formData.provider,
            amount: formData.amount,
            accountNumber: formData.phoneNumber,
            accountName: formData.phoneNumber,
            meterLabel: "Phone Number",
            email: userEmail,
            serviceType: formData.serviceType,
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

export default PhoneBill;