import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MissionSearch from "./pages/missions/MissionSearch";
import MissionDetail from "./pages/missions/MissionDetail";
import RocketCompare from "./pages/ai-comparison/RocketCompare";
import SolarSystemExplorer from "./pages/explore/SolarSystemExplorer";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

function App() {
  const { theme } = useTheme();

  return (
    <Router>
      <div
        className={`min-h-screen transition-all duration-300 ${
          theme === "dark"
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-900"
        }`}
      >
        <Navbar />
        <main className="p-6 max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/missions" element={<MissionSearch />} />
            <Route
              path="/missions/:flight_number"
              element={<MissionDetail />}
            />
            <Route path="/compare-rockets" element={<RocketCompare />} />
            <Route path="/explore" element={<SolarSystemExplorer />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
