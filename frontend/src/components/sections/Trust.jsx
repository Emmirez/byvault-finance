// components/sections/Trust.jsx
import React from "react";
import { Shield, TrendingUp } from "lucide-react";

export const Trust = ({ t, className = "" }) => {
  const badges = [
    {
      icon: Shield,
      text: t("landing.trustBadges.fdicInsured"),
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-100 dark:bg-blue-900",
    },
    {
      icon: Shield,
      text: t("landing.trustBadges.sipcMember"),
      iconColor: "text-green-600 dark:text-green-400",
      iconBg: "bg-green-100 dark:bg-green-900",
    },
    {
      icon: Shield,
      text: t("landing.trustBadges.ssl256Bit"),
      iconColor: "text-red-600 dark:text-red-400",
      iconBg: "bg-red-100 dark:bg-red-900",
    },
    {
      icon: TrendingUp,
      text: t("landing.trustBadges.betterBusinessBureau"),
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-100 dark:bg-purple-900",
    },
    {
      icon: Shield,
      text: t("landing.trustBadges.pciDssCompliant"),
      iconColor: "text-yellow-600 dark:text-yellow-400",
      iconBg: "bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  return (
    <section className={`py-12 bg-white dark:bg-gray-900 border-t border-b border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400 font-semibold">
            {t("landing.trustBadges.title")}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 items-center justify-center">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className={`w-16 h-16 ${badge.iconBg} rounded-full flex items-center justify-center mb-2`}>
                <badge.icon className={badge.iconColor} size={32} />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Trust;