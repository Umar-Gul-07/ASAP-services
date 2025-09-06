import React, { useEffect, useState } from "react";
import $ from "jquery";
import DataTable from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import { Link } from "react-router-dom";
const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ Title: "", image: "" });
  const [editData, setEditData] = useState({ _id: "", Title: "", image: "" });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const apiEndpoint = "https://asap-nine-pi.vercel.app/Category";

  const fetchCategories = () => {
    fetch(apiEndpoint)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setTimeout(() => {
          if ($.fn.DataTable.isDataTable("#datatable")) {
            $("#datatable").DataTable().destroy();
          }
          $("#datatable").DataTable();
        }, 0);
      })
      .catch((err) => console.error("Fetch Error:", err));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    return () => {
      if ($.fn.DataTable.isDataTable("#datatable")) {
        $("#datatable").DataTable().destroy();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(apiEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setFormData({ Title: "", image: "" });
        fetchCategories();
      })
      .catch((err) => console.error("Add Error:", err));
  };

  const handleEdit = (e) => {
    e.preventDefault();
    fetch(`${apiEndpoint}/${editData._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Title: editData.Title,
        image: editData.image,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        setEditData({ _id: "", Title: "", image: "" });
        fetchCategories();
      })
      .catch((err) => console.error("Update Error:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return;
    fetch(`${apiEndpoint}/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => fetchCategories())
      .catch((err) => console.error("Delete Error:", err));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg md:text-xl font-bold">AsSoonAsPossible</h1>
        <button className="flex items-center space-x-2">
          <i className="fa-regular fa-user"></i>
          <span className="hidden sm:inline">Admin</span>
        </button>
      </nav>

      {/* Main Layout: Sidebar + Content */}
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
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
        <main className="flex-1 p-4 ml-72  sm:p-6">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Categories</h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Add Category Form */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-4">Add Category</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Title</label>
                  <input
                    type="text"
                    className="w-full border border-black rounded px-3 py-2"
                    value={formData.Title}
                    onChange={(e) => setFormData({ ...formData, Title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Image Link</label>
                  <input
                    type="text"
                    className="w-full border border-black rounded px-3 py-2"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    required
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Submit</button>
                  <button type="reset" className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={() => setFormData({ Title: "", image: "" })}>Reset</button>
                </div>
              </form>
            </div>

            {/* Categories Table */}
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-4">All Categories</h2>
              <div className="overflow-x-auto">
                <table id="datatable" className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-200 text-left">
                      <th className="p-2">SL</th>
                      <th className="p-2">Name</th>
                      <th className="p-2">Image</th>
                      <th className="p-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat, i) => (
                      <tr key={cat._id} className="border-b">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{cat.Title}</td>
                        <td className="p-2">
                          <img
                            src={cat.image}
                            alt={cat.Title}
                            className="h-16 w-16 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://placehold.co/64x64?text=No+Image";
                            }}
                          />
                        </td>
                        <td className="p-2 space-x-2">
                          <button className="text-yellow-600" onClick={() => setEditData(cat)}>
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button className="text-red-600" onClick={() => handleDelete(cat._id)}>
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Edit Modal */}
          {editData._id && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
              <div className="bg-white p-6 rounded w-full max-w-md">
                <h3 className="text-lg font-bold mb-4">Edit Category</h3>
                <form onSubmit={handleEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium">Title</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={editData.Title}
                      onChange={(e) => setEditData({ ...editData, Title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Image Link</label>
                    <input
                      type="text"
                      className="w-full border rounded px-3 py-2"
                      value={editData.image}
                      onChange={(e) => setEditData({ ...editData, image: e.target.value })}
                      required
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Update</button>
                    <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setEditData({ _id: "", Title: "", image: "" })}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CategoriesPage;
