import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs5";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [sellers, setSellers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showChat, setShowChat] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (users.length || sellers.length || bookings.length) {
      $("#bookingdatatable").DataTable().destroy?.();
      $("#sellerdatatable").DataTable().destroy?.();
      $("#userdatatable").DataTable().destroy?.();

      $("#bookingdatatable").DataTable();
      $("#sellerdatatable").DataTable();
      $("#userdatatable").DataTable();

      $(document)
        .off("click", ".btn-delete")
        .on("click", ".btn-delete", function () {
          const id = $(this).data("id");
          const type = $(this).data("type");
          handleDelete(id, type);
        });
    }
  }, [users, sellers, bookings]);
  

  const fetchData = async () => {
    try {
      const [usersRes, sellersRes, bookingsRes, categoriesRes] = await Promise.all([
        fetch("https://asap-nine-pi.vercel.app/users"),
        fetch("https://asap-nine-pi.vercel.app/getallsellers"),
        fetch("https://asap-nine-pi.vercel.app/bookings"),
        fetch("https://asap-nine-pi.vercel.app/Category"),
      ]);

      const usersData = await usersRes.json();
      const sellersData = await sellersRes.json();
      const bookingsData = await bookingsRes.json();
      const categoriesData = await categoriesRes.json();

      setUsers(usersData);
      setSellers(sellersData);
      setBookings(bookingsData.reverse());
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  ///////////////////
  // Count users by heardFrom

  // Count users by heardFrom (normalized)
const heardFromCounts = users.reduce((acc, user) => {
  const source = user.heardFrom || "Other";  // direct use
  acc[source] = (acc[source] || 0) + 1;
  return acc;
}, {});

// Count sellers by heardFrom (normalized)
const heardFromCountsSeller = sellers.reduce((acc, seller) => {
  const source = seller.heardFrom || "Other";
  acc[source] = (acc[source] || 0) + 1;
  return acc;
}, {});


const handleDelete = async (id, type) => {
  if (!window.confirm("Are you sure you want to delete this?")) return;

  let url = "";

  if (type === "user") {
    url = `https://asap-nine-pi.vercel.app/deleteUser/${id}`;
  } else if (type === "seller") {
    url = `https://asap-nine-pi.vercel.app/delete-seller/${id}`;
  } else if (type === "booking") {
    url = `https://asap-nine-pi.vercel.app/bookings/${id}`;
  } else {
    alert("Unknown type");
    return;
  }

  try {
    const res = await fetch(url, {
      method: "DELETE",
    });

    const data = await res.json();
    
    if (res.ok) {
      alert("Deleted successfully!");
      fetchData(); // Refresh the table
    } else {
      console.error(data);
      alert("Delete failed: " + (data.message || "Unknown error"));
    }
  } catch (error) {
    console.error(error);
    alert("Error deleting record.");
  }
};


  // PDF Export functions
  const downloadBookingsPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("List of Bookings", 14, 20);
    const tableColumn = [
      "#",
      "Product Name",
      "Buyer Name",
      "Buyer Contact",
      "Seller Name",
      "Seller Contact",
      "Date",
    ];
    const tableRows = bookings.map((b, i) => [
      i + 1,
      b.product?.name || "N/A",
      b.user?.Name || "N/A",
      b.user?.phoneNumber || "N/A",
      b.seller?.Name || "N/A",
      b.seller?.phoneNumber || "N/A",
      b.dateAdded || "N/A",
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
    });
    doc.save("bookings_list.pdf");
  };

  const downloadSellersPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("List of Sellers", 14, 20);
    const tableColumn = ["#", "Name", "Contact", "Email", "User Type"];
    const tableRows = sellers.map((s, i) => [
      i + 1,
      s.Name || "N/A",
      s.phoneNumber || "N/A",
      s.email || "N/A",
      s.userType || "Seller",
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("sellers_list.pdf");
  };

  const downloadUsersPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("List of Users", 14, 20);
    const tableColumn = ["#", "Name", "Contact", "Email", "User Type"];
    const tableRows = users.map((u, i) => [
      i + 1,
      u.Name || "N/A",
      u.phoneNumber || "N/A",
      u.email || "N/A",
      u.userType || "User",
    ]);

    autoTable(doc, { head: [tableColumn], body: tableRows, startY: 30 });
    doc.save("users_list.pdf");
  };

  // Table renderer
  const renderTable = (data, type) => (
    <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
      <table
        id={`${type}datatable`}
        className="display table table-striped table-bordered w-full text-sm min-w-[600px]"
      >
        <thead className="bg-gray-100">
          <tr>
            {type === "booking" ? (
              <>
                <th>#</th>
                <th>Product Name</th>
                <th>Buyer Name</th>
                <th>Buyer Contact</th>
                <th>Seller Name</th>
                <th>Seller Contact</th>
                <th>Date</th>
                <th>Action</th>
              </>
            ) : (
              <>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>User Type</th>
                <th>Reference Name</th>
                <th>Action</th>
                
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              {type === "booking" ? (
                <>
                  <td>{item.product?.name || "N/A"}</td>
                  <td>{item.user?.Name || "N/A"}</td>
                  <td>{item.user?.phoneNumber || "N/A"}</td>
                  <td>{item.seller?.Name || "N/A"}</td>
                  <td>{item.seller?.phoneNumber || "N/A"}</td>
                  <td>{item.dateAdded}</td>
                </>
              ) : (
                <>
                  <td>{item.Name}</td>
                  <td>{item.phoneNumber}</td>
                  <td>{item.email}</td>
                  <td>{item.userType}</td>
                  <td>{item.referenceName || "N/A"}</td>
                </>
              )}
              <td className="text-center space-x-2">
                <button
                  className="btn btn-sm btn-danger btn-delete"
                  title="Delete"
                  data-id={item._id}
                  data-type={type === "seller" ? "seller" : type === "user" ? "user" : "booking"}
                >
                  <i className="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderCard = (title, count, iconClass, bgColor) => (
    <div className="w-full sm:w-1/2 lg:w-1/4 p-2">
      <div
        className={`rounded-xl shadow-lg text-white p-5 flex flex-col justify-between h-32 ${bgColor} hover:brightness-110 transition-transform hover:scale-105`}
      >
        <div className="flex justify-between items-center">
          <div className="text-3xl opacity-80">
            <i className={`bi ${iconClass}`}></i>
          </div>
          <div className="text-3xl font-bold">{count}</div>
        </div>
        <div className="text-lg font-medium opacity-90">{title}</div>
      </div>
    </div>
  );
const renderSmallCard = (title, count, bgColor) => (
  <div className="w-1/6 p-1">
    <div
      className={`rounded-md shadow-md text-white p-3 flex flex-col justify-center items-center ${bgColor} hover:brightness-110 transition`}
    >
      <div className="text-lg font-bold">{count}</div>
      <div className="text-xs opacity-90 text-center mt-1">{title}</div>
    </div>
  </div>
);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-4 py-3 flex justify-between items-center relative">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden p-2 text-gray-700 bg-gray-200 rounded"
        >
          <i className="bi bi-list text-2xl"></i>
        </button>
        <h1 className="text-lg md:text-xl font-bold">AsSoonAsPossible</h1>
        <button className="flex items-center space-x-2">
          <i className="fa-regular fa-user"></i>
          <span className="hidden sm:inline">Admin</span>
        </button>
      </nav>

      {/* Sidebar */}
<aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#292511] text-white p-4 shadow-lg transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 z-40`}
      >
        <div className="flex items-center justify-between md:justify-start mb-8">
          <div className="flex items-center">
            <i className="bi bi-speedometer2 text-2xl mr-2"></i>
            <span className="text-xl font-bold">Admin Panel</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a
                href="admindashboard"
                className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#2d2d3f] transition"
              >
                <i className="bi bi-house-door-fill"></i>
                <span>Dashboard</span>
              </a>
            </li>
            <li>
              <a href="Categories" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-tags-fill"></i>
                <span>Categories</span>
              </a>
            </li>
            <li>
              <a href="Products" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-box-seam"></i>
                <span>Products</span>
              </a>
            </li>
            <li>
              <a href="Sub-Product" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-grid-fill"></i>
                <span>Sub-Products</span>
              </a>
            </li>
        
            <li>
              <a href="adminAd" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-bullseye"></i>
                <span>Manage Ad</span>
              </a>
            </li>
            <li>
              <a href="/admin/sellerservice" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-bullseye"></i>
                <span>Manage Seller Service</span>
              </a>
            </li>
            <li>
              <a href="adminsellerlist" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-people-fill"></i>
                <span>Sellers Profile Manage</span>
              </a>
            </li>
            <li>
              <a href="/adminEvent" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-people-fill"></i>
                <span>Manage Events</span>
              </a>
            </li>
            <li>
              <a href="/userQuery" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-question-circle"></i>
                <span>User Questions</span>
              </a>
            </li>
            <li>
              <a href="/AdminApp" className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded">
                <i className="bi bi-question-circle"></i>
                <span>App Data</span>
              </a>
            </li>
            <li>
              <Link
                to="/"
                className="flex items-center gap-3 py-2 px-3 text-[#dddddd] hover:bg-[#3a3620] hover:text-white rounded"
              >
                <i className="bi bi-house-door-fill"></i>
                <span>Home</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:ml-64">
        {showChat ? (
          <>
            <button
              onClick={() => setShowChat(false)}
              className="bg-red-500 text-white px-4 py-2 rounded mb-4"
            >
              Close Chat
            </button>
            {/* ChatApp component */}
          </>
        ) : (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">📊 Admin Dashboard</h2>
            <div className="flex flex-wrap -m-2 mb-8">
              {renderCard("Users", users.length, "bi-people-fill", "bg-gray-800")}
              {renderCard("Bookings", bookings.length, "bi-bag-check", "bg-green-800")}
              {renderCard("Categories", categories.length, "bi-intersect", "bg-yellow-700")}
              {renderCard("Sellers", sellers.length, "bi-journal-text", "bg-red-800")}
            </div>
     {/* User HeardFrom Cards */}
<h3 className="text-lg font-semibold text-gray-700 mb-2">👤 User Data</h3>
<div className="flex flex-wrap -m-1 mb-8">
  {renderSmallCard("Facebook", heardFromCounts.Facebook || 0, "bg-blue-600")}
  {renderSmallCard("Instagram", heardFromCounts.Instagram || 0, "bg-pink-500")}
  {renderSmallCard("YouTube", heardFromCounts.YouTube || 0, "bg-red-600")}
  {renderSmallCard("TikTok", heardFromCounts.TikTok || 0, "bg-black")}
  {renderSmallCard("Influencers", heardFromCounts.Influencers || 0, "bg-purple-600")}
  {renderSmallCard("Other", heardFromCounts.Other || 0, "bg-gray-500")}
</div>

{/* Seller HeardFrom Cards */}
<h3 className="text-lg font-semibold text-gray-700 mb-2">🛍️ Seller Data</h3>
<div className="flex flex-wrap -m-1 mb-8">
  {renderSmallCard("Facebook", heardFromCountsSeller.Facebook || 0, "bg-blue-600")}
  {renderSmallCard("Instagram", heardFromCountsSeller.Instagram || 0, "bg-pink-500")}
  {renderSmallCard("YouTube", heardFromCountsSeller.YouTube || 0, "bg-red-600")}
  {renderSmallCard("TikTok", heardFromCountsSeller.TikTok || 0, "bg-black")}
  {renderSmallCard("Influencers", heardFromCountsSeller.Influencers || 0, "bg-purple-600")}
  {renderSmallCard("Other", heardFromCountsSeller.Other || 0, "bg-gray-500")}
</div>




            <div className="space-y-10">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-700">🛒 List of Bookings</h3>
                  <button
                    onClick={downloadBookingsPDF}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                  >
                    Download PDF
                  </button>
                </div>
                {renderTable(bookings, "booking")}
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-700">🛍️ List of Sellers</h3>
                  <button
                    onClick={downloadSellersPDF}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Download PDF
                  </button>
                </div>
                {renderTable(sellers, "seller")}
              </div>
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-semibold text-gray-700">👤 List of Users</h3>
                  <button
                    onClick={downloadUsersPDF}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Download PDF
                  </button>
                </div>
                {renderTable(users, "user")}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
