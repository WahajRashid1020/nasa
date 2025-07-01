import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { gsap } from "gsap";

export default function RocketCompareList() {
  const [rockets, setRockets] = useState([]);
  const [selected, setSelected] = useState([]);
  const [comparison, setComparison] = useState("");
  const [loading, setLoading] = useState(false);

  const cardsRef = useRef({});
  const comparisonRef = useRef(null);

  const loadingRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchRockets = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/rockets`);
        setRockets(res.data);
      } catch (err) {
        console.error("Failed to load rockets", err);
      }
    };
    fetchRockets();
  }, []);

  useEffect(() => {
    selected.forEach((rocket) => {
      const el = cardsRef.current[rocket.id];
      if (el) {
        gsap.to(el, {
          scale: 1.05,
          borderColor: "#facc15",
          boxShadow: "0 0 15px #facc15",
          duration: 0.3,
          ease: "power1.out",
        });
      }
    });

    rockets.forEach((rocket) => {
      if (!selected.includes(rocket)) {
        const el = cardsRef.current[rocket.id];
        if (el) {
          gsap.to(el, {
            scale: 1,
            borderColor: "#374151",
            boxShadow: "none",
            duration: 0.3,
            ease: "power1.out",
          });
        }
      }
    });
  }, [selected, rockets]);

  useEffect(() => {
    if (comparison && comparisonRef.current) {
      gsap.fromTo(
        comparisonRef.current,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }
      );
    }
  }, [comparison]);

  useEffect(() => {
    if (loading && loadingRef.current) {
      gsap.to(loadingRef.current, {
        opacity: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        duration: 0.8,
      });
    } else if (loadingRef.current) {
      gsap.to(loadingRef.current, {
        opacity: 1,
        repeat: 0,
        yoyo: false,
        duration: 0.2,
      });
    }
  }, [loading]);

  const handleSelect = (rocket) => {
    if (selected.includes(rocket)) {
      setSelected(selected.filter((r) => r !== rocket));
    } else if (selected.length < 2) {
      setSelected([...selected, rocket]);
    }
  };

  const compare = async () => {
    if (selected.length !== 2) return;
    setLoading(true);
    setComparison("");

    try {
      const res = await axios.post(`${backendUrl}/api/compare-rockets`, {
        rocket1: selected[0].name,
        rocket2: selected[1].name,
      });
      setComparison(res.data.comparison);
    } catch (err) {
      setComparison("Error: Could not generate comparison.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center">
        {" "}
        Compare Rockets with OpenAI
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {rockets.map((rocket) => (
          <div
            key={rocket.id}
            ref={(el) => (cardsRef.current[rocket.id] = el)}
            className={`p-4 border rounded shadow transition cursor-pointer ${
              selected.includes(rocket)
                ? "border-yellow-400"
                : "border-gray-700"
            }`}
            onClick={() => handleSelect(rocket)}
          >
            <img
              src={rocket.flickr_images[0]}
              alt={rocket.name}
              className="h-40 w-full object-cover mb-3 rounded"
            />
            <h2 className="text-xl font-semibold">{rocket.name}</h2>
            <p className="text-sm text-gray-400">
              {rocket.description.slice(0, 100)}...
            </p>
            <p className="text-xs mt-2 text-gray-500">
              First Flight: {rocket.first_flight}
            </p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          disabled={selected.length !== 2 || loading}
          onClick={compare}
          className="bg-yellow-400 px-6 py-2 rounded text-black font-semibold disabled:opacity-50"
          onMouseEnter={(e) =>
            gsap.to(e.currentTarget, { scale: 1.05, duration: 0.2 })
          }
          onMouseLeave={(e) =>
            gsap.to(e.currentTarget, { scale: 1, duration: 0.2 })
          }
        >
          Compare Selected Rockets
        </button>
      </div>

      {loading && (
        <p ref={loadingRef} className="text-center text-gray-400">
          Generating comparison...
        </p>
      )}

      {comparison && (
        <div
          ref={comparisonRef}
          className="bg-gray-800 p-4 rounded shadow text-white whitespace-pre-line mt-4"
        >
          {comparison}
        </div>
      )}
    </div>
  );
}
