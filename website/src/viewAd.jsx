import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function ViewAd() {
  const backendUrl = "https://asap-nine-pi.vercel.app";
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stacked, setStacked] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null); // For modal

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x250?text=No+Image";
    return imagePath.startsWith("http") ? imagePath : `${backendUrl}/${imagePath}`;
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
    const fetchAds = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/post/admin/verified`);
        if (!res.ok) throw new Error("Failed to fetch ads");
        const data = await res.json();
        setAds(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error("Error fetching ads:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAds();
  }, []);

  // Stack & shuffle loop
  useEffect(() => {
    if (!ads.length) return;
    const interval = setInterval(() => {
      setStacked(true);
      setTimeout(() => {
        setAds((prev) => shuffleArray(prev));
        setStacked(false);
      }, 1000);
    }, 3000);
    return () => clearInterval(interval);
  }, [ads]);

  return (
    <div className="min-h-screen pt-28 pb-10 px-6 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 relative overflow-hidden">
      <h1 className="text-5xl md:text-6xl font-extrabold text-center mb-12 text-amber-700 relative z-10">
        <span className="text-yellow-600">All</span> Verified Ads
        <span className="block w-32 h-1 bg-amber-500 mt-3 mx-auto rounded-full shadow-lg"></span>
      </h1>

      {loading ? (
        <p className="text-center text-gray-700 text-lg">Loading ads...</p>
      ) : ads.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">No ads available.</p>
      ) : (
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <AnimatePresence>
            {ads.map((ad, index) => {
              const stackRotation = stacked
                ? (Math.random() - 0.5) * 20
                : 0;
              const stackOffset = stacked ? -index * 15 : 0;
              const zIndex = stacked ? ads.length - index : 0;
              const flutter = stacked ? Math.random() * 5 - 2.5 : 0;

              return (
                <motion.div
                  key={ad._id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{
                    opacity: 1,
                    scale: stacked ? 0.7 : 1,
                    rotate: stackRotation,
                    y: stackOffset,
                    x: flutter,
                    zIndex: zIndex,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col lg:flex-row group transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
                >
                  {/* Left: Image */}
                  <div
                    className="relative h-56 lg:h-auto lg:w-1/2 overflow-hidden"
                    onClick={() => setSelectedAd(ad)}
                  >
                    <img
                      src={getImageUrl(ad.image)}
                      alt={ad.description || "Ad Image"}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Right: Description */}
                  <div className="p-5 lg:w-1/2 flex flex-col justify-between relative overflow-hidden">
                    <h3 className="text-xl font-bold text-amber-700 mb-3">
                      Featured Ad
                    </h3>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                      {ad.description || "No description available"}
                    </p>
                    <Link
                      to="/sellermsg"
                      className="w-full bg-amber-500 text-white py-2 rounded-lg font-medium hover:bg-amber-600 transition text-center"
                    >
                      Contact Us
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal for zoomed ad */}
      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full overflow-hidden animate-scaleIn relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl font-bold"
              onClick={() => setSelectedAd(null)}
            >
              &times;
            </button>
            <img
              src={getImageUrl(selectedAd.image)}
              alt={selectedAd.description}
              className="w-full h-96 object-cover"
            />
            <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100">
              <h3 className="text-2xl font-bold text-amber-700 mb-4">
                Featured Ad
              </h3>
              <p className="text-gray-700 text-sm mb-4">
                {selectedAd.description || "No description available"}
              </p>
              <Link
                to="/sellermsg"
                className="inline-block bg-amber-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-amber-600 transition"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.8); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
