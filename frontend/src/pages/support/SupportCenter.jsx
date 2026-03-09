// src/pages/user/Support/SupportCenter.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Headphones,
  Send,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Clock,
  Zap,
  HelpCircle,
  ArrowRight,
  Wallet,
  CreditCard,
  Shield,
  TrendingUp,
  PlusCircle,
  Ticket,
  Eye,
} from "lucide-react";
import Header from "../../components/layout/UserNav/Header";
import Sidebar from "../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../contexts/AuthContext";
import { useDarkMode } from "../../hooks/useDarkMode";

const SupportCenter = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqItems = [
    {
      id: 1,
      icon: Send,
      question: "How to make a transfer?",
      answer:
        "To make a transfer, go to the Transfer section from your dashboard. Select either Local Transfer or International Wire, enter the recipient's details, amount, and confirm with your transaction PIN.",
    },
    {
      id: 2,
      icon: CreditCard,
      question: "How to apply for a card?",
      answer:
        "Navigate to the Cards section, select 'Request New Card', choose your preferred card type (Debit or Credit), fill in the required information, and submit your application. Processing typically takes 5-7 business days.",
    },
    {
      id: 3,
      icon: Wallet,
      question: "How to check my balance?",
      answer:
        "Your account balance is displayed prominently on your dashboard home screen. You can also view detailed balance information and transaction history in the Activity section.",
    },
    {
      id: 4,
      icon: Shield,
      question: "How to enable 2FA?",
      answer:
        "Go to Settings > Two-Factor Authentication. Toggle the switch to enable 2FA. You'll receive a verification code via email each time you log in for enhanced security.",
    },
    {
      id: 5,
      icon: PlusCircle,
      question: "How to deposit funds?",
      answer:
        "Click on Deposit from the dashboard, select your preferred payment method, and follow the instructions. Deposits are typically processed instantly for most payment methods.",
    },
    {
      id: 6,
      icon: TrendingUp,
      question: "How to track transactions?",
      answer:
        "Visit the Activity section to view all your transactions. You can filter by date, type, or amount. Each transaction includes detailed information including status, timestamp, and reference number.",
    },
  ];

  const toggleFaq = (id) => {
    setExpandedFaq(expandedFaq === id ? null : id);
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
        pageTitle="Support Center"
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
            {/* Ticket Status Card - NEW */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                    <Ticket size={24} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Your Tickets</h3>
                    <p className="text-sm text-white/80">
                      View and track support requests
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate("/support/tickets")}
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Eye size={16} />
                  View Tickets
                </button>
              </div>
            </div>

            {/* Submit Ticket Card */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Headphones
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

              <button
                onClick={() => navigate("/support/submit-ticket")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <Send size={20} />
                Submit Ticket
              </button>
            </div>

            {/* Quick Help Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <HelpCircle
                    size={24}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Quick Help
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Find answers to common questions
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {faqItems.map((item) => {
                  const Icon = item.icon;
                  const isExpanded = expandedFaq === item.id;

                  return (
                    <div
                      key={item.id}
                      className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFaq(item.id)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon
                              size={20}
                              className="text-gray-600 dark:text-gray-400"
                            />
                          </div>
                          <span className="font-medium text-gray-900 dark:text-white text-left">
                            {item.question}
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp
                            size={20}
                            className="text-gray-400 flex-shrink-0"
                          />
                        ) : (
                          <ChevronDown
                            size={20}
                            className="text-gray-400 flex-shrink-0"
                          />
                        )}
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-4 pt-2">
                          <p className="text-sm text-gray-600 dark:text-gray-400 pl-13">
                            {item.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                Quick Links
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/support/tickets")}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                >
                  <Ticket
                    size={20}
                    className="text-blue-600 dark:text-blue-400 mb-2"
                  />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    My Tickets
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    View all requests
                  </p>
                </button>
                <button
                  onClick={() => navigate("/support/submit-ticket")}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                >
                  <Send
                    size={20}
                    className="text-green-600 dark:text-green-400 mb-2"
                  />
                  <p className="font-medium text-gray-900 dark:text-white text-sm">
                    New Ticket
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Create a request
                  </p>
                </button>
              </div>
            </div>

            {/* Still Need Help Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-20 lg:mb-8">
              <h3 className="text-center font-semibold text-gray-900 dark:text-white mb-6">
                Still need help?
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Clock
                      size={28}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    24/7 Support
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <MessageSquare
                      size={28}
                      className="text-green-600 dark:text-green-400"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Live Chat
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <Zap
                      size={28}
                      className="text-purple-600 dark:text-purple-400"
                    />
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white">
                    Fast Response
                  </p>
                </div>
              </div>
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

export default SupportCenter;
