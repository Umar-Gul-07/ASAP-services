import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserEventsBox() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    createdBy: "",
    category: "",
    image: null
  });

  const API_URL = "https://asap-nine-pi.vercel.app";

  const fetchEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user-events`);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });
      data.append('userId', localStorage.getItem("userId"));
let temp={...formData,userId:localStorage.getItem("userId")

}
      await axios.post(`${API_URL}/api/user-events`, temp, {
        // headers: { "Content-Type": "multipart/form-data" }
      });

      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        createdBy: "",
        category: "",
        image: null
      });
      fetchEvents();
    } catch (err) {
      console.error("Error creating event", err);
    }
  };

  return (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-full">
      <h2 className="text-xl font-bold mb-3">Create Event</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input type="text" name="title" placeholder="Event Title" value={formData.title} onChange={handleChange} className="w-full p-2 rounded text-black" required />
        <textarea name="description" placeholder="Event Description" value={formData.description} onChange={handleChange} className="w-full p-2 rounded text-black" required />
        <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full p-2 rounded text-black" required />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} className="w-full p-2 rounded text-black" required />
        <input type="text" name="createdBy" placeholder="User ID" value={formData.createdBy} onChange={handleChange} className="w-full p-2 rounded text-black" required />
        <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} className="w-full p-2 rounded text-black" />
        
        {/* Image Upload Field */}
        <input type="file" name="image" onChange={handleChange} className="w-full p-2 rounded text-black" accept="image/*" />

        <button type="submit" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700">Create Event</button>
      </form>

      <h2 className="text-xl font-bold mt-6 mb-3">User Events</h2>
      <ul className="space-y-2">
        {events.map((event) => (
          <li key={event._id} className="bg-gray-800 p-3 rounded">
            {event.image && <img src={`${API_URL}/${event.image}`} alt={event.title} className="w-32 h-32 object-cover rounded mb-2" />}
            <h3 className="font-bold">{event.title}</h3>
            <p>{event.description}</p>
            <p className="text-sm text-gray-400">{new Date(event.date).toLocaleDateString()} - {event.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
