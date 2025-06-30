import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { gsap } from "gsap";
import ZoomableImage from "../../components/ZoomableImage"; // import here

export default function ApodViewer({ isDark }) {
  const [apod, setApod] = useState(null);
  const [apodLoading, setApodLoading] = useState(true);
  const [apodError, setApodError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const apodRef = useRef(null);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchApod = async (date) => {
      try {
        setApodLoading(true);
        setApodError(null);
        const url = date
          ? `${backendUrl}/api/apod?date=${
              selectedDate.toISOString().split("T")[0]
            }`
          : `${backendUrl}/api/apod`;
        const res = await axios.get(url);
        setApod(res.data);

        if (apodRef.current) {
          gsap.fromTo(
            apodRef.current,
            { autoAlpha: 0, y: 20 },
            { autoAlpha: 1, y: 0, duration: 0.6, ease: "power2.out" }
          );
        }
      } catch {
        setApodError("Failed to load Astronomy Picture of the Day.");
        setApod(null);
      } finally {
        setApodLoading(false);
      }
    };

    fetchApod(selectedDate);
  }, [selectedDate]);

  return (
    <section className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-center md:text-left">
          Picture of the Day
        </h1>

        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          maxDate={new Date()}
          placeholderText="Select a date"
          className={`p-2 rounded border ${
            isDark
              ? "bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-yellow-400`}
          calendarClassName={isDark ? "react-datepicker-dark" : ""}
        />
      </div>

      {apodLoading && <p className="text-center">Loading...</p>}
      {apodError && (
        <p className="text-center text-red-500 font-semibold">{apodError}</p>
      )}

      {apod && !apodLoading && !apodError && (
        <div ref={apodRef} className="space-y-4">
          <h2 className="text-xl text-center font-semibold">{apod.title}</h2>
          {apod.media_type === "video" ? (
            <iframe
              title="apod-video"
              src={apod.url}
              frameBorder="0"
              allowFullScreen
              className="w-full h-64 md:h-96 rounded shadow-lg"
            />
          ) : (
            <ZoomableImage src={apod.url} alt={apod.title} />
          )}
          <p className="text-justify">{apod.explanation}</p>
          <p className="italic text-right">Date: {apod.date}</p>
        </div>
      )}
    </section>
  );
}
