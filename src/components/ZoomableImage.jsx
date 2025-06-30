import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ZoomableImage({ src, alt }) {
  const [origin, setOrigin] = useState({ x: 0.5, y: 0.5 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setOrigin({ x, y });
  };

  return (
    <div
      className="w-full max-h-[500px] overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ cursor: "zoom-in" }}
    >
      <AnimatePresence mode="wait">
        <motion.img
          key={src}
          src={src}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          whileHover={{ scale: 1.5 }}
          style={{
            originX: origin.x,
            originY: origin.y,
            transformOrigin: `${origin.x * 100}% ${origin.y * 100}%`,
          }}
          className="w-full h-full object-contain"
          draggable={false}
        />
      </AnimatePresence>
    </div>
  );
}
