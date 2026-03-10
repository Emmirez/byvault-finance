// components/layout/Footer.jsx
import React from "react";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useLanguageContext } from "../../../contexts/LanguageContext";

const Footer = ({
  showSocialIcons = true,
  showEmail = true,
  customClassName = "",
  companyEmail = "admin@byvaultonline.com",
  companyPhone = "1-800-BYVAULTFN-1",
  companyAddress = "123 Financial Plaza, New York, NY 10001"
}) => {
  const { t } = useLanguageContext();

  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: t("footer.products"),
      links: [
        { label: t("navigation.checking"), href: "/checking" },
        { label: t("navigation.savings"), href: "/savings" },
        { label: t("navigation.creditCards"), href: "/credit-cards" },
        { label: t("navigation.loans"), href: "/loans" }
      ]
    },
    {
      title: t("footer.support"),
      links: [
        { label: t("navigation.help"), href: "/help" },
        { label: t("navigation.contact"), href: "/contact-support" },
        { label: t("navigation.privacySecurity"), href: "/privacy-security" },
        { label: t("footer.privacy"), href: "/privacy-security" }
      ]
    },
    {
      title: t("footer.company"),
      links: [
        { label: t("navigation.aboutUs"), href: "/about" },
        { label: t("footer.careers"), href: "#careers" },
        { label: t("footer.press"), href: "#press" },
        { label: t("footer.locations"), href: "#locations" }
      ]
    }
  ];

  const socialLinks = [
    { icon: Facebook, href: "#facebook", label: "Facebook" },
    { icon: Twitter, href: "#twitter", label: "Twitter" },
    { icon: Linkedin, href: "#linkedin", label: "LinkedIn" },
    { icon: Instagram, href: "#instagram", label: "Instagram" }
  ];

  return (
    <footer className={`bg-slate-900 dark:bg-slate-950 text-slate-400 transition-colors duration-300 ${customClassName}`}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Top Section - Logo/Brand and Contact Info */}
        <div className="grid lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">BYVAULT FINANCE</h3>
              <p className="text-slate-400 text-sm">Empowering your financial success since 1990</p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              {showEmail && (
                <a 
                  href={`mailto:${companyEmail}`}
                  className="flex items-start gap-3 text-slate-400 hover:text-white transition group"
                >
                  <Mail size={18} className="mt-0.5 flex-shrink-0 group-hover:text-blue-400" />
                  <div>
                    <div className="text-xs text-slate-500">Email</div>
                    <div className="text-sm">{companyEmail}</div>
                  </div>
                </a>
              )}
              
              <a 
                href={`tel:${companyPhone.replace(/\D/g, '')}`}
                className="flex items-start gap-3 text-slate-400 hover:text-white transition group"
              >
                <Phone size={18} className="mt-0.5 flex-shrink-0 group-hover:text-blue-400" />
                <div>
                  <div className="text-xs text-slate-500">Phone</div>
                  <div className="text-sm">{companyPhone}</div>
                </div>
              </a>

              <a 
                href="#address"
                className="flex items-start gap-3 text-slate-400 hover:text-white transition group"
              >
                <MapPin size={18} className="mt-0.5 flex-shrink-0 group-hover:text-blue-400" />
                <div>
                  <div className="text-xs text-slate-500">Address</div>
                  <div className="text-sm">{companyAddress}</div>
                </div>
              </a>
            </div>
          </div>

          {/* Links Sections */}
          {footerSections.map((section, idx) => (
            <div key={idx}>
              <h4 className="text-white font-semibold mb-6 text-sm uppercase tracking-wide border-b border-slate-800 pb-3">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIdx) => (
                  <li key={linkIdx}>
                    <a 
                      href={link.href} 
                      className="text-slate-400 hover:text-white transition text-sm group flex items-center gap-2"
                    >
                      <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-blue-400 transition"></span>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 my-12"></div>

        {/* Bottom Section - Social & Legal */}
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Social Links */}
          {showSocialIcons && (
            <div>
              <p className="text-slate-400 text-sm mb-4">Follow us on social media</p>
              <div className="flex gap-4">
                {socialLinks.map((social, idx) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={idx}
                      href={social.href}
                      aria-label={social.label}
                      className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-blue-600 text-slate-400 hover:text-white transition flex items-center justify-center group"
                    >
                      <Icon size={18} />
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {/* Legal Text */}
          <div className="text-right md:text-left">
            <p className="text-xs text-slate-500 mb-3">
              © {currentYear} Byvault Finance. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-500">
              <a href="#terms" className="hover:text-slate-300 transition">
                Terms of Service
              </a>
              <span>•</span>
              <a href="#privacy" className="hover:text-slate-300 transition">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#security" className="hover:text-slate-300 transition">
                Security
              </a>
              <span>•</span>
              <a href="#accessibility" className="hover:text-slate-300 transition">
                Accessibility
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Legal Disclaimer Section */}
      <div className="bg-slate-950 dark:bg-black/50 border-t border-slate-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-3 text-xs text-slate-500 text-center">
            <p>{t("footer.bankappDisclaimer")}</p>
            <p className="text-slate-600">
              {t("footer.legalDisclaimer")}
            </p>
            <p className="text-slate-600 pt-2">
              Member FDIC | Equal Opportunity Lender | Licensed in all 50 states
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;