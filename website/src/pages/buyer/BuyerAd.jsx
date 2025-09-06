import React, { useEffect, useState } from "react";
import BuyerHeader from "./BuyerHeader";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "../seller/PaymentForm";
import {
  LayoutDashboard,
  User,
  Home,
  FilePlus,
  LogIn,
} from "lucide-react"; // 👈 sidebar icons

const stripePromise = loadStripe("pk_test_1234567890"); // your publishable key

const BuyerAd = () => {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [ads, setAds] = useState([]);
  const [editingAdId, setEditingAdId] = useState(null);
  const [showPopup, setShowPopup] = useState(true);
  const [paymentDone, setPaymentDone] = useState(false);

  const backendUrl = "https://asap-nine-pi.vercel.app/api/post";
  const userId = localStorage.getItem("userId") || "demo-user-123";

  // Fetch buyer's ads
  const fetchAds = async () => {
    try {
      const res = await fetch(`${backendUrl}/posts?userId=${userId}`);
      const data = await res.json();
      setAds(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAds();
  }, []);

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
    setPreview(ad.image?.url || ad.image);
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
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Payment / Free Trial Popup */}
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

      <div className="w-full">
        <BuyerHeader />
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-[#292511] text-white flex flex-col shadow-lg">
          <div className="text-2xl font-bold p-6 border-b border-yellow-800">
            ASSOONASPOSSIBLE
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a
              href="/buyerdashboard"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <LayoutDashboard size={18} /> Dashboard
            </a>
            <a
              href="/buyerprofile"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <User size={18} /> Profile
            </a>
            <a
              href="/"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <Home size={18} /> Home
            </a>
            <a
              href="/BuyerAd"
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#1f1b0d] text-white"
            >
              <FilePlus size={18} /> Post Ad
            </a>
            <a
              href="/BuyerLogin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <LogIn size={18} /> Login
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-blue-50 overflow-auto space-y-8">
          {/* Ad Form */}
          <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              {editingAdId ? "Edit Ad" : "Post Your Ad"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Upload Image</label>
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
                <label className="block text-gray-700 font-medium mb-2">Description</label>
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
                          {ad.status || "pending"}
                        </span>
                      </p>
                      {ad.status === "rejected" && ad.message && (
                        <p className="text-xs text-red-500 mt-1">Reason: {ad.message}</p>
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
        </main>
      </div>
    </div>
  );
};

export default BuyerAd;
