/* eslint-disable no-unused-vars */
// src/pages/user/More/MoreMenu.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building2,
  FileText,
  DollarSign,
  Settings,
  LifeBuoy,
  LogOut,
  ChevronRight,
  Shield,
  Bell,
  CreditCard,
  PiggyBank,
} from "lucide-react";
import Header from "../../../components/layout/UserNav/Header";
import Sidebar from "../../../components/layout/UserNav/Sidebar";
import { useAuth } from "../../../contexts/AuthContext";
import BottomNavigation from "../../../components/layout/UserNav/BottomNavigation";
import { useDarkMode } from "../../../hooks/useDarkMode";

const MoreMenu = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [darkMode, toggleDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    const confirmed = window.confirm("Are you sure you want to sign out?");
    if (confirmed) {
      await logout();
      navigate("/login");
    }
  };

  const userEmail = user?.email || "user@email.com";
  const userName = user?.firstName
    ? `${user.firstName} ${user.lastName}`
    : user?.name || "User";

  const menuSections = [
    {
      title: "SERVICES",
      items: [
        {
          id: "loans",
          label: "Apply for Loans",
          icon: Building2,
          color: "blue",
          route: "/loans",
        },
        {
          id: "tax-refund",
          label: "Tax Refund",
          description: "IRS refund services",
          icon: FileText,
          color: "green",
          route: "/tax-refund",
        },
        {
          id: "grants",
          label: "Grants",
          description: "Apply for grants",
          icon: DollarSign,
          color: "purple",
          route: "/grants",
        },
      ],
    },
    {
      title: "ACCOUNT",
      items: [
        {
          id: "bank-details",
          label: "Bank Details",
          description: "View account info",
          icon: Building2,
          color: "blue",
          route: "/bank-details",
        },
        {
          id: "cards",
          label: "My Cards",
          description: "Manage your cards",
          icon: CreditCard,
          color: "purple",
          route: "/cards",
        },
        // {
        //   id: "savings",
        //   label: "Savings",
        //   description: "View savings accounts",
        //   icon: PiggyBank,
        //   color: "green",
        //   route: "/savings",
        // },
        {
          id: "settings",
          label: "Settings",
          description: "Manage your account",
          icon: Settings,
          color: "gray",
          route: "/settings",
        },
        {
          id: "notifications",
          label: "Notifications",
          description: "Manage alerts",
          icon: Bell,
          color: "orange",
          route: "/notifications",
        },
        {
          id: "security",
          label: "Security & Privacy",
          description: "Privacy settings",
          icon: Shield,
          color: "red",
          route: "/security",
        },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        {
          id: "support",
          label: "Support",
          description: "Get assistance",
          icon: LifeBuoy,
          color: "blue",
          route: "/support",
        },
      ],
    },
  ];

  const getIconColor = (color) => {
    const colors = {
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      gray: "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400",
      orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
      red: "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400",
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        darkMode={darkMode}
        setDarkMode={toggleDarkMode}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        userName={userName}
        userEmail={userEmail}
        showBackButton={true}
        onBackClick={() => navigate(-1)}
        pageTitle="Menu"
        isMobile={true}
      />

      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          userEmail={userEmail}
          activePage=""
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-x-hidden lg:ml-64">
          <div className="max-w-2xl mx-auto p-4 lg:p-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 mb-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                  <User size={32} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{userName}</h2>
                  <p className="text-sm text-white/90">{userEmail}</p>
                </div>
              </div>
            </div>

            {menuSections.map((section, sectionIndex) => (
              <div key={section.title} className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-3 px-2">
                  {section.title}
                </h3>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon;
                    const isLast = itemIndex === section.items.length - 1;

                    return (
                      <button
                        key={item.id}
                        onClick={() => navigate(item.route)}
                        className={`w-full p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-4 ${
                          !isLast ? "border-b border-gray-200 dark:border-gray-700" : ""
                        }`}
                      >
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${getIconColor(
                            item.color
                          )}`}
                        >
                          <Icon size={24} />
                        </div>

                        <div className="flex-1 text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.label}
                          </p>
                          {item.description && (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {item.description}
                            </p>
                          )}
                        </div>

                        <ChevronRight
                          size={20}
                          className="text-gray-400 dark:text-gray-500"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full p-4 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">
                  <LogOut size={24} />
                </div>

                <div className="flex-1 text-left">
                  <p className="font-semibold text-red-600 dark:text-red-400">
                    Sign Out
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-400">
                    Logout from account
                  </p>
                </div>

                <ChevronRight
                  size={20}
                  className="text-red-400 dark:text-red-500"
                />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-sm">
              <button className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                <Shield size={14} />
                Secure
              </button>
              <button className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1">
                <LifeBuoy size={14} />
                24/7
              </button>
              <button className="text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1">
                <Shield size={14} />
                Support
              </button>
            </div>

            <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-6 mb-20 lg:mb-8">
              Byvault Finance v1.0.0
            </p>
          </div>
        </main>
      </div>
      
      <div className="lg:hidden">
        <BottomNavigation />
      </div>
    </div>
  );
};

export default MoreMenu;