// pages/Checking.jsx (Fixed - uniform card heights)
import React from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Shield,
  Clock,
  Smartphone,
  CheckCircle,
  DollarSign,
  Lock,
  Users,
  ArrowLeft,
  Check,
  Zap,
  ArrowRight,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";
import { CTASection } from "../components/sections/CTA";
import Features from "../components/sections/Features.jsx";

const Checking = () => {
  const { t } = useLanguageContext();

  const checkingAccounts = [
    {
      name: "Everyday Checking",
      description: "Perfect for daily transactions with no minimum balance",
      features: [
        "No monthly fee with $500+ balance",
        "Free debit card",
        "Mobile check deposit",
        "Overdraft protection",
      ],
      apy: "0.01%",
      monthlyFee: "$0 with $500 balance",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: CreditCard,
      iconBg: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-600 dark:text-blue-400",
    },
    {
      name: "Premium Checking",
      description: "Enhanced benefits with higher interest rates",
      features: [
        "Higher interest rates",
        "Free checks",
        "ATM fee reimbursements",
        "Priority customer service",
      ],
      apy: "0.05%",
      monthlyFee: "$25 (waived with $5,000+ balance)",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: Shield,
      iconBg: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-600 dark:text-purple-400",
    },
    {
      name: "Student Checking",
      description: "Designed for students with special benefits",
      features: [
        "No monthly fees for students",
        "Overdraft forgiveness",
        "Free budgeting tools",
        "Campus ATM access",
      ],
      apy: "0.01%",
      monthlyFee: "$0",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      icon: Users,
      iconBg: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-600 dark:text-green-400",
    },
  ];

  const features = [
    {
      icon: Clock,
      title: "24/7 Access",
      description: "Access your account anytime with online and mobile banking",
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Shield,
      title: "FDIC Insured",
      description: "Up to $250,000 in deposit insurance per account",
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: Smartphone,
      title: "Mobile Banking",
      description:
        "Deposit checks, pay bills, and transfer funds from your phone",
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: Lock,
      title: "Overdraft Protection",
      description: "Link to savings to avoid overdraft fees",
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-orange-100 dark:bg-orange-900",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
      />

      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  to="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-400 dark:hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <span className="mx-2 text-gray-400">/</span>
                  <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Checking Accounts
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section - Image Background */}
      <section className="relative text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&q=80"
            alt="Checking accounts and banking"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="opacity-40 absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-950/60"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/30">
              <CreditCard className="w-5 h-5" />
              <span className="text-sm font-semibold">No Monthly Fees</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Checking Accounts
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Choose the perfect checking account for your lifestyle with
              competitive rates and no hidden fees
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Shield className="w-4 h-4" />
                <span>FDIC Insured</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Smartphone className="w-4 h-4" />
                <span>Mobile Banking</span>
              </div>
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
                <Zap className="w-4 h-4" />
                <span>Instant Transfers</span>
              </div>
            </div>

            <Link
              to="/register"
              className="group inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
            >
              Open an Account
              <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Account Options - Clean minimal style matching the screenshot */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Checking Account
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our full range of banking products and services
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {checkingAccounts.map((account, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Icon Badge */}
                <div
                  className={`w-12 h-12 rounded-xl ${account.iconBg} flex items-center justify-center mb-6`}
                >
                  <account.icon className={`w-6 h-6 ${account.iconColor}`} />
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {account.name}
                </h3>

                {/* Description */}
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {account.description}
                </p>

                {/* Learn More Link */}
                <Link
                  to="/register"
                  className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold hover:gap-2 transition-all group"
                >
                  Learn more
                  <svg
                    className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="w-full overflow-hidden">
        <Features t={t} />
      </section>

      {/*CTA*/}
      <section className="w-full overflow-hidden">
        <CTASection
          title={t("landing.cta.readyToGetStarted")}
          description={t("landing.cta.openAccountToday")}
          primaryButtonText={t("landing.cta.openAnAccount")}
          primaryButtonLink="/register"
          secondaryButtonText={t("landing.cta.scheduleAppointment")}
          secondaryButtonAction={() =>
            alert("Schedule appointment feature coming soon!")
          }
          showLoginLink={true}
          t={t}
        />
      </section>

      <Footer />
    </div>
  );
};

export default Checking;
