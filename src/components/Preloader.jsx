import React, { useState, useEffect } from 'react';

const ProfessionalPreloader = ({ onLoaded }) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const minimumLoadDuration = 2000;

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoaded) {
        onLoaded();
      }
    }, minimumLoadDuration);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  if (!isLoading) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-500 ease-out">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 border-4 border-t-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          <img
            src="/logo.jpg"
            alt="Store Logo"
            className="w-full h-full p-2 object-contain rounded-full shadow-lg"
          />
        </div>
        <div className="flex items-center space-x-2">
            <p className="text-lg font-semibold text-gray-700">Loading Store</p>
            <div className="flex space-x-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>
        <div className="w-48 mt-4 bg-gray-200 rounded-full h-1">
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPreloader;