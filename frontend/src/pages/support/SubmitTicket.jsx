// src/pages/user/Support/SubmitTicket.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  Bookmark,
  Flag,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Loader,
  Info,
  HelpCircle,
  X,
  Home,
  Ticket,
} from "lucide-react";
import Header from "../../components/layout/UserNav/Header";
import Sidebar from "../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { supportService } from "../../services/supportService";
import { useDarkMode } from "../../hooks/useDarkMode";

const SubmitTicket = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [submittedTicket, setSubmittedTicket] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    priority: "Low Priority",
    description: "",
  });

  const priorityLevels = [
    "Low Priority",
    "Medium Priority",
    "High Priority",
    "Urgent",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Please provide a ticket title");
      return;
    }
    if (!formData.description.trim()) {
      setError("Please describe your issue");
      return;
    }
    if (formData.description.trim().length < 10) {
      setError(
        "Please provide more details about your issue (at least 10 characters)",
      );
      return;
    }

    setLoading(true);

    try {
      const response = await supportService.submitTicket(formData);

      if (response.success) {
        setSubmittedTicket(response.ticket);
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error submitting ticket:", error);
      setError(error.message || "Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
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

  // Success Screen
  if (success && submittedTicket) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl border border-green-100 dark:border-gray-700 relative">
          {/* Close button */}
          <button
            onClick={() => navigate("/support")}
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
            Ticket Submitted!
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your support ticket has been successfully submitted
          </p>

          {/* Ticket Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 mb-6 text-left">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Ticket Number
              </span>
              <span className="text-sm font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
                {submittedTicket.ticketNumber}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Title
              </span>
              <span className="font-medium text-gray-900 dark:text-white">
                {submittedTicket.title}
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Priority
              </span>
              <span
                className={`font-medium ${
                  submittedTicket.priority === "Urgent"
                    ? "text-red-600 dark:text-red-400"
                    : submittedTicket.priority === "High Priority"
                      ? "text-orange-600 dark:text-orange-400"
                      : "text-blue-600 dark:text-blue-400"
                }`}
              >
                {submittedTicket.priority}
              </span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-600">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Status
              </span>
              <span className="text-sm bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-full capitalize">
                {submittedTicket.status}
              </span>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center justify-center gap-2">
              <Info size={18} className="text-blue-500" />
              Response time: 24-48 hours
            </p>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/support/tickets")}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Ticket size={18} />
              View My Tickets
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
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Submit Ticket"
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
            {/* Header Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Send
                    size={24}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                    Submit a Support Ticket
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    We're here to help. Tell us about your issue and we'll find
                    a solution.
                  </p>
                </div>
              </div>

              {/* Help Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                  <HelpCircle
                    size={40}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
              </div>

              {/* Ticket Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle
                      className="text-red-600 dark:text-red-400 flex-shrink-0"
                      size={20}
                    />
                    <p className="text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  </div>
                )}

                {/* Ticket Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Ticket Title
                  </label>
                  <div className="relative">
                    <Bookmark
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Briefly describe your issue"
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Be specific to help us understand your issue
                  </p>
                </div>

                {/* Priority Level */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Priority Level
                  </label>
                  <div className="relative">
                    <Flag
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                      size={20}
                    />
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all appearance-none"
                    >
                      {priorityLevels.map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Select based on urgency of your request
                  </p>
                </div>

                {/* Describe Your Issue */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Describe Your Issue
                  </label>
                  <div className="relative">
                    <MessageSquare
                      className="absolute left-4 top-4 text-gray-400"
                      size={20}
                    />
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Please provide all relevant details about your issue so we can help you better"
                      rows={6}
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Include any relevant details that might help us resolve your
                    issue
                  </p>
                </div>

                {/* Support Information */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <Info
                      className="text-blue-600 dark:text-blue-400 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                        Support Information
                      </h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Our support team typically responds within 24-48 hours.
                        For urgent matters, please select "Urgent" and we'll
                        prioritize your request.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Submitting Ticket...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Submit Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default SubmitTicket;
