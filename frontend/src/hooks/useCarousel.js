import { useState, useEffect } from 'react';
import {useLanguageContext} from '../contexts/LanguageContext';

export const useCarousel = () => {
  const { t } = useLanguageContext();
  const [currentSlide, setCurrentSlide] = useState(0);

  // Define carouselSlides inside the hook
  const carouselSlides = [
    {
      title: t("landing.hero.title1"),
      subtitle: t("landing.hero.subtitle1"),
      description: t("landing.hero.description1"),
      cta: t("landing.hero.cta1"),
      images: [
        "https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=800&fit=crop"
      ],
      action: "scroll",
      target: "#cta",
    },
    {
      title: t("landing.hero.title2"),
      subtitle: t("landing.hero.subtitle2"),
      description: t("landing.hero.description2"),
      cta: t("landing.hero.cta2"),
      images: [
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&h=800&fit=crop"
      ],
      action: "scroll",
      target: "#realTalk",
    },
    {
      title: t("landing.hero.title3"),
      subtitle: t("landing.hero.subtitle3"),
      description: t("landing.hero.description3"),
      cta: t("landing.hero.cta3"),
      images: [
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=800&fit=crop",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=800&fit=crop"
      ],
      action: "link",
      target: "/register",
    },
  ];

  // Auto-rotate slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [carouselSlides.length]);

  // Navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length
    );
  };

  const goToSlide = (index) => {
    if (index >= 0 && index < carouselSlides.length) {
      setCurrentSlide(index);
    }
  };

  return {
    currentSlide,
    carouselSlides,
    nextSlide,
    prevSlide,
    goToSlide,
  };
};