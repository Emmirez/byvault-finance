// components/cards/FeatureCard.jsx
import React from "react";
import { ChevronRight } from "lucide-react";

export const FeatureCard = ({
  icon,
  title,
  description,
  ctaText,
  ctaLink = "#",
  gradientFrom,
  gradientTo,
  className = "",
  cardTitle,
  iconSize = "text-5xl",
  showIconBackground = true,
}) => {
  return (
    <div className={`bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 hover:shadow-lg transition ${className}`}>
      {showIconBackground && gradientFrom && gradientTo && (
        <div 
          className={`aspect-video bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-xl mb-6 flex items-center justify-center`}
        >
          <div className="text-white text-center p-4">
            <div className={`${iconSize} mb-2`}>{icon}</div>
            {cardTitle && (
              <h3 className="text-xl font-bold">{cardTitle}</h3>
            )}
          </div>
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 mb-4">
        {description}
      </p>
      {ctaText && (
        <a
          href={ctaLink}
          className="text-blue-600 dark:text-blue-400 font-semibold flex items-center hover:underline"
        >
          {ctaText}
          <ChevronRight size={20} className="ml-1" />
        </a>
      )}
    </div>
  );
};

export default FeatureCard;