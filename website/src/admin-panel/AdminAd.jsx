import React, { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, XCircle, Clock, Eye, Trash2, X } from "lucide-react";

const AdminAds = () => {
  const backendUrl = "https://asap-nine-pi.vercel.app/api/post";

  const [pendingAds, setPendingAds] = useState([]);
  const [verifiedAds, setVerifiedAds] = useState([]);
  const [rejectedAds, setRejectedAds] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  // Fetch ads
  const fetchAds = async () => {
    try {
      const [pending, verified, rejected] = await Promise.all([
        axios.get(`${backendUrl}/admin/pending`),
        axios.get(`${backendUrl}/admin/verified`),
        axios.get(`${backendUrl}/admin/rejected`),
      ]);
      setPendingAds(pending.data.data || []);
      setVerifiedAds(verified.data.data || []);
      setRejectedAds(rejected.data.data || []);
    } catch (err) {
      console.error("Error fetching ads:", err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Verify / Reject ad
  const handleAction = async (adId, action, message = "") => {
    try {
      await axios.put(
        `${backendUrl}/admin/verify/${adId}`,
        { action, message },
        { headers: { "Content-Type": "application/json" } }
      );
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Error updating ad status");
    }
  };

  // Delete ad
  const handleDelete = async (adId) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;
    try {
      await axios.delete(`${backendUrl}/posts/${adId}`);
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Error deleting ad");
    }
  };

  // Image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/300x200?text=No+Image";
    return imagePath.startsWith("http")
      ? imagePath
      : `https://asap-nine-pi.vercel.app/${imagePath}`;
  };

  // Table component
  const AdsTable = ({ ads, status }) => (
    <div className="overflow-x-auto bg-white shadow-md rounded-xl mb-10">
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Image</th>
            <th className="p-3 border">Description</th>
            <th className="p-3 border">Posted Date</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {ads.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-500">
                No {status} ads.
              </td>
            </tr>
          ) : (
            ads.map((ad) => (
              <tr key={ad._id} className="hover:bg-gray-50">
                <td className="p-3 border">
                  <img
                    src={getImageUrl(ad.image)}
                    alt="Ad"
                    className="w-20 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-3 border">{ad.description}</td>
                <td className="p-3 border">
                  {new Date(ad.createdAt).toLocaleDateString()}
                </td>
                <td className="p-3 border text-center">
                  {status === "pending" && (
                    <span className="text-yellow-600 flex items-center justify-center gap-1">
                      <Clock className="w-4 h-4" /> Pending
                    </span>
                  )}
                  {status === "verified" && (
                    <span className="text-green-600 flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Verified
                    </span>
                  )}
                  {status === "rejected" && (
                    <span className="text-red-600 flex items-center justify-center gap-1">
                      <XCircle className="w-4 h-4" /> Rejected
                    </span>
                  )}
                </td>
                <td className="p-3 border flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setSelectedAd(ad);
                      setShowViewModal(true);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Eye size={16} /> View
                  </button>
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                  {status === "pending" && (
                    <>
                      <button
                        onClick={() => handleAction(ad._id, "verified")}
                        className="bg-green-500 text-white px-2 py-1 rounded"
                      >
                        Verify
                      </button>
                      <button
                        onClick={() => {
                          const reason = prompt("Enter rejection reason:");
                          if (reason !== null)
                            handleAction(ad._id, "rejected", reason);
                        }}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Ads Panel</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white shadow rounded-2xl p-6 flex flex-col items-center">
          <Clock className="w-10 h-10 text-yellow-300 mb-2" />
          <h3 className="text-lg font-semibold">Pending Ads</h3>
          <p className="text-2xl font-bold text-yellow-200">
            {pendingAds.length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white shadow rounded-2xl p-6 flex flex-col items-center">
          <CheckCircle className="w-10 h-10 text-green-300 mb-2" />
          <h3 className="text-lg font-semibold">Verified Ads</h3>
          <p className="text-2xl font-bold text-green-200">
            {verifiedAds.length}
          </p>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-700 text-white shadow rounded-2xl p-6 flex flex-col items-center">
          <XCircle className="w-10 h-10 text-red-300 mb-2" />
          <h3 className="text-lg font-semibold">Rejected Ads</h3>
          <p className="text-2xl font-bold text-red-200">
            {rejectedAds.length}
          </p>
        </div>
      </div>

      {/* Separate Lists */}
      <h2 className="text-2xl font-semibold mb-4">⏳ Pending Ads</h2>
      <AdsTable ads={pendingAds} status="pending" />

      <h2 className="text-2xl font-semibold mb-4">✅ Verified Ads</h2>
      <AdsTable ads={verifiedAds} status="verified" />

      <h2 className="text-2xl font-semibold mb-4">❌ Rejected Ads</h2>
      <AdsTable ads={rejectedAds} status="rejected" />

      {/* View Modal */}
      {showViewModal && selectedAd && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">
            <button
              onClick={() => setShowViewModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={getImageUrl(selectedAd.image)}
              alt="Ad"
              className="w-full h-60 object-cover rounded-lg"
            />
            <p className="mt-4 text-gray-700">{selectedAd.description}</p>
            <p className="text-sm text-gray-500 mt-1">
              Posted: {new Date(selectedAd.createdAt).toLocaleString()}
            </p>
            {selectedAd.status === "rejected" && selectedAd.message && (
              <p className="text-sm text-red-500 mt-2">
                Reason: {selectedAd.message}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAds;
