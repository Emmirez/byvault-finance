/* eslint-disable no-unused-vars */
// pages/AboutUs.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguageContext } from "../contexts/LanguageContext";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/footer/Footer.jsx";
import {
  Users,
  Shield,
  TrendingUp,
  CheckCircle,
  Building,
  Globe,
  ArrowRight,
  Target,
  Heart,
  Award,
  Zap,
  ChevronUp,
  ArrowUp
} from "lucide-react";

const AboutUs = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Custom header configuration
  const handleMenuToggle = (isOpen) => {
    console.log("Menu is now:", isOpen ? "open" : "closed");
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Core values
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description:
        "Bank-level encryption and fraud protection to keep your money safe",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description:
        "Your financial success is our priority, backed by 24/7 support",
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description: "Cutting-edge technology for seamless banking experiences",
    },
    {
      icon: Heart,
      title: "Transparent & Fair",
      description: "No hidden fees, clear terms, and honest communication",
    },
  ];

  // Team/leadership (placeholder)
  const team = [
    {
      name: "Sarah Johnson",
      role: "Chief Executive Officer",
      image:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80",
      bio: "15+ years in fintech innovation",
    },
    {
      name: "Michael Chen",
      role: "Chief Technology Officer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
      bio: "Former VP of Engineering at top banks",
    },
    {
      name: "Emily Rodriguez",
      role: "Chief Financial Officer",
      image:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80",
      bio: "Expert in financial compliance & growth",
    },
    {
      name: "David Kim",
      role: "Head of Security",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80",
      bio: "Cybersecurity specialist with 20+ years",
    },
  ];

  // Timeline/milestones
  const milestones = [
    {
      year: "2018",
      title: "Company Founded",
      description: "Started with a vision to democratize banking",
    },
    {
      year: "2019",
      title: "50K Users",
      description: "Reached our first major milestone",
    },
    {
      year: "2021",
      title: "Series A Funding",
      description: "Raised $50M to expand globally",
    },
    {
      year: "2023",
      title: "100K+ Users",
      description: "Became one of the fastest-growing digital banks",
    },
    {
      year: "2025",
      title: "Global Expansion",
      description: "Now serving customers in 150+ countries",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Tiny Round Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md flex items-center justify-center hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-110 hover:shadow-lg"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Header */}
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
        customClassName="shadow-sm"
        onMenuToggle={handleMenuToggle}
        onSignInClick={handleSignInClick}
      />

      <main>
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
                      About Us
                    </span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative pt-20 pb-16 overflow-hidden bg-gray-900">
          {/* Background image without gradient overlay */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
              alt="Modern banking office"
              className="w-full h-full object-cover opacity-30"
            />
          </div>

          {/* Subtle pattern overlay for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/20 to-gray-900/60"></div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              {/* Company Logo/Icon */}
              <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl mb-8 border border-white/20 shadow-xl">
                <Building className="w-10 h-10 text-white" />
              </div>

              {/* Main Title */}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                About <span className="text-blue-400">ByVault</span> Finance
              </h1>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed mb-10">
                Revolutionizing digital banking with cutting-edge technology,
                unmatched security, and customer-first service.
              </p>

              {/* Stats Bar */}
              <div className="flex flex-wrap justify-center gap-6 md:gap-12 mt-12">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    100K+
                  </div>
                  <div className="text-gray-300 text-sm uppercase tracking-wider">
                    Business Clients
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    $5B+
                  </div>
                  <div className="text-gray-300 text-sm uppercase tracking-wider">
                    Assets Managed
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    150+
                  </div>
                  <div className="text-gray-300 text-sm uppercase tracking-wider">
                    Countries
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    24/7
                  </div>
                  <div className="text-gray-300 text-sm uppercase tracking-wider">
                    Support
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 dark:from-gray-900 to-transparent"></div>
        </section>

        {/* Our Story Section */}
        <section className="py-20 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Text Content */}
              <div className="lg:pr-8 xl:pr-12">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                  <span className="mr-2">•</span> SINCE 2018
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8 leading-tight">
                  Our Journey to{" "}
                  <span className="text-blue-600 dark:text-blue-400">
                    Reinvent
                  </span>{" "}
                  Banking
                </h2>

                <div className="space-y-6">
                  <div className="relative pl-8">
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500"></div>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                      Founded in 2018,{" "}
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ByVault Finance
                      </span>{" "}
                      started with a bold vision: to make banking
                      <span className="text-blue-600 dark:text-blue-400 font-semibold">
                        {" "}
                        accessible, transparent, and effortless
                      </span>{" "}
                      for everyone. We recognized how traditional banks were
                      failing modern consumers and businesses.
                    </p>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-green-500"></div>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                      Today, we proudly serve
                      <span className="font-bold text-gray-900 dark:text-white mx-1">
                        100,000+ customers
                      </span>
                      across{" "}
                      <span className="font-semibold">150+ countries</span>,
                      processing billions in transactions with
                      <span className="text-green-600 dark:text-green-400 font-semibold mx-1">
                        industry-leading security
                      </span>
                      and absolutely zero hidden fees.
                    </p>
                  </div>

                  <div className="relative pl-8">
                    <div className="absolute left-0 top-2 w-4 h-4 rounded-full bg-purple-500"></div>
                    <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300">
                      We believe banking should be{" "}
                      <span className="font-semibold">
                        simple, secure, and built around you
                      </span>
                      —not the other way around. That's why we've invested in{" "}
                      <span className="text-purple-600 dark:text-purple-400 font-semibold">
                        cutting-edge technology
                      </span>{" "}
                      that puts you in complete control of your finances,
                      anytime, anywhere.
                    </p>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        150+
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                        Countries
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        100K+
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                        Customers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-gray-900 dark:text-white">
                        24/7
                      </div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm uppercase tracking-wider">
                        Support
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Image Gallery */}
              <div className="relative">
                {/* Main image grid */}
                <div className="grid grid-cols-2 gap-4 md:gap-6">
                  {[
                    {
                      src: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80",
                      alt: "Team collaboration at ByVault",
                      title: "Our Team",
                      delay: "0",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&q=80",
                      alt: "ByVault's modern headquarters",
                      title: "Our Space",
                      delay: "100",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
                      alt: "Advanced banking technology",
                      title: "Our Tech",
                      delay: "200",
                    },
                    {
                      src: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&q=80",
                      alt: "Data-driven financial insights",
                      title: "Our Analytics",
                      delay: "300",
                    },
                  ].map((image, index) => (
                    <div
                      key={index}
                      className={`relative group overflow-hidden rounded-2xl shadow-xl transition-all duration-500 hover:shadow-2xl`}
                      style={{ animationDelay: `${image.delay}ms` }}
                    >
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="w-full h-56 md:h-64 lg:h-72 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      {/* Overlay with title */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                        <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm font-medium mb-2">
                            {image.title}
                          </div>
                          <div className="text-white font-medium">
                            {image.alt.split(" ")[0]} {image.alt.split(" ")[1]}
                          </div>
                        </div>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">+</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Decorative element */}
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-gradient-to-tr from-green-500/10 to-blue-500/10 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Our Guiding Principles
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The foundation of everything we do at ByVault Finance
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              {/* Banking Image 1 */}
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Global banking network"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <div className="text-white">
                    <div className="text-sm font-semibold tracking-wider text-blue-300 mb-2">
                      GLOBAL REACH
                    </div>
                    <div className="text-2xl font-bold">150+ Countries</div>
                  </div>
                </div>
              </div>

              {/* Banking Image 2 */}
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1579532537598-459ecdaf39cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Secure digital transactions"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <div className="text-white">
                    <div className="text-sm font-semibold tracking-wider text-green-300 mb-2">
                      SECURITY FIRST
                    </div>
                    <div className="text-2xl font-bold">
                      Bank-Level Protection
                    </div>
                  </div>
                </div>
              </div>

              {/* Banking Image 3 */}
              <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                  alt="Innovative banking technology"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-8">
                  <div className="text-white">
                    <div className="text-sm font-semibold tracking-wider text-purple-300 mb-2">
                      TECH INNOVATION
                    </div>
                    <div className="text-2xl font-bold">
                      Cutting-Edge Platform
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Vision Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Mission Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-400/5 to-transparent rounded-full -translate-x-20 translate-y-20"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mb-8 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Mission
                  </h3>

                  <div className="space-y-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      To{" "}
                      <span className="font-semibold text-blue-600 dark:text-blue-400">
                        democratize financial access
                      </span>{" "}
                      by providing innovative, secure, and transparent banking
                      solutions that empower individuals and businesses
                      worldwide.
                    </p>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-bold">
                            ✓
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            Financial Inclusion
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Making banking accessible to everyone, everywhere
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vision Card */}
              <div className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-full -translate-y-16 translate-x-16"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-purple-400/5 to-transparent rounded-full -translate-x-20 translate-y-20"></div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 mb-8 shadow-lg">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                      ></path>
                    </svg>
                  </div>

                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    Our Vision
                  </h3>

                  <div className="space-y-4">
                    <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                      To become the{" "}
                      <span className="font-semibold text-purple-600 dark:text-purple-400">
                        world's most trusted digital bank
                      </span>
                      , setting new standards for transparency, security, and
                      customer experience while driving financial innovation
                      globally.
                    </p>

                    <div className="pt-6 border-t border-gray-100 dark:border-gray-700 mt-6">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center">
                          <span className="text-purple-600 dark:text-purple-400 font-bold">
                            ✦
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white mb-1">
                            Global Leadership
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400">
                            Redefining banking standards worldwide
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Banner */}
            <div className="mt-20 text-center">
              <div className="inline-block bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 rounded-2xl px-8 py-4">
                <p className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                  Join us in building the future of finance.
                  <span className="text-blue-600 dark:text-blue-400 ml-2">
                    Be part of the revolution.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                <span className="mr-2">✦</span> FOUNDATION OF EXCELLENCE
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Guiding Principles
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The values that define our culture and drive our success
              </p>
            </div>

            {/* Value Cards with Images */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {values.map((value, index) => {
                const Icon = value.icon;
                const imageUrls = [
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1920&q=80", // Security
                  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=1920&q=80", // Transparency
                  "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", // Innovation
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1920&q=80", // Customer First
                ];

                return (
                  <div
                    key={index}
                    className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                  >
                    {/* Background Image */}
                    <div className="absolute inset-0 overflow-hidden opacity-60 group-hover:opacity-20 transition-opacity duration-500">
                      <img
                        src={imageUrls[index]}
                        alt={value.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="relative z-10 p-8">
                      <div className="mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-4 shadow-lg">
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-semibold tracking-wider">
                          0{index + 1}
                        </span>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                        {value.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                        {value.description}
                      </p>

                      <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center text-blue-600 dark:text-blue-400 font-medium">
                          <span>Learn More</span>
                          <svg
                            className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Hover Effect Border */}
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-3xl transition-all duration-500"></div>
                  </div>
                );
              })}
            </div>

            {/* Supporting Images Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                {
                  url: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  title: "Secure Banking",
                },
                {
                  url: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  title: "Transparent Fees",
                },
                {
                  url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
                  title: "Modern Platform",
                },
                {
                  url: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1920&q=80",
                  title: "Customer Focus",
                },
              ].map((image, index) => (
                <div
                  key={index}
                  className="relative group overflow-hidden rounded-2xl"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-4">
                    <span className="text-white font-medium text-sm">
                      {image.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-16 pt-12 border-t border-gray-200 dark:border-gray-700">
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                These values aren't just words—they're how we operate every day
              </p>
              <Link
                to="/register"
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl inline-block"
              >
                Join Our Team
              </Link>
            </div>
          </div>
        </section>

        {/* Leadership Team Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                Meet Our Leadership
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                Experienced leaders committed to your financial success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <div key={index} className="group">
                  <div className="relative overflow-hidden rounded-2xl mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">
                    {member.role}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-semibold mb-6">
                <span className="mr-2">📈</span> OUR EVOLUTION
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Our Growth Journey
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From startup to industry leader - the milestones that define our
                success
              </p>
            </div>

            {/* Timeline Container */}
            <div className="relative">
              {/* Decorative Background Elements */}
              <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent dark:via-blue-400/20"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-blue-500/10 to-transparent dark:via-blue-400/10 transform -translate-x-1/2 hidden md:block"></div>

              {/* Timeline Items */}
              <div className="relative space-y-16">
                {milestones.map((milestone, index) => {
                  const imageUrls = [
                    "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1920&q=80",
                    "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
                    "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1616514197671-15d99ce7a6f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                    "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                  ];

                  return (
                    <div
                      key={index}
                      className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                    >
                      {/* Year Badge - Centered on Mobile */}
                      <div className="md:flex-1 flex justify-center md:justify-end mb-6 md:mb-0">
                        {index % 2 === 0 && (
                          <div className="relative group">
                            <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-lg group-hover:bg-blue-500/20 transition-all duration-500"></div>
                            <div className="relative">
                              <div className="text-6xl md:text-7xl font-bold text-gray-200 dark:text-gray-700">
                                {milestone.year}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-xl">
                                  {milestone.year}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Timeline Connector & Icon */}
                      <div className="relative flex flex-col items-center mx-4 md:mx-8">
                        <div className="w-4 h-4 rounded-full bg-blue-500 dark:bg-blue-400 border-4 border-white dark:border-gray-800 shadow-xl z-10"></div>
                        <div className="w-0.5 h-24 bg-gradient-to-b from-blue-500 to-blue-300 dark:from-blue-400 dark:to-blue-200 mt-4"></div>

                        {/* Connection Line on Desktop */}
                        <div className="hidden md:block absolute top-4 left-1/2 w-32 h-0.5 bg-gradient-to-r from-blue-500 to-transparent transform -translate-x-1/2"></div>
                      </div>

                      {/* Content Card */}
                      <div className="md:flex-1 mt-8 md:mt-0">
                        <div
                          className={`relative group overflow-hidden bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 hover:shadow-3xl transition-all duration-500 ${
                            index % 2 === 0 ? "md:ml-8" : "md:mr-8"
                          }`}
                        >
                          {/* Background Image */}
                          <div className="absolute inset-0 overflow-hidden opacity-10 group-hover:opacity-15 transition-opacity duration-500">
                            <img
                              src={imageUrls[index]}
                              alt={milestone.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Content */}
                          <div className="relative z-10 p-8">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                  <CheckCircle className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 tracking-wider">
                                    MILESTONE {index + 1}
                                  </div>
                                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {milestone.year}
                                  </div>
                                </div>
                              </div>
                              <div className="text-4xl opacity-30 group-hover:opacity-50 transition-opacity duration-500">
                                {index === 0
                                  ? "🚀"
                                  : index === 1
                                    ? "💡"
                                    : index === 2
                                      ? "📊"
                                      : index === 3
                                        ? "🌍"
                                        : "🏆"}
                              </div>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                              {milestone.title}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                              {milestone.description}
                            </p>

                            {/* Stats or Highlights */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex flex-wrap gap-3">
                                {milestone.highlights?.map(
                                  (highlight, hIndex) => (
                                    <span
                                      key={hIndex}
                                      className="px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium"
                                    >
                                      {highlight}
                                    </span>
                                  ),
                                ) || (
                                  <span className="px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm font-medium">
                                    Industry First
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Hover Effect Border */}
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-3xl transition-all duration-500"></div>
                        </div>
                      </div>

                      {/* Year Badge - Right Side */}
                      <div className="md:flex-1 flex justify-center md:justify-start mt-8 md:mt-0">
                        {index % 2 !== 0 && (
                          <div className="relative group">
                            <div className="absolute -inset-4 bg-purple-500/10 rounded-full blur-lg group-hover:bg-purple-500/20 transition-all duration-500"></div>
                            <div className="relative">
                              <div className="text-6xl md:text-7xl font-bold text-gray-200 dark:text-gray-700">
                                {milestone.year}
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-2xl md:text-3xl font-bold text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-xl">
                                  {milestone.year}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Journey Completion */}
              <div className="text-center mt-20 pt-16 border-t border-gray-200 dark:border-gray-700">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-6 shadow-xl">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  The Journey Continues
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                  We're just getting started. Join us as we continue to innovate
                  and transform the future of banking.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-20 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
              alt="Successful business professionals discussing finance"
              className="w-full h-full object-cover"
            />
            {/* Dark overlay for better text contrast */}
            <div className="absolute inset-0 bg-gray-900/75"></div>
          </div>

          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-8 border border-white/20">
              <Award className="w-10 h-10 text-white" />
            </div>

            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Join Over 100,000 Satisfied Customers
            </h2>

            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Experience banking that's designed for you. Open your account
              today and discover the difference.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/register"
                className="group px-8 py-4 bg-white hover:bg-gray-100 text-blue-600 font-semibold rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl inline-flex items-center justify-center"
              >
                <span>Open an Account</span>
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/contact-support"
                className="group px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-xl transition-all duration-300 border-2 border-white/40 hover:border-white/60 inline-flex items-center justify-center"
              >
                <span>Contact Us</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;
