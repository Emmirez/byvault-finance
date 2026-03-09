/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext"; 
import {
  User,
  Shield,
  LogOut,
  ChevronDown,
  HelpCircle,
  BadgeCheck,
  CreditCard
} from "lucide-react";
import { useDarkMode } from "../../../hooks/useDarkMode";

const SuperAdminProfile = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const [darkMode, toggleDarkMode] = useDarkMode();


  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const fullName = user?.firstName
    ? `${user.firstName} ${user.lastName || ""}`.trim()
    : "Super Admin";

  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const email = user?.email || "admin@byvault.com";

  const menuSections = [
    {
      items: [
        { label: "View Profile", icon: User, to: "/admin/profile" },
        { label: "Payment Settings", icon: CreditCard, to: "/admin/payment-settings" },
        { label: "Promote User", icon: BadgeCheck, to: "/admin/users/promote" },
        { label: "Help & Support", icon: HelpCircle, to: "/admin/support" },
      ],
    },
    {
      items: [
        {
          label: "Log Out",
          icon: LogOut,
          danger: true,
          onClick: () => {
            setOpen(false);
            logout?.();
          },
        },
      ],
    },
  ];

  return (
    <div className="relative" ref={ref}>
      {/*  Trigger button  */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
        className={`
          flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
          transition-all duration-150 select-none
          hover:bg-gray-100 dark:hover:bg-gray-700
          ${open ? "bg-gray-100 dark:bg-gray-700" : ""}
        `}
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm ring-2 ring-white dark:ring-gray-800">
            <span className="text-white text-xs font-bold tracking-wide">{initials}</span>
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full" />
        </div>

        {/* Name — hidden on small screens */}
        <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-white max-w-[100px] truncate">
          {fullName}
        </span>

        <ChevronDown
          size={14}
          className={`hidden sm:block text-gray-500 dark:text-white transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/*  Dropdown panel */}
      <div
        className={`
          absolute right-0 top-full mt-2 w-64
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/30
          z-50 overflow-hidden
          transition-all duration-200 origin-top-right
          ${open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
          }
        `}
      >
        {/* User info header */}
        <div className="px-4 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow flex-shrink-0 ring-2 ring-white dark:ring-gray-700">
              <span className="text-white text-sm font-bold">{initials}</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{fullName}</p>
                <BadgeCheck size={14} className="text-blue-500 dark:text-blue-400 flex-shrink-0" />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{email}</p>
              <span className="inline-flex items-center mt-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300 uppercase tracking-wide">
                Super Admin
              </span>
            </div>
          </div>
        </div>

        {/* Menu sections */}
        {menuSections.map((section, si) => (
          <div key={si} className={si < menuSections.length - 1 ? "border-b border-gray-100 dark:border-gray-700" : ""}>
            <ul className="py-1.5">
              {section.items.map(({ label, icon: Icon, to, onClick, danger }) => {
                const cls = `
                  w-full flex items-center gap-3 px-4 py-2.5
                  text-sm font-medium transition-colors duration-100 cursor-pointer
                  ${danger
                    ? "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    : "text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700/60"
                  }
                `;

                const content = (
                  <>
                    <span className={`
                      w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0
                      ${danger
                        ? "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-white"
                      }
                    `}>
                      <Icon size={14} />
                    </span>
                    <span className="text-gray-700 dark:text-white">{label}</span>
                  </>
                );

                return (
                  <li key={label}>
                    {to ? (
                      <Link to={to} className={cls} onClick={() => setOpen(false)}>
                        {content}
                      </Link>
                    ) : (
                      <button className={cls} onClick={onClick}>
                        {content}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperAdminProfile;