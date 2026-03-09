import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Search, AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const NotFound = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // You can implement actual search logic here
      // For now, just navigate to home with search query
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-950 dark:to-blue-950 flex items-center justify-center px-4 py-12 overflow-x-hidden">
      <div className="max-w-md w-full mx-auto text-center animate-fadeIn">
        {/* Animated 404 Number */}
        <div className="relative mb-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 blur-xl sm:blur-2xl rounded-full scale-90"></div>
          <div className="relative">
            <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-gray-900 dark:text-white mb-2">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent animate-pulse">
                404
              </span>
            </h1>
            <div className="absolute top-0 right-0 sm:-top-2 sm:-right-2 animate-bounce">
              <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <div className="mb-8 px-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg mb-2">
            The page you're looking for seems to have wandered off.
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            It might have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Search Box - Now clickable and functional */}
        <div className="relative mb-8 max-w-xs mx-auto">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20 sm:opacity-30 animate-pulse scale-95"></div>
          <form onSubmit={handleSearch} className="relative">
            <div className="flex items-center bg-white dark:bg-gray-800 rounded-xl shadow-lg px-4 py-3">
              <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for something else..."
                className="flex-1 bg-transparent border-none outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 text-sm sm:text-base"
                autoFocus
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="ml-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-10 px-2">
          <Link
            to="/"
            className="group flex-1 sm:flex-initial px-5 py-3.5 sm:px-6 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm sm:text-base">Go Home</span>
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="group flex-1 sm:flex-initial px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-xl border border-gray-200 dark:border-gray-700 shadow hover:shadow-md transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm sm:text-base">Refresh Page</span>
          </button>
        </div>

        {/* Quick Links */}
        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 px-2">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Try one of these helpful links:
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg text-xs sm:text-sm font-medium transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              Dashboard
            </Link>
            <Link
              to="/help"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Help Center
            </Link>
            <Link
              to="/contact-support"
              className="px-3 py-2 sm:px-4 sm:py-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg text-xs sm:text-sm font-medium transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="mt-8 sm:mt-10 flex justify-center space-x-4 sm:space-x-8 px-2">
          <div className="w-10 h-1 sm:w-16 sm:h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-30 sm:opacity-50"></div>
          <div className="w-10 h-1 sm:w-16 sm:h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent rounded-full opacity-30 sm:opacity-50"></div>
          <div className="w-10 h-1 sm:w-16 sm:h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full opacity-30 sm:opacity-50"></div>
        </div>

        {/* Copyright */}
        <p className="mt-8 sm:mt-10 text-xs text-gray-400 dark:text-gray-600 px-2">
          © {new Date().getFullYear()} Byvault Finance • Error 404
        </p>
      </div>

      {/* Add CSS animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default NotFound;