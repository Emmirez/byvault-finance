// pages/Business.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Building,
  Users,
  BarChart,
  CreditCard,
  Shield,
  TrendingUp,
  FileText,
  Check,
  ShoppingCart,
  ArrowLeft,
  Smartphone,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";

const Business = () => {
  const { t } = useLanguageContext();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 w-full overflow-hidden">
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
                    Business Banking
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
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80" // Business/office image
            alt="Business banking background"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/70 to-purple-900/70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6">
              Business Banking
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto">
              Comprehensive financial solutions designed to help your business
              grow and thrive
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center">
                <Shield className="mr-2" />
                <span>FDIC Insured</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="mr-2" />
                <span>Business Growth Tools</span>
              </div>
              <div className="flex items-center">
                <FileText className="mr-2" />
                <span>Online Management</span>
              </div>
            </div>
            <Link
              to="/register"
              className="inline-block px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Open Business Account
            </Link>
          </div>
        </div>
      </section>

      
      {/* Business Types */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold mb-4">
              Tailored Solutions
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Solutions for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Every Business
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Tailored banking services designed to help businesses of all sizes
              grow and thrive
            </p>
          </div>

          {/* Business Cards with Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                type: "Startups & SMEs",
                description: "Growth-focused banking for emerging businesses",
                icon: TrendingUp,
                features: [
                  "No minimum balance",
                  "Digital-first banking",
                  "Growth capital access",
                  "Business credit lines",
                ],
                image:
                  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80",
                color: "from-blue-500 to-cyan-500",
                stats: "+25% YoY Growth",
              },
              {
                type: "Enterprise",
                description: "Corporate solutions for large organizations",
                icon: Building,
                features: [
                  "Global transactions",
                  "Treasury management",
                  "M&A advisory",
                  "Risk management",
                ],
                image:
                  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w-800&q=80",
                color: "from-purple-500 to-pink-500",
                stats: "$10M+ Accounts",
              },
              {
                type: "E-commerce",
                description: "Digital payment and merchant solutions",
                icon: ShoppingCart,
                features: [
                  "Payment processing",
                  "Fraud protection",
                  "Multi-currency",
                  "Inventory financing",
                ],
                image:
                  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80",
                color: "from-green-500 to-emerald-500",
                stats: "2M+ Transactions",
              },
              {
                type: "Professional Services",
                description: "Banking for consultants and service providers",
                icon: Briefcase,
                features: [
                  "Client payment portals",
                  "Expense tracking",
                  "Tax optimization",
                  "Retirement planning",
                ],
                image:
                  "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80",
                color: "from-amber-500 to-orange-500",
                stats: "98% Satisfaction",
              },
            ].map((business, index) => (
              <div
                key={index}
                onClick={() => (window.location.href = "/login")}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 cursor-pointer"
              >
                {/* Background Image with Gradient Overlay */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={business.image}
                    alt={business.type}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-20`}
                  ></div>

                  {/* Stats Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-white text-xs font-semibold rounded-full">
                      {business.stats}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Icon */}
                  <div
                    className={`relative z-10 w-14 h-14 -mt-12 mb-4 rounded-xl bg-gradient-to-br ${business.color} flex items-center justify-center shadow-lg`}
                  >
                    <business.icon className="text-white" size={28} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {business.type}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                    {business.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-3 mb-6">
                    {business.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-700 dark:text-gray-300 text-sm"
                      >
                        <div
                          className={`w-5 h-5 rounded-full bg-gradient-to-br ${business.color} flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between w-full text-indigo-600 dark:text-indigo-400 font-medium text-sm group/btn">
                      <span>Explore Solutions</span>
                      <span className="transform group-hover/btn:translate-x-2 transition-transform duration-300">
                        →
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hover Effect Glow */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${business.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-2xl`}
                ></div>
              </div>
            ))}
          </div>

          {/* Bottom Stats Banner */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                50,000+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Business Clients
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                $15B+
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Assets Managed
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                24/7
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Support Available
              </div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-xl p-6 text-center">
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                98%
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Client Satisfaction
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Don't see your business type? We customize solutions for unique
              needs.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Get Custom Quote</span>
              <span className="ml-3 text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-sm font-semibold mb-4">
              Premium Products
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Business{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                Banking Products
              </span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Everything you need to manage, grow, and protect your business
              finances
            </p>
          </div>

          {/* Product Cards with Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Business Accounts",
                description: "High-yield checking and savings accounts",
                icon: CreditCard,
                features: [
                  "No monthly fees",
                  "Unlimited transactions",
                  "FDIC insured",
                  "Mobile check deposit",
                ],
                image:
                  "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=1200&q=80",
                color: "from-blue-500 to-cyan-500",
                badge: "Most Popular",
              },
              {
                name: "Merchant Services",
                description: "Complete payment processing solutions",
                icon: Smartphone,
                features: [
                  "POS systems",
                  "Online payments",
                  "Mobile payments",
                  "Fraud protection",
                ],
                image:
                  "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80",
                color: "from-purple-500 to-pink-500",
                badge: "Fast Setup",
              },
              {
                name: "Business Loans",
                description: "Flexible financing for growth",
                icon: TrendingUp,
                features: [
                  "Low interest rates",
                  "Quick approval",
                  "Flexible terms",
                  "No prepayment fees",
                ],
                image:
                  "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80",
                color: "from-green-500 to-emerald-500",
                badge: "Competitive Rates",
              },
              {
                name: "Treasury Services",
                description: "Advanced cash management tools",
                icon: Shield,
                features: [
                  "Automated payments",
                  "Fraud monitoring",
                  "Multi-currency",
                  "Investment options",
                ],
                image:
                  "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80",
                color: "from-amber-500 to-orange-500",
                badge: "Enterprise Grade",
              },
            ].map((product, index) => (
              <div
                key={index}
                onClick={() => (window.location.href = "/register")}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 cursor-pointer"
              >
                {/* Background Image with Gradient Overlay */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}
                  ></div>

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <div className="px-3 py-1.5 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-800 dark:text-white text-xs font-semibold rounded-full">
                      {product.badge}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Icon with Gradient Background */}
                  <div
                    className={`relative z-10 w-12 h-12 -mt-10 mb-4 rounded-xl bg-gradient-to-br ${product.color} flex items-center justify-center shadow-lg`}
                  >
                    <product.icon className="text-white" size={24} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                    {product.description}
                  </p>

                  {/* Features List with Icons */}
                  <ul className="space-y-3 mb-6">
                    {product.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center text-gray-700 dark:text-gray-300 text-sm"
                      >
                        <div
                          className={`w-6 h-6 rounded-full bg-gradient-to-br ${product.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300 flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <Check className="w-3 h-3 text-gray-600 dark:text-gray-400" />
                        </div>
                        <span className="group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <div className="w-full py-3 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 text-gray-800 dark:text-gray-300 rounded-lg font-medium text-sm hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 dark:hover:from-indigo-900/30 dark:hover:to-purple-900/30 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-300 group/btn flex items-center justify-center">
                    Learn More
                    <span className="ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300">
                      →
                    </span>
                  </div>
                </div>

                {/* Corner Accent */}
                <div
                  className={`absolute top-0 right-0 w-16 h-16 overflow-hidden`}
                >
                  <div
                    className={`absolute -top-8 -right-8 w-16 h-16 bg-gradient-to-br ${product.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 rounded-full`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Comparison Banner */}
          <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="lg:w-2/3">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Not Sure Which Product Is Right For You?
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Compare all products side-by-side or talk to our business
                  banking specialists
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact-support"
                  className="px-6 py-3 bg-purple-600 dark:bg-gray-800 text-white dark:text-indigo-400 font-semibold rounded-lg hover:bg-purple-700 dark:hover:bg-gray-700 transition-all duration-300 border border-indigo-200 dark:border-indigo-800"
                >
                  Talk to Specialist
                </Link>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <p className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider font-semibold">
                Trusted by businesses of all sizes
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  A+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  BBB Rating
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  250k+
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Business Clients
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Support
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 text-center border border-gray-200 dark:border-gray-700">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  99.9%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Uptime
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              All products come with dedicated account management and priority
              support
            </p>
            <Link
              to="/register"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1"
            >
              <span>Open Business Account Now</span>
              <span className="ml-3 text-xl animate-pulse">✨</span>
              <span className="ml-3 text-xl">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA - Updated with Image Background (Shorter Height) */}
      <section className="relative py-12 md:py-16">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80"
            alt="Business growth and consultation"
            className="w-full h-full object-cover"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/80 via-indigo-800/70 to-purple-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10 items-center">
            {/* Left Column - Call to Action */}
            <div className="text-white">
              {/* Badge */}
              <div className="inline-flex items-center px-3 py-1.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
                <span className="text-xs md:text-sm font-semibold">
                  Start Your Journey
                </span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Grow Your{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                  Business?
                </span>
              </h2>

              <p className="text-base md:text-lg text-indigo-100 mb-6 leading-relaxed">
                Schedule a consultation with our business banking specialists.
              </p>

              {/* Stats - Compact */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xl font-bold text-cyan-300">98%</div>
                  <div className="text-xs text-indigo-100">Satisfaction</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
                  <div className="text-xl font-bold text-cyan-300">24/7</div>
                  <div className="text-xs text-indigo-100">Support</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  to="/register"
                  className="px-6 py-3 bg-gradient-to-r from-white to-gray-100 text-indigo-600 font-semibold rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 text-center text-sm md:text-base"
                >
                  Open Account Now
                </Link>
                <Link
                  to="/contact-support"
                  className="px-6 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300 hover:border-cyan-300 text-center text-sm md:text-base"
                >
                  Book Consultation
                </Link>
              </div>
            </div>

            {/* Right Column - Resources Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-2xl">
              {/* Card Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white text-sm">📚</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Free Business Resources
                </h3>
              </div>

              {/* Resources List */}
              <ul className="space-y-3 mb-4">
                {[
                  {
                    icon: FileText,
                    text: "Business Plan Templates",
                    badge: "Free",
                  },
                  {
                    icon: BarChart,
                    text: "Financial Calculators",
                    badge: "Interactive",
                  },
                  {
                    icon: Shield,
                    text: "Compliance Guides",
                    badge: "2024",
                  },
                  {
                    icon: TrendingUp,
                    text: "Growth Webinars",
                    badge: "Live",
                  },
                ].map((resource, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-md bg-indigo-50 dark:bg-gray-700 flex items-center justify-center mr-3">
                        <resource.icon className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <span className="text-gray-800 dark:text-gray-200 font-medium group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-sm">
                        {resource.text}
                      </span>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full">
                      {resource.badge}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Card Footer */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
                  Access all resources immediately
                </p>
                <Link
                  to="/register"
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:from-indigo-100 hover:to-purple-100 dark:hover:from-gray-600 dark:hover:to-gray-700 transition-all duration-300 group/access flex items-center justify-center text-sm"
                >
                  Access All Resources
                  <span className="ml-2 transform group-hover/access:translate-x-1 transition-transform">
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Business;
