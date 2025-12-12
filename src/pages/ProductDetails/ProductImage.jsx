import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import MediaViewerModal from './MediaViewerModal';

const ProductImage = ({ name, media }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const navigationPrevRef = useRef(null);
  const navigationNextRef = useRef(null);

  const openModal = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMedia(null);
  };

  return (
    <>
      <div className="relative rounded-lg overflow-hidden group">
        <Swiper
          spaceBetween={10}
          slidesPerView={1}
          navigation={{
            prevEl: navigationPrevRef.current,
            nextEl: navigationNextRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = navigationPrevRef.current;
            swiper.params.navigation.nextEl = navigationNextRef.current;
          }}
          modules={[Navigation]}
        >
          {media?.map((mediaItem, i) => (
            <SwiperSlide key={i} onClick={() => openModal(mediaItem)} className="cursor-pointer">
              {mediaItem.url.includes('/video/') ? (
                <video
                  src={mediaItem.url}
                  className="w-full h-96 object-contain bg-gray-50 p-4 rounded"
                  muted
                  playsInline
                />
              ) : (
                <img
                  src={mediaItem.url}
                  alt={`${name}-${i}`}
                  className="w-full h-96 object-contain bg-gray-50 p-4 rounded"
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
        {media?.length > 1 && (
          <>
            <div ref={navigationPrevRef} className="absolute top-1/2 left-2 -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 cursor-pointer hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <ChevronLeft className="h-6 w-6 text-gray-800" />
            </div>
            <div ref={navigationNextRef} className="absolute top-1/2 right-2 -translate-y-1/2 z-10 bg-white/50 rounded-full p-2 cursor-pointer hover:bg-white transition-opacity duration-300 opacity-0 group-hover:opacity-100">
              <ChevronRight className="h-6 w-6 text-gray-800" />
            </div>
          </>
        )}
      </div>
      <MediaViewerModal
        media={selectedMedia}
        allMedia={media || []}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default ProductImage;