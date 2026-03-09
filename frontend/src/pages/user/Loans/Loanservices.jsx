import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Users,
  CreditCard,
  Heart,
  Clock,
  TrendingDown,
  FileText,
  Shield,
  Layers,
  Home,
  Car,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useAuth } from "../../../contexts/AuthContext";
import { useDarkMode } from "../../../hooks/useDarkMode";

const LoanServices = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : "User";

  const handleApplyLoan = () => {
    navigate("/apply-loan");
  };

  const benefits = [
    {
      icon: Clock,
      title: "Quick Approval",
      description: "Get a decision within hours and funds within days",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: TrendingDown,
      title: "Competitive Rates",
      description: "Low interest rates tailored to your credit profile",
      color:
        "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    },
    {
      icon: FileText,
      title: "Simple Process",
      description: "Straightforward application with minimal paperwork",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Shield,
      title: "Secure & Confidential",
      description: "Your information is protected with bank-level security",
      color:
        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    },
  ];

  const loanTypes = [
    {
      icon: Home,
      title: "Personal Home Loans",
      description: "Finance your dream home with competitive rates",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Car,
      title: "Automobile Loans",
      description: "Get on the road with flexible auto financing",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Briefcase,
      title: "Business Loans",
      description: "Grow your business with tailored financing solutions",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Users,
      title: "Joint Mortgage",
      description: "Share responsibility with a co-borrower",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: CreditCard,
      title: "Secured Overdraft",
      description: "Access funds when needed with asset backing",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
    {
      icon: Heart,
      title: "Health Finance",
      description: "Cover medical expenses with flexible payment options",
      color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    },
  ];

  const howItWorksSteps = [
    {
      step: 1,
      title: "Apply Online",
      description:
        "Complete our simple online application form with your details and loan requirements",
    },
    {
      step: 2,
      title: "Quick Review",
      description:
        "Our team reviews your application and may contact you for additional information",
    },
    {
      step: 3,
      title: "Approval & Disbursement",
      description:
        "Once approved, the loan amount will be transferred to your account",
    },
  ];

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
        pageTitle="Loan Services"
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
          <div className="max-w-4xl mx-auto p-4 lg:p-8">
            {/* Why Choose Our Loan Services */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Why Choose Our Loan Services
                </h2>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl"
                  >
                    <div
                      className={`w-12 h-12 ${benefit.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <benefit.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Loan Types */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <Layers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Available Loan Types
                </h2>
              </div>

              <div className="space-y-4">
                {loanTypes.map((loan, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                    onClick={handleApplyLoan}
                  >
                    <div
                      className={`w-12 h-12 ${loan.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                    >
                      <loan.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                        {loan.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {loan.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  How It Works
                </h2>
              </div>

              <div className="space-y-6">
                {howItWorksSteps.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {item.step}
                        </span>
                      </div>
                      {index < howItWorksSteps.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                      )}
                    </div>
                    <div className="pb-6">
                      <h3 className="font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ready to Get Started CTA */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-center text-white mb-20 lg:mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold mb-3">
                Ready to get started?
              </h2>
              <p className="text-blue-50 mb-6 max-w-md mx-auto">
                Apply now and get a decision on your loan application quickly
              </p>
              <button
                onClick={handleApplyLoan}
                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                <ExternalLink className="w-5 h-5" />
                Apply for a Loan
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation */}
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default LoanServices;