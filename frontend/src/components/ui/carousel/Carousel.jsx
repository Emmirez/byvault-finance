// components/ui/Carousel.jsx
import React from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const Carousel = ({
  slides,
  currentSlide,
  prevSlide,
  nextSlide,
  goToSlide,
  children,
  className = ""
}) => {
  return (
    <div className={`relative ${className}`}>
      {children(slides[currentSlide])}
      
      <div className="flex items-center space-x-4 mt-8">
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
  );
};

export default Carousel;