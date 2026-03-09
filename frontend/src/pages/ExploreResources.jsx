// pages/ExploreResources.jsx
import React, { useState } from "react";
import { useLanguageContext } from "../contexts/LanguageContext";
import Header from "../components/header/header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { 
  BookOpen, 
  Video, 
  FileText, 
  Calculator, 
  TrendingUp, 
  Shield, 
  CreditCard,
  PiggyBank,
  Home,
  GraduationCap,
  Briefcase,
  Globe,
  ChevronRight,
  Search,
  Filter
} from "lucide-react";

const ExploreResources = () => {
  const { t } = useLanguageContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Custom header configuration
  const handleMenuToggle = (isOpen) => {
    console.log("Menu is now:", isOpen ? "open" : "closed");
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");
  };

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen },
    { id: "banking", name: "Banking Basics", icon: CreditCard },
    { id: "savings", name: "Savings & Investment", icon: PiggyBank },
    { id: "credit", name: "Credit & Loans", icon: TrendingUp },
    { id: "security", name: "Security & Fraud", icon: Shield },
    { id: "tools", name: "Financial Tools", icon: Calculator },
    { id: "guides", name: "How-To Guides", icon: FileText },
  ];

  const resources = [
    {
      id: 1,
      category: "banking",
      type: "guide",
      title: "Getting Started with Online Banking",
      description: "Learn how to set up and navigate your online banking account with our comprehensive step-by-step guide.",
      icon: BookOpen,
      duration: "5 min read",
      color: "blue",
    },
    {
      id: 2,
      category: "banking",
      type: "video",
      title: "Understanding Your Account Types",
      description: "Explore the differences between checking, savings, and money market accounts to choose what's right for you.",
      icon: Video,
      duration: "8 min watch",
      color: "blue",
    },
    {
      id: 3,
      category: "savings",
      type: "guide",
      title: "Building Your Emergency Fund",
      description: "Discover strategies for creating a financial safety net with 3-6 months of expenses saved.",
      icon: PiggyBank,
      duration: "7 min read",
      color: "green",
    },
    {
      id: 4,
      category: "savings",
      type: "calculator",
      title: "Savings Goal Calculator",
      description: "Calculate how much you need to save monthly to reach your financial goals on time.",
      icon: Calculator,
      duration: "Interactive",
      color: "green",
    },
    {
      id: 5,
      category: "credit",
      type: "guide",
      title: "Understanding Your Credit Score",
      description: "Learn what affects your credit score and how to improve it for better loan rates.",
      icon: TrendingUp,
      duration: "6 min read",
      color: "purple",
    },
    {
      id: 6,
      category: "credit",
      type: "guide",
      title: "Mortgage Pre-Approval Process",
      description: "Step-by-step guide to getting pre-approved for a home mortgage loan.",
      icon: Home,
      duration: "10 min read",
      color: "purple",
    },
    {
      id: 7,
      category: "security",
      type: "guide",
      title: "Protecting Your Account from Fraud",
      description: "Essential security practices to keep your money and identity safe from scammers.",
      icon: Shield,
      duration: "5 min read",
      color: "red",
    },
    {
      id: 8,
      category: "security",
      type: "video",
      title: "Recognizing Phishing Attempts",
      description: "Learn to identify and avoid email, text, and phone scams targeting bank customers.",
      icon: Video,
      duration: "6 min watch",
      color: "red",
    },
    {
      id: 9,
      category: "tools",
      type: "calculator",
      title: "Loan Payment Calculator",
      description: "Estimate your monthly payments for auto loans, personal loans, and mortgages.",
      icon: Calculator,
      duration: "Interactive",
      color: "orange",
    },
    {
      id: 10,
      category: "tools",
      type: "calculator",
      title: "Compound Interest Calculator",
      description: "See how your savings can grow over time with compound interest.",
      icon: Calculator,
      duration: "Interactive",
      color: "orange",
    },
    {
      id: 11,
      category: "guides",
      type: "guide",
      title: "How to Set Up Direct Deposit",
      description: "Quick guide to setting up direct deposit for your paycheck or benefits.",
      icon: FileText,
      duration: "4 min read",
      color: "indigo",
    },
    {
      id: 12,
      category: "guides",
      type: "guide",
      title: "Mobile Check Deposit Tutorial",
      description: "Learn how to deposit checks using your smartphone camera safely and securely.",
      icon: FileText,
      duration: "3 min read",
      color: "indigo",
    },
    {
      id: 13,
      category: "banking",
      type: "guide",
      title: "Wire Transfer vs ACH: What's the Difference?",
      description: "Understand the pros and cons of different money transfer methods.",
      icon: Globe,
      duration: "6 min read",
      color: "blue",
    },
    {
      id: 14,
      category: "savings",
      type: "guide",
      title: "Retirement Planning 101",
      description: "Start planning for retirement with IRAs, 401(k)s, and other investment vehicles.",
      icon: Briefcase,
      duration: "12 min read",
      color: "green",
    },
    {
      id: 15,
      category: "credit",
      type: "video",
      title: "Debt Management Strategies",
      description: "Effective methods to pay down debt and improve your financial health.",
      icon: Video,
      duration: "10 min watch",
      color: "purple",
    },
    {
      id: 16,
      category: "banking",
      type: "guide",
      title: "Student Banking Benefits",
      description: "Special accounts and services designed for students and young adults.",
      icon: GraduationCap,
      duration: "5 min read",
      color: "blue",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
      icon: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900/40",
      hover: "hover:border-blue-400 dark:hover:border-blue-600",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      icon: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900/40",
      hover: "hover:border-green-400 dark:hover:border-green-600",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
      icon: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900/40",
      hover: "hover:border-purple-400 dark:hover:border-purple-600",
    },
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      icon: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900/40",
      hover: "hover:border-red-400 dark:hover:border-red-600",
    },
    orange: {
      bg: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
      icon: "text-orange-600 dark:text-orange-400",
      iconBg: "bg-orange-100 dark:bg-orange-900/40",
      hover: "hover:border-orange-400 dark:hover:border-orange-600",
    },
    indigo: {
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-200 dark:border-indigo-800",
      icon: "text-indigo-600 dark:text-indigo-400",
      iconBg: "bg-indigo-100 dark:bg-indigo-900/40",
      hover: "hover:border-indigo-400 dark:hover:border-indigo-600",
    },
  };

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation/header */}
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
        customClassName="shadow-sm"
        onMenuToggle={handleMenuToggle}
        onSignInClick={handleSignInClick}
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=1920&q=80"
            alt="Resources"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gray-900/60 dark:bg-gray-900/80"></div>
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            Explore Resources
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
            Guides, tools, and educational content to help you make informed financial decisions
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[200px]"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Quick Links */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.slice(1).map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    selectedCategory === category.id
                      ? "bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-500"
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700"
                  }`}
                >
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${
                    selectedCategory === category.id
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`} />
                  <p className={`text-xs font-medium text-center ${
                    selectedCategory === category.id
                      ? "text-blue-900 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {category.name.replace(" & ", " &\n")}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Count */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {selectedCategory === "all" ? "All Resources" : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {filteredResources.length} {filteredResources.length === 1 ? "resource" : "resources"} found
            </p>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const Icon = resource.icon;
              const colors = colorClasses[resource.color];

              return (
                <div
                  key={resource.id}
                  className={`${colors.bg} ${colors.border} ${colors.hover} border-2 rounded-2xl p-6 transition-all duration-300 hover:shadow-lg cursor-pointer group`}
                >
                  {/* Icon and Duration */}
                  <div className="flex items-center justify-between mb-4">
                    <div className={`${colors.iconBg} w-12 h-12 rounded-xl flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${colors.icon}`} />
                    </div>
                    <span className={`text-xs font-medium ${colors.icon}`}>
                      {resource.duration}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                    {resource.description}
                  </p>

                  {/* Action */}
                  <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                    <span>
                      {resource.type === "calculator" ? "Use Tool" : 
                       resource.type === "video" ? "Watch Now" : "Read More"}
                    </span>
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* No Results */}
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                No resources found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or filter to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold rounded-xl transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Need Personalized Guidance?
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Our financial advisors are here to help you achieve your goals
          </p>
          <button className="px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl transition-colors shadow-lg">
            Schedule a Consultation
          </button>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ExploreResources;