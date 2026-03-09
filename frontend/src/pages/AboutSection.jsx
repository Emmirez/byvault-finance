// components/sections/AboutSection.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AboutSection = ({ t }) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    const element = document.getElementById("about-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  return (
    <section
      id="about-section"
      className="relative py-20 md:py-32 px-4 md:px-8 lg:px-16 bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-900 dark:to-slate-900 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-200 to-cyan-200 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-full blur-3xl opacity-40 -z-10 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-200 to-blue-200 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-full blur-3xl opacity-40 -z-10"></div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          
          {/* Left Side - Large Image Section */}
          <div
            className={`relative h-96 sm:h-[500px] md:h-[600px] lg:h-[650px] transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"
            }`}
          >
            {/* Primary Image Container */}
            <div className="relative w-full h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl shadow-2xl transform group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=900&fit=crop"
                  alt="Modern banking workspace"
                  className="w-full h-full object-cover mix-blend-multiply opacity-90 hover:opacity-100 transition-opacity duration-500"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>

              {/* Accent Image - Floating */}
              <div className="absolute -bottom-6 -right-6 w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 rounded-2xl shadow-2xl border-8 border-white dark:border-gray-800 overflow-hidden transform hover:scale-105 transition-transform duration-500 z-20 group">
                <img
                  src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=400&fit=crop"
                  alt="Team collaboration"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Decorative element */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-white dark:bg-gray-800 rounded-full opacity-10 blur-2xl"></div>

              {/* Stats Badge */}
              <div className="absolute top-8 left-8 bg-white dark:bg-gray-800 backdrop-blur-md rounded-2xl p-6 shadow-xl z-10 max-w-xs">
                <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {t?.("landing.about.statLabel") || "Industry Impact"}
                </p>
                <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 mt-2">
                  15M+
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
                  {t?.("landing.about.statDesc") || "Customers Worldwide"}
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div
            className={`space-y-8 transition-all duration-1000 transform ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
            }`}
          >
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800">
                <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                <span className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                  {t?.("landing.about.label") || "Our Story"}
                </span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight tracking-tight">
                {t?.("landing.about.title") ||
                  "Redefining Financial Freedom for Everyone"}
              </h2>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-light">
              {t?.("landing.about.description") ||
                "We're not just another bank. Founded on the belief that financial services should be accessible, transparent, and empowering, we've built a platform that puts you in control. From seamless digital experiences to intelligent financial tools, we're committed to making banking work for you, not against you."}
            </p>

            {/* Key Values */}
            <div className="grid grid-cols-2 gap-4 py-4">
              {/* Value 1 */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t?.("landing.about.value1") || "Innovation"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t?.("landing.about.value1Desc") || "Cutting-edge tech"}
                </p>
              </div>

              {/* Value 2 */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t?.("landing.about.value2") || "Transparency"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t?.("landing.about.value2Desc") || "No hidden fees"}
                </p>
              </div>

              {/* Value 3 */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-cyan-500 dark:hover:border-cyan-500 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t?.("landing.about.value3") || "Security"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t?.("landing.about.value3Desc") || "Your data matters"}
                </p>
              </div>

              {/* Value 4 */}
              <div className="group p-4 rounded-2xl bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 hover:border-pink-500 dark:hover:border-pink-500 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm">
                  {t?.("landing.about.value4") || "Experience"}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {t?.("landing.about.value4Desc") || "Customer first"}
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => navigate("/about")}
                className="group relative inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
              >
                <span>{t?.("landing.about.readMore") || "Learn Our Full Story"}</span>
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>

            {/* Trust Badge */}
            <div className="pt-4 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex -space-x-2">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
                <img
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop"
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 object-cover"
                />
              </div>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {t?.("landing.about.trustText") || "Join thousands"}
                </span>{" "}
                {t?.("landing.about.trustTextDesc") || "who trust us daily"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;