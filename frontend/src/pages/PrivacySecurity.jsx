// pages/PrivacySecurity.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Shield,
  Lock,
  Eye,
  Key,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Users,
  Bell,
  ArrowUp,
  Fingerprint,
  Server,
  Database,
  Smartphone,
  Award,
  AlertCircle,
  Phone,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";

const PrivacySecurity = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);

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

  const handleMenuToggle = (isOpen) => {
    console.log("Menu is now:", isOpen ? "open" : "closed");
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");
  };

  const securityFeatures = [
    {
      title: "256-Bit Encryption",
      description:
        "Military-grade SSL/TLS encryption protects all your data in transit and at rest",
      icon: Lock,
      color: "from-blue-500 to-blue-600",
      features: [
        "AES-256 encryption standard",
        "Secure Socket Layer (SSL)",
        "Transport Layer Security (TLS 1.3)",
        "End-to-end encryption",
      ],
    },
    {
      title: "Multi-Factor Authentication",
      description:
        "Multiple verification layers ensure only you can access your account",
      icon: Key,
      color: "from-green-500 to-emerald-600",
      features: [
        "SMS verification codes",
        "Authenticator app support (Google, Microsoft)",
        "Biometric authentication (Face ID, Touch ID)",
        "Hardware security key compatibility",
      ],
    },
    {
      title: "24/7 Fraud Monitoring",
      description:
        "AI-powered systems detect and prevent suspicious activity around the clock",
      icon: Eye,
      color: "from-orange-500 to-red-600",
      features: [
        "Real-time transaction monitoring",
        "Behavioral analysis algorithms",
        "Instant fraud alerts via SMS/email",
        "Automatic account protection",
      ],
    },
    {
      title: "Secure Infrastructure",
      description:
        "Enterprise-grade servers with redundant backups in multiple locations",
      icon: Server,
      color: "from-purple-500 to-indigo-600",
      features: [
        "ISO 27001 certified data centers",
        "99.99% uptime guarantee",
        "Regular security audits",
        "Disaster recovery systems",
      ],
    },
  ];

  const privacyPolicies = [
    {
      title: "Data Collection & Usage",
      icon: Database,
      description: "We collect only what's necessary to provide our services",
      points: [
        "Personal information for account verification (name, address, SSN)",
        "Transaction data to process payments and prevent fraud",
        "Device information for security and authentication",
        "Communication preferences for alerts and updates",
        "No sale of personal information to third parties",
      ],
    },
    {
      title: "Information Sharing",
      icon: Users,
      description:
        "Your data is shared only when legally required or explicitly authorized",
      points: [
        "Service providers (payment processors, identity verification)",
        "Regulatory authorities when required by law",
        "Credit bureaus for credit reporting purposes",
        "Your explicit consent required for marketing partners",
        "Annual privacy notice detailing all sharing practices",
      ],
    },
    {
      title: "Your Privacy Rights",
      icon: Award,
      description: "Federal and state laws protect your financial privacy",
      points: [
        "Access your personal data at any time",
        "Request corrections to inaccurate information",
        "Opt-out of marketing communications",
        "Delete your data (subject to legal requirements)",
        "Export your data in portable format",
        "File complaints with regulatory authorities",
      ],
    },
  ];

  const securityTips = [
    {
      title: "Create Strong Passwords",
      description:
        "Use 12+ characters with uppercase, lowercase, numbers, and symbols. Never reuse passwords across accounts.",
      icon: Key,
    },
    {
      title: "Enable Two-Factor Authentication",
      description:
        "Add an extra security layer by requiring a second verification step beyond your password.",
      icon: Shield,
    },
    {
      title: "Monitor Account Activity",
      description:
        "Review transactions weekly and set up alerts for unusual activity. Report suspicious charges immediately.",
      icon: Eye,
    },
    {
      title: "Beware of Phishing Scams",
      description:
        "Never click suspicious links or share account details via email, text, or phone. Verify requests directly with the bank.",
      icon: AlertTriangle,
    },
    {
      title: "Use Secure Networks",
      description:
        "Avoid banking on public Wi-Fi. Use your mobile data or a VPN when accessing accounts outside your home.",
      icon: Smartphone,
    },
    {
      title: "Keep Software Updated",
      description:
        "Regularly update your devices, browsers, and banking apps to get the latest security patches.",
      icon: Server,
    },
  ];

  const certifications = [
    { label: "FDIC Insured", subtitle: "Up to $250,000", icon: Shield },
    { label: "SOC 2 Type II", subtitle: "Certified", icon: Award },
    { label: "PCI DSS", subtitle: "Compliant", icon: CheckCircle2 },
    { label: "ISO 27001", subtitle: "Certified", icon: Lock },
  ];

  const commonScams = [
    {
      type: "Phishing Emails",
      description:
        "Fake emails claiming to be from your bank asking for account details or password resets",
      warning: "Banks never ask for passwords via email",
    },
    {
      type: "Phone Scams (Vishing)",
      description:
        "Callers impersonating bank staff requesting verification of account information or one-time codes",
      warning: "Never share security codes over the phone",
    },
    {
      type: "Text Message Scams (Smishing)",
      description:
        "Text messages with urgent warnings about account problems with links to fake websites",
      warning: "Don't click links in unexpected text messages",
    },
    {
      type: "Fake Customer Support",
      description:
        "Scammers posing as tech support claiming your account has been compromised",
      warning: "Contact us through official channels only",
    },
    {
      type: "Check Fraud",
      description:
        "Counterfeit checks or requests to deposit checks and wire back funds",
      warning: "Verify large checks before depositing",
    },
    {
      type: "Romance Scams",
      description:
        "Online relationships leading to requests for money transfers or account access",
      warning: "Never send money to people you haven't met",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
        customClassName="shadow-sm"
        onMenuToggle={handleMenuToggle}
        onSignInClick={handleSignInClick}
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
                    Privacy & Security
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80"
            alt="Security background"
            className="w-full h-full object-cover"
          />
          <div className="opacity-50 absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90 dark:from-gray-900/95 dark:via-blue-900/90 dark:to-gray-900/95"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Your Security is Our Priority
            </h1>
            <p className="text-xl text-blue-100 mb-12 leading-relaxed">
              Bank-level security protecting your accounts with 256-bit
              encryption, real-time fraud monitoring, and FDIC insurance up to
              $250,000
            </p>

            {/* Certifications */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {certifications.map((cert, i) => {
                const Icon = cert.icon;
                return (
                  <div
                    key={i}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-300"
                  >
                    <Icon className="w-8 h-8 text-blue-200 mx-auto mb-2" />
                    <div className="text-sm font-semibold text-white">
                      {cert.label}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                      {cert.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Security Features - Clean minimal style matching the screenshot */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Advanced Security Features
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Explore our full range of banking products and services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-900 rounded-xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 dark:border-gray-700"
                >
                  {/* Icon Badge */}
                  <div
                    className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-6`}
                  >
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Learn More Link */}
                  <a
                    href="#"
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
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Privacy Policies */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Your Privacy Rights
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Transparent policies that comply with federal privacy laws and
              give you control over your data
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {privacyPolicies.map((policy, index) => {
              const Icon = policy.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {policy.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {policy.description}
                  </p>
                  <ul className="space-y-2">
                    {policy.points.map((point, i) => (
                      <li
                        key={i}
                        className="flex items-start text-gray-700 dark:text-gray-300 text-sm gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link
              to="/privacy-policy"
              className="inline-flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl gap-2"
            >
              <FileText className="w-5 h-5" />
              View Full Privacy Policy
            </Link>
          </div>
        </div>
      </section>

      {/* Security Tips */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Security Best Practices
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Follow these essential tips to protect your account and personal
              information
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {securityTips.map((tip, index) => {
              const Icon = tip.icon;
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 group"
                >
                  <div className="flex items-start gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {tip.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Common Scams Section */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-2xl mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recognize & Avoid Common Scams
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Stay alert to these common fraud tactics and protect yourself from
              scammers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {commonScams.map((scam, index) => (
              <div
                key={index}
                className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800 hover:border-red-500 dark:hover:border-red-600 transition-all"
              >
                <div className="flex items-start gap-3 mb-3">
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      {scam.type}
                    </h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                      {scam.description}
                    </p>
                    <div className="bg-red-100 dark:bg-red-900/30 rounded-lg p-3 border border-red-300 dark:border-red-700">
                      <p className="text-xs font-semibold text-red-800 dark:text-red-300">
                        ⚠️ {scam.warning}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* What to Do */}
          <div className="mt-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 border border-blue-200 dark:border-blue-800">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              If You Suspect Fraud
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Call Us Immediately
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  24/7 Fraud Hotline
                </p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  1-800-FRAUD-ALERT
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Email Security Team
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Direct support line
                </p>
                <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                  security@byvaultfinance.com
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  Response Time
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Average response
                </p>
                <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  Under 5 minutes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80"
            alt="Security data center and protection"
            className="w-full h-full object-cover"
          />
          {/* Dark blue gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/85 to-indigo-900/90"></div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Questions About Security?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Our security team is available 24/7 to assist with any concerns,
            fraud reports, or security questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact-support"
              className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Contact Security Team
            </Link>
          </div>

          {/* Security Badges */}
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-sm text-white font-medium">
                24/7 Monitoring
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-sm text-white font-medium">
                Bank-Grade Encryption
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <span className="text-sm text-white font-medium">
                Certified Security
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-9 h-9 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default PrivacySecurity;
