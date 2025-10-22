import React from 'react';
import { FaShoppingBag } from 'react-icons/fa';

const Logo = ({ size = 'large', animated = true }) => {
  const sizeClasses = {
    small: {
      container: 'w-16 h-16',
      icon: 'text-2xl',
      text: 'text-sm',
      tagline: 'text-[6px]'
    },
    medium: {
      container: 'w-32 h-32',
      icon: 'text-4xl',
      text: 'text-lg',
      tagline: 'text-[8px]'
    },
    large: {
      container: 'w-64 h-64',
      icon: 'text-7xl',
      text: 'text-2xl',
      tagline: 'text-xs'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`${currentSize.container} relative flex flex-col items-center justify-center bg-white rounded-full shadow-2xl overflow-hidden`}>
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 opacity-40"></div>
      
      {/* Decorative Circles */}
      <div className="absolute top-2 right-2 w-20 h-20 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 blur-2xl"></div>
      <div className="absolute bottom-2 left-2 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 blur-2xl"></div>
      
      {/* Logo Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-2">
        {/* Icon Container with Hexagon Background */}
        <div className="relative">
          {/* Hexagon-like background */}
          <div className="absolute inset-0 transform rotate-45">
            <div className={`${currentSize.icon === 'text-7xl' ? 'w-20 h-20' : currentSize.icon === 'text-4xl' ? 'w-12 h-12' : 'w-8 h-8'} bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl opacity-40`}></div>
          </div>
          
          {/* Shopping Bag Icon */}
          <div className="relative">
            <FaShoppingBag 
              className={`${currentSize.icon} ${animated ? 'animate-bounce-slow' : ''}`}
              style={{
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 50%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3))'
              }}
            />
          </div>
        </div>
        
        {/* Brand Name */}
        <div className="text-center">
          <div 
            className={`${currentSize.text} font-black tracking-tight leading-none`}
            style={{
              background: 'linear-gradient(135deg, #7C3AED 0%, #DB2777 50%, #2563EB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.02em'
            }}
          >
            Shop<span style={{
              background: 'linear-gradient(135deg, #DB2777 0%, #2563EB 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>Ease</span>
          </div>
          
          {/* Decorative Underline */}
          <div className="flex items-center justify-center gap-1 mt-1">
            <div className="h-[2px] w-3 bg-gradient-to-r from-transparent via-purple-500 to-pink-500 rounded-full"></div>
            <div className="w-1 h-1 rounded-full bg-pink-500"></div>
            <div className="h-[2px] w-3 bg-gradient-to-r from-pink-500 via-blue-500 to-transparent rounded-full"></div>
          </div>
          
          {/* Tagline */}
          <div className={`${currentSize.tagline} font-semibold text-purple-600 mt-1 tracking-wide uppercase opacity-70`}>
            Shop Smart, Save More
          </div>
        </div>
      </div>
      
      {/* Shine Effect */}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-20 transition-opacity duration-500 transform -skew-x-12"></div>
      )}
    </div>
  );
};

export default Logo;
