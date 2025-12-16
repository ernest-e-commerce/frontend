import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MediaViewerModal = ({ media, isOpen, onClose, allMedia = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (media && allMedia.length > 0) {
      const index = allMedia.findIndex(item => item.url === media.url);
      setCurrentIndex(index !== -1 ? index : 0);
    }
  }, [media, allMedia]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % allMedia.length);
  };

  if (!isOpen || allMedia.length === 0) {
    return null;
  }

  const currentMedia = allMedia[currentIndex];
  const isVideo = currentMedia.url.includes('/video/');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={onClose}>
      <div className="relative max-w-4xl max-h-full w-full h-full p-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-4xl z-20">&times;</button>
        
        {allMedia.length > 1 && (
          <>
            <button
              onClick={goToPrevious}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20 bg-white/50 rounded-full p-3 hover:bg-white transition-all duration-300"
            >
              <ChevronLeft className="h-8 w-8 text-gray-800" />
            </button>
            <button
              onClick={goToNext}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20 bg-white/50 rounded-full p-3 hover:bg-white transition-all duration-300"
            >
              <ChevronRight className="h-8 w-8 text-gray-800" />
            </button>
          </>
        )}

        <div className="w-full h-full flex items-center justify-center">
          {isVideo ? (
            <video src={currentMedia.url} className="max-w-full max-h-full object-contain" controls autoPlay />
          ) : (
            <img src={currentMedia.url} alt="Full screen view" className="max-w-full max-h-full object-contain" />
          )}
        </div>

        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {allMedia.length}
        </div>
      </div>
    </div>
  );
};

export default MediaViewerModal;