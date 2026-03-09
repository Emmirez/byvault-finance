/* eslint-disable no-unused-vars */
// src/components/BottomNavigation/BottomNavigation.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BarChart3,
  Send,
  CreditCard,
  User,
} from "lucide-react";

const tabs = [
  { to: "/transactions", label: "Activity", icon: BarChart3 },
  { to: "/transfer", label: "Transfer", icon: Send },
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/cards", label: "Cards", icon: CreditCard },
  { to: "/settings/profile", label: "Profile", icon: User },
];

const BottomNavigation = () => {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="grid grid-cols-5 h-16">

        {tabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex flex-col items-center justify-center gap-1"
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-all ${
                    isActive
                      ? "-mt-6 bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  <Icon size={22} />
                </div>

                <span
                  className={`text-[10px] font-medium ${
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}

      </div>
    </nav>
  );
};

export default BottomNavigation;
