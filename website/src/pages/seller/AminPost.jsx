import React, { useEffect, useState } from "react";

const AdminAdManager = () => {
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ✅ Backend URLs
  const userBackendUrl = "https://asap-nine-pi.vercel.app/api/post"; // fetch user ads
  const adminBackendUrl = "https://asap-nine-pi.vercel.app/api/statuspost"; // admin API

  // Fetch ads and filter rejected
  const fetchAds = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${userBackendUrl}/posts`);
      if (!res.ok) throw new Error("Failed to fetch posts");

      let data;
      try {
        data = await res.json();
      } catch {
        console.error("Invalid JSON response");
        setAds([]);
        return;
      }

      const filtered = Array.isArray(data.data)
        ? data.data.filter((ad) => ad.status !== "rejected")
        : [];
      setAds(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

  // Update status (verify/reject)
  const updateStatus = async (ad, newStatus) => {
    try {
      const res = await fetch(`${adminBackendUrl}/${ad._id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        alert("Server returned invalid response. Check backend route.");
        return;
      }

      if (res.ok) {
        setAds((prev) =>
          newStatus === "rejected"
            ? prev.filter((p) => p._id !== ad._id)
            : prev.map((p) => (p._id === ad._id ? { ...p, status: newStatus } : p))
        );
      } else {
        alert(data.message || "Error updating status");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating ad status");
    }
  };

  // Admin add ad
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !image) return alert("Add description and image");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);

    try {
      const res = await fetch(`${adminBackendUrl}/add`, {
        method: "POST",
        body: formData,
      });

      let data;
      try {
        data = await res.json();
      } catch {
        alert("Server returned invalid response. Check backend route.");
        return;
      }

      if (res.ok) {
        alert("Ad posted successfully!");
        setDescription("");
        setImage(null);
        setPreview(null);
        fetchAds();
      } else {
        alert(data.message || "Error posting ad");
      }
    } catch (err) {
      console.error(err);
      alert("Error posting ad");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://via.placeholder.com/400x200?text=No+Image";
    if (imagePath.startsWith("http")) return imagePath;
    return `${userBackendUrl.replace("/api/post", "")}/${imagePath}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Ad Manager</h1>

      {/* Admin Post Ad Form */}
      <div className="bg-white p-6 rounded shadow-md max-w-lg mb-8">
        <h2 className="text-xl font-semibold mb-4">Post New Ad</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full" />
          {preview && <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded" />}
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
            Post Ad
          </button>
        </form>
      </div>

      {/* Ads List */}
      {loading ? (
        <p>Loading ads...</p>
      ) : ads.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => (
            <div key={ad._id} className="bg-white shadow rounded-lg overflow-hidden">
              <img src={getImageUrl(ad.image)} alt="Ad" className="w-full h-40 object-cover" />
              <div className="p-4">
                <p>{ad.description}</p>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    ad.status === "verified" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                  }`}
                >
                  {ad.status.toUpperCase()}
                </span>

                <div className="mt-2 flex space-x-2">
                  <button
                    onClick={() => updateStatus(ad, "verified")}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => updateStatus(ad, "rejected")}
                    className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No ads found.</p>
      )}
    </div>
  );
};

export default AdminAdManager;
