// components/sections/RealTalk.jsx
import React, { useState, useEffect } from "react";
import { ChevronRight, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RealTalk = ({ t, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("realTalk-section");
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const cards = [
    {
      id: 1,
      cardTitle: t("landing.realTalk.budgeting.title") || "Smart Budgeting",
      title: t("landing.realTalk.budgeting.cardTitle") || "Master Your Money",
      description: t("landing.realTalk.budgeting.description") || "Learn proven strategies to track expenses, set realistic goals, and build wealth.",
      ctaText: t("landing.realTalk.budgeting.cta") || "Explore",
      link: "/budgeting",
      image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?w=600&h=600&fit=crop&q=80",
    },
    {
      id: 2,
      cardTitle: t("landing.realTalk.homeBuying.title") || "Home Ownership",
      title: t("landing.realTalk.homeBuying.cardTitle") || "Your Dream Home",
      description: t("landing.realTalk.homeBuying.description") || "Navigate homeownership with confidence and expert guidance every step.",
      ctaText: t("landing.realTalk.homeBuying.cta") || "Learn More",
      link: "/home-buying",
      image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=600&fit=crop&q=80",
    },
    {
      id: 3,
      cardTitle: t("landing.realTalk.credit.title") || "Credit Mastery",
      title: t("landing.realTalk.credit.cardTitle") || "Stellar Credit Score",
      description: t("landing.realTalk.credit.description") || "Understand credit scores and unlock better rates on loans and mortgages.",
      ctaText: t("landing.realTalk.credit.cta") || "Get Started",
      link: "/credit",
      image: "https://images.unsplash.com/photo-1563207153-f403bf289096?w=600&h=600&fit=crop&q=80",
    },
  ];

  const handleNavigate = (link) => {
    navigate(link);
  };

  return (
    <section id="realTalk-section" className={`py-16 md:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 ${className}`}>
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
            <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
            <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              {t("landing.realTalk.badge") || "Guidance"}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight px-2 sm:px-0">
            {t("landing.realTalk.title") || "Real Talk About Money"}
          </h2>

          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed px-2 sm:px-0">
            {t("landing.realTalk.description") || "Expert strategies to help you make smarter financial decisions"}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {cards.map((card, index) => (
            <div
              key={card.id}
              className={`group transition-all duration-1000 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              {/* Card Container */}
              <div className="relative h-80 sm:h-96 bg-gray-100 dark:bg-gray-800 rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-shadow duration-300">
                
                {/* Image */}
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80 group-hover:via-black/50 group-hover:to-black/85 transition-all duration-300"></div>

                {/* Content - Centered */}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-5 sm:p-6 md:p-8">
                  
                  {/* Category Label */}
                  <div className="mb-3 sm:mb-4">
                    <p className="text-xs sm:text-sm font-bold text-blue-200 opacity-90 uppercase tracking-widest">
                      {card.cardTitle}
                    </p>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-snug mb-3 sm:mb-4">
                    {card.title}
                  </h3>

                  {/* Description - Hidden on very small screens */}
                  <p className="hidden sm:block text-sm text-gray-100 leading-relaxed opacity-95 mb-4 sm:mb-6 line-clamp-3">
                    {card.description}
                  </p>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleNavigate(card.link)}
                    className="inline-flex items-center gap-1 sm:gap-2 text-white text-xs sm:text-sm font-semibold group/btn hover:gap-3 transition-all opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 duration-300 hover:text-blue-200"
                  >
                    <span className="relative">
                      {card.ctaText}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover/btn:w-full transition-all duration-300"></span>
                    </span>
                    <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform flex-shrink-0" />
                  </button>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RealTalk;