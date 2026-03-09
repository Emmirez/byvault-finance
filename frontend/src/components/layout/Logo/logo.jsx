import React from 'react';

const Logo = ({ 
  size = 'medium', // 'small', 'medium', 'large'
  showText = true,
  className = '',
  onClick
}) => {
  const sizes = {
    small: { container: 'w-8 h-8', text: 'text-lg', icon: 'text-base' },
    medium: { container: 'w-10 h-10', text: 'text-2xl', icon: 'text-xl' },
    large: { container: 'w-12 h-12', text: 'text-3xl', icon: 'text-2xl' },
  };

  const selectedSize = sizes[size] || sizes.medium;

  return (
    <div 
      className={`flex items-center space-x-2 ${className}`}
      onClick={onClick}
      style={onClick ? { cursor: 'pointer' } : {}}
    >
      {/* Logo Icon */}
      <div className={`${selectedSize.container} bg-gradient-to-br from-blue-600 to-blue-600 dark:from-blue-600 dark:to-blue-600 rounded-lg flex items-center justify-center`}>
        <span className={`text-white font-bold ${selectedSize.icon}`}>B</span>
      </div>
      
      {/* Logo Text */}
      {showText && (
        <span className={`font-bold text-gray-900 dark:text-white ${selectedSize.text}`}>
          Byvault Finance
        </span>
      )}
    </div>
  );
};

export default Logo;