import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function ThumbnailSlider({
  images,
  activeIndex,
  onChange,
  isDark,
}) {
  return (
    <div className="w-full mt-6 relative">
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        spaceBetween={2}
        breakpoints={{
          320: {
            slidesPerView: 3,
          },
          480: {
            slidesPerView: 3,
          },
          768: {
            slidesPerView: 5,
          },
          1024: {
            slidesPerView: 5,
          },
        }}
        onSlideChange={(swiper) => onChange(swiper.activeIndex)}
        className=" w-full px-4"
      >
        {images.map((img, i) => (
          <SwiperSlide
            key={img.identifier || i}
            className="flex justify-center"
          >
            <img
              src={img.imageUrl || img.src || img}
              alt={`Thumbnail ${i + 1}`}
              onClick={() => onChange(i)}
              className={`ml-10 cursor-pointer rounded-full border-2 ${
                i === activeIndex
                  ? "border-blue-500"
                  : isDark
                  ? "border-gray-700"
                  : "border-gray-400"
              }`}
              style={{
                width: 60,
                height: 60,
                objectFit: "cover",
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons, hidden on small screens */}
      <div className="hidden md:flex justify-between absolute top-1/2 left-0 right-0 px-2 pointer-events-none z-10">
        <div className="swiper-button-prev pointer-events-auto   rounded-full p-1 shadow-md" />
        <div className="swiper-button-next pointer-events-auto  rounded-full p-1 shadow-md" />
      </div>
    </div>
  );
}
