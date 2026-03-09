// components/sections/FAQSection.jsx
import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export const FAQSection = ({ 
  title,
  subtitle,
  items,
  t,
  className = "",
  maxWidth = "max-w-3xl",
  bgColor = "bg-white dark:bg-slate-950",
  padding = "py-16"
}) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Default FAQ items if none provided
  const defaultItems = [
    {
      question: t("landing.faq.faq1Question"),
      answer: t("landing.faq.faq1Answer")
    },
    {
      question: t("landing.faq.faq2Question"),
      answer: t("landing.faq.faq2Answer")
    },
    {
      question: t("landing.faq.faq3Question"),
      answer: t("landing.faq.faq3Answer")
    },
    {
      question: t("landing.faq.faq4Question"),
      answer: t("landing.faq.faq4Answer")
    }
  ];

  const faqItems = items || defaultItems;

  const toggleItem = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section className={`${padding} ${bgColor} transition-colors duration-300 ${className}`}>
      <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8`}>
        {/* Header */}
        <div className="text-center mb-12">
          {title && (
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-1 w-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-white">
                {title}
              </h2>
              <div className="h-1 w-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full"></div>
            </div>
          )}
          {subtitle && (
            <p className="text-base lg:text-lg text-slate-600 dark:text-slate-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* FAQ Items */}
        <div className="space-y-3">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="group"
              style={{
                animation: `fadeInUp 0.5s ease-out ${index * 0.08}s both`,
              }}
            >
              <button
                onClick={() => toggleItem(index)}
                className="w-full bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md"
              >
                {/* Question Section */}
                <div className="flex items-center justify-between p-5 lg:p-6">
                  <h3 className="text-base lg:text-lg font-semibold text-slate-900 dark:text-white text-left group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {item.question}
                  </h3>

                  {/* Chevron Icon */}
                  <ChevronDown
                    className={`w-5 h-5 lg:w-6 lg:h-6 text-slate-600 dark:text-slate-400 flex-shrink-0 ml-4 transition-transform duration-300 ${
                      expandedIndex === index ? "rotate-180 text-blue-600 dark:text-blue-400" : ""
                    }`}
                  />
                </div>

                {/* Answer Section - Animated */}
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    expandedIndex === index ? "max-h-96" : "max-h-0"
                  }`}
                >
                  <div className="px-5 lg:px-6 pb-5 lg:pb-6 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50">
                    <p className="text-slate-700 dark:text-slate-300 text-sm lg:text-base leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </button>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Can't find what you're looking for?{" "}
            <a href="/contact-support" className="text-blue-600 dark:text-blue-400 font-semibold hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
              Contact us
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </section>
  );
};

export default FAQSection;