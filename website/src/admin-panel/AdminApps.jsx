import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";

const AdminApps = () => {
  const [apps, setApps] = useState([]);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  const API_URL = "https://asap-nine-pi.vercel.app";

  const fetchApps = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/apps`);
      setApps(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("link", link);
    if (image) formData.append("image", image);

    try {
      if (editId) {
        await axios.put(`${API_URL}/api/apps/${editId}`, formData);
        setEditId(null);
      } else {
        await axios.post(`${API_URL}/api/apps`, formData);
      }
      setName("");
      setLink("");
      setImage(null);
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (app) => {
    setEditId(app._id);
    setName(app.name);
    setLink(app.link);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/apps/${id}`);
      fetchApps();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-r from-purple-100 to-pink-100 min-h-screen">
      <h2 className="text-4xl font-bold mb-8 text-center text-purple-700">
        Admin Apps Dashboard
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 bg-white p-6 rounded-2xl shadow-2xl max-w-2xl mx-auto"
      >
        <input
          type="text"
          placeholder="App Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-purple-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
          required
        />
        <input
          type="text"
          placeholder="App Link (https://...)"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border border-purple-300 p-3 w-full mb-3 rounded-lg focus:ring-2 focus:ring-pink-400 focus:border-pink-400"
          required
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          className="mb-4"
        />
        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold px-6 py-3 rounded-lg w-full hover:from-pink-500 hover:to-purple-500 transition-all"
        >
          {editId ? "Update App" : "Add App"}
        </button>
      </form>

      {/* App List */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {apps.map((app) => (
          <div
            key={app._id}
            className="bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all p-4 flex flex-col items-center"
          >
            <a
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-32 flex items-center justify-center mb-3"
            >
              <img
                src={app.image}
                alt={app.name}
                className="object-contain max-h-32 rounded-lg shadow-md"
              />
            </a>
            <h3 className="font-bold mb-3 text-center text-purple-700 text-lg">
              {app.name}
            </h3>
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(app)}
                className="flex items-center gap-1 bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-full transition-all shadow-md"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(app._id)}
                className="flex items-center gap-1 bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-full transition-all shadow-md"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminApps;
