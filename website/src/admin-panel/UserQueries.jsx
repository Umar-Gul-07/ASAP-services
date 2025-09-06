import React, { useEffect, useState } from "react";
import { FaClock, FaCheckCircle, FaListAlt } from "react-icons/fa";

const UserQueries = () => {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("pending"); // pending | responded

  // Fetch all messages
  const fetchQueries = async () => {
    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/api/informationBox");
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setQueries(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  // Delete a query
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`https://asap-nine-pi.vercel.app/api/informationBox/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setQueries(queries.filter((q) => q._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  // Mark query as responded
  const handleRespond = async (id) => {
    try {
      const res = await fetch(`https://asap-nine-pi.vercel.app/api/informationBox/${id}/respond`, {
        method: "PATCH",
      });
      if (!res.ok) throw new Error("Failed to mark as responded");
      await res.json();

      // Update local state
      setQueries(
        queries.map((q) => (q._id === id ? { ...q, status: "responded" } : q))
      );
    } catch (err) {
      alert(err.message);
    }
  };

  // Filtered queries based on active tab
  const filteredQueries = queries.filter((q) => (q.status || "pending") === activeTab);

  // Counts
  const pendingCount = queries.filter((q) => (q.status || "pending") === "pending").length;
  const respondedCount = queries.filter((q) => q.status === "responded").length;
  const totalCount = queries.length;

  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Queries</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-5 rounded-lg shadow flex items-center">
          <FaClock className="text-yellow-600 text-3xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-yellow-700">Pending</h2>
            <p className="text-2xl font-bold">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-green-100 border-l-4 border-green-500 p-5 rounded-lg shadow flex items-center">
          <FaCheckCircle className="text-green-600 text-3xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-green-700">Responded</h2>
            <p className="text-2xl font-bold">{respondedCount}</p>
          </div>
        </div>
        <div className="bg-blue-100 border-l-4 border-blue-500 p-5 rounded-lg shadow flex items-center">
          <FaListAlt className="text-blue-600 text-3xl mr-4" />
          <div>
            <h2 className="text-lg font-semibold text-blue-700">Total</h2>
            <p className="text-2xl font-bold">{totalCount}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("pending")}
          className={`px-4 py-2 rounded ${
            activeTab === "pending"
              ? "bg-yellow-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Pending ({pendingCount})
        </button>
        <button
          onClick={() => setActiveTab("responded")}
          className={`px-4 py-2 rounded ${
            activeTab === "responded"
              ? "bg-green-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Responded ({respondedCount})
        </button>
      </div>

      {filteredQueries.length === 0 ? (
        <p>No {activeTab} queries found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Contact</th>
                <th className="px-4 py-2 border">Description</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Status</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredQueries.map((q) => (
                <tr key={q._id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{q.name}</td>
                  <td className="px-4 py-2 border">{q.email}</td>
                  <td className="px-4 py-2 border">{q.contact}</td>
                  <td className="px-4 py-2 border">{q.description}</td>
                  <td className="px-4 py-2 border">
                    {new Date(q.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <span
                      className={`px-2 py-1 rounded text-sm font-semibold ${
                        q.status === "responded"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {q.status || "pending"}
                    </span>
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex gap-2">
                      {q.status !== "responded" && (
                        <button
                          onClick={() => handleRespond(q._id)}
                          className="flex-1 bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 shadow"
                        >
                          Mark Responded
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(q._id)}
                        className="flex-1 bg-amber-800 text-white px-3 py-1 rounded hover:bg-amber-900 shadow"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserQueries;
