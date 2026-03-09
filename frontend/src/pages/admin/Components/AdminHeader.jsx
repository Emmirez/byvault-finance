// src/components/admin/AdminHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Sun, Moon } from 'lucide-react';
import { useDarkMode } from '../../../hooks/useDarkMode';
import SuperAdminProfile from './SuperAdmin';
import AdminAlertBell from '../Notification/AdminAlertBell';

const AdminHeader = ({ 
  title, 
  showBackButton = true, 
  onBack,
  rightActions = [],
  showNotifications = true,
  showDarkMode = true,
  showProfile = true,
  className = ""
}) => {
  const navigate = useNavigate();
  const [darkMode, toggleDarkMode] = useDarkMode();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 ${className}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          {/* Left: Back button */}
          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex-shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft
                size={20}
                className="text-gray-700 dark:text-white" // Changed from dark:text-gray-300 to dark:text-white
              />
            </button>
          )}

          {/* Center: Title */}
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate flex-1 text-center">
            {title}
          </h1>

          {/* Right: Actions */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Custom right actions */}
            {rightActions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label={action.label}
              >
                {React.cloneElement(action.icon, {
                  className: "text-gray-700 dark:text-white" // Force white in dark mode
                })}
              </button>
            ))}

            {/* Dark mode toggle */}
            {showDarkMode && (
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <Sun size={20} className="text-white" /> // Force white when dark mode is on
                ) : (
                  <Moon size={20} className="text-gray-700 dark:text-white" />
                )}
              </button>
            )}

            {/* Notifications */}
            {showNotifications && (
               <AdminAlertBell />
            )}

            {/* Profile */}
            {showProfile && <SuperAdminProfile />}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;