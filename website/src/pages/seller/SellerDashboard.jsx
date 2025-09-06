import React, { useEffect, useState } from "react";
import SellerHeader from "./SellerHeader";
import {
  FaBars,
  FaTimes,
  FaUsers,
  FaBox,
  FaShoppingCart,
  FaTachometerAlt,
  FaUser,
  FaEnvelope,
  FaPlusSquare,
  FaIdCard,
  FaLayerGroup,
  FaCloudUploadAlt
} from "react-icons/fa";

import { HomeIcon } from "lucide-react";

const SellerDashboard = () => {
  const [userCount, setUserCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [orders, setOrders] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showChat, setShowChat] = useState(false); // toggle chat

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const token = localStorage.getItem("token");

        const usersResponse = await fetch(`https://asap-nine-pi.vercel.app/users`, {
          headers: { Authorization: token },
        });
        const usersData = await usersResponse.json();
        setUserCount(usersData.length || 0);

        const categoriesResponse = await fetch(`https://asap-nine-pi.vercel.app/Category`);
        const categoriesData = await categoriesResponse.json();
        setCategoryCount(categoriesData.length || 0);

        const ordersResponse = await fetch(
          `https://asap-nine-pi.vercel.app/specificbooking?sellerId=${userId}`,
          { headers: { Authorization: token } }
        );
        const ordersData = await ordersResponse.json();
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const links = [
    { href: "/sellerdashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/Sellerprofile", label: "Profile", icon: <FaUser /> },
 
    { href: "/userAd", label: "Post Ad", icon: <FaPlusSquare /> },
    { href: "/sellerdetails", label: "Personal details", icon: <FaIdCard /> },
    { href: "/sellerservice", label: "Multi service", icon: <FaLayerGroup /> },
    { href: "/", label: "Home", icon: <HomeIcon /> },
     { href: "/Sellermsg", label: "Contact Buyer", icon: <FaEnvelope />},
        
{ href: "/uploadwork", label: "Upload Work Sample", icon: <FaCloudUploadAlt /> },
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <SellerHeader />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-[#292511] p-4">
        <h2 className="text-white font-bold text-lg">ASsoonaspossible</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white text-2xl focus:outline-none"
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`fixed top-0 left-0 h-full w-72 bg-[#292511] flex flex-col shadow-xl z-30 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex`}
        >
          {/* Sidebar Header */}
          <div className="bg-gradient-to-r from-[#1f1b0d] to-[#3b3620] p-6 text-center">
            <h2 className="text-2xl font-bold text-white tracking-wide">Seller Panel</h2>
            <p className="text-sm text-gray-300 opacity-80">Manage your business</p>
          </div>

          {/* Navigation */}
<nav className="flex-1 overflow-y-auto mt-4">
            <ul className="space-y-1 px-2">
              {links.map((link) =>
                link.label === "Messages" ? (
                  <li key={link.href}>
                    <button
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition-all duration-200 w-full"
                      onClick={() => setShowChat(true)}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                    </button>
                  </li>
                ) : (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition-all duration-200"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="text-lg">{link.icon}</span>
                      <span className="font-medium">{link.label}</span>
                    </a>
                  </li>
                )
              )}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-[#3d3822] text-gray-400 text-sm">
            <p className="text-center">&copy; 2025 ASAP</p>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-auto p-4 md:p-6 md:ml-36 md:mr-36">
          {showChat ? (
            <>
              <button
                onClick={() => setShowChat(false)}
                className="bg-red-500 text-white px-4 py-2 rounded mb-4 w-max"
              >
                Close Chat
              </button>
              <ChatApp
                currentUserId={localStorage.getItem("userId")} // seller id
                chatUsers={[{ id: "admin@gmail.com", name: "Admin" }]} // only admin
              />
            </>
          ) : (
            <>
              {/* Stats Cards */}
              <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-6 rounded-2xl shadow flex items-center justify-between">
                  <div>
                    <h3 className="text-sm opacity-90">Users</h3>
                    <p className="text-3xl font-bold">{userCount}</p>
                  </div>
                  <FaUsers className="text-4xl opacity-80" />
                </div>

                <div className="bg-gradient-to-r from-orange-400 to-orange-600 text-white p-6 rounded-2xl shadow flex items-center justify-between">
                  <div>
                    <h3 className="text-sm opacity-90">Categories</h3>
                    <p className="text-3xl font-bold">{categoryCount}</p>
                  </div>
                  <FaBox className="text-4xl opacity-80" />
                </div>

                {/* Orders Count */}
                <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-2xl shadow flex items-center justify-between">
                  <div>
                    <h3 className="text-sm opacity-90">Orders</h3>
                    <p className="text-3xl font-bold">{orders.length}</p>
                  </div>
                  <FaShoppingCart className="text-4xl opacity-80" />
                </div>
              </section>

              {/* Recent Orders Table */}
              <section>
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 overflow-x-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Recent Orders</h2>
                    <button className="px-4 py-2 text-sm bg-[#292511] text-white rounded-lg hover:bg-[#1f1b0d] transition">
                      View All
                    </button>
                  </div>
                  <table className="min-w-full text-sm text-left rounded-lg overflow-hidden">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs sm:text-sm">
                      <tr>
                        <th className="py-3 px-4">#</th>
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-4">Product</th>
                        <th className="py-3 px-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.length > 0 ? (
                        orders.map((order, index) => (
                          <tr
                            key={order._id || index}
                            className="border-t hover:bg-gray-50 transition"
                          >
                            <td className="py-3 px-4">{index + 1}</td>
                            <td className="py-3 px-4">{order.user?.Name || "N/A"}</td>
                            <td className="py-3 px-4">{order.product?.name || "N/A"}</td>
                            <td
                              className={`py-3 px-4 font-medium ${
                                order.ordered ? "text-green-600" : "text-yellow-600"
                              }`}
                            >
                              {order.ordered ? "Approved" : "Pending"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="py-6 text-center text-gray-500">
                            No orders found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;
