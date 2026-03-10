// pages/ContactSupport.jsx
import React, { useState } from "react";
import { useLanguageContext } from "../contexts/LanguageContext";
import Header from "../components/header/header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { MapPin, Mail, Phone, Send, MessageCircle, CheckCircle, XCircle, X } from "lucide-react";
import { Link } from "react-router-dom";

const Notification = ({ notification, onClose }) => {
  if (!notification) return null;

  const isSuccess = notification.type === "success";

  return (
    <div
      className={`flex items-start gap-3 px-5 py-4 rounded-xl border w-full
        ${isSuccess
          ? "bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-700"
          : "bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-700"
        }`}
    >
      {isSuccess
        ? <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
        : <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
      }
      <p className={`text-sm font-medium flex-1 ${isSuccess ? "text-green-800 dark:text-green-200" : "text-red-800 dark:text-red-200"}`}>
        {notification.message}
      </p>
      <button
        onClick={onClose}
        className={`flex-shrink-0 rounded-lg p-0.5 transition-colors
          ${isSuccess
            ? "text-green-500 hover:text-green-700 dark:text-green-400 dark:hover:text-green-200"
            : "text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
          }`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

const ContactSupport = () => {
  const { t } = useLanguageContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!agreed) {
      showNotification("error", "Please agree to the Terms & Conditions and Privacy Policy");
      return;
    }

    setIsSubmitting(true);

    try {
      // Real API call to backend
      const response = await fetch("http://localhost:3001/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      showNotification("success", data.message || "Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setAgreed(false);
    } catch (error) {
      console.error("Contact form error:", error);
      showNotification("error", error.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMenuToggle = (isOpen) => {
    console.log("Menu is now:", isOpen ? "open" : "closed");
  };

  const handleSignInClick = () => {
    console.log("Sign In clicked");
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: t("pages.contact.ourLocation") || "Our Location",
      primary: "New, York, USA.",
      secondary: "123 Financial Plaza, New York, NY 10001.",
      color: "blue",
    },
    {
      icon: Mail,
      title: t("pages.contact.emailUs") || "Email Us",
      primary: "admin@byvaultonline.com",
      secondary: null,
      color: "green",
      isLink: true,
      linkHref: "mailto:admin@byvaultonline.com",
    },
    {
      icon: Phone,
      title: t("pages.contact.phone") || "Phone",
      primary: "+1-469-696-1911",
      secondary: "1-800-BYVAULTFN-1",
      color: "purple",
    },
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "text-green-600 dark:text-green-400",
      border: "border-green-200 dark:border-green-800",
    },
    purple: {
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-800",
    },
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Navigation/header */}
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
        customClassName="shadow-sm"
        onMenuToggle={handleMenuToggle}
        onSignInClick={handleSignInClick}
      />

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
                    Contact Us
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-20 pb-12 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=800&q=80"
            alt="Customer Service"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl mb-6 shadow-lg">
            <MessageCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg mb-4">
            {t("pages.contact.contactSupport") || "Contact Support"}
          </h1>
          <p className="text-lg text-white/90 drop-shadow-md max-w-2xl mx-auto">
            {t("pages.contact.subtitle") ||
              "Get in touch with our support team"}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((info, index) => {
                const Icon = info.icon;
                const colors = colorClasses[info.color];

                return (
                  <div
                    key={index}
                    className={`${colors.bg} ${colors.border} border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center shadow-sm">
                          <Icon className={`w-6 h-6 ${colors.icon}`} />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          {info.title}
                        </h3>
                        {info.isLink ? (
                          <a
                            href={info.linkHref}
                            className={`block text-gray-700 dark:text-gray-300 hover:${colors.icon} transition-colors break-words`}
                          >
                            {info.primary}
                          </a>
                        ) : (
                          <>
                            <p className="text-gray-700 dark:text-gray-300 mb-1">
                              {info.primary}
                            </p>
                            {info.secondary && (
                              <p className="text-gray-600 dark:text-gray-400 text-sm">
                                {info.secondary}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {t("pages.contact.sendMessage") || "Send Message"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("pages.contact.name") || "Name*"}
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("pages.contact.email") || "Email*"}
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter your email"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t("pages.contact.yourMessage") || "Your Message*"}
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                      placeholder="Type your message here..."
                    />
                  </div>

                  {/* Terms Agreement */}
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreed}
                      onChange={(e) => setAgreed(e.target.checked)}
                      className="mt-1 w-5 h-5 text-blue-600 dark:text-blue-400 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer"
                    >
                      {t("pages.contact.agreeTerms") || "I agree to the "}
                      <a
                        href="/terms-conditions"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {t("pages.contact.termsConditions") ||
                          "Terms & Conditions"}
                      </a>{" "}
                      {t("pages.contact.and") || "and"}{" "}
                      <a
                        href="/privacy-policy"
                        className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                      >
                        {t("pages.contact.privacyPolicy") || "Privacy Policy"}
                      </a>
                    </label>
                  </div>

                  {/* Notification */}
                  {notification && (
                    <Notification
                      notification={notification}
                      onClose={() => setNotification(null)}
                    />
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-600 dark:to-indigo-600 dark:hover:from-blue-500 dark:hover:to-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t("pages.contact.sending") || "Sending..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        {t("pages.contact.sendMessageButton") || "SEND MESSAGE"}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ContactSupport;