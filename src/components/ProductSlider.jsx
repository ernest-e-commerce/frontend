import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules"; 

import "swiper/css";
import "swiper/css/pagination";

const ProductSlider = () => {
  const slides = ["/images/banner.avif", "/images/banner.avif", "/images/banner.avif"];

  return (
    <div className="w-full overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination]} 
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        speed={4500}
        autoplay={{ delay: 10000, disableOnInteraction: false }}
      >
        {slides.map((s, i) => (
          <SwiperSlide key={i}>
            <img
              src={s}
              alt={`slide-${i}`}
              className="w-full h-40 md:h-96 object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ProductSlider;
