import React, { useEffect, useState } from "react";

const UserAdStatus = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);

  const userBackendUrl = "https://asap-nine-pi.vercel.app/api/post"; // user ads
  const adminBackendUrl = "https://asap-nine-pi.vercel.app/api/statuspost"; // admin status API

  // Fetch user ads
  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${userBackendUrl}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");
      const data = await res.json();
      setAds(Array.isArray(data.data) ? data.data : []);
    } catch (err) {
      console.error("Error fetching ads:", err);
    } finally {
      setLoading(false);
    }
  };

  // Verify ad (post it to main feed)
  const handleVerify = async (ad) => {
    try {
      // Post ad to main user API (no file upload, just JSON)
      const res = await fetch(`${userBackendUrl}/add-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: ad.description,
          image: ad.image, // use existing image path
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Remove from pending ads
        await fetch(`${userBackendUrl}/posts/${ad._id}`, { method: "DELETE" });
        alert("Ad verified and posted!");
        fetchAds();
      } else {
        alert(data.message || "Error verifying ad");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying ad");
    }
  };

  // Reject ad (delete from pending)
  const handleReject = async (ad) => {
    try {
      const res = await fetch(`${userBackendUrl}/posts/${ad._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      alert("Ad rejected and deleted!");
      fetchAds();
    } catch (err) {
      console.error(err);
      alert("Error rejecting ad");
    }
  };

  // Fix image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${userBackendUrl.replace("/api/post", "")}/${imagePath}`;
  };

  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage User Ads</h1>

      {loading ? (
        <p className="text-gray-600">Loading ads...</p>
      ) : ads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div
              key={ad._id}
              className="bg-white shadow-md rounded-lg overflow-hidden border hover:shadow-lg transition"
            >
              <img
                src={getImageUrl(ad.image)}
                alt="Ad"
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <p className="text-gray-700 text-sm">{ad.description}</p>
                <p className="text-xs text-gray-500 mt-1">
                  Posted: {new Date(ad.createdAt).toLocaleDateString()}
                </p>

                {/* Status Badge */}
                <div className="mt-2">
                  <span className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-600">
                    PENDING
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="mt-3 flex space-x-2">
                  <button
                    onClick={() => handleVerify(ad)}
                    className="flex-1 bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleReject(ad)}
                    className="flex-1 bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No ads found.</p>
      )}
    </div>
  );
};

export default UserAdStatus;
