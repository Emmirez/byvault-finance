// pages/Education.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  BookOpen,
  DollarSign,
  TrendingUp,
  Calculator,
  Users,
  Video,
  Download,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Target,
  Clock,
  Shield,
  Zap,
  Award,
  Eye,
  ChartBar,
  ChevronUp,
} from "lucide-react";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";

const Education = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState("all");

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

  const courses = [
    {
      title: "Investment Fundamentals",
      description: "Master the basics of investing and portfolio building",
      level: "Beginner",
      icon: TrendingUp,
      duration: "4 hours",
      lessons: 12,
      students: "25,000+",
    },
    {
      title: "Stock Market Analysis",
      description: "Learn technical and fundamental analysis techniques",
      level: "Intermediate",
      icon: ChartBar,
      duration: "6 hours",
      lessons: 18,
      students: "18,000+",
    },
    {
      title: "Retirement Planning",
      description: "Strategies for building a secure retirement fund",
      level: "Beginner",
      icon: Shield,
      duration: "3 hours",
      lessons: 10,
      students: "32,000+",
    },
    {
      title: "Tax Optimization Strategies",
      description: "Legal ways to minimize your tax burden",
      level: "Advanced",
      icon: Calculator,
      duration: "5 hours",
      lessons: 15,
      students: "12,000+",
    },
  ];

  const tips = [
    {
      title: "50/30/20 Budget Rule",
      description: "Allocate 50% to needs, 30% to wants, 20% to savings",
      icon: Target,
    },
    {
      title: "Emergency Fund",
      description: "Save 3-6 months of expenses for financial security",
      icon: Shield,
    },
    {
      title: "Start Early",
      description:
        "Begin retirement savings early to leverage compound interest",
      icon: TrendingUp,
    },
    {
      title: "Check Credit",
      description: "Monitor your credit report regularly for errors",
      icon: Eye,
    },
    {
      title: "Diversify",
      description: "Spread investments across asset classes to manage risk",
      icon: Award,
    },
    {
      title: "Debt Strategy",
      description: "Pay high-interest debt first using the avalanche method",
      icon: Zap,
    },
  ];

  // Helper functions for tips
  const getActionSteps = (title) => {
    const stepsMap = {
      "50/30/20 Budget Rule": [
        "Calculate your monthly income",
        "Categorize expenses as needs, wants, savings",
        "Set up automatic transfers",
        "Review monthly and adjust",
      ],
      "Emergency Fund": [
        "Open a dedicated savings account",
        "Set goal: 3-6 months of expenses",
        "Automate monthly contributions",
        "Keep in liquid, safe account",
      ],
      "Start Early": [
        "Open retirement account",
        "Set up automatic contributions",
        "Increase contributions annually",
        "Review investment choices",
      ],
      "Check Credit": [
        "Get free annual credit report",
        "Dispute any errors immediately",
        "Set up credit monitoring",
        "Pay bills on time",
      ],
      Diversify: [
        "Assess current portfolio",
        "Add different asset classes",
        "Rebalance quarterly",
        "Consider index funds",
      ],
      "Debt Strategy": [
        "List all debts with interest rates",
        "Focus on highest interest first",
        "Make minimum payments on others",
        "Snowball as debts are paid",
      ],
    };
    return (
      stepsMap[title] || [
        "Review current habits",
        "Set specific goals",
        "Track progress monthly",
      ]
    );
  };

  const getDifficulty = (title) => {
    const difficultyMap = {
      "50/30/20 Budget Rule": 2,
      "Emergency Fund": 1,
      "Start Early": 1,
      "Check Credit": 1,
      Diversify: 3,
      "Debt Strategy": 2,
    };
    return difficultyMap[title] || 2;
  };

  const getImpact = (title) => {
    const impactMap = {
      "50/30/20 Budget Rule": 5,
      "Emergency Fund": 5,
      "Start Early": 5,
      "Check Credit": 3,
      Diversify: 4,
      "Debt Strategy": 4,
    };
    return impactMap[title] || 4;
  };

  // Filter logic
  const filteredCourses =
    selectedLevel === "all"
      ? courses
      : courses.filter((course) => course.level === selectedLevel);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 overflow-x-hidden">
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
                    Education
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section - Refined with subtle effects */}
      <section className="relative overflow-hidden text-white py-12 md:py-16">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80"
            alt="Financial education and learning"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay with subtle gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-900/80"></div>
        </div>

        {/* Subtle decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-500/30 backdrop-blur-sm rounded-full border border-blue-400/50 mb-4">
              <span className="text-sm font-semibold text-white">
                Learn & Grow
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
              Financial{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
                Education
              </span>{" "}
              Starts Here
            </h1>
            <p className="text-lg text-slate-200 mb-6 leading-relaxed">
              Master money management with expert-led courses, practical tools,
              and actionable strategies for financial success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/Login"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Learning Free
              </Link>
              <button
                onClick={() => {
                  const featuredCoursesSection =
                    document.getElementById("featured-courses");
                  if (featuredCoursesSection) {
                    featuredCoursesSection.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/30 text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 cursor-pointer"
              >
                Explore Courses
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-xl font-bold text-cyan-300">500k+</div>
                <div className="text-xs text-slate-300">Active Learners</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-xl font-bold text-cyan-300">50+</div>
                <div className="text-xs text-slate-300">Expert Courses</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20 hover:bg-white/15 transition-colors">
                <div className="text-xl font-bold text-cyan-300">100%</div>
                <div className="text-xs text-slate-300">Free Access</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section
        className="py-16 bg-white dark:bg-slate-900"
        section
        id="featured-courses"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Learn at your own pace with our comprehensive financial curriculum
            </p>
          </div>

          {/* 4-Image Gallery - Fixed: All go to /Login */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            <div
              onClick={() => (window.location.href = "/Login")}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1562774053-701939374585?w=1200&q=80"
                alt="Investment Fundamentals"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  Investment Basics
                </div>
              </div>
            </div>

            <div
              onClick={() => (window.location.href = "/Login")}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&q=80"
                alt="Stock Market Analysis"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  Market Analysis
                </div>
              </div>
            </div>

            <div
              onClick={() => (window.location.href = "/Login")}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&q=80"
                alt="Retirement Planning"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  Retirement Planning
                </div>
              </div>
            </div>

            <div
              onClick={() => (window.location.href = "/Login")}
              className="relative overflow-hidden rounded-xl group cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&q=80"
                alt="Tax Strategies"
                className="w-full h-40 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 text-white text-sm font-medium">
                  Tax Strategies
                </div>
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {["All Levels", "Beginner", "Intermediate", "Advanced"].map(
              (level) => (
                <button
                  key={level}
                  onClick={() => {
                    setSelectedLevel(level === "All Levels" ? "all" : level);
                    // Scroll to courses section after filter
                    setTimeout(() => {
                      const coursesSection =
                        document.getElementById("courses-grid");
                      if (coursesSection) {
                        coursesSection.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 100);
                  }}
                  className={`px-5 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    (level === "All Levels" && selectedLevel === "all") ||
                    selectedLevel === level
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {level}
                </button>
              ),
            )}
          </div>

          {/* Courses Grid - All go to /Login */}
          <div
            id="courses-grid"
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredCourses.map((course, index) => {
              const Icon = course.icon;
              return (
                <div
                  key={index}
                  onClick={() => (window.location.href = "/Login")}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 cursor-pointer group"
                >
                  {/* Course Image */}
                  <div className="relative h-40 bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <Icon className="w-12 h-12 text-slate-400 dark:text-slate-500 group-hover:scale-110 transition-transform duration-300" />
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {course.title}
                        </h3>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                          {course.level}
                        </span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {course.description}
                    </p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                        <Clock className="w-4 h-4 mr-2 text-slate-500" />
                        {course.duration}
                      </div>
                      <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                        <BookOpen className="w-4 h-4 mr-2 text-slate-500" />
                        {course.lessons} lessons
                      </div>
                      <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                        <Users className="w-4 h-4 mr-2 text-slate-500" />
                        {course.students} students
                      </div>
                    </div>

                    <div className="w-full py-3 text-center font-semibold bg-blue-600 text-white rounded-lg transition-all duration-200 group-hover:bg-blue-700">
                      Enroll Now
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Show message when no courses match filter */}
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600 dark:text-slate-400">
                No courses found for "
                {selectedLevel === "all" ? "All Levels" : selectedLevel}" level.
              </p>
              <button
                onClick={() => setSelectedLevel("all")}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Show All Courses
              </button>
            </div>
          )}
        </div>
      </section>

      
      {/* Resources Section with Images */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Free Resources & Tools
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Access our complete library of financial education materials
            </p>
          </div>

          {/* Resources Grid with Images */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                type: "E-Book",
                title: "Financial Wellness Guide",
                description: "50-page guide to financial health and planning",
                icon: BookOpen,
                color: "from-blue-500 to-cyan-500",
                size: "2.4 MB",
                image:
                  "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
              },
              {
                type: "Webinar",
                title: "Market Trends 2024",
                description: "Expert-led session with live Q&A",
                icon: Video,
                color: "from-emerald-500 to-teal-500",
                size: "Monthly",
                image:
                  "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=1200&q=80",
              },
              {
                type: "Tool",
                title: "Budget Calculator",
                description: "Interactive tool for financial planning",
                icon: Calculator,
                color: "from-amber-500 to-orange-500",
                size: "Free",
                image:
                  "https://images.unsplash.com/photo-1495465798138-718f86d1a4bc?w=1200&q=80",
              },
              {
                type: "Community",
                title: "Financial Forums",
                description: "Connect with experts and peers",
                icon: Users,
                color: "from-rose-500 to-pink-500",
                size: "24/7",
                image:
                  "https://images.unsplash.com/photo-1560264280-88b68371db39?w=400&h=250&fit=crop",
              },
            ].map((resource, index) => (
              <div
                key={index}
                onClick={() => (window.location.href = "/Login")}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 group cursor-pointer"
              >
                {/* Image Thumbnail */}
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={resource.image}
                    alt={resource.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3">
                    <div className="text-xs font-semibold bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm text-slate-800 dark:text-white px-3 py-1.5 rounded-full">
                      {resource.type}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center flex-shrink-0`}
                    >
                      <resource.icon size={20} className="text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {resource.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {resource.description}
                      </p>
                    </div>
                  </div>

                  {/* Access Info */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-medium">{resource.size}</span>
                    </div>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium text-sm group/access">
                      <span>Login to Access</span>
                      <span className="ml-2 group-hover/access:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Login CTA */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full mb-4">
              <span className="text-white text-2xl">🔓</span>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
              Unlock All Resources
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-lg mx-auto">
              Create a free account or login to access our complete library of
              financial education materials
            </p>
            <button
              onClick={() => (window.location.href = "/Login")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Login Now to Get Access</span>
              <span className="ml-3 text-xl">→</span>
            </button>
          </div>
        </div>
      </section>

      
      {/* Quick Financial Tips Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Quick Financial Tips
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Practical, actionable advice for immediate financial improvement.
              Apply these tips today!
            </p>
          </div>

          {/* Tips Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tips.map((tip, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-100 dark:border-slate-700 group"
              >
                {/* Tip Header */}
                <div className="relative p-6 pb-4">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <tip.icon className="w-7 h-7 text-white" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-blue-600">
                        {index + 1}
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {tip.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Tip Content */}
                <div className="p-6 pt-0">
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    {tip.description}
                  </p>

                  {/* Action Steps */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-100 dark:border-blue-800">
                    <div className="text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                      🚀 How to implement:
                    </div>
                    <ul className="text-sm text-slate-700 dark:text-slate-300 space-y-1">
                      {getActionSteps(tip.title).map((step, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-blue-500 mt-1">•</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Difficulty & Impact */}
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Difficulty:
                      </span>
                      <div className="flex">
                        {[1, 2, 3].map((star) => (
                          <span
                            key={star}
                            className={`w-2 h-2 rounded-full mx-0.5 ${star <= getDifficulty(tip.title) ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        Impact:
                      </span>
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            className={`w-2 h-2 rounded-full mx-0.5 ${star <= getImpact(tip.title) ? "bg-yellow-500" : "bg-slate-300 dark:bg-slate-600"}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Tips Summary */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">6</div>
              <div className="font-medium">Essential Tips</div>
              <div className="text-sm text-blue-100 mt-2">
                Covering all financial areas
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">15min</div>
              <div className="font-medium">Daily Practice</div>
              <div className="text-sm text-emerald-100 mt-2">
                For best results
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-6 text-white">
              <div className="text-3xl font-bold mb-2">90%</div>
              <div className="font-medium">Success Rate</div>
              <div className="text-sm text-amber-100 mt-2">
                When consistently applied
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-16">
            <p className="text-lg text-slate-600 dark:text-slate-400 mb-6 max-w-2xl mx-auto">
              Want personalized financial advice based on your specific
              situation?
            </p>
            <button
              onClick={() => (window.location.href = "/Login")}
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              <span>Get Personalized Advice</span>
              <span className="ml-3 text-xl">→</span>
            </button>
          </div>
        </div>
      </section>

      
      {/* Why Learn Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Why Financial Education Matters
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Financial literacy is one of the most valuable skills you can
              develop. It impacts every major life decision.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Benefits */}
            <div>
              {/* Stats Banner */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    92%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Better Decisions
                  </div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    3.5x
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Wealth Growth
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    68%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Less Stress
                  </div>
                </div>
              </div>

              {/* Benefits List */}
              <div className="space-y-6">
                {[
                  {
                    title: "Make Informed Financial Decisions",
                    description:
                      "Navigate investments, loans, and major purchases with confidence",
                    icon: "🎯",
                    color: "text-blue-600 dark:text-blue-400",
                  },
                  {
                    title: "Build Wealth Systematically",
                    description:
                      "Create sustainable growth through proven strategies",
                    icon: "📈",
                    color: "text-emerald-600 dark:text-emerald-400",
                  },
                  {
                    title: "Avoid Costly Financial Mistakes",
                    description:
                      "Learn from experts who've seen common pitfalls",
                    icon: "🛡️",
                    color: "text-amber-600 dark:text-amber-400",
                  },
                  {
                    title: "Achieve Long-Term Goals",
                    description:
                      "Plan for retirement, education, and major life events",
                    icon: "🏆",
                    color: "text-purple-600 dark:text-purple-400",
                  },
                  {
                    title: "Reduce Financial Stress",
                    description:
                      "Gain peace of mind through financial security",
                    icon: "😌",
                    color: "text-cyan-600 dark:text-cyan-400",
                  },
                ].map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="text-2xl">{benefit.icon}</div>
                    <div>
                      <h3
                        className={`font-bold ${benefit.color} mb-1 group-hover:translate-x-1 transition-transform`}
                      >
                        {benefit.title}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column - Expert Learning */}
            <div className="relative">
              {/* Main Card */}
              <div className="bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-500 rounded-2xl p-8 text-white shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full translate-y-20 -translate-x-20"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
                    <span className="text-sm font-medium">
                      Expert-Led Learning
                    </span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-4">
                    Learn from Industry Professionals
                  </h3>

                  <p className="text-blue-100 mb-8 leading-relaxed">
                    Our courses are designed and taught by financial experts
                    with decades of real-world experience in banking,
                    investments, and wealth management.
                  </p>

                  {/* Expert Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold">+42%</div>
                      <div className="text-sm text-blue-100">
                        Avg. Financial Literacy Improvement
                      </div>
                    </div>
                    <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4">
                      <div className="text-2xl font-bold">25+</div>
                      <div className="text-sm text-blue-100">
                        Years Avg. Instructor Experience
                      </div>
                    </div>
                  </div>

                  {/* Expert Features */}
                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">
                        Real-world case studies
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">Live Q&A sessions</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-100">
                        Personalized feedback
                      </span>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => (window.location.href = "/Login")}
                    className="w-full py-3 bg-white text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 hover:shadow-lg"
                  >
                    Start Learning with Experts
                  </button>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl p-4 shadow-xl w-30">
                <div className="text-lg font-bold mb-1">500k+</div>
                <div className="text-sm text-amber-100">
                  Successful Learners
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl p-6 shadow-xl w-48">
                <div className="text-lg font-bold mb-1">98%</div>
                <div className="text-sm text-emerald-100">
                  Satisfaction Rate
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Testimonial */}
          <div className="mt-20 bg-gradient-to-r from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-900/20 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-3xl">
                  👤
                </div>
              </div>
              <div className="flex-1">
                <blockquote className="text-xl italic text-slate-700 dark:text-slate-300 mb-4">
                  "The financial education I received completely transformed how
                  I manage my money. I went from living paycheck to paycheck to
                  building real wealth."
                </blockquote>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Sarah M.
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Graduate, 6 months ago
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 text-center">
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  +$25k
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400">
                  Increased Savings
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 text-white relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&q=80"
            alt="Financial transformation and growth"
            className="w-full h-full object-cover"
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-indigo-900/80"></div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300">
              Financial Transformation
            </span>
          </h2>
          <p className="text-lg text-slate-200 mb-8 max-w-2xl mx-auto">
            Join thousands of learners who've improved their financial health
            and achieved their goals
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/Login"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              Create Free Account
            </Link>
            <button
              onClick={() => (window.location.href = "/Login")}
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-200"
            >
              Explore Courses
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-xl font-bold text-cyan-300">500k+</div>
              <div className="text-sm text-slate-300">Active Learners</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-xl font-bold text-cyan-300">94%</div>
              <div className="text-sm text-slate-300">Satisfaction Rate</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-xl font-bold text-cyan-300">100%</div>
              <div className="text-sm text-slate-300">Free Access</div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-10 h-10 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Education;
