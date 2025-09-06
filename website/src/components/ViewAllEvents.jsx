import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewAllEvents() {
  const backendUrl = "https://asap-nine-pi.vercel.app";
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stacked, setStacked] = useState(false);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/400x250?text=No+Image";
    return img.startsWith("http") ? img : `${backendUrl}/${img}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/event/admin/verified`, {
        headers: { email: "admin@gmail.com", password: "ADMIN" },
      });
      if (!res.ok) throw new Error("Failed to fetch events");
      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  const shuffleArray = (arr) => {
    const newArr = [...arr];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Stack & shuffle loop
  useEffect(() => {
    if (!events.length) return;
    const interval = setInterval(() => {
      // Stack cards
      setStacked(true);

      // After 1s, shuffle and spread
      setTimeout(() => {
        setEvents((prev) => shuffleArray(prev));
        setStacked(false);
      }, 1000);
    }, 3000); // every 3s (1s stacked + 2s normal)
    return () => clearInterval(interval);
  }, [events]);

  return (
    <div className="min-h-screen pt-28 pb-10 px-6 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 relative overflow-hidden">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 text-amber-700 relative z-10">
        <span className="text-yellow-600">All</span> Verified Events
        <span className="block w-32 h-1 bg-amber-500 mt-3 mx-auto rounded-full shadow-lg"></span>
      </h1>

      {loading ? (
        <p className="text-center text-gray-700 text-lg">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">No events available.</p>
      ) : (
        <div
          className={`grid relative z-10 ${
            stacked ? "grid-cols-1 justify-items-center" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          }`}
        >
          <AnimatePresence>
            {events.map((event) => (
              <motion.div
                key={event._id}
                layout
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: 1,
                  scale: stacked ? 0.7 : 1,
                  x: 0,
                  y: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row group transform hover:scale-[1.03] hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative h-56 lg:h-auto lg:w-1/2 overflow-hidden cursor-pointer">
                  <img
                    src={getImageUrl(event.image)}
                    alt={event.description || "Event Image"}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-5 lg:w-1/2 flex flex-col justify-between relative overflow-hidden">
                  <h3 className="text-xl font-bold text-amber-700 mb-3">
                    Event Details
                  </h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                    {event.description || "No description available"}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                      Venue: {event.venue || "N/A"}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                      Date: {formatDate(event.date)}
                    </span>
                    <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded">
                      Time: {event.time || "N/A"}
                    </span>
                  </div>
                  <Link
                    to="/sellermsg"
                    className="w-full bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition text-center"
                  >
                    Contact Us
                  </Link>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
