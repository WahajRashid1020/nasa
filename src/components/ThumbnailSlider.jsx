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
    <Swiper
      modules={[Navigation]}
      navigation
      spaceBetween={10}
      slidesPerView={5}
      onSlideChange={(swiper) => onChange(swiper.activeIndex)}
      className="max-w-sm mt-6"
    >
      {images.map((img, i) => (
        <SwiperSlide key={img.identifier || i}>
          <img
            src={img.imageUrl || img.src || img}
            alt={`Thumbnail ${i + 1}`}
            onClick={() => onChange(i)}
            className={`cursor-pointer rounded-full border-2 ${
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
  );
}
