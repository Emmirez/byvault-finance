/* eslint-disable no-unused-vars */
// pages/Landing.jsx
import { useLanguageContext } from "../contexts/LanguageContext";
import { useSmoothScroll } from "../hooks/useSmoothscroll.js";
import { useCarousel } from "../hooks/useCarousel.js";
import Header from "../components/header/Header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { CTASection } from "../components/sections/CTA";
import { Disclosures } from "../components/sections/Disclosures.jsx";
import { FAQSection } from "../components/sections/FAQSection.jsx";
import RealTalk from "../components/sections/RealTalk.jsx";
import Offer from "../components/sections/Offer.jsx";
import Mobile from "../components/sections/Mobile.jsx";
import Product from "../components/sections/Products.jsx";
import Features from "../components/sections/Features.jsx";
import Trust from "../components/sections/Trust.jsx";
import Stats from "../components/sections/Stats.jsx";
import Gallery from "../components/sections/Gallery.jsx";
import Hero from "../components/sections/Hero.jsx";
import Testimonials from "../components/sections/Testimonials.jsx";
import AboutSection from "./AboutSection.jsx";
import React from "react";
import CurrencyTable from "../components/sections/CurrencyTable.jsx";
import { useAuth } from "../contexts/AuthContext";
import ChatWidget from "../components/chatbot/ChatWidget.jsx";
import LanguageSwitcher from "../components/ui/GoogleTranslate/GoogleTranslate.jsx";

const Landing = () => {
  const { t } = useLanguageContext();
  const { user, isAuthenticated } = useAuth(); // GET AUTH STATE

  //smooth scroll hook
  const { scrollToSection } = useSmoothScroll();

  //carousel hook
  const { currentSlide, carouselSlides, nextSlide, prevSlide, goToSlide } =
    useCarousel();

  // Custom header configuration
  const handleMenuToggle = (isOpen) => {

  };

  // Determine which dashboard to redirect to based on user role
  const getDashboardLink = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard";
    }
    return "/dashboard";
  };

  // Determine CTA button text based on auth state
  const getPrimaryButtonText = () => {
    if (isAuthenticated) {
      return user?.role === "admin"
        ? "Go to Admin Dashboard"
        : "Go to Dashboard";
    }
    return t("landing.cta.openAnAccount");
  };

  // Determine CTA button link based on auth state
  const getPrimaryButtonLink = () => {
    if (isAuthenticated) {
      return getDashboardLink();
    }
    return "/register";
  };

  // Determine secondary button text based on auth state
  const getSecondaryButtonText = () => {
    if (isAuthenticated) {
      return "View Transactions";
    }
    return t("landing.cta.scheduleAppointment");
  };

  // Determine secondary button action based on auth state
  const getSecondaryButtonAction = () => {
    if (isAuthenticated) {
      return () => {
        // Redirect to transactions page
        window.location.href = "/transactions";
      };
    }
    return () => alert("Schedule appointment feature coming soon!");
  };

  return (
    <div className="w-full overflow-x-hidden bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation/header */}
      <Header
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
        customClassName="shadow-sm"
        onMenuToggle={handleMenuToggle}
        user={user} // Pass user data to header
        isAuthenticated={isAuthenticated} // Pass auth state to header
        forceLoggedOut={true}
      />

      {/* Hero Section */}
      <section className="w-full overflow-hidden">
        <Hero
          t={t}
          carouselSlides={carouselSlides}
          currentSlide={currentSlide}
          prevSlide={prevSlide}
          nextSlide={nextSlide}
          goToSlide={goToSlide}
          scrollToSection={scrollToSection}
          isAuthenticated={isAuthenticated}
          userName={user?.firstName}
        />
      </section>

      {/* Real Talk with Better Money Habits */}
      <section id="realTalk" className="w-full overflow-hidden">
        <RealTalk t={t} />
      </section>

      {/* About Us Section */}
      <section className="w-full overflow-hidden">
        <AboutSection t={t} />
      </section>

      {/* Currency Exchange Rates Table - NEW */}
      <section className="w-full overflow-hidden">
        <CurrencyTable t={t} />
      </section>

      <section className="w-full overflow-hidden">
        <Offer t={t} />
      </section>

      <section className="w-full overflow-hidden">
        <Mobile t={t} />
      </section>

      <section className="w-full overflow-hidden">
        <Product t={t} />
      </section>

      {/* Testimonials */}
      <section className="w-full overflow-hidden">
        <Testimonials t={t} />
      </section>

      {/* Why Choose Us */}
      <section className="w-full overflow-hidden">
        <Features t={t} />
      </section>

      <section className="w-full overflow-hidden">
        <Trust t={t} />
      </section>

      <section className="w-full overflow-hidden">
        <Stats t={t} />
      </section>

      <section className="w-full overflow-hidden">
        <Gallery t={t} />
      </section>

      {/*CTA*/}
      <section id="cta" className="w-full overflow-hidden">
        <CTASection
          title={
            isAuthenticated
              ? `Welcome back, ${user?.firstName || "User"}!`
              : t("landing.cta.readyToGetStarted")
          }
          description={
            isAuthenticated
              ? "Continue managing your finances with ease"
              : t("landing.cta.openAccountToday")
          }
          primaryButtonText={getPrimaryButtonText()}
          primaryButtonLink={getPrimaryButtonLink()}
          secondaryButtonText={getSecondaryButtonText()}
          secondaryButtonAction={getSecondaryButtonAction()}
          showLoginLink={true} 
          t={t}
        />
      </section>

      <section className="w-full overflow-hidden">
        <Disclosures t={t} />
      </section>

      {/* FAQ */}
      <section className="w-full overflow-hidden">
        <FAQSection
          title={t("landing.faq.title")}
          subtitle={t("landing.faq.subtitle")}
          t={t}
        />
      </section>

      <LanguageSwitcher />

      {/* Footer */}
      <Footer />

      {/* chat widget */}
      <ChatWidget position="right" primaryColor="#2563eb" />
    </div>
  );
};

export default Landing;
