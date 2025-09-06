// UserAd.js
import React, { useEffect, useState } from "react";
import SellerHeader from "./SellerHeader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm";
import {
  FaTachometerAlt,
  FaUser,
  FaEnvelope,
  FaPlusSquare,
  FaIdCard,
  FaLayerGroup,
} from "react-icons/fa";

const stripePromise = loadStripe("pk_test_1234567890"); // your publishable key

const UserAd = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [ads, setAds] = useState([]);
  const [editingAdId, setEditingAdId] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [prevAds, setPrevAds] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const backendUrl = "https://asap-nine-pi.vercel.app/api/post";
  const userId = localStorage.getItem("sellerId") || "demo-user-123";
  
  // Sidebar links
  const links = [
    { href: "/sellerdashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/Sellerprofile", label: "Profile", icon: <FaUser /> },
    { href: "/Sellermsg", label: "Messages", icon: <FaEnvelope /> },
    { href: "/userAd", label: "Post Ad", icon: <FaPlusSquare /> },
    { href: "/sellerdetails", label: "Personal details", icon: <FaIdCard /> },
    { href: "/sellerservice", label: "Multi service", icon: <FaLayerGroup /> },
  ];

  // Fetch ads
  const fetchAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/posts?userId=${userId}`);
      const data = await res.json();
      const adsData = Array.isArray(data.data) ? data.data : [];

      if (prevAds.length > 0) {
        const newNotifications = adsData
          .filter((ad) => {
            const prev = prevAds.find((a) => a._id === ad._id);
            return prev && prev.status !== ad.status;
          })
          .map((ad) => ({
            id: ad._id,
            message: `Your ad "${ad.description}" is now ${ad.status}`,
            status: ad.status,
          }));

        if (newNotifications.length > 0) {
          setNotifications(notifications.concat(newNotifications));
        }
      }

      setAds(adsData);
      setPrevAds(adsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchAds, 5000);
    return () => clearInterval(interval);
  }, [prevAds, notifications]);

  // Image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // Submit ad
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || (!image && !editingAdId)) {
      alert("Add a description and image");
      return;
    }
    if (!paymentDone) {
      alert("Please complete payment or free trial first to post ads.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("description", description);
      formData.append("userId", userId);
      if (image) formData.append("image", image);

      let res;
      if (editingAdId) {
        res = await fetch(`${backendUrl}/posts/${editingAdId}`, {
          method: "PUT",
          body: formData,
        });
      } else {
        res = await fetch(`${backendUrl}/add-post`, {
          method: "POST",
          body: formData,
        });
      }

      const data = await res.json();
      if (res.ok) {
        alert(editingAdId ? "Ad updated!" : "Ad posted!");
        setImage(null);
        setPreview(null);
        setDescription("");
        setEditingAdId(null);
        fetchAds();
      } else {
        alert(data.message || "Error submitting ad");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting ad");
    }
  };

  const handleEdit = (ad) => {
    setEditingAdId(ad._id);
    setDescription(ad.description);
    setPreview(ad.image);
    setImage(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await fetch(`${backendUrl}/posts/${id}`, { method: "DELETE" });
      fetchAds();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentDone(true);
    setShowPopup(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#292511] flex flex-col shadow-xl z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex`}
      >
        <div className="bg-gradient-to-r from-[#1f1b0d] to-[#3b3620] p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Seller Panel</h2>
          <p className="text-sm text-gray-300 opacity-80">Manage your ads</p>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition-all"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#3d3822] text-gray-400 text-sm text-center">
          &copy; 2025 ASAP
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-72 overflow-y-auto">
        {/* Notifications */}
        <div className="fixed top-4 right-4 space-y-2 z-50">
          {notifications.map((note) => (
            <div
              key={note.id}
              className={`px-4 py-2 rounded shadow text-white ${
                note.status === "verified" ? "bg-green-600" : "bg-red-600"
              }`}
            >
              {note.message}
              <button
                className="ml-2 font-bold"
                onClick={() =>
                  setNotifications(notifications.filter((n) => n.id !== note.id))
                }
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {/* Payment Popup */}
        {showPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
              <p className="text-gray-600">Select one option to continue</p>

              <button
                onClick={() => {
                  setPaymentDone(true);
                  setShowPopup(false);
                  alert("✅ 6 Month Free Trial activated! You can now post ads.");
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-medium transition"
              >
                6 Month Free Trial
              </button>

              <Elements stripe={stripePromise}>
                <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
              </Elements>
            </div>
          </div>
        )}

        {/* Ad Form */}
        <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {editingAdId ? "Edit Ad" : "Post Your Ad"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-600
                           file:mr-4 file:py-2 file:px-4
                           file:rounded-lg file:border-0
                           file:text-sm file:font-semibold
                           file:bg-[#292511] file:text-white
                           hover:file:bg-[#1f1b0d]"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="mt-4 w-full h-48 object-cover rounded-lg border"
                />
              )}
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                placeholder="Write about your ad..."
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#292511] outline-none"
              />
            </div>
            <button
              type="submit"
              className={`w-full py-3 rounded-lg font-medium ${
                paymentDone
                  ? "bg-[#292511] text-white hover:bg-[#1f1b0d]"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
              disabled={!paymentDone}
            >
              {editingAdId ? "Update Ad" : "Post Ad"}
            </button>
          </form>
        </div>

        {/* My Ads */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">My Ads</h2>
          {ads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ads.map((ad) => (
                <div
                  key={ad._id}
                  className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                >
                  <img
                    src={ad.image?.url || ad.image}
                    alt="Ad"
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4 flex flex-col">
                    <p className="text-gray-700 text-sm">{ad.description}</p>

                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span
                        className={`font-semibold ${
                          ad.status === "verified"
                            ? "text-green-600"
                            : ad.status === "rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                        }`}
                      >
                        {ad.status}
                      </span>
                    </p>
                    {ad.status === "rejected" && ad.message && (
                      <p className="text-xs text-red-500 mt-1">
                        Reason: {ad.message}
                      </p>
                    )}

                    <span className="text-xs text-gray-500 mt-2">
                      Posted: {new Date(ad.createdAt).toLocaleDateString()}
                    </span>
                    <div className="mt-2 flex space-x-2">
                      <button
                        onClick={() => handleEdit(ad)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(ad._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No ads posted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAd;
