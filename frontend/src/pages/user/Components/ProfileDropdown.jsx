// src/components/ProfileDropdown.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { User, ChevronDown, Shield, HelpCircle, LogOut } from "lucide-react";
import { kycService } from "../../../services/kycService";

const ProfileDropdown = ({
  user,
  onLogout,
  className = "",
  showUserInfo = true,
  menuItems = [], // Custom menu items
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [kycStatus, setKycStatus] = useState("unverified");
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Fetch KYC status
  useEffect(() => {
    const fetchKYCStatus = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await kycService.getKYCStatus();
        if (response.success) {
          setKycStatus(response.status);
        }
      } catch (error) {
        console.error("Error fetching KYC status:", error);
        // Don't change status on error, keep as "unverified"
      } finally {
        setLoading(false);
      }
    };

    fetchKYCStatus();
  }, [user]); // Re-fetch if user changes

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigation = (path) => {
    setIsOpen(false);
    navigate(path);
  };

  const getKycBadge = () => {
    if (loading) {
      return (
        <span className="ml-auto text-[10px] bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 px-1.5 py-0.5 rounded-full animate-pulse">
          Loading...
        </span>
      );
    }

    switch (kycStatus) {
      case "verified":
        return (
          <span className="ml-auto text-[10px] bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 py-0.5 rounded-full">
            Verified
          </span>
        );
      case "pending":
      case "under_review":
        return (
          <span className="ml-auto text-[10px] bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 py-0.5 rounded-full">
            Pending
          </span>
        );
      case "rejected":
        return (
          <span className="ml-auto text-[10px] bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-1.5 py-0.5 rounded-full">
            Rejected
          </span>
        );
      default:
        return (
          <span className="ml-auto text-[10px] bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
            Unverified
          </span>
        );
    }
  };

  // Handle KYC click - redirect based on status
  const handleKYCClick = () => {
    setIsOpen(false);

    if (kycStatus === "verified") {
      navigate("/kyc/status");
    } else if (kycStatus === "pending" || kycStatus === "under_review") {
      navigate("/kyc/status");
    } else if (kycStatus === "rejected") {
      navigate("/kyc/submit");
    } else {
      navigate("/kyc/submit");
    }
  };

  // Default menu items - only Profile, KYC, and Help & Support
  const defaultMenuItems = [
    {
      icon: User,
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      label: "My Profile",
      description: "View and edit your details",
      path: "/settings/profile",
      onClick: () => handleNavigation("/settings/profile"),
    },
    {
      icon: Shield,
      bgColor: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      label: "KYC Verification",
      description: "Verify your identity",
      onClick: handleKYCClick,
      badge: getKycBadge(),
    },
    {
      icon: HelpCircle,
      bgColor: "bg-cyan-100 dark:bg-cyan-900/30",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      label: "Help & Support",
      description: "Get assistance",
      path: "/support",
      onClick: () => handleNavigation("/support"),
    },
  ];

  const itemsToRender = menuItems.length > 0 ? menuItems : defaultMenuItems;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Dropdown Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity profile-trigger"
      >
        {/* Smaller profile icon */}
        <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center shadow-sm">
          <User size={14} className="text-white" />
        </div>
        {showUserInfo && (
          <>
            <div className="hidden sm:block text-left">
              <p className="text-[11px] font-medium text-gray-900 dark:text-white leading-tight">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[9px] text-gray-500 dark:text-gray-400 leading-tight">
                {user?.email}
              </p>
            </div>
            <ChevronDown
              size={14}
              className={`text-gray-500 dark:text-gray-400 transition-transform duration-200 hidden sm:block ${isOpen ? "rotate-180" : ""}`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu - Smaller width */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1 z-50 animate-fadeIn">
          {/* User Info Header - Smaller padding */}
          {showUserInfo && (
            <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
              <p className="text-xs font-semibold text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                {user?.email}
              </p>
              <p className="text-[9px] text-gray-400 dark:text-gray-500 mt-0.5">
                ID: {user?.accountId?.slice(-10) || "N/A"}
              </p>
            </div>
          )}

          {/* Menu Items - Smaller padding and text */}
          <div className="py-1">
            {itemsToRender.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={item.onClick}
                  className="w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors flex items-center gap-2 group"
                >
                  <div
                    className={`w-7 h-7 ${item.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0`}
                  >
                    <Icon size={14} className={item.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-[9px] text-gray-500 dark:text-gray-400 truncate">
                      {item.description}
                    </p>
                  </div>
                  {item.badge && item.badge}
                </button>
              );
            })}

            {/* Divider - Thinner */}
            <div className="my-1 border-t border-gray-200 dark:border-gray-700"></div>

            {/* Logout - Smaller */}
            <button
              onClick={onLogout}
              className="w-full px-3 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-2 group"
            >
              <div className="w-7 h-7 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
                <LogOut size={14} className="text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">
                  Logout
                </p>
                <p className="text-[9px] text-gray-500 dark:text-gray-400">
                  Sign out of your account
                </p>
              </div>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProfileDropdown;
