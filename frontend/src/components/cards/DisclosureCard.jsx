// components/cards/DisclosureCard.jsx
import React from "react";
import { Shield } from "lucide-react";

export const DisclosureCard = ({ 
  text,
  iconColor = "text-blue-600 dark:text-blue-400",
  bgColor = "bg-blue-100 dark:bg-blue-900",
}) => {
  return (
    <div className="flex items-center space-x-2">
      <div className={`w-8 h-8 ${bgColor} rounded-full flex items-center justify-center`}>
        <Shield className={iconColor} size={16} />
      </div>
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        {text}
      </span>
    </div>
  );
};