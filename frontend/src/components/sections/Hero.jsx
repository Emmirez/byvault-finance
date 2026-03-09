// components/sections/Hero.jsx
import React from "react";
import { ChevronRight, ChevronLeft, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { CTAButton } from "../ui/CTAButton/CTAButton";

const Hero = ({
  t,
  carouselSlides,
  currentSlide,
  nextSlide,
  prevSlide,
  goToSlide,
  scrollToSection,
}) => {
  const currentSlideData = carouselSlides[currentSlide];

  return (
    <section className="relative text-dark-900 dark:text-white overflow-hidden">
      {/* Background Bank Building Image */}

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 z-10">
            <p className="text-sm font-semibold tracking-wider mb-4 text-black-200 dark:text-gray-300 uppercase">
              {currentSlideData.subtitle}
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-black dark:text-white">
              {currentSlideData.title}
            </h1>
            <p className="text-lg md:text-xl mb-8 text-black-100 dark:text-gray-300">
              {currentSlideData.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
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
              <p className="text-lg text-blue-600 dark:text-blue-400">
                {currentSlide === 2
                  ? t("auth.alreadyHaveAccount") + " "
                  : t("auth.dontHaveAccount") + " "}
                <Link
                  to={currentSlide === 2 ? "/login" : "/register"}
                  className="font-semibold underline hover:text-blue-600 dark:hover:text-blue-300 transition"
                >
                  {currentSlide === 2 ? t("auth.signIn") : t("auth.signUp")}
                </Link>
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={prevSlide}
                className="w-10 h-10 bg-blue-600/90 dark:bg-blue-500/80 hover:bg-blue-700/80 dark:hover:bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-sm transition"
                aria-label="Previous slide"
              >
                <ChevronLeft className="text-white" size={20} />
              </button>

              <div className="flex space-x-2">
                {carouselSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index
                        ? "bg-blue-600 dark:bg-blue-500 w-8"
                        : "bg-gray-400/70 dark:bg-gray-500/70 w-2"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="w-10 h-10 bg-blue-600/90 dark:bg-blue-600/90 hover:bg-blue-700/80 dark:hover:bg-blue-600/80 rounded-full flex items-center justify-center backdrop-blur-sm transition"
                aria-label="Next slide"
              >
                <ChevronRight className="text-white" size={20} />
              </button>
            </div>
          </div>

          {/* Image Grid - Always visible on all screen sizes */}
          <div className="order-1 lg:order-2 relative w-full z-10">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* Left Image */}
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl">
                <img
                  src={currentSlideData.images[0]}
                  alt={`${currentSlideData.title} - Image 1`}
                  className="w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />
              </div>

              {/* Right Image */}
              <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-2xl">
                <img
                  src={currentSlideData.images[1]}
                  alt={`${currentSlideData.title} - Image 2`}
                  className="w-full h-[250px] xs:h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] object-cover transition-transform duration-700 hover:scale-105"
                  loading="eager"
                />

                {/* Active Users Badge */}
                <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 lg:bottom-4 lg:left-4 lg:right-4 bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl shadow-lg p-2.5 sm:p-3 lg:p-4 backdrop-blur-sm bg-opacity-95 dark:bg-opacity-95">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                    </div>
                    <div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                        18.5M+
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
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
    </section>
  );
};

export default Hero;