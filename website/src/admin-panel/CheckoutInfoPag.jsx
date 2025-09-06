import React, { useState, useEffect } from "react";

const CheckoutInfoPage = ({ sellerId }) => {
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeller = async () => {
      try {
        const res = await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetailsprofile/${sellerId}`);
        const data = await res.json();
        setSeller(data);
      } catch (err) {
        console.error("Error fetching seller:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [sellerId]);

  if (loading) return <p className="text-center mt-10">Loading seller information...</p>;
  if (!seller) return <p className="text-center mt-10 text-red-500">Seller not found</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Card Container */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        
        {/* Top Section: Profile Picture */}
        <div className="bg-gradient-to-r from-blue-100 to-white p-6 flex flex-col items-center">
          <img
            src={seller.personal?.profileImage?.url || "https://via.placeholder.com/150"}
            alt="Profile"
            className="w-36 h-36 rounded-full border-4 border-blue-300 shadow-md object-cover"
          />
          <h1 className="text-3xl font-bold mt-4 text-gray-800">{seller.personal?.name || "-"}</h1>
          <p className="text-gray-600 mt-1">{seller.personal?.email || "-"}</p>
          <p className="text-gray-600">{seller.personal?.address || "-"}</p>
        </div>

        {/* Personal Info */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
            <div><strong>Phone:</strong> {seller.personal?.phoneNumber || "-"}</div>
            <div><strong>Verified:</strong> {seller.isVerified ? "✅ Verified" : "❌ Not Verified"}</div>
          </div>
        </div>

        {/* About */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">About</h2>
          <p className="text-gray-700">{seller.about?.description || "No description provided."}</p>
        </div>

        {/* Skills */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Skills</h2>
          {seller.skills?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {seller.skills.map((s, i) => (
                <li key={i}>{s.skill} ({s.hobby}) - {s.experience}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No skills listed.</p>
          )}
        </div>

        {/* Education */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Education</h2>
          {seller.education?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700">
              {seller.education.map((e, i) => (
                <li key={i}>{e.degree} - {e.university}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No education details.</p>
          )}
        </div>

        {/* Ads */}
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ads</h2>
          {seller.ads?.length > 0 ? (
            <div className="flex flex-wrap gap-4 overflow-x-auto">
              {seller.ads.map((ad, i) => (
                <div key={i} className="flex flex-col items-center min-w-[150px]">
                  <img
                    src={ad.image?.url || "https://via.placeholder.com/150"}
                    alt={`ad-${i}`}
                    className="w-36 h-36 object-cover rounded-lg shadow-md"
                  />
                  <span className="text-gray-600 mt-1 text-sm">{ad.description || "No description"}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No ads available.</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default CheckoutInfoPage;
