import React from "react";
import { Sun, Moon, Bell, User, Menu, ArrowLeft } from "lucide-react";
import NotificationBell from "../../../pages/user/Components/NotificationBell";
import ProfileDropdown from "../../../pages/user/Components/ProfileDropdown";
import { useAuth } from "../../../contexts/AuthContext";

const Header = ({
  darkMode,
  setDarkMode,
  sidebarOpen,
  setSidebarOpen,
  userName = "User",
  userEmail = "user@email.com",
  showBackButton = true,
  onBackClick = null,
  pageTitle = "",
  isMobile = false,
}) => {
  const { user, logout } = useAuth(); // ✅ Add this to get user and logout function

  const handleLogout = async () => {
    // ✅ Add this function
    try {
      await logout();
      // Navigate to login - you might need to pass navigate as prop or use useNavigate
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      {/* Mobile Header */}
      {isMobile && (
        <div className="lg:hidden">
          <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showBackButton && onBackClick && (
                <button
                  onClick={onBackClick}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                  aria-label="Go back"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300 mr-6" />
                </button>
              )}
              {pageTitle && (
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {pageTitle}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun size={20} className="text-gray-600 dark:text-gray-300" />
                ) : (
                  <Moon
                    size={20}
                    className="text-gray-600 dark:text-gray-300"
                  />
                )}
              </button>
              <NotificationBell />

              {/* Profile */}
              <ProfileDropdown
                user={user}
                onLogout={handleLogout}
                kycStatus="pending"
              />
            </div>
          </div>
        </div>
      )}

      {/* Desktop Header */}
      <div className="hidden lg:block px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              <Menu size={24} />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
                Byvault Finance
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <Sun size={20} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Moon size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 relative">
              <Bell size={20} className="text-gray-600 dark:text-gray-300" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {/* Profile - Desktop Only */}
            <div className="hidden sm:flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-900 dark:text-white">
                  {userName}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">
                  {userEmail}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
