// pages/Loans.jsx
import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Car,
  GraduationCap,
  Calculator,
  Clock,
  Shield,
  CheckCircle,
  DollarSign,
  ArrowLeft,
  ArrowUp,
  Building,
  User,
} from "lucide-react";
import Header from "../components/header/header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";

const Loans = () => {
  const { t } = useLanguageContext();
  const [loanType, setLoanType] = useState("home");
  const [loanAmount, setLoanAmount] = useState(25000);
  const [loanTerm, setLoanTerm] = useState(36);
  const [monthlyPayment, setMonthlyPayment] = useState(750);
  const [totalInterest, setTotalInterest] = useState(2000);

  const loanDetailsRef = useRef(null);

  const loanTypes = [
    {
      id: "home",
      name: "Home Loans",
      rates: "From 3.5% APR",
      icon: Home,
      color: "from-blue-500 to-cyan-500",
      image:
        "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
      category: "Real Estate",
      detailImage:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    },
    {
      id: "auto",
      name: "Auto Loans",
      rates: "From 2.9% APR",
      icon: Car,
      color: "from-green-500 to-emerald-500",
      image:
        "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
      category: "Vehicle Financing",
      detailImage:
        "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&q=80",
    },
    {
      id: "personal",
      name: "Personal Loans",
      rates: "From 5.9% APR",
      icon: User,
      color: "from-purple-500 to-pink-500",
      image:
        "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
      category: "Personal Finance",
      detailImage:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&q=80",
    },
    {
      id: "student",
      name: "Student Loans",
      rates: "From 4.5% APR",
      icon: GraduationCap,
      color: "from-amber-500 to-orange-500",
      image:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80",
      category: "Education",
      detailImage: "",
    },
    {
      id: "business",
      name: "Business Loans",
      rates: "From 4.5% APR",
      icon: Building,
      color: "from-indigo-500 to-purple-500",
      image:
        "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800&q=80",
      category: "Business Growth",
      detailImage:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
    },
  ];

  const loanDetails = {
    home: {
      title: "Home Mortgage Loans",
      description:
        "Purchase or refinance your home with competitive rates and flexible terms.",
      features: [
        "Fixed rates from 6.25% APR",
        "Adjustable rates available",
        "Up to 95% loan-to-value",
        "No PMI with 20% down payment",
        "Online application in minutes",
      ],
      terms: ["15-year", "20-year", "30-year"],
      maxAmount: "$2,000,000",
      category: "Real Estate",
    },
    auto: {
      title: "Auto Loans",
      description:
        "Finance new or used vehicles with low rates and fast approval.",
      features: [
        "Rates from 4.99% APR for qualified buyers",
        "Up to 84-month terms",
        "100% financing available",
        "Gap insurance included",
        "Pre-approval in 5 minutes",
      ],
      terms: ["36-month", "48-month", "60-month", "72-month", "84-month"],
      maxAmount: "$100,000",
      category: "Vehicle Financing",
    },
    personal: {
      title: "Personal Loans",
      description: "Borrow for any purpose with fixed monthly payments.",
      features: [
        "Rates from 7.99% APR",
        "Loan amounts $1,000 - $50,000",
        "No collateral required",
        "Fixed monthly payments",
        "Funds as fast as same day",
      ],
      terms: ["12-month", "24-month", "36-month", "48-month", "60-month"],
      maxAmount: "$50,000",
      category: "Personal Finance",
    },
    student: {
      title: "Student Loans",
      description: "Cover education costs with deferred payment options.",
      features: [
        "Undergraduate rates from 4.50% APR",
        "Graduate rates from 5.99% APR",
        "Defer payments until after graduation",
        "Cosigner release available",
        "Multi-year approval",
      ],
      terms: ["5-year", "10-year", "15-year", "20-year"],
      maxAmount: "Cost of attendance",
      category: "Education",
    },
    business: {
      title: "Business Loans",
      description: "Fund your business growth with flexible financing options.",
      features: [
        "Rates from 6.99% APR",
        "Loan amounts up to $500,000",
        "Flexible repayment terms",
        "No prepayment penalties",
        "Fast funding in 2-5 days",
      ],
      terms: ["12-month", "24-month", "36-month", "48-month", "60-month"],
      maxAmount: "$500,000",
      category: "Business Growth",
    },
  };

  const currentLoan = loanDetails[loanType];
  const currentLoanData = loanTypes.find((loan) => loan.id === loanType);

  const handleLoanTypeClick = (type) => {
    setLoanType(type);

    setTimeout(() => {
      if (loanDetailsRef.current) {
        loanDetailsRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  useEffect(() => {
    // Calculate monthly payment and total interest based on loan amount and term
    const calculatePayments = () => {
      const principal = loanAmount;
      const annualRate = 0.06; // 6% annual interest rate (adjust based on loan type)
      const monthlyRate = annualRate / 12;
      const months = loanTerm;

      // Calculate monthly payment using the formula: P * r * (1+r)^n / ((1+r)^n - 1)
      if (monthlyRate === 0) {
        // If interest rate is 0, payment is just principal divided by months
        const monthly = principal / months;
        setMonthlyPayment(monthly);
        setTotalInterest(0);
      } else {
        const monthly =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);
        setMonthlyPayment(monthly);
        setTotalInterest(monthly * months - principal);
      }
    };

    calculatePayments();
  }, [loanAmount, loanTerm]);

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
                    Loans
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative text-white">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80"
            alt="Loan Solutions - Financial growth and opportunities"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-indigo-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Loan Solutions
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Achieve your dreams with flexible financing options and
              competitive rates
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <Clock className="mr-2" />
                <span>Fast Approval</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <Shield className="mr-2" />
                <span>Secure Process</span>
              </div>
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 border border-white/30">
                <Calculator className="mr-2" />
                <span>Easy Payments</span>
              </div>
            </div>
            <Link
              to="/login"
              className="inline-block px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* Loan Type Selector */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {loanTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => handleLoanTypeClick(type.id)}
                className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ${
                  loanType === type.id
                    ? `ring-4 ring-opacity-50 ring-blue-500 scale-[1.02] shadow-2xl`
                    : "hover:scale-[1.02] hover:shadow-xl"
                }`}
              >
                {/* Background Image */}
                <div className="absolute inset-0">
                  <img
                    src={type.image}
                    alt={type.name}
                    className="w-full h-full object-cover"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${type.color} ${
                      loanType === type.id ? "opacity-80" : "opacity-60"
                    }`}
                  ></div>
                </div>

                {/* Content */}
                <div className="relative z-10 text-center">
                  <div className="w-14 h-14 mx-auto mb-4 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <type.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="font-bold text-lg text-white mb-1">
                    {type.name}
                  </div>
                  <div className="text-white/90 text-sm mb-3">{type.rates}</div>

                  {/* Active Indicator */}
                  {loanType === type.id && (
                    <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-medium">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                      Selected
                    </div>
                  )}
                </div>

                {/* Hover Effect */}
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Loan Details */}
      <section ref={loanDetailsRef} className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column - Loan Info */}
            <div>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
                {currentLoan.category}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {currentLoan.title}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {currentLoan.description}
              </p>

              {/* Key Features */}
              <div className="mb-10">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-3">
                    <span className="text-white">✓</span>
                  </div>
                  Key Features
                </h3>
                <ul className="space-y-4">
                  {currentLoan.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-center text-gray-700 dark:text-gray-300 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center mr-4 flex-shrink-0">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="font-medium group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Loan Details Card */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center mr-4">
                    <span className="text-white text-lg">💰</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Loan Details
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Max Loan Amount
                    </div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">
                      {currentLoan.maxAmount}
                    </div>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Available Terms
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {currentLoan.terms.map((term, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium"
                        >
                          {term}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <button
                  onClick={() => (window.location.href = "/login")}
                  className="w-full mt-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                  Apply for {currentLoan.title}
                </button>
              </div>
            </div>

            {/* Right Column - Image & Calculator */}
            <div className="sticky top-24">
              {/* Loan Image */}
              <div className="relative rounded-2xl overflow-hidden mb-8">
                <img
                  src={currentLoanData?.detailImage || currentLoanData?.image}
                  alt={currentLoan.title}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm font-medium mb-1">
                    Visualize Your Goal
                  </div>
                  <div className="text-2xl font-bold">{currentLoan.title}</div>
                </div>
              </div>

              {/* Quick Calculator */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Calculate Your Payment
                </h3>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Loan Amount
                    </label>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="1000"
                        max="500000"
                        step="1000"
                        value={loanAmount}
                        onChange={(e) => setLoanAmount(Number(e.target.value))}
                        className="w-full h-2 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                          $
                        </div>
                        <input
                          type="number"
                          min="1000"
                          max="500000"
                          step="1000"
                          value={loanAmount}
                          onChange={(e) => {
                            const value = Math.min(
                              Math.max(Number(e.target.value), 1000),
                              500000,
                            );
                            setLoanAmount(value);
                          }}
                          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white text-center font-semibold"
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>$1,000</span>
                        <span>$250,000</span>
                        <span>$500,000</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Loan Term
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[12, 24, 36, 48, 60, 72].map((term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setLoanTerm(term)}
                          className={`py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                            loanTerm === term
                              ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg scale-105"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                          }`}
                        >
                          {term} mo
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Monthly Payment
                          </div>
                          <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                            ${monthlyPayment.toFixed(2)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Total Interest
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            ${totalInterest.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Total Amount
                          </span>
                          <span className="font-bold text-gray-900 dark:text-white">
                            ${(loanAmount + totalInterest).toFixed(2)}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Principal + Interest over {loanTerm} months
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => (window.location.href = "/login")}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple Application Process
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Get pre-approved in just a few steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  1
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Check Rates
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                See your personalized rates without affecting your credit score
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  2
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Apply Online
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Complete our secure application in about 10 minutes
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  3
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Get Decision
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Receive instant decision on most applications
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                  4
                </span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Receive Funds
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Get funds as fast as the same day after approval
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <button
              onClick={() => (window.location.href = "/login")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>Start Your Application</span>
              <span className="ml-3 text-xl">→</span>
            </button>
          </div>
        </div>
      </section>

      

      <Footer />
    </div>
  );
};

export default Loans;
