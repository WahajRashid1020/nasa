import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

export default function MissionDetail() {
  const { flight_number } = useParams();
  const [mission, setMission] = useState(null);
  const [error, setError] = useState(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/launches`);
        const launch = res.data.find(
          (item) => item.flight_number.toString() === flight_number
        );
        setMission(launch);
      } catch (err) {
        setError("Could not fetch mission details");
      }
    };
    fetchMission();
  }, [flight_number]);

  if (error) return <p className="text-red-500">{error}</p>;
  if (!mission) return <p>Loading...</p>;

  return (
    <div className="space-y-6">
      <Link to="/missions" className="text-blue-400 hover:underline text-sm">
        ← Back to Missions
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Mission Patch Image */}
        <div className="flex justify-center">
          {mission.links?.mission_patch ? (
            <img
              src={mission.links.mission_patch}
              alt="Mission Patch"
              className="max-w-xs w-full h-auto rounded shadow-md"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-700 text-gray-400 rounded">
              No Image
            </div>
          )}
        </div>

        {/* Mission Details */}
        <div className="text-center md:text-left space-y-3">
          <h1 className="text-3xl font-bold text-yellow-400">
            {mission.mission_name}
          </h1>

          <p>
            <span className="font-semibold">Flight Number:</span>{" "}
            {mission.flight_number}
          </p>
          <p>
            <span className="font-semibold">Launch Year:</span>{" "}
            {mission.launch_year}
          </p>
          <p>
            <span className="font-semibold">Rocket Name:</span>{" "}
            {mission.rocket.rocket_name}
          </p>
          <p>
            <span className="font-semibold">Launch Site:</span>{" "}
            {mission.launch_site.site_name_long}
          </p>
          <p>
            <span className="font-semibold">Details:</span>{" "}
            {mission.details || "No description available."}
          </p>
        </div>
      </div>
    </div>
  );
}
