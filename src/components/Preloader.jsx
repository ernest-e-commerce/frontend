import React, { useState, useEffect } from 'react';

// NOTE: This component assumes you have a keyframes setup in your CSS/Tailwind config
// for 'spin-slow' (optional, or remove if not defined) and 'pulse'.
// If using Tailwind, you might need to configure custom keyframes or use the default 'animate-spin'.

const ProfessionalPreloader = ({ onLoaded }) => {
  // Use a boolean state to track the loading status instead of a progress bar
  // to avoid faking the percentage (which often feels misleading).
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Simulate a minimum load time (e.g., 2 seconds) for a smooth transition.
    const minimumLoadDuration = 2000;

    // 2. In a real app, you would fetch data or check resources here.
    // Replace this setTimeout with your actual async data fetching logic.
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (onLoaded) {
        onLoaded(); // Call a function to hide the preloader in the parent component
      }
    }, minimumLoadDuration);

    return () => clearTimeout(timer);
  }, [onLoaded]);

  if (!isLoading) {
    return null; // Don't render anything once loading is complete
  }

  return (
    // Clean background, high z-index, fixed position
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 backdrop-blur-sm transition-opacity duration-500 ease-out">
      
      {/* 1. Primary Container for the Core Element */}
      <div className="flex flex-col items-center justify-center space-y-4">
        
        {/* 2. Logo - Minimalist Focus */}
        <div className="relative w-20 h-20">
          {/* Subtle Outer Ring (The Spinner) */}
          <div className="absolute inset-0 border-4 border-t-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
          
          {/* Logo Image */}
          <img
            src="/logo.jpg"
            alt="Store Logo"
            // Adjust size to fit inside the spinner, add a subtle shadow
            className="w-full h-full p-2 object-contain rounded-full shadow-lg"
          />
        </div>

        {/* 3. Loading Text */}
        <div className="flex items-center space-x-2">
            <p className="text-lg font-semibold text-gray-700">Loading Store</p>
            {/* Simple dot animation for flair */}
            <div className="flex space-x-1">
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></span>
                <span className="w-1 h-1 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                <span className="w-1 h-1 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
            </div>
        </div>

        {/* Optional: Simple Bottom Bar */}
        <div className="w-48 mt-4 bg-gray-200 rounded-full h-1">
            {/* Indeterminate Shimmer effect is better than faked percentage */}
            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full animate-shimmer"></div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalPreloader;