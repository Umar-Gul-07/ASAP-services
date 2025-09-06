import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("verified");
  const [editService, setEditService] = useState(null);
  const [viewService, setViewService] = useState(null);

  // Fetch all services
  const fetchServices = async () => {
    try {
      const res = await axios.get("https://asap-nine-pi.vercel.app/api/servicesSeller");
      setServices(res.data);
    } catch (err) {
      console.error("❌ Service Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Toggle verified/unverified
const toggleVerifyService = async (service) => {
  try {
    console.log("🔎 Verifying service with ID:", service._id);

    const res = await axios.put(
      `http://localhost:8000/api/services/${service._id}/verify`
    );

    const updated = res.data.data;
    console.log("✅ Verify API Response:", updated);

    // ab safely replace kar sakte ho
    setServices((prev) =>
      prev.map((s) =>
        String(s._id) === String(updated._id) ? updated : s
      )
    );
  } catch (err) {
    console.error("❌ Verify Error:", err.response?.data || err.message);
  }
};

  // Delete service
  const deleteService = async (id) => {
    if (!window.confirm("Are you sure to delete this service?")) return;
    try {
      await axios.delete(`https://asap-nine-pi.vercel.app/api/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error("❌ Delete Error:", err);
    }
  };

  // Update service
  const updateService = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(editService).forEach((key) => {
      if (editService[key] !== null && editService[key] !== undefined)
        data.append(key, editService[key]);
    });
    try {
      await axios.put(
        `https://asap-nine-pi.vercel.app/api/services/${editService._id}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setEditService(null);
      fetchServices();
    } catch (err) {
      console.error("❌ Update Error:", err);
    }
  };

  // Filter services
  const filteredServices = services.filter((s) => {
    if (filter === "verified") return s.isVerified;
    if (filter === "unverified") return !s.isVerified;
    return true;
  });

  const totalCount = services.length;
  const verifiedCount = services.filter((s) => s.isVerified).length;
  const unverifiedCount = totalCount - verifiedCount;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Admin Services Dashboard
      </h2>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-md rounded-2xl p-6 border-l-4 border-blue-500">
          <h3 className="text-lg text-white font-semibold">Total Services</h3>
          <p className="text-3xl font-bold text-white mt-2">{totalCount}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 shadow-md rounded-2xl p-6 border-l-4 border-green-500">
          <h3 className="text-lg font-semibold text-white">Verified Services</h3>
          <p className="text-3xl font-bold text-white mt-2">{verifiedCount}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 shadow-md rounded-2xl p-6 border-l-4 border-red-500">
          <h3 className="text-lg font-semibold text-white">Unverified Services</h3>
          <p className="text-3xl font-bold text-white mt-2">{unverifiedCount}</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex justify-center space-x-3 mb-8">
        {["all", "verified", "unverified"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded font-semibold transition ${
              filter === f
                ? f === "verified"
                  ? "bg-green-600 text-white"
                  : f === "unverified"
                  ? "bg-red-600 text-white"
                  : "bg-blue-600 text-white"
                : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Conditional View: Table or Single Service */}
      {viewService ? (
        <div className="max-w-md mx-auto border rounded-xl shadow-md p-6 bg-white relative">
          {viewService.isVerified && (
            <span className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
              Verified
            </span>
          )}
          <img
            src={viewService.image || "/placeholder.png"}
            alt={viewService.name}
            className="h-40 w-full object-cover rounded mb-3"
          />
          <h3 className="text-lg font-bold text-gray-800">{viewService.name}</h3>
          <p className="text-sm text-gray-600 mb-1">
            Experience: {viewService.experience}
          </p>
          <p className="text-gray-700 text-sm mb-2">{viewService.description}</p>
          <p className="text-xs text-gray-500">
            Category: {viewService.category?.name || "-"}
          </p>
          <p className="text-xs text-gray-500">
            Product: {viewService.product?.name || "-"}
          </p>
          <p className="text-xs text-gray-500 mb-2">
            SubProduct: {viewService.subProduct?.name || "-"}
          </p>
          <div className="flex space-x-2 mt-2">
            <button
              onClick={() => setViewService(null)}
              className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded bg-white shadow">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-4 py-2 border">Image</th>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Experience</th>
                <th className="px-4 py-2 border">Category</th>
                <th className="px-4 py-2 border">Product</th>
                <th className="px-4 py-2 border">SubProduct</th>
                <th className="px-4 py-2 border">Verified</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.map((service) => (
                <tr key={service._id} className="text-center">
                  <td className="px-4 py-2 border">
                    <img
                      src={service.image || "/placeholder.png"}
                      alt={service.name}
                      className="h-12 w-12 object-cover rounded mx-auto"
                    />
                  </td>
                  <td className="px-4 py-2 border">{service.name}</td>
                  <td className="px-4 py-2 border">{service.experience}</td>
                  <td className="px-4 py-2 border">{service.category?.name || "-"}</td>
                  <td className="px-4 py-2 border">{service.product?.name || "-"}</td>
                  <td className="px-4 py-2 border">{service.subProduct?.name || "-"}</td>
                  <td className="px-4 py-2 border">
                    {service.isVerified ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 border space-x-1 flex justify-center">
                    <button
                      onClick={() => toggleVerifyService(service)}
                      className={`px-2 py-1 rounded text-white ${
                        service.isVerified
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {service.isVerified ? "Unverify" : "Verify"}
                    </button>
                    <button
                      onClick={() => setEditService(service)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(service._id)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setViewService(service)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={updateService}
            className="bg-white p-6 rounded-lg w-96 shadow-lg"
          >
            <h3 className="text-xl font-bold mb-4">Edit Service</h3>
            <input
              type="text"
              placeholder="Name"
              value={editService.name}
              onChange={(e) =>
                setEditService({ ...editService, name: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              required
            />
            <input
              type="text"
              placeholder="Experience"
              value={editService.experience}
              onChange={(e) =>
                setEditService({ ...editService, experience: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              required
            />
            <textarea
              placeholder="Description"
              value={editService.description}
              onChange={(e) =>
                setEditService({ ...editService, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
              required
            ></textarea>
            <input
              type="file"
              onChange={(e) =>
                setEditService({ ...editService, image: e.target.files[0] })
              }
              className="w-full p-2 border rounded mb-2"
            />
            <div className="flex justify-end space-x-2 mt-3">
              <button
                type="button"
                onClick={() => setEditService(null)}
                className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
