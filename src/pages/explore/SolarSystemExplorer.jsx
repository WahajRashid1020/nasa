import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import Loader from "../../assets/loader/Loader";

const PLANETS = [
  "mercury",
  "venus",
  "earth",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
];

export default function SolarSystemMediaExplorer() {
  const [planetMedia, setPlanetMedia] = useState({});
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [loading, setLoading] = useState(false);
  const isFirstLoad = useRef(true);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchMedia = async () => {
      if (isFirstLoad.current) setLoading(true);

      const results = {};

      for (const planet of PLANETS) {
        try {
          const [imgRes, vidRes] = await Promise.all([
            axios.get(`${backendUrl}/api/nasa-images`, {
              params: { q: planet, media_type: "image" },
            }),
            axios.get(`${backendUrl}/api/nasa-images`, {
              params: { q: planet, media_type: "video" },
            }),
          ]);

          results[planet] = {
            images: imgRes.data,
            videos: vidRes.data,
          };
        } catch (err) {
          console.warn(`Failed to fetch for ${planet}`, err);
          results[planet] = { images: [], videos: [] };
        }
      }

      setPlanetMedia(results);
      if (isFirstLoad.current) {
        setLoading(false);
        isFirstLoad.current = false;
      }
    };

    fetchMedia();
  }, []);

  const hasNoData = Object.values(planetMedia).every(
    (media) => media.images.length === 0 && media.videos.length === 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b text-white p-6 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold mb-8 text-center tracking-wide">
        Solar System Explorer
      </h1>

      {loading ? (
        <>
          <Loader />
          <p className="text-center text-green-500 font-bold">Loading</p>
        </>
      ) : hasNoData ? (
        <p className="text-center text-red-500 font-bold">
          Failed to load media for all planets.
        </p>
      ) : (
        <div className="flex flex-col gap-6">
          {PLANETS.map((planet) => {
            const { images = [], videos = [] } = planetMedia[planet] || {};
            const previewImage = images[0]?.thumbnail;
            const previewVideo = videos[0]?.thumbnail?.replace(".jpg", ".mp4");

            return (
              <motion.div
                key={planet}
                whileHover={{ scale: 1.03 }}
                className="cursor-pointer rounded-lg overflow-hidden shadow-lg"
                onClick={() => setSelectedPlanet(planet)}
              >
                <h2 className="text-2xl font-semibold capitalize p-4 border-b border-gray-700">
                  {planet}
                </h2>
                {previewVideo ? (
                  <video
                    src={previewVideo}
                    muted
                    loop
                    playsInline
                    autoPlay
                    className="w-full h-56 object-cover"
                  />
                ) : previewImage ? (
                  <img
                    src={previewImage}
                    alt={planet}
                    className="w-full h-56 object-cover"
                  />
                ) : (
                  <div className="h-56 flex items-center justify-center text-gray-500">
                    No media
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {selectedPlanet && planetMedia[selectedPlanet] && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlanet(null)}
          >
            <motion.div
              className="bg-gray-900 rounded-xl max-w-xl max-h-[80vh] overflow-y-auto p-6 relative shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedPlanet(null)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white text-3xl font-bold"
                aria-label="Close"
              >
                &times;
              </button>
              <h2 className="text-3xl font-bold capitalize mb-6 text-center tracking-wide">
                {selectedPlanet}
              </h2>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Images</h3>
                <div className="flex flex-col gap-4">
                  {planetMedia[selectedPlanet].images.map((img) => (
                    <div key={img.nasa_id} className="text-center">
                      <img
                        src={img.thumbnail}
                        alt={img.title}
                        className="rounded max-h-64 object-contain mx-auto shadow-md"
                      />
                      <p className="mt-2 text-sm text-gray-300">{img.title}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Videos</h3>
                <div className="flex flex-col gap-6">
                  {planetMedia[selectedPlanet].videos.map((vid) => {
                    const videoUrl = vid.thumbnail?.replace(".jpg", ".mp4");
                    return (
                      <div key={vid.nasa_id} className="text-center">
                        {videoUrl && (
                          <video
                            src={videoUrl}
                            controls
                            className="rounded max-h-64 w-full object-contain shadow-md"
                          />
                        )}
                        <p className="mt-2 text-sm text-gray-300">
                          {vid.title}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
