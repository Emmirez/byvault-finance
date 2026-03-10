// pages/WealthManagement.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  PieChart,
  Target,
  Shield,
  Users,
  Globe,
  Building,
  DollarSign,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  CheckCircle2,
  BarChart3,
  Lock,
  Award,
  Briefcase,
  Zap,
  ChevronUp,
  Calendar,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";
import Features from "../components/sections/Features.jsx";

const WealthManagement = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [hoveredTeam, setHoveredTeam] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const services = [
    {
      title: "Investment Management",
      description: "Customized portfolio strategies aligned with your goals",
      icon: PieChart,
      color: "from-blue-500 to-cyan-500",
      features: [
        "Diversified portfolios",
        "Risk management",
        "Performance tracking",
      ],
    },
    {
      title: "Retirement Planning",
      description: "Comprehensive strategies for your golden years",
      icon: Target,
      color: "from-emerald-500 to-teal-500",
      features: [
        "Pension planning",
        "401(k) optimization",
        "Income strategies",
      ],
    },
    {
      title: "Estate Planning",
      description: "Preserve and transfer wealth across generations",
      icon: Lock,
      color: "from-amber-500 to-orange-500",
      features: ["Trust structures", "Asset protection", "Succession planning"],
    },
    {
      title: "Tax Optimization",
      description: "Strategies to minimize tax liabilities",
      icon: Zap,
      color: "from-rose-500 to-pink-500",
      features: [
        "Tax-efficient investing",
        "Liability reduction",
        "Compliance",
      ],
    },
  ];

  const wealthLevels = [
    {
      name: "Premier Banking",
      minimum: "$100K+",
      features: [
        "Priority Banking Services",
        "Preferred Rates & Pricing",
        "Financial Advisory",
        "Enhanced Digital Tools",
        "Dedicated Support",
      ],
      color: "from-emerald-600 to-teal-600",
      icon: Briefcase,
    },
    {
      name: "Wealth Management",
      minimum: "$500K+",
      features: [
        "Financial Planning",
        "Investment Advisory",
        "Retirement Strategies",
        "Education Funding",
        "Relationship Manager",
      ],
      color: "from-blue-600 to-cyan-600",
      icon: BarChart3,
      highlighted: true,
    },
    {
      name: "Private Banking",
      minimum: "$1M+",
      features: [
        "Dedicated Relationship Manager",
        "Custom Credit Solutions",
        "Family Office Services",
        "Concierge Banking",
        "Global Access",
      ],
      color: "from-rose-600 to-pink-600",
      icon: Building,
    },
  ];

  const team = [
    {
      name: "Michael Chen",
      title: "Estate Planning Director",
      experience: "20+ years",
      specialization: "Estate & Legacy Planning",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1472099645785-5658abf4ff4e",
      expertise: ["Estate", "Trusts", "Legacy"],
      bio: "Expert in multi-generational wealth transfer and complex estate structures.",
      clients: 850,
      awards: 12,
    },
    {
      name: "David Rodriguez",
      title: "Chief Investment Officer",
      experience: "18+ years",
      specialization: "Global Markets & Asset Allocation",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1507003211169-0a1dd7228f2d",
      expertise: ["Global Markets", "Asset Allocation", "Risk Management"],
      bio: "Former hedge fund manager specializing in global market strategies and tactical asset allocation.",
      clients: 950,
      awards: 15,
    },
    {
      name: "Lisa Thompson",
      title: "Business Wealth Advisor",
      experience: "16+ years",
      specialization: "Business Succession & Exit Planning",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1580489944761-15a19d654956",
      expertise: ["Succession", "Exit Strategy", "Business Valuation"],
      bio: "Helps business owners maximize value and execute seamless ownership transitions.",
      clients: 700,
      awards: 11,
    },
    {
      name: "Emily Parker",
      title: "Philanthropy Advisor",
      experience: "10+ years",
      specialization: "Charitable Giving & Foundations",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1534528741775-53994a69daeb",
      expertise: ["Philanthropy", "Foundations", "Impact Investing"],
      bio: "Helps families create meaningful charitable legacies through strategic giving and foundations.",
      clients: 450,
      awards: 7,
    },
    {
      name: "Marcus Johnson",
      title: "Alternative Investments Director",
      experience: "13+ years",
      specialization: "Private Equity & Real Estate",
      image:
        "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1508214751196-bcfd4ca60f91",
      expertise: ["Private Equity", "Real Estate", "Hedge Funds"],
      bio: "Specializes in alternative investment opportunities for qualified investors.",
      clients: 600,
      awards: 5,
    },
    {
      name: "Priya Sharma",
      title: "Risk Management Director",
      experience: "11+ years",
      specialization: "Portfolio Risk & Compliance",
      image:
        "https://images.unsplash.com/photo-1584999734482-0361aecad844?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1584999734482-0361aecad844",
      expertise: ["Risk Management", "Compliance", "Due Diligence"],
      bio: "Ensures portfolio resilience through comprehensive risk assessment and mitigation strategies.",
      clients: 900,
      awards: 8,
    },
    {
      name: "Thomas Anderson",
      title: "Digital Assets Strategist",
      experience: "8+ years",
      specialization: "Crypto & Digital Wealth",
      image:
        "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=400&h=300&fit=crop&crop=face",
      unsplashId: "1519345182560-3f2917c472ef",
      expertise: ["Cryptocurrency", "Blockchain", "Digital Assets"],
      bio: "Pioneer in integrating digital assets into traditional wealth management portfolios.",
      clients: 550,
      awards: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
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
                    Wealth Management
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section - Refined */}
      <section className="relative overflow-hidden text-white py-16 md:py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1920&q=80"
            alt="Wealth management and financial planning"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/50 mb-4">
              <span className="text-sm font-semibold text-blue-200">
                Wealth Solutions
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Grow & Preserve{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
                Your Wealth
              </span>
            </h1>
            <p className="text-lg text-slate-200 mb-6 leading-relaxed">
              Sophisticated financial solutions for preserving and growing your
              wealth across generations with expert guidance and personalized
              strategies.
            </p>

            <Link
              to="/contact-support"
              className="inline-flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition shadow-lg hover:shadow-xl gap-2 group mb-8"
            >
              <span>Schedule Consultation</span>
              <ArrowUp className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </Link>

            {/* Stats - Made smaller */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-xl font-bold text-cyan-400">$500B+</div>
                <div className="text-xs text-slate-300">Assets Managed</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-xl font-bold text-cyan-400">50k+</div>
                <div className="text-xs text-slate-300">Clients Served</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                <div className="text-xl font-bold text-cyan-400">98%</div>
                <div className="text-xs text-slate-300">Client Retention</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Wealth Services
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Tailored strategies for every stage of your financial journey
            </p>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80"
                alt="Investment Planning"
                className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white font-medium">
                Investment Planning
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=800&q=80"
                alt="Retirement Solutions"
                className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white font-medium">
                Retirement Solutions
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                alt="Estate Planning"
                className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white font-medium">
                Estate Planning
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1542744095-fcf48d80b0fd?w=800&q=80"
                alt="Tax Optimization"
                className="w-full h-48 md:h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-4 left-4 text-white font-medium">
                Tax Optimization
              </div>
            </div>
          </div>

          {/* Services Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 group"
                >
                  {/* Icon Section */}
                  <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon
                        size={28}
                        className="text-slate-700 dark:text-slate-300"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                      {service.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                      {service.description}
                    </p>

                    <ul className="space-y-2 mb-5">
                      {service.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start text-sm text-slate-700 dark:text-slate-300 gap-2"
                        >
                          <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle2
                              size={12}
                              className="text-emerald-600 dark:text-emerald-400"
                            />
                          </div>
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact-support"
                      className="inline-flex items-center text-blue-500 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium text-sm transition group/link"
                    >
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Need a personalized wealth strategy?
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <span>Get Free Consultation</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Service Levels */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Service Tiers
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Choose the wealth management tier that matches your financial
              profile
            </p>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?w=800&q=80"
                alt="Private Banking"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                Private Banking
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80"
                alt="Wealth Management"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                Wealth Management
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80"
                alt="Family Office"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                Family Office
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl group">
              <img
                src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&q=80"
                alt="Investment Advisory"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                Investment Advisory
              </div>
            </div>
          </div>

          {/* Service Tiers Cards - Made smaller */}
          <div className="grid md:grid-cols-3 gap-6">
            {wealthLevels.map((level, index) => {
              const Icon = level.icon;
              return (
                <div
                  key={index}
                  className={`bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border ${
                    level.highlighted
                      ? "border-blue-500 shadow-lg lg:-translate-y-2"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500"
                  }`}
                >
                  {/* Badge for featured tier */}
                  {level.highlighted && (
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-3 py-1 text-xs font-bold rounded-lg shadow-md">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Header - Made smaller */}
                  <div
                    className={`bg-gradient-to-r ${level.color} p-6 text-white`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold">{level.name}</h3>
                        <div className="text-xs text-white/90 mt-1">
                          Minimum: {level.minimum}
                        </div>
                      </div>
                      <Icon className="w-6 h-6 opacity-50" />
                    </div>
                  </div>

                  {/* Features - Made smaller */}
                  <div className="p-6">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3 text-sm uppercase tracking-wide text-slate-500">
                      Key Features
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {level.features.map((feature, i) => (
                        <li
                          key={i}
                          className="flex items-start text-slate-700 dark:text-slate-300 text-xs gap-2"
                        >
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="flex-1">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to="/contact"
                      className={`block w-full py-2.5 text-center font-medium text-sm rounded-lg transition ${
                        level.highlighted
                          ? "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      Schedule Assessment
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Note */}
          <div className="text-center mt-10 pt-6 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              All tiers include dedicated advisor support and quarterly
              portfolio reviews
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full overflow-hidden">
        <Features t={t} />
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Certified professionals with decades of combined wealth management
              experience, dedicated to your financial success
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 group"
              >
                {/* Profile Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={
                      member.image ||
                      `https://images.unsplash.com/photo-${member.unsplashId}?w=400&h=300&fit=crop&crop=face`
                    }
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {member.expertise?.map((skill, i) => (
                          <span
                            key={i}
                            className="text-xs bg-white/20 backdrop-blur-sm text-white px-2 py-1 rounded"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <div className="mb-3">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-2">
                      {member.title}
                    </p>
                    <div className="flex items-center text-sm text-slate-600 dark:text-slate-400 mb-3">
                      <span className="flex items-center">
                        <Calendar className="w-3 h-3 mr-1" />
                        {member.experience}
                      </span>
                    </div>
                  </div>

                  {/* Specialization */}
                  <div className="mb-4">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      {member.bio || member.specialization}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {member.clients}+
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Clients
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                        {member.awards}+
                      </div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">
                        Awards
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Team Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                100+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Years Combined Experience
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                25+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Certifications
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                50K+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Clients Served
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-slate-900 dark:text-white">
                $500B+
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400">
                Assets Managed
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Link
              to="/contact-support"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Schedule Team Consultation</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-blue-900 dark:from-slate-950 dark:to-blue-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Grow Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Wealth?
            </span>
          </h2>
          <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
            Our wealth advisors are ready to help you build a comprehensive
            financial plan tailored to your goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-support"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition shadow-lg hover:shadow-xl"
            >
              Request Consultation
            </Link>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-9 h-9 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center z-50 group"
          aria-label="Scroll to top"
        >
          <ArrowUp
            size={18}
            className="group-hover:-translate-y-0.5 transition-transform"
          />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default WealthManagement;
