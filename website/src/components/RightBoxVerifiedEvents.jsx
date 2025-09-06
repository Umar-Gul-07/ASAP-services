import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const RightBoxVerifiedEvents = ({ setShowEventPopup }) => {
  const [verifiedEvents, setVerifiedEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/500x300?text=No+Image";
    return img.startsWith("http") ? img : `https://asap-nine-pi.vercel.app/${img}`;
  };

  const fetchVerifiedEvents = async () => {
    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/api/event/admin/verified", {
        headers: {
          email: "admin@gmail.com",
          password: "ADMIN",
        },
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setVerifiedEvents(data.data || []);
    } catch (err) {
      console.error("Error fetching verified events:", err);
    }
  };

  useEffect(() => {
    fetchVerifiedEvents();
  }, []);

  // Auto-change current index every 2 seconds
  useEffect(() => {
    if (verifiedEvents.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % verifiedEvents.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [verifiedEvents]);

  const event = verifiedEvents[currentIndex];

  return (
    <div className="bg-amber-400 rounded-2xl shadow-lg p-3 h-[350px] flex flex-col">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">Upcoming Events</h2>

      <div className="relative h-[360px] md:h-[400px] overflow-hidden">
        <AnimatePresence>
          {event && (
            <motion.div
              key={event._id}
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -300, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              {/* Image */}
              <div className="md:w-1/2 w-full h-56 md:h-auto overflow-hidden">
                <img
                  src={getImageUrl(event.image)}
                  alt={event.description || "Event Image"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Details */}
           <div className="md:w-1/2 w-full p-4 flex flex-col h-full bg-amber-100">
  <div className="flex-1">
    <h3 className="text-base font-bold text-amber-900 mb-1 border-b border-amber-300 pb-1">
      Event Details
    </h3>
    <p className="text-amber-900 text-[11px] leading-tight mb-1 line-clamp-2">
      {event.description || "No description available"}
    </p>

    <div className="flex flex-col gap-1 text-[11px] leading-tight">
      <span className="bg-amber-200 text-amber-900 px-2 py-[2px] rounded-md shadow-sm">
        Venue: {event.venue || "N/A"}
      </span>
      <span className="bg-amber-200 text-amber-900 px-2 py-[2px] rounded-md shadow-sm">
        Start:{" "}
        {event.startDate
          ? new Date(event.startDate).toLocaleDateString()
          : "N/A"}
      </span>
      <span className="bg-amber-200 text-amber-900 px-2 py-[2px] rounded-md shadow-sm">
        End:{" "}
        {event.endDate
          ? new Date(event.endDate).toLocaleDateString()
          : "N/A"}
      </span>
      <span className="bg-amber-200 text-amber-900 px-2 py-[2px] rounded-md shadow-sm">
        Time: {event.time || "N/A"}
      </span>
    </div>
  </div>

  {/* Button bottom center */}
  <Link
    to="/Buyermsg"
    className="bg-amber-500 text-white py-1.5 px-4 rounded-md font-medium hover:bg-amber-600 transition self-center text-xs"
  >
    Contact Us
  </Link>
</div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Buttons */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          className="bg-[#292511] text-white px-6 py-2 rounded-lg hover:bg-[#1f1b0d] transition text-base"
          onClick={() => setShowEventPopup(true)}
        >
          Post Event
        </button>

        <Link
          to="/viewallEvent"
          className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition text-base"
        >
          View All
        </Link>
      </div>
    </div>
  );
};

export default RightBoxVerifiedEvents;
