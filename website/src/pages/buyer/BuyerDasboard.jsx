import React, { useEffect, useState } from "react";
import BuyerHeader from "./BuyerHeader";
import {
  LayoutDashboard,
  User,
  Home,
  FilePlus,
  LogIn,
 MessageSquare
} from "lucide-react"; // 👈 icons

const BuyerDashboard = () => {
  const buyerId = localStorage.getItem('buyerId');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          `https://asap-nine-pi.vercel.app/specificbooking?sellerId=${userId}`
        );
        const data = await response.json();
        setBookings(data.reverse());
      } catch (err) {
        console.error("Error fetching booking data:", err);
        setError("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchBookings();
  }, [userId]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <FilePlus size={18} /> Post Ad
            </a>
             <a
              href="/Buyermsg"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <MessageSquare size={18} /> Contact Seller
            </a>
            <a
              href="/BuyerLogin"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition"
            >
              <LogIn size={18} /> Login
            </a>
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 bg-blue-50 overflow-auto">
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Buyer Dashboard
          </h1>
          <div className="text-sm text-blue-600 mb-4">
            <a href="/" className="hover:underline">
              Home
            </a>{" "}
            &gt; Dashboard
          </div>

          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-lg font-bold mb-4">List of Bookings</h2>

            {loading ? (
              <p className="text-center text-gray-600">Loading...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : bookings.length === 0 ? (
              <p className="text-center text-gray-500">No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm border rounded-lg overflow-hidden">
                  <thead className="bg-gray-100 text-left">
                    <tr>
                      <th className="border px-4 py-2">#</th>
                      <th className="border px-4 py-2">Product Name</th>
                      <th className="border px-4 py-2">Buyer Name</th>
                      <th className="border px-4 py-2">Buyer Contact</th>
                      <th className="border px-4 py-2">Buyer Email</th>
                      <th className="border px-4 py-2">Date</th>
                      <th className="border px-4 py-2">Status</th>
                      <th className="border px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, index) => (
                      <tr
                        key={booking._id || index}
                        className="bg-white hover:bg-gray-50"
                      >
                        <td className="border px-4 py-2">{index + 1}</td>
                        <td className="border px-4 py-2">
                          {booking.product?.name || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {booking.user?.Name || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {booking.user?.phoneNumber || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {booking.user?.email || "N/A"}
                        </td>
                        <td className="border px-4 py-2">
                          {new Date(booking.dateAdded).toLocaleDateString()}
                        </td>
                        <td className="border px-4 py-2">
                          {booking.ordered ? "Approved" : "Pending"}
                        </td>
                        <td className="border px-4 py-2">
                          <button className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition">
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default BuyerDashboard;
