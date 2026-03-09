// pages/Contact.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Users,
  Building,
  Globe,
  ArrowLeft,
  ArrowUp,
  Send,
  CheckCircle2,
  Headphones,
  Shield,
  AlertCircle,
  MessageCircle
} from "lucide-react";
import Header from "../components/header/header.jsx";
import Footer from "../components/layout/Footer/Footer.jsx";
import { useLanguageContext } from "../contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguageContext();
  const [showScrollTop, setShowScrollTop] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [hoveredMethod, setHoveredMethod] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.subject) errors.subject = "Subject is required";
    if (!formData.message.trim()) errors.message = "Message is required";
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    console.log("Form submitted:", formData);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    setFormErrors({});
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactMethods = [
    {
      title: "Customer Service",
      phone: "1-800-555-1234",
      email: "service@trustedbank.com",
      hours: "24/7 Available",
      icon: Headphones,
      color: "from-blue-500 to-cyan-500",
      description: "Account support and general inquiries"
    },
    {
      title: "Business Banking",
      phone: "1-800-555-5678",
      email: "business@trustedbank.com",
      hours: "Mon-Fri: 8am-8pm EST",
      icon: Building,
      color: "from-emerald-500 to-teal-500",
      description: "Business accounts and services"
    },
    {
      title: "Wealth Management",
      phone: "1-800-555-9012",
      email: "wealth@trustedbank.com",
      hours: "Mon-Fri: 9am-5pm EST",
      icon: Users,
      color: "from-amber-500 to-orange-500",
      description: "Investment and wealth services"
    },
    {
      title: "Security Support",
      phone: "1-888-555-3456",
      email: "security@trustedbank.com",
      hours: "24/7 Available",
      icon: Shield,
      color: "from-rose-500 to-pink-500",
      description: "Security and fraud support"
    }
  ];

  const locations = [
    {
      city: "New York, NY",
      address: "123 Wall Street, New York, NY 10005",
      phone: "(212) 555-0100",
      hours: "Mon-Fri: 9am-5pm",
      metro: "Wall St Station"
    },
    {
      city: "Chicago, IL",
      address: "456 Michigan Ave, Chicago, IL 60611",
      phone: "(312) 555-0200",
      hours: "Mon-Fri: 9am-5pm",
      metro: "Loop District"
    },
    {
      city: "San Francisco, CA",
      address: "789 Market St, San Francisco, CA 94103",
      phone: "(415) 555-0300",
      hours: "Mon-Fri: 9am-5pm",
      metro: "Financial District"
    },
    {
      city: "Miami, FL",
      address: "101 Brickell Ave, Miami, FL 33131",
      phone: "(305) 555-0400",
      hours: "Mon-Fri: 9am-5pm",
      metro: "Brickell"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Header
        showSignIn={true}
        showDarkModeToggle={true}
        showLanguageSwitcher={true}
      />

      {/* Back to Home Navigation */}
      <div className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            to="/"
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </div>
      </div>

      {/* Hero Section - Refined */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 text-white py-24">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block px-4 py-2 bg-blue-500/20 backdrop-blur-sm rounded-full border border-blue-400/50 mb-6">
              <span className="text-sm font-semibold text-blue-200">Get in Touch</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              We're <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Here to Help</span>
            </h1>
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              Connect with our dedicated support team through your preferred channel. We're committed to resolving your banking needs quickly and professionally.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-cyan-400">24/7</div>
                <div className="text-sm text-slate-300">Available Support</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-cyan-400">&lt; 1min</div>
                <div className="text-sm text-slate-300">Avg Response Time</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-cyan-400">99%</div>
                <div className="text-sm text-slate-300">Satisfaction Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-blue-600"></div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Contact Methods</h2>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Choose the department and contact method that best suits your needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setHoveredMethod(index)}
                  onMouseLeave={() => setHoveredMethod(null)}
                  className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 group"
                >
                  {/* Header with gradient */}
                  <div className={`bg-gradient-to-br ${method.color} p-6 text-white`}>
                    <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                      {method.description}
                    </p>

                    <div className="space-y-3 text-sm">
                      <a 
                        href={`tel:${method.phone.replace(/\D/g, '')}`}
                        className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>{method.phone}</span>
                      </a>
                      <a 
                        href={`mailto:${method.email}`}
                        className="flex items-center text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition"
                      >
                        <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span className="truncate">{method.email}</span>
                      </a>
                      <div className="flex items-center text-slate-700 dark:text-slate-300">
                        <Clock className="w-4 h-4 mr-3 flex-shrink-0" />
                        <span>{method.hours}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-blue-600"></div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Send a Message</h2>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Fill out the form below and our team will respond within 24 hours
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 md:p-12 border border-slate-200 dark:border-slate-700">
            {isSubmitted && (
              <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-emerald-900 dark:text-emerald-300">Success!</p>
                  <p className="text-sm text-emerald-800 dark:text-emerald-400">Your message has been sent. We'll be in touch soon.</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-900 dark:text-white mb-2 font-medium text-sm">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                      formErrors.name
                        ? "border-rose-500 dark:border-rose-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    placeholder="John Doe"
                  />
                  {formErrors.name && (
                    <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle size={14} /> {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-slate-900 dark:text-white mb-2 font-medium text-sm">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white ${
                      formErrors.email
                        ? "border-rose-500 dark:border-rose-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                    placeholder="john@example.com"
                  />
                  {formErrors.email && (
                    <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle size={14} /> {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-slate-900 dark:text-white mb-2 font-medium text-sm">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white transition"
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-slate-900 dark:text-white mb-2 font-medium text-sm">
                    Subject <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white appearance-none ${
                      formErrors.subject
                        ? "border-rose-500 dark:border-rose-500"
                        : "border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    <option value="">Select a subject</option>
                    <option value="account">Account Inquiry</option>
                    <option value="loan">Loan Application</option>
                    <option value="investment">Investment Services</option>
                    <option value="technical">Technical Support</option>
                    <option value="security">Security Concern</option>
                    <option value="other">Other</option>
                  </select>
                  {formErrors.subject && (
                    <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1">
                      <AlertCircle size={14} /> {formErrors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-slate-900 dark:text-white mb-2 font-medium text-sm">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="6"
                  className={`w-full px-4 py-3 rounded-lg border transition focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-700 dark:text-white resize-none ${
                    formErrors.message
                      ? "border-rose-500 dark:border-rose-500"
                      : "border-slate-300 dark:border-slate-600"
                  }`}
                  placeholder="Please provide details about your inquiry..."
                />
                {formErrors.message && (
                  <p className="mt-2 text-sm text-rose-600 dark:text-rose-400 flex items-center gap-1">
                    <AlertCircle size={14} /> {formErrors.message}
                  </p>
                )}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-lg hover:shadow-lg transition flex items-center justify-center gap-2 group"
                >
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Branch Locations */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-8 bg-blue-600"></div>
              <h2 className="text-4xl font-bold text-slate-900 dark:text-white">Branch Locations</h2>
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
              Visit one of our conveniently located branch offices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-200 dark:border-slate-700 group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {location.city}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{location.metro}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {location.address}
                  </p>
                  <a 
                    href={`tel:${location.phone.replace(/\D/g, '')}`}
                    className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <Phone className="w-4 h-4 flex-shrink-0" />
                    {location.phone}
                  </a>
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    {location.hours}
                  </div>
                </div>

                <button className="w-full py-2 text-center text-blue-600 dark:text-blue-400 font-semibold text-sm hover:text-blue-700 dark:hover:text-blue-300 transition border-t border-slate-200 dark:border-slate-700 pt-4">
                  Get Directions →
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Chat CTA */}
      <section className="py-20 bg-slate-50 dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-12 text-white text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <MessageCircle className="w-96 h-96 absolute -top-40 -right-40" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">Need Immediate Help?</h2>
              <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
                Start a live chat with our customer support team for instant assistance
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-50 transition shadow-lg hover:shadow-xl">
                  Start Live Chat
                </button>
                <button className="px-8 py-4 bg-white/20 backdrop-blur-sm border border-white/50 text-white font-semibold rounded-lg hover:bg-white/30 transition">
                  Schedule Call
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 dark:bg-blue-700 text-white rounded-lg shadow-lg hover:shadow-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 flex items-center justify-center z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default Contact;