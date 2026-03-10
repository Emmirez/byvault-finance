// pages/Help.jsx (Chase Style)
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  HelpCircle,
  Search,
  MessageSquare,
  Phone,
  Mail,
  BookOpen,
  Video,
  Download,
  ChevronRight,
  ArrowLeft,
  ArrowUp,
  Clock,
  CheckCircle,
  Users,
  FileText,
  CreditCard,
  Home,
  Car,
  TrendingUp,
  Shield,
  Building,
  DollarSign,
  Target,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";

const Help = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [activeSection, setActiveSection] = useState("overview");

  // Create refs for each section
  const overviewRef = useRef(null);
  const selfServiceRef = useRef(null);
  const accountHelpRef = useRef(null);
  const faqsRef = useRef(null);
  const watchLearnRef = useRef(null);
  const questionsRef = useRef(null);

  // Map sections to refs
  const sectionRefs = {
    overview: overviewRef,
    selfService: selfServiceRef,
    accountHelp: accountHelpRef,
    faqs: faqsRef,
    watchLearn: watchLearnRef,
    questions: questionsRef,
  };

  // Searchable content data
  const searchableContent = [
    { id: 1, title: "How to Open an Account", category: "Getting Started", url: "/register", content: "Learn how to open a bank account online with our step-by-step guide." },
    { id: 2, title: "Mobile Banking Setup", category: "Digital Banking", url: "/help/mobile-banking", content: "Set up mobile banking on your smartphone in minutes." },
    { id: 3, title: "Reset Password", category: "Account Security", url: "/help/reset-password", content: "Forgot your password? Here's how to reset it securely." },
    { id: 4, title: "Make a Payment", category: "Payments", url: "/login", content: "How to make payments online through your account." },
    { id: 5, title: "Order Checks", category: "Account Services", url: "/login", content: "Order new checks for your checking account." },
    { id: 6, title: "Credit Card Support", category: "Credit Cards", url: "/credit-cards", content: "Get help with credit card payments, disputes, and questions." },
    { id: 7, title: "Report Fraud", category: "Security", url: "/contact-support", content: "Steps to take if you suspect fraudulent activity on your account." },
    { id: 8, title: "Wire Transfer", category: "Transfers", url: "/login", content: "How to send and receive wire transfers." },
    { id: 9, title: "Bill Pay", category: "Payments", url: "/login", content: "Set up and manage automatic bill payments." },
    { id: 10, title: "Account Statements", category: "Documents", url: "/login", content: "Access and download your account statements." },
  ];

  // Search function
  const handleSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const results = searchableContent.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  // Handle search input change
  const handleInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    handleSearch(query);
  };

  // Handle search button click
  const handleSearchClick = () => {
    handleSearch(searchQuery);
  };

  // Handle Enter key press
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch(searchQuery);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Update active section based on scroll position
      const sections = Object.keys(sectionRefs);
      let currentSection = "overview";

      sections.forEach((section) => {
        const ref = sectionRefs[section];
        if (ref?.current) {
          const rect = ref.current.getBoundingClientRect();
          if (rect.top <= 100) {
            currentSection = section;
          }
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Function to handle section navigation
  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setTimeout(() => {
      const ref = sectionRefs[sectionId];
      if (ref?.current) {
        ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Navigation items matching Chase style
  const navItems = [
    { id: "overview", name: "Overview", ref: overviewRef },
    { id: "selfService", name: "Self-service actions", ref: selfServiceRef },
    {
      id: "accountHelp",
      name: "Get help with your account",
      ref: accountHelpRef,
    },
    { id: "faqs", name: "FAQs", ref: faqsRef },
    { id: "watchLearn", name: "Watch and learn", ref: watchLearnRef },
    { id: "questions", name: "Still have questions?", ref: questionsRef },
  ];

  const selfServiceActions = [
    {
      title: "Make a payment",
      icon: DollarSign,
      color: "text-blue-600 dark:text-blue-400",
      link: "/login",
    },
    {
      title: "Order checks",
      icon: BookOpen,
      color: "text-green-600 dark:text-green-400",
      link: "/login",
    },
    {
      title: "Manage account alerts",
      icon: Shield,
      color: "text-purple-600 dark:text-purple-400",
      link: "/login",
    },
    {
      title: "Replace a lost/damaged card",
      icon: CreditCard,
      color: "text-orange-600 dark:text-orange-400",
      link: "/login",
    },
    {
      title: "Dispute a charge",
      icon: Target,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Reset username/password",
      icon: Shield,
      color: "text-indigo-600 dark:text-indigo-400",
      link: "/login",
    },
    {
      title: "Find account/routing number",
      icon: Search,
      color: "text-blue-600 dark:text-blue-400",
      link: "/login",
    },
    {
      title: "Report fraud",
      icon: Shield,
      color: "text-red-600 dark:text-red-400",
    },
    {
      title: "Payment support",
      icon: DollarSign,
      color: "text-green-600 dark:text-green-400",
    },
  ];

  const accountHelpCategories = [
    {
      name: "Credit Cards",
      icon: CreditCard,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
      description: "Find tools that can help with your credit card accounts",
    },
    {
      name: "Savings",
      icon: Users,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-700 dark:text-green-300",
      description: "Checking, savings, and debit card support",
    },
    {
      name: "Education",
      icon: TrendingUp,
      color: "bg-purple-100 dark:bg-purple-900",
      textColor: "text-purple-700 dark:text-purple-300",
      description: "Education savings and retirement planning",
    },
    {
      name: "Wealth Management",
      icon: Building,
      color: "bg-gray-100 dark:bg-gray-900",
      textColor: "text-gray-700 dark:text-gray-300",
      description: "Premium banking services",
    },
    {
      name: "Loans",
      icon: Car,
      color: "bg-orange-100 dark:bg-orange-900",
      textColor: "text-orange-700 dark:text-orange-300",
      description: "Auto financing and lease support",
    },
    {
      name: "Checking",
      icon: Home,
      color: "bg-indigo-100 dark:bg-indigo-900",
      textColor: "text-indigo-700 dark:text-indigo-300",
      description: "checking accounts and services",
    },
    {
      name: "Privacy & Security",
      icon: Building,
      color: "bg-blue-100 dark:bg-blue-900",
      textColor: "text-blue-700 dark:text-blue-300",
      description: "Manage your privacy settings",
    },
    {
      name: "Business",
      icon: Building,
      color: "bg-green-100 dark:bg-green-900",
      textColor: "text-green-700 dark:text-green-300",
      description: "Small business banking support",
    },
  ];

  const faqs = [
    {
      category: "Credit Card",
      phone: "1-800-432-3117",
      description: "Answers to common questions about Chase credit cards",
      link: "/credit-cards",
    },
    {
      category: "Savings & CDs",
      phone: "1-800-935-9935",
      description:
        "Answers about checking and savings accounts, and debit cards",
      link: "/savings",
    },
    {
      category: "Loans",
      phone: "1-800-336-6675",
      description: "Answers about auto loans and leases",
      link: "/loans",
    },
    {
      category: "Checking",
      phone: "1-800-848-9136",
      description: "Answers about mortgage loans and home equity lines",
      link: "/checking",
    },
    {
      category: "Education",
      phone: "1-800-935-9935",
      description: "Answers about investment accounts and retirement planning",
      link: "/education",
    },
    {
      category: "Business Banking",
      phone: "1-800-242-7338",
      description: "Answers about small business banking services",
      link: "/business",
    },
    {
      category: "Wealth Management",
      phone: "1-888-994-5353",
      description: "Answers about wealth management services",
      link: "/wealth-management",
    },
    {
      category: "Privacy & Security",
      phone: "1-800-935-9935",
      description: "Answers about online security and privacy settings",
      link: "/privacy-security",
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-50 transition-colors duration-300 w-full overflow-hidden">
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
                    Help & Support
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section with Image Background */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80"
            alt="Customer service support team"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for text contrast */}
          <div className="absolute inset-0 bg-blue-900/70"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <HelpCircle size={40} className="text-white" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-white">
              Welcome to Customer Service
            </h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto text-gray-200">
              We'll help you find a solution.
            </p>

            {/* Search Bar - Chase Style */}
            <div className="relative max-w-2xl mx-auto">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search for help articles, guides, or FAQs..."
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-lg"
                />
                <button 
                  onClick={handleSearchClick}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-semibold transition-colors duration-200"
                >
                  Search
                </button>
              </div>

              {/* Search Results Dropdown */}
              {searchQuery && (
                <div className="absolute z-50 w-full bg-white shadow-xl rounded-lg mt-1 border border-gray-200 max-h-96 overflow-y-auto">
                  {searchResults.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          to={result.url}
                          className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors duration-150"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-1">
                                {result.title}
                              </h4>
                              <p className="text-sm text-gray-600 mb-1">
                                {result.content.substring(0, 100)}...
                              </p>
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                                {result.category}
                              </span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400" />
                          </div>
                        </Link>
                      ))}
                      
                      {/* View all results link */}
                      {searchResults.length > 3 && (
                        <Link
                          to={`/search?q=${encodeURIComponent(searchQuery)}`}
                          className="block p-4 text-center text-blue-600 hover:text-blue-800 font-medium border-t border-gray-200"
                        >
                          View all {searchResults.length} results
                        </Link>
                      )}
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Navigation Bar - Chase Style */}
      <section className="sticky top-16 z-30 bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSectionClick(item.id)}
                className={`flex-shrink-0 px-6 py-4 font-medium whitespace-nowrap transition-colors ${
                  activeSection === item.id
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {item.name}
                {activeSection === item.id && (
                  <span className="sr-only"> selected</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Section */}
        <section ref={overviewRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get the banking services help you need
            </h2>
            <p className="text-xl text-gray-600">
              We'll help you find answers to your questions today!
            </p>
          </div>
        </section>

        {/* Self-service Actions Section */}
        <section ref={selfServiceRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Self-service actions
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Quickly manage common banking tasks online
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selfServiceActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.link || "/contact-support"}
                  className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div className={`${action.color} p-2 rounded-lg mr-4`}>
                    <action.icon size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600">
                      {action.title}
                    </span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Get Help with Your Account Section */}
        <section ref={accountHelpRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Get help with your account
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              We've got tools and information to guide you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {accountHelpCategories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div
                  className={`w-16 h-16 ${category.color} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  <category.icon className={category.textColor} size={28} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {category.description}
                </p>
                <Link
                  to={`/${category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center"
                >
                  Learn more
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Section */}
        <section ref={faqsRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {faq.category}
                </h3>
                <div className="mb-4">
                  <div className="flex items-center text-gray-600 mb-2">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="font-medium">
                      {faq.category} Customer Service:
                    </span>
                  </div>
                  <a
                    href={`tel:${faq.phone}`}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-lg"
                  >
                    {faq.phone}
                  </a>
                </div>
                <p className="text-gray-600 mb-6">{faq.description}</p>
                <Link
                  to={faq.link}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
                >
                  See FAQs
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Watch and Learn Section */}
        <section ref={watchLearnRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Watch and learn
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore how-to videos and see how easy it is to get things done
            </p>
          </div>

          <div className="bg-blue-50 rounded-xl p-8 text-center">
            <Video className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Helpful Tips & Tutorials
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Learn how to manage your accounts, make payments, and use our
              digital tools through step-by-step video guides.
            </p>

            {/* Updated Link with target="_blank" for new page */}
            <a
              href="https://www.youtube.com/watch?v=Ig_NpP_5z-U"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors duration-200"
            >
              More helpful tips videos
              <ChevronRight className="w-5 h-5 ml-2" />
            </a>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section ref={questionsRef} className="mb-16 scroll-mt-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Still have questions?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              If you need to contact us, we're here to help
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Customer Help */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Phone className="w-8 h-8 text-blue-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-900">
                  Customer Help and Technical Support
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get online and mobile banking support, or help with your
                account.
              </p>
              <a
                href="tel:1-800-935-9935"
                className="text-blue-600 hover:text-blue-800 font-semibold text-lg block mb-2"
              >
                1-800-935-9935
              </a>
              <p className="text-sm text-gray-500">
                We also accept operator relay calls.
              </p>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <MessageSquare className="w-8 h-8 text-blue-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-900">
                  Connect with Us on Social Media
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Tweet us @TrustedBankSupport or message us on Facebook. We're
                here to help!
              </p>
              <p className="text-sm text-gray-500 italic">
                Please don't include account numbers or personal information.
              </p>
            </div>

            {/* Schedule Meeting */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-blue-600 mr-4" />
                <h3 className="text-xl font-bold text-gray-900">
                  Schedule a Meeting
                </h3>
              </div>
              <p className="text-gray-600 mb-6">
                Meet with a banker to discuss your account or open a new one.
              </p>
              <Link
                to="/contact-support"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>

          {/* Military Personnel */}
          <div className="mt-8 bg-gray-50 rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Military Personnel and Veterans
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-600 mb-2">
                  Domestic Military Services:
                </p>
                <a
                  href="tel:1-877-469-0110"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  1-877-469-0110
                </a>
              </div>
              <div>
                <p className="text-gray-600 mb-2">Overseas:</p>
                <a
                  href="tel:1-318-340-3308"
                  className="text-blue-600 hover:text-blue-800 font-semibold"
                >
                  1-318-340-3308
                </a>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              We also accept operator relay calls.
            </p>
          </div>

          {/* Complaints and Feedback */}
          <div className="mt-8 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Complaints and Feedback
            </h3>
            <p className="text-gray-600 mb-6">
              Your satisfaction matters. Tell us about your banking experience.
            </p>
            <Link
              to="/contact-support"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
            >
              Let us know
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        </section>
      </main>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-9 h-9 bg-blue-600 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Help;