import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentmainFrom";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const stripePromise = loadStripe("pk_test_1234567890"); // Replace with your Stripe key
const backendUrl = "https://asap-nine-pi.vercel.app";

export default function ViewAdLeftBox() {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentFor, setPaymentFor] = useState("ad");

  // Fetch Ads
  useEffect(() => {
    fetch(`${backendUrl}/api/post/admin/verified`)
      .then((res) => res.json())
      .then((data) => setAds(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error(err));
  }, []);

  // Auto slider
  useEffect(() => {
    if (ads.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % ads.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [ads]);

  const getImageUrl = (img) =>
    !img ? "https://via.placeholder.com/400x250?text=No+Image" : img.startsWith("http") ? img : `${backendUrl}/${img}`;

  // Payment Success
  const handlePaymentSuccess = () => {
    setShowPaymentPopup(false);
    setShowAdPopup(true);
    setTimeout(() => setSlideIn(true), 10);
  };

  // Submit Ad
  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!description || !image) return alert("Please add image and description");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);
    formData.append("userId", localStorage.getItem("userId") || "demo-user-123");

    try {
      const res = await fetch(`${backendUrl}/api/post/add-post`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Ad posted successfully!");
        setDescription("");
        setImage(null);
        setPreview(null);
        setShowAdPopup(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const ad = ads[currentIndex];

  return (
    <div className="bg-amber-400 rounded-2xl shadow-lg p-3 h-[350px] flex flex-col">
      <h2 className="text-2xl font-bold mb-4 text-white text-center">Advertisement</h2>

      <div className="relative h-[360px] md:h-[400px] overflow-hidden">
        <AnimatePresence>
          {ad && (
            <motion.div
              key={ad._id}
              initial={{ y: 300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -300, opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 flex flex-col md:flex-row bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="md:w-1/2 w-full h-56 md:h-auto overflow-hidden">
                <img
                  src={getImageUrl(ad.image)}
                  alt={ad.description || "Ad Image"}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="md:w-1/2 w-full p-6 flex flex-col justify-between bg-gradient-to-tr from-yellow-50 via-yellow-100 to-yellow-50 hover:shadow-xl hover:-translate-y-1 transition-transform">
                <div>
                  <h3 className="text-xl font-bold text-amber-700 mb-3 border-b border-amber-200 pb-2">
                    Ad Details
                  </h3>
                  <p className="text-gray-700 text-sm mb-3 line-clamp-4">
                    {ad.description || "No description available"}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to="/sellermsg"
                    className="bg-amber-500 text-white py-2 px-6 rounded-lg font-medium hover:bg-amber-600 transition self-start"
                  >
                    Contact Us
                  </Link>

                 
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

<div className="mt-4 flex justify-center gap-4">
  {/* Post Ad Button */}
  <button
    onClick={() => {
      setPaymentFor("ad");
      setShowPaymentPopup(true);
    }}
    className="bg-[#292511] text-white px-6 py-2 rounded-lg font-medium hover:bg-[#1f1b0d] transition"
  >
    Post Ad
  </button>

  {/* View All Button */}
  <Link
    to="/viewallAd"
    className="bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
  >
    View All
  </Link>
</div>



      {/* Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">Post Ad Plan</h2>
            <p className="text-gray-600">Pay <b>$20</b> for 1 Month posting limit</p>

            <Elements stripe={stripePromise}>
              <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
            </Elements>

            <button
              onClick={() => setShowPaymentPopup(false)}
              className="w-full mt-4 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Post Ad Popup */}
      {showAdPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
          onClick={() => {
            setSlideIn(false);
            setTimeout(() => setShowAdPopup(false), 300);
          }}
        >
          <div
            className={`bg-white rounded-l-xl shadow-lg w-full max-w-md p-6 transform transition-transform duration-300 ease-out
              ${slideIn ? "translate-x-0 scale-100" : "translate-x-full scale-90"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={() => {
                setSlideIn(false);
                setTimeout(() => setShowAdPopup(false), 300);
              }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Post Your Ad</h2>
            <form onSubmit={handleAdSubmit} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm border rounded p-2"
              />
              {preview && (
                <img src={preview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
              )}
              <textarea
                placeholder="Write description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-3"
                rows="4"
              />
              <button type="submit" className="w-full bg-[#292511] text-white py-2 rounded-lg hover:bg-[#1f1b0d]">
                Submit Ad
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
