import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

gsap.registerPlugin(ScrollTrigger);

const ITEMS_PER_PAGE = 10;

export default function MissionSearch() {
  const [allMissions, setAllMissions] = useState([]);
  const [visibleMissions, setVisibleMissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const loaderRef = useRef(null);
  const gridRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/launches`);
        const sorted = res.data.sort(
          (a, b) => b.flight_number - a.flight_number
        );
        setAllMissions(sorted);
        setVisibleMissions(sorted.slice(0, ITEMS_PER_PAGE));
      } catch (err) {
        console.error("Failed to load missions", err);
      }
    };
    fetchMissions();
  }, []);

  const loadMore = useCallback(() => {
    const next = page + 1;
    const start = 0;
    const end = next * ITEMS_PER_PAGE;
    setVisibleMissions(allMissions.filter(filterByQuery).slice(start, end));
    setPage(next);
  }, [page, allMissions, searchQuery]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => loaderRef.current && observer.unobserve(loaderRef.current);
  }, [loaderRef, loadMore]);

  const filterByQuery = (mission) =>
    mission.mission_name.toLowerCase().includes(searchQuery.toLowerCase());

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = allMissions
      .filter((m) => m.mission_name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, page * ITEMS_PER_PAGE);
    setVisibleMissions(filtered);
  };

  useEffect(() => {
    const cards = gridRef.current?.querySelectorAll(".mission-card");
    if (!cards) return;

    gsap.utils.toArray(cards).forEach((card) => {
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 50 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [visibleMissions]);

  const missionByYear = allMissions.reduce((acc, mission) => {
    const year = mission.launch_year;
    acc[year] = (acc[year] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(missionByYear),
    datasets: [
      {
        label: "Missions",
        data: Object.values(missionByYear),
        backgroundColor: "#3b82f6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#fff",
        },
      },
      title: {
        display: true,
        text: "Missions Per Year",
        color: "#facc15",
      },
    },
    scales: {
      x: {
        ticks: { color: "#fff" },
      },
      y: {
        ticks: { color: "#fff" },
      },
    },
  };

  const successCount = allMissions.filter(
    (m) => m.launch_success === true
  ).length;
  const failureCount = allMissions.filter(
    (m) => m.launch_success === false
  ).length;

  const pieData = {
    labels: ["Successful Launches", "Failed Launches"],
    datasets: [
      {
        label: "Launch Outcomes",
        data: [successCount, failureCount],
        backgroundColor: ["#22c55e", "#ef4444"],
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: { color: "#fff" },
      },
      title: {
        display: true,
        text: "Launch Success vs Failure",
        color: "#facc15",
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">🚀 SpaceX Missions</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 rounded shadow h-[300px]">
          <Bar
            data={chartData}
            options={{ ...chartOptions, maintainAspectRatio: false }}
          />
        </div>

        <div className="bg-gray-800 p-4 rounded shadow h-[300px]">
          <Pie
            data={pieData}
            options={{ ...pieOptions, maintainAspectRatio: false }}
          />
        </div>
      </div>

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="🔍 Search mission name..."
        className="w-full p-3 rounded-lg border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
      />

      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4"
      >
        {visibleMissions.map((mission) =>
          mission.links.mission_patch ? (
            <div
              key={mission.flight_number}
              className="mission-card bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
            >
              <Link to={`/missions/${mission.flight_number}`}>
                <img
                  src={mission.links.mission_patch}
                  alt={mission.mission_name}
                  className="w-full h-48 object-contain mb-4"
                />
                <h2 className="text-xl font-semibold mb-1">
                  {mission.mission_name}
                </h2>
                <p className="text-sm text-gray-400">
                  🚀 {mission.rocket.rocket_name} | {mission.launch_year}
                </p>
              </Link>
            </div>
          ) : null
        )}
      </div>

      <div ref={loaderRef} className="py-8 text-center text-gray-500">
        Loading more missions...
      </div>
    </div>
  );
}
