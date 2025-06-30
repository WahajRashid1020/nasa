import React, { useEffect, useState } from "react";
import axios from "axios";
import ZoomableImage from "../../components/ZoomableImage";
import ThumbnailSlider from "../../components/ThumbnailSlider";

export default function EpicViewer({ isDark }) {
  const [epicImages, setEpicImages] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [epicLoading, setEpicLoading] = useState(true);
  const [epicError, setEpicError] = useState(null);

  const currentImage = epicImages[currentIdx];
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setEpicLoading(true);
        setEpicError(null);
        const res = await axios.get(`${backendUrl}/api/epic`);
        setEpicImages(res.data);
      } catch {
        setEpicError("Failed to load EPIC Earth images.");
      } finally {
        setEpicLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <section className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-center">
        🌍 NASA EPIC Earth Viewer
      </h1>

      {epicLoading && (
        <p className="text-center">Loading EPIC Earth images...</p>
      )}
      {epicError && (
        <p className="text-center text-red-500 font-semibold">{epicError}</p>
      )}

      {!epicLoading && epicImages.length > 0 && (
        <div
          className={`flex flex-col md:flex-row gap-6 pb-6 rounded-xl p-4 shadow-xl ${
            isDark ? "bg-black" : "bg-gray-50"
          }`}
        >
          <div className="flex flex-col items-center w-full md:w-2/3">
            {currentImage && (
              <ZoomableImage
                src={currentImage.imageUrl}
                alt={currentImage.caption || "EPIC Earth image"}
              />
            )}

            <ThumbnailSlider
              images={epicImages}
              activeIndex={currentIdx}
              onChange={setCurrentIdx}
              isDark={isDark}
            />
          </div>

          <div
            className={`rounded p-4 text-sm w-full md:w-1/2 shadow-md backdrop-blur-md ${
              isDark
                ? "bg-gray-300/10 text-white"
                : "bg-gray-50 text-gray-900 border border-gray-200"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">📊 Image Info</h2>
            {currentImage ? (
              <ul className="space-y-2 list-disc list-inside">
                <li>
                  <strong>ID:</strong> {currentImage.identifier}
                </li>
                <li>
                  <strong>Version:</strong> {currentImage.version}
                </li>
                <li>
                  <strong>Sun J2000 Position:</strong> X:{" "}
                  {currentImage.sun_j2000_position?.x.toFixed(0)}, Y:{" "}
                  {currentImage.sun_j2000_position?.y.toFixed(0)}, Z:{" "}
                  {currentImage.sun_j2000_position?.z.toFixed(0)}
                </li>
                <li>
                  <strong>DSCOVR J2000 Position:</strong> X:{" "}
                  {currentImage.dscovr_j2000_position?.x.toFixed(0)}, Y:{" "}
                  {currentImage.dscovr_j2000_position?.y.toFixed(0)}, Z:{" "}
                  {currentImage.dscovr_j2000_position?.z.toFixed(0)}
                </li>
                <li>
                  <strong>Attitude Quaternions:</strong> q0:{" "}
                  {currentImage.attitude_quaternions?.q0.toFixed(3)}, q1:{" "}
                  {currentImage.attitude_quaternions?.q1.toFixed(3)}, q2:{" "}
                  {currentImage.attitude_quaternions?.q2.toFixed(3)}, q3:{" "}
                  {currentImage.attitude_quaternions?.q3.toFixed(3)}
                </li>
                <li>
                  <strong>Centroid Coordinates:</strong> Lat:{" "}
                  {currentImage.centroid_coordinates?.lat.toFixed(3)}, Lon:{" "}
                  {currentImage.centroid_coordinates?.lon.toFixed(3)}
                </li>
                <li>
                  <strong>Date:</strong>{" "}
                  {new Date(currentImage.date).toLocaleString()}
                </li>
                <li>
                  <strong>Caption:</strong> {currentImage.caption}
                </li>
              </ul>
            ) : (
              <p>No image data available</p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
