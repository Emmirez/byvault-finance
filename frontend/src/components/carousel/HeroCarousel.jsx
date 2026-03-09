// components/carousel/HeroCarousel.jsx
import React from "react";
import { ChevronRight, ChevronLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { CTAButton } from "../ui/CTAButton/index.jsx";

export const HeroCarousel = ({
  slides,
  currentSlide,
  nextSlide,
  prevSlide,
  goToSlide,
  scrollToSection,
  t,
}) => {
  const currentSlideData = slides[currentSlide];

  return (
    <div className="relative">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Text Content */}
        <div className="order-2 lg:order-1">
          <p className="text-sm font-semibold tracking-wider mb-4 text-blue-200 dark:text-blue-300">
            {currentSlideData.subtitle}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {currentSlideData.title}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100 dark:text-blue-200">
            {currentSlideData.description}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            {currentSlideData.action === "scroll" ? (
              <CTAButton
                onClick={() => {
                  const targetId = currentSlideData.target.replace("#", "");
                  scrollToSection(targetId, 80);
                }}
                variant="primary"
              >
                {currentSlideData.cta}
              </CTAButton>
            ) : (
              <CTAButton to={currentSlideData.target} variant="primary">
                {currentSlideData.cta}
              </CTAButton>
            )}

            {currentSlide === 1 && (
              <CTAButton to="/education" variant="secondary">
                {t("landing.realTalk.exploreResources")}
              </CTAButton>
            )}
          </div>

          <div className="space-y-2 mb-8">
            <p className="text-sm text-blue-200 dark:text-blue-300">
              {currentSlide === 2
                ? t("auth.alreadyHaveAccount") + " "
                : t("auth.dontHaveAccount") + " "}
              <Link
                to={currentSlide === 2 ? "/login" : "/register"}
                className="font-semibold underline hover:text-white transition"
              >
                {currentSlide === 2 ? t("auth.signIn") : t("auth.signUp")}
              </Link>
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition"
              aria-label="Previous slide"
            >
              <ChevronLeft className="text-white" size={20} />
            </button>

            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all ${
                    currentSlide === index
                      ? "bg-white w-8"
                      : "bg-white/50 dark:bg-white/30 w-2"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-white/20 dark:bg-white/10 hover:bg-white/30 dark:hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition"
              aria-label="Next slide"
            >
              <ChevronRight className="text-white" size={20} />
            </button>
          </div>
        </div>

        {/* Image Grid - Now visible on all screen sizes */}
        <div className="order-1 lg:order-2 relative">
          <div className="grid grid-cols-2 gap-4">
            {/* Left Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={currentSlideData.images[0]}
                alt={`${currentSlideData.title} - Image 1`}
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />
            </div>

            {/* Right Image */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <img
                src={currentSlideData.images[1]}
                alt={`${currentSlideData.title} - Image 2`}
                className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
              />
              
              {/* Active Users Badge - Positioned at bottom left */}
              <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      18.5M+
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Active Users
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};