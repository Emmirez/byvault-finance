// components/sections/CTASection.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, UserPlus, Phone } from "lucide-react";
import { CTAButton } from "../ui/CTAButton/CTAButton";

export const CTASection = ({
  title,
  description,
  primaryButtonText,
  primaryButtonLink = "/register",
  secondaryButtonText,
  secondaryButtonAction,
  showLoginLink = true,
  t,
  className = "",
  bgColor = "bg-gradient-to-br from-blue-600 via-blue-600 to-blue-600",
  maxWidth = "max-w-4xl",
}) => {
  return (
    <section
      id="cta"
      className={`py-24 ${bgColor} relative overflow-hidden transition-colors duration-300 ${className}`}
    >
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-white to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-white to-transparent rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

      <div
        className={`relative ${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 text-center`}
      >
        {/* Title */}
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
          {title}
        </h2>

        {/* Description */}
        <p className="text-lg lg:text-xl text-white mb-12 leading-relaxed max-w-2xl mx-auto drop-shadow">
          {description}
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            to={primaryButtonLink}
            className="group inline-flex items-center justify-center bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-xl"
          >
            <UserPlus className="w-5 h-5 mr-2" />
            {primaryButtonText}
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>

          {secondaryButtonText && (
            <Link
              to="/login"
              className="group inline-flex items-center justify-center bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm border-2 border-white/40 hover:border-white/60 px-8 py-4 text-base font-semibold rounded-xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <Phone className="w-5 h-5 mr-2" />
              {secondaryButtonText}
            </Link>
          )}
        </div>

        {/* Login link for existing users */}
        {showLoginLink && t && (
          <p className="text-white/90 text-sm sm:text-base">
            {t("auth.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-white hover:text-white/80 transition-colors underline underline-offset-4 decoration-2"
            >
              {t("auth.signIn")}
            </Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default CTASection;
