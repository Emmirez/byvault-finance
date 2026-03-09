import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ArrowLeftRight,
  CreditCard,
  Send,
  Building2,
  Repeat,
  PiggyBank,
  DollarSign,
  LifeBuoy,
  Settings,
  Plus,
  LogOut,
  User,
  X,
  FileText,
} from "lucide-react";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  userName = "User",
  userEmail = "user@email.com",
  activePage = "",
  onLogout,
}) => {
  const isActive = (page) => activePage === page;

  return (
    <>
      {/* Sidebar - Desktop & Mobile - Sticky with independent scroll */}
      <aside
        className={`fixed top-16 h-[calc(100vh-4rem)] left-0 z-40 lg:z-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile Sidebar Header with Close Button */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 h-16 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">B</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              Byvault Finance
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 flex items-center justify-center"
          >
            <X size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        {/* Scrollable Sidebar Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Main Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
              Main
            </p>
            <Link
              to="/dashboard"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("dashboard")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Home size={18} />
              <span className="text-sm font-medium">Dashboard</span>
            </Link>
            <Link
              to="/transactions"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("transactions")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <ArrowLeftRight size={18} />
              <span className="text-sm">Transactions</span>
            </Link>
            <Link
              to="/cards"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive("cards")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <CreditCard size={18} />
              <span className="text-sm">Cards</span>
            </Link>
          </div>

          {/* Transfers Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
              Transfers
            </p>
            <Link
              to="/transfer/local"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("local-transfer")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Send size={18} />
              <span className="text-sm">Local Transfer</span>
            </Link>
            <Link
              to="/transfer/international"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("international-transfer")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Building2 size={18} />
              <span className="text-sm">International</span>
            </Link>
            <Link
              to="/deposit"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("deposit")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Plus size={18} />
              <span className="text-sm">Deposit</span>
            </Link>
            <Link
              to="/currency-swap"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive("currency-swap")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Repeat size={18} />
              <span className="text-sm">Currency Swap</span>
            </Link>
          </div>

          {/* Services Section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
              Services
            </p>
            <Link
              to="/loans"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("loans")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <DollarSign size={18} />
              <span className="text-sm">Loans</span>
            </Link>
            <Link
              to="/tax-refund"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("tax-refund")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <FileText size={18} />
              <span className="text-sm">Tax Refund</span>
            </Link>
            <Link
              to="/grants"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive("grants")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <PiggyBank size={18} />
              <span className="text-sm">Grants</span>
            </Link>
          </div>

          {/* Account Section */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3">
              Account
            </p>
            <Link
              to="/settings"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg mb-1 ${
                isActive("settings")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <Settings size={18} />
              <span className="text-sm">Settings</span>
            </Link>
            <Link
              to="/support"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${
                isActive("support")
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <LifeBuoy size={18} />
              <span className="text-sm">Support</span>
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center gap-3 px-3 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg w-full mt-2"
            >
              <LogOut size={18} />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>

        {/* User Profile at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center relative">
              <User size={20} className="text-white" />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full"></span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {userName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {userEmail}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;