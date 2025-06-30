import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkClasses = "hover:text-yellow-400";

  const navLinks = (
    <>
      <Link
        to="/"
        onClick={() => setMenuOpen(false)}
        className={navLinkClasses}
      >
        Home
      </Link>
      <Link
        to="/missions"
        onClick={() => setMenuOpen(false)}
        className={navLinkClasses}
      >
        SpaceX Missions
      </Link>
      <Link
        to="/compare-rockets"
        onClick={() => setMenuOpen(false)}
        className={navLinkClasses}
      >
        Compare with AI
      </Link>
      <Link
        to="/explore"
        onClick={() => setMenuOpen(false)}
        className={navLinkClasses}
      >
        Explore
      </Link>
    </>
  );

  return (
    <>
      <nav
        className={`p-4 flex items-center justify-between ${
          theme === "dark" ? "bg-gray-800" : "bg-gray-300"
        }`}
      >
        <div className="text-lg font-bold">
          <Link to="/">NASA Explorer</Link>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4 items-center">
          {navLinks}
          <button
            onClick={toggleTheme}
            className={`px-3 py-1 rounded font-semibold transition ${
              theme === "dark"
                ? "bg-yellow-400 text-black hover:bg-yellow-300"
                : "bg-gray-800 text-white hover:bg-gray-700"
            }`}
          >
            {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
            className="text-2xl focus:outline-none"
          >
            {menuOpen ? "✖" : "☰"}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={`md:hidden flex flex-col space-y-4 px-6 py-4 ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-gray-300 text-gray-900"
            }`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {navLinks}
            <button
              onClick={() => {
                toggleTheme();
                setMenuOpen(false);
              }}
              className={`px-3 py-2 rounded font-semibold transition ${
                theme === "dark"
                  ? "bg-yellow-400 text-black hover:bg-yellow-300"
                  : "bg-gray-800 text-white hover:bg-gray-700"
              }`}
            >
              {theme === "dark" ? "☀ Light Mode" : "🌙 Dark Mode"}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
