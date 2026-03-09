// src/components/ui/CTAButton.jsx
import React from "react";
import { Link } from "react-router-dom";

export const CTAButton = ({
  children,
  onClick,
  href,
  to,
  variant = "primary",
  size = "lg", 
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-semibold rounded-lg transition-all duration-300 flex items-center justify-center";

  const variants = {
    primary:
      "bg-blue-500 dark:bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-600 shadow-md hover:shadow-lg active:scale-95",
    secondary:
      "bg-transparent border-2 border-blue-600 dark:border-blue-500 text-blue-600 dark:text-blue-500 hover:bg-blue-500 dark:hover:bg-blue-500 hover:text-white dark:hover:text-white shadow-md hover:shadow-lg active:scale-95",
  };

  const sizes = {
    sm: "px-6 py-3 text-sm",
    md: "px-6 py-4 text-base",
    lg: "px-10 py-6 text-lg", 
  };

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={buttonClasses} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={buttonClasses} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default CTAButton;