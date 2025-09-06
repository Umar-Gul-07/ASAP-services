// SellerDetailCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SellerDetailCard = ({ seller }) => {
  const navigate = useNavigate();

  if (!seller) return null;

  const handleContactUs = async () => {
    // Hamesha Mongo _id save karo
    localStorage.setItem('sellerId', seller._id);
    navigate('/buyermsg'); // Navigate to chat page
  };

  const handleViewDetails = async () => {
    // Save _id instead of sellerId
    localStorage.setItem('sellerId', seller._id);
    const sellerId = localStorage.getItem('sellerId');

    try {
      const res = await axios.get(
        `https://asap-nine-pi.vercel.app/getseller/${sellerId}`
      );
      const sellerProfile = res.data?.seller || res.data;
      console.log("Fetched seller profile:", sellerProfile);

      navigate('/seller-cv', { state: { sellerProfile } });
    } catch (err) {
      console.error("Error fetching seller profile:", err);
      alert("Failed to fetch seller profile.");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 hover:shadow-xl transition">
      {/* Image */}
      <div className="w-full h-40 overflow-hidden rounded-md">
        <img
          src={seller.image || "https://via.placeholder.com/150"}
          alt={seller.name || "Service"}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Details */}
      <div className="mt-3">
        <h3 className="text-lg font-bold text-gray-900">
          {seller.name || "Unnamed Service"}
        </h3>
        <p className="text-sm text-gray-600">
          <span className="font-semibold">Experience: </span>
          {seller.experience ? `${seller.experience} years` : "Not provided"}
        </p>
        <p className="text-gray-700 mt-2 line-clamp-3">
          {seller.description || "No description available."}
        </p>
      </div>

      {/* Buttons */}
      <div className="mt-4 flex flex-col gap-2">
        <button
          onClick={handleContactUs}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
        >
          Contact Seller
        </button>

        <button
          onClick={handleViewDetails}
          className="w-full px-4 py-2 border border-gray-400 text-gray-900 font-semibold rounded-md hover:bg-gray-100 transition"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default SellerDetailCard;
