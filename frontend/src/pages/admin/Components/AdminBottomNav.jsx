/* eslint-disable no-unused-vars */
import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  MessageSquare,
  Settings,
} from "lucide-react";



const DEFAULT_ITEMS = [
  { label: "Dashboard",    icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Users",        icon: Users,            to: "/admin/users" },
  { label: "Transactions", icon: ArrowLeftRight,   to: "/admin/transactions" },
  { label: "Live Chat",    icon: MessageSquare,    to: "/admin/chat" },
  { label: "Settings",     icon: Settings,         to: "/admin/settings" },
];

const AdminBottomNav = ({ items = DEFAULT_ITEMS }) => {
  const { pathname } = useLocation();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 z-50 safe-area-bottom">
      <div
        className="grid h-16"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map(({ label, icon: Icon, to, badge }) => {
          const isActive = pathname === to || pathname.startsWith(to + "/");

          return (
            <Link
              key={to}
              to={to}
              className="relative flex flex-col items-center justify-center gap-0.5 transition-colors"
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive ? (
                /* Active: raised icon pill */
                <>
                  <div className="w-14 h-14 -mt-8 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/40">
                    <Icon size={24} className="text-white" />
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 mt-0.5">
                    {label}
                  </span>
                </>
              ) : (
                /* Inactive: flat icon */
                <>
                  <div className="relative">
                    <Icon
                      size={20}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    {/* Optional badge */}
                    {badge > 0 && (
                      <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5">
                        {badge > 99 ? "99+" : badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                    {label}
                  </span>
                </>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default AdminBottomNav;