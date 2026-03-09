// components/header/header.jsx - FIXED VERSION
import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Moon,
  Sun,
  Home,
  User,
  ChevronDown,
  LogOut,
  LayoutDashboard,
  Shield,
} from "lucide-react";
import Logo from "../layout/Logo/logo.jsx";
import LanguageSwitcher from "../ui/GoogleTranslate/GoogleTranslate.jsx";
import { useLanguageContext } from "../../contexts/LanguageContext";
import { useDarkMode } from "../../hooks/useDarkMode.js";
import MobileMenu from "./MobileMenu.jsx";
import { useAuth } from "../../contexts/AuthContext";

const Header = ({
  showDarkModeToggle = true,
  showLanguageSwitcher = true,
  customClassName = "",
  onMenuToggle,
  menuItems = [],
  user: propUser,
  isAuthenticated: propIsAuthenticated,
  forceLoggedOut = false,
}) => {
  const { t } = useLanguageContext();
  const {
    user: authUser,
    logout,
    isAuthenticated: authIsAuthenticated,
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [darkMode, toggleDarkMode] = useDarkMode();
  const dropdownRef = useRef(null);

  const user = forceLoggedOut ? null : propUser || authUser;
  const isAuthenticated = forceLoggedOut
    ? false
    : propIsAuthenticated !== undefined
      ? propIsAuthenticated
      : authIsAuthenticated;

  const handleMenuToggle = () => {
    const newState = !mobileMenuOpen;
    setMobileMenuOpen(newState);
    if (onMenuToggle) onMenuToggle(newState);
  };

  const handleCloseMenu = () => {
    setMobileMenuOpen(false);
    if (onMenuToggle) onMenuToggle(false);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    };

    if (profileDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileDropdownOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    setProfileDropdownOpen(false);
    navigate("/");
  };

  const getDashboardLink = () => {
    if (user?.role === "admin") {
      return "/admin/dashboard";
    }
    return "/dashboard";
  };

  const getUserInitials = () => {
    if (!user) return "U";
    if (user.firstName && user.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    if (user.firstName) return user.firstName.charAt(0);
    if (user.username) return user.username.charAt(0);
    return "U";
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user.firstName) return user.firstName;
    if (user.username) return user.username;
    return "User";
  };

  // Default menu items structure
  const defaultMenuItems = [
    {
      id: "home",
      label: "Home",
      href: "/",
      type: "link",
      icon: Home,
      emoji: "🏠",
      color: "text-blue-600",
    },
    { id: "divider1", type: "divider" },
    {
      id: "checking",
      label: t("navigation.checking"),
      href: "/checking",
      type: "link",
      emoji: "👛",
      color: "text-blue-600",
    },
    {
      id: "savings",
      label: t("navigation.savings"),
      href: "/savings",
      type: "link",
      emoji: "🐷",
      color: "text-green-600",
    },
    {
      id: "creditCards",
      label: t("navigation.creditCards"),
      href: "/credit-cards",
      type: "link",
      emoji: "💳",
      color: "text-purple-600",
    },
    {
      id: "loans",
      label: t("navigation.loans"),
      href: "/loans",
      type: "link",
      emoji: "💵",
      color: "text-green-600",
    },
    { id: "divider2", type: "divider" },
    {
      id: "business",
      label: t("navigation.business"),
      href: "/business",
      type: "link",
      emoji: "💼",
      color: "text-blue-600",
    },
    {
      id: "education",
      label: t("navigation.education"),
      href: "/education",
      type: "link",
      emoji: "🎓",
      color: "text-orange-600",
    },
    {
      id: "wealthManagement",
      label: t("navigation.wealthManagement"),
      href: "/wealth-management",
      type: "link",
      emoji: "📈",
      color: "text-green-600",
    },
    { id: "divider3", type: "divider" },
    {
      id: "privacySecurity",
      label: t("navigation.privacySecurity"),
      href: "/privacy-security",
      type: "link",
      emoji: "🛡️",
      color: "text-red-600",
    },
    {
      id: "contact",
      label: t("navigation.contact"),
      href: "/contact-support",
      type: "link",
      emoji: "📞",
      color: "text-orange-600",
    },
    {
      id: "aboutUs",
      label: t("navigation.aboutUs"),
      href: "/about",
      type: "link",
      emoji: "ℹ️",
      color: "text-teal-600",
    },
    {
      id: "help",
      label: t("navigation.help"),
      href: "/help",
      type: "link",
      emoji: "❓",
      color: "text-blue-600",
    },
    // Add authenticated-only items for mobile menu
    ...(isAuthenticated
      ? [
          { id: "divider_auth", type: "divider" },
          {
            id: "dashboard",
            label: user?.role === "admin" ? "Admin Dashboard" : "Dashboard",
            href: getDashboardLink(),
            type: "link",
            icon: LayoutDashboard,
            emoji: user?.role === "admin" ? "🛡️" : "📊",
            color: user?.role === "admin" ? "text-purple-600" : "text-blue-600",
          },
        ]
      : []),
  ];

  const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <>
      <nav
        className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${customClassName}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side: Hamburger */}
            <div className="flex items-center">
              <button
                onClick={handleMenuToggle}
                className="p-2 mr-7 bg-white dark:bg-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 lg:hidden"
                aria-label={
                  mobileMenuOpen
                    ? t("navigation.closeMenu")
                    : t("navigation.openMenu")
                }
              >
                {mobileMenuOpen ? (
                  <X size={24} className="dark:text-white" />
                ) : (
                  <Menu size={22} className="dark:text-white" />
                )}
              </button>
              <Logo size="medium" showText={true} />
            </div>

            {/* Desktop Menu Items - Only visible on large screens */}
            <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
              <Link
                to="/"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                Home
              </Link>
              <Link
                to="/business"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {t("navigation.business")}
              </Link>
              <Link
                to="/savings"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {t("navigation.savings")}
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {t("navigation.contact")}
              </Link>
              <Link
                to="/credit-cards"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {t("navigation.creditCards")}
              </Link>
              <Link
                to="/loans"
                className="text-gray-700 dark:text-gray-300 font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm"
              >
                {t("navigation.loans")}
              </Link>
            </nav>

            {/* Right side: Language Switcher, Dark Mode Toggle, and Profile Dropdown */}
            <div className="flex items-center space-x-4">
              {/* Desktop Language Switcher */}
              {showLanguageSwitcher && (
                <div className="hidden md:block">
                  <LanguageSwitcher dropDown={true}/>
                </div>
              )}

              {/* Desktop Dark Mode Toggle */}
              {showDarkModeToggle && (
                <button
                  onClick={toggleDarkMode}
                  className="hidden md:flex items-center justify-center p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  aria-label={
                    darkMode
                      ? t("theme.switchToLight")
                      : t("theme.switchToDark")
                  }
                >
                  {darkMode ? (
                    <Sun
                      size={20}
                      className="text-gray-700 dark:text-yellow-400"
                    />
                  ) : (
                    <Moon
                      size={20}
                      className="text-gray-700 dark:text-gray-300"
                    />
                  )}
                </button>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center gap-2 p-2 rounded-lg transition-colors"
                  aria-label="Profile menu"
                >
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isAuthenticated
                        ? user?.role === "admin"
                          ? "bg-gradient-to-br from-blue-600 to-blue-800"
                          : "bg-gradient-to-br from-blue-600 to-blue-800"
                        : "bg-gradient-to-br from-blue-600 to-blue-600"
                    }`}
                  >
                    {isAuthenticated ? (
                      <span className="text-white font-medium text-sm">
                        {getUserInitials()}
                      </span>
                    ) : (
                      <User size={18} className="text-white" />
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-gray-600 dark:text-gray-400 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || "No email"}
                          </p>
                          {user?.role && (
                            <span
                              className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                                user.role === "admin"
                                  ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                                  : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                              }`}
                            >
                              {user.role === "admin" ? "Administrator" : "User"}
                            </span>
                          )}
                        </div>

                        {/* Dashboard Link */}
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          {user?.role === "admin" ? (
                            <>
                              <Shield size={16} />
                              Admin Dashboard
                            </>
                          ) : (
                            <>
                              <LayoutDashboard size={16} />
                              Dashboard
                            </>
                          )}
                        </Link>

                        {/* Profile Link */}
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={16} />
                          My Profile
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

                        {/* Logout Button */}
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        {/* Login/Signup for non-authenticated users */}
                        <Link
                          to="/login"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={16} />
                          {t("auth.signIn")}
                        </Link>
                        <Link
                          to="/register"
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <User size={16} />
                          Create Account
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        {mobileMenuOpen && (
          <MobileMenu
            items={items}
            darkMode={darkMode}
            toggleDarkMode={toggleDarkMode}
            showLanguageSwitcher={showLanguageSwitcher}
            showDarkModeToggle={showDarkModeToggle}
            onClose={handleCloseMenu}
            t={t}
            isAuthenticated={false}
            user={null}
            onLogout={handleLogout}
          />
        )}
      </nav>
      {/* fixed header spacer */}
      <div className="pt-16"></div>
    </>
  );
};

export default Header;
