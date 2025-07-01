// Home.jsx
import React, { useRef } from "react";
import { useTheme } from "../context/ThemeContext";
import ApodViewer from "./apod/ApodViewer";
import EpicViewer from "./epic/EpicViewer";
import Spline from "@splinetool/react-spline";
import { motion, useInView } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

function SectionWrapper({ children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className="flex-1"
      style={{ marginBottom: "2rem" }}
    >
      {children}
    </motion.div>
  );
}

export default function Home() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen  transition-all duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      <div className="sm:flex gap-2">
        <SectionWrapper>
          <ApodViewer isDark={isDark} />
        </SectionWrapper>
        <SectionWrapper>
          <Spline scene="https://prod.spline.design/0HHP5UhOoA4EPyNI/scene.splinecode" />
        </SectionWrapper>
      </div>

      <SectionWrapper>
        <EpicViewer isDark={isDark} />
      </SectionWrapper>
    </div>
  );
}
