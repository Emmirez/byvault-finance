//MobileMenu
import React from "react";
import { Link } from "react-router-dom";
import { X, Sun, Moon, User, LayoutDashboard, Shield, LogOut } from "lucide-react";
import LanguageSwitcher from "../ui/GoogleTranslate/GoogleTranslate";

const MobileMenu = ({
  items,
  darkMode,
  toggleDarkMode,
  showLanguageSwitcher = true,
  showDarkModeToggle = true,
  onClose,
  t,
  isAuthenticated = false,
  user = null,
  onLogout
}) => {
  

  const handleLogout = () => {
    onLogout();
    onClose();
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

  return (
    <div className="fixed top-0 left-0 h-full w-62 bg-white dark:bg-gray-900 shadow-lg z-50 transform transition-transform duration-300 flex flex-col">
      {/* Header with Menu title and Close button */}
      <div className="flex justify-between items-center px-3 py-2 border-b border-gray-200 dark:border-gray-700 shrink-0">
        <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-600 bg-clip-text text-transparent">
          {t("navigation.menu")}
        </span>

        <button 
          onClick={onClose} 
          className="p-2 bg-white dark:bg-blue-600 rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
          aria-label={t("navigation.closeMenu")}
        >
          <X size={20} className="dark:text-white" />
        </button>
      </div>

      {/* User Info Section (if authenticated) */}
      {isAuthenticated && user && (
        <div className="px-3 py-3 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                user?.role === "admin"
                  ? "bg-gradient-to-br from-purple-600 to-purple-800"
                  : "bg-gradient-to-br from-blue-600 to-blue-800"
              }`}
            >
              <span className="text-white font-medium text-sm">
                {getUserInitials()}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {getUserDisplayName()}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email || ""}
              </p>
              {user?.role && (
                <span
                  className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                    user.role === "admin"
                      ? "bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400"
                      : "bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {user.role === "admin" ? "Administrator" : "User"}
                </span>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 mt-3">
            <Link
              to={getDashboardLink()}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              onClick={onClose}
            >
              {user?.role === "admin" ? (
                <>
                  <Shield size={12} />
                  Admin
                </>
              ) : (
                <>
                  <LayoutDashboard size={12} />
                  Dashboard
                </>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              onClick={onClose}
            >
              <User size={12} />
              Profile
            </Link>
          </div>
        </div>
      )}

      {/* Dark Mode Toggle Switch */}
      {showDarkModeToggle && (
        <div className="flex items-center justify-between py-2 px-3 mx-2 my-2 rounded-lg bg-gray-50 dark:bg-gray-800 shrink-0">
          <div className="flex items-center space-x-2">
            {darkMode ? (
              <Sun
                size={18}
                className="text-gray-700 dark:text-yellow-400"
              />
            ) : (
              <Moon
                size={18}
                className="text-gray-700 dark:text-gray-300"
              />
            )}
            <span className="text-gray-700 dark:text-gray-300 text-sm font-medium">
              {darkMode ? t("theme.light") : t("theme.dark")}
            </span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
              darkMode ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label={t("theme.toggle")}
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
                darkMode ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      )}

      {/* Scrollable Menu Content */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <div className="space-y-0.5">
          {items.map((item) => {
            if (item.type === 'divider') {
              return <hr key={item.id} className="border-gray-200 dark:border-gray-700 my-2" />;
            }
            
            if (item.type === 'link') {
              return (
                <a
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition text-sm"
                  onClick={onClose}
                >
                  {item.emoji && (
                    <span className={`text-lg ${item.color || ''}`}>
                      {item.emoji}
                    </span>
                  )}
                  <span>{item.label}</span>
                </a>
              );
            }

            if (item.type === 'route') {
              return (
                <Link
                  key={item.id}
                  to={item.to}
                  className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-medium py-2 px-3 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition text-sm"
                  onClick={onClose}
                >
                  {item.emoji && (
                    <span className={`text-lg ${item.color || ''}`}>
                      {item.emoji}
                    </span>
                  )}
                  <span>{item.label}</span>
                </Link>
              );
            }

            return null;
          })}
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
        {/* Authentication Buttons */}
        {isAuthenticated ? (
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition mb-2"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        ) : (
           (
            <>
              <Link
                to="/login"
                className="w-full px-4 py-2 text-sm text-blue-600 dark:text-blue-400 font-semibold hover:bg-blue-50 dark:hover:bg-gray-800 rounded transition mb-2 flex justify-center"
                onClick={onClose}
              >
                {t("auth.signIn")}
              </Link>
              <Link
                to="/register"
                className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition mb-2 flex justify-center border border-gray-200 dark:border-gray-700"
                onClick={onClose}
              >
                Create Account
              </Link>
            </>
          )
        )}

        {/* Language selector */}
        {showLanguageSwitcher && (
          <LanguageSwitcher variant="button" className="w-full mb-7" />
        )}
      </div>
    </div>
  );
};

export default MobileMenu;