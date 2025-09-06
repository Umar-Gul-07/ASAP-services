import React, { useEffect, useState } from "react";

const AdminEventsManagement = () => {
  const [verifiedEvents, setVerifiedEvents] = useState([]);
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Event Post Popup state
  const [showEventPopup, setShowEventPopup] = useState(false);
  const [eventImage, setEventImage] = useState(null);
  const [eventPreview, setEventPreview] = useState(null);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");

  // Helper to fix image URLs
  const getImageUrl = (img) => {
    if (!img) return "https://via.placeholder.com/500x300?text=No+Image";
    return img.startsWith("http") ? img : `https://asap-nine-pi.vercel.app/${img}`;
  };

  // Filtered events based on search
  const filteredAllEvents = allEvents.filter(
    (e) =>
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.includes(searchQuery)
  );

  const filteredVerifiedEvents = verifiedEvents.filter(
    (e) =>
      e.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.date.includes(searchQuery)
  );

  // Fetch verified events
  const fetchVerified = async () => {
    try {
      const res = await fetch(
        "https://asap-nine-pi.vercel.app/api/event/admin/verified",
        {
          headers: { email: "admin@gmail.com", password: "ADMIN" },
        }
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setVerifiedEvents(data.data || []);
    } catch (err) {
      console.error("Error fetching verified events:", err);
    }
  };

  // Fetch all events
  const fetchAll = async () => {
    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/api/event/events");
      const data = await res.json();
      setAllEvents(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    Promise.all([fetchVerified(), fetchAll()]).finally(() => setLoading(false));
  }, []);

  // Handle Verify
  const handleVerify = async (id) => {
    try {
      await fetch(`https://asap-nine-pi.vercel.app/api/event/admin/verify/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          email: "admin@gmail.com",
          password: "ADMIN",
        },
        body: JSON.stringify({ action: "verified", message: "Approved by admin" }),
      });
      fetchAll();
      fetchVerified();
    } catch (err) {
      console.error("Verify error:", err);
    }
  };

  // Handle Delete
  const handleDelete = async (id) => {
    try {
      await fetch(`https://asap-nine-pi.vercel.app/api/event/events/${id}`, {
        method: "DELETE",
      });
      fetchAll();
      fetchVerified();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Handle Post / Update Event
  const handlePostEvent = async (e) => {
    e.preventDefault();

    if (!eventDate || !eventTime || !eventVenue || !eventDescription) {
      return alert("Please fill all fields and select an image if new");
    }

    const formData = new FormData();
    if (eventImage) formData.append("image", eventImage);
    formData.append("date", eventDate);
    formData.append("time", eventTime);
    formData.append("venue", eventVenue);
    formData.append("description", eventDescription);

    try {
      let res;
      if (editingEvent) {
        // Update event
        res = await fetch(
          `https://asap-nine-pi.vercel.app/api/event/events/${editingEvent._id}`,
          {
            method: "PUT",
            body: formData,
          }
        );
      } else {
        // Create new event
        formData.append("status", "verified");
        formData.append("userId", "admin-123");
        res = await fetch("https://asap-nine-pi.vercel.app/api/event/add-event", {
          method: "POST",
          body: formData,
        });
      }

      if (res.ok) {
        alert(editingEvent ? "Event updated successfully!" : "Event posted successfully!");
        // Reset form
        setEventImage(null);
        setEventPreview(null);
        setEventDate("");
        setEventTime("");
        setEventVenue("");
        setEventDescription("");
        setShowEventPopup(false);
        setEditingEvent(null);
        fetchAll();
        fetchVerified();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Render table
  const renderTable = (data, title, showVerifyBtn = false) => (
    <div className="my-6 bg-white rounded-xl shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
      {data.length === 0 ? (
        <p className="text-gray-500">No {title.toLowerCase()}.</p>
      ) : (
        <table className="w-full border rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gradient-to-r from-blue-100 to-blue-200">
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Time</th>
              <th className="p-2 border">Venue</th>
              <th className="p-2 border">Description</th>
              <th className="p-2 border">Verified</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((event) => (
              <tr key={event._id} className="border hover:bg-blue-50 transition">
                <td className="p-2 border">
                  <img
                    src={getImageUrl(event.image)}
                    alt="event"
                    className="w-24 h-16 object-cover rounded"
                  />
                </td>
                <td className="p-2 border">{event.date}</td>
                <td className="p-2 border">{event.time}</td>
                <td className="p-2 border">{event.venue}</td>
                <td className="p-2 border">{event.description}</td>
                <td className="p-2 border text-center">
                  {event.status === "verified" ? "✅" : "❌"}
                </td>
                <td className="p-2 border flex gap-2 flex-wrap">
                  {showVerifyBtn && (
                    <button
                      onClick={() => handleVerify(event._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      setEditingEvent(event);
                      setEventDate(event.date);
                      setEventTime(event.time);
                      setEventVenue(event.venue);
                      setEventDescription(event.description);
                      setEventPreview(getImageUrl(event.image));
                      setShowEventPopup(true);
                    }}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md shadow"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Render modal for viewing
  const renderModal = () => {
    if (!selectedEvent) return null;
    const event = selectedEvent;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-white p-6">
          <button
            onClick={() => setSelectedEvent(null)}
            className="absolute top-4 right-4 text-gray-700 hover:text-red-500 text-3xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">{event.venue}</h2>
          <p className="text-gray-700 mb-1"><strong>Date:</strong> {event.date}</p>
          <p className="text-gray-700 mb-1"><strong>Time:</strong> {event.time}</p>
          <p className="text-gray-700 mb-4"><strong>Description:</strong> {event.description}</p>
          <img
            src={getImageUrl(event.image)}
            alt="event"
            className="rounded-lg w-full max-h-96 object-cover"
          />
        </div>
      </div>
    );
  };

  if (loading) return <p>Loading events...</p>;

  const totalEvents = allEvents.length;
  const verifiedCount = verifiedEvents.length;
  const pendingCount = totalEvents - verifiedCount;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Events Management</h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Total Events</h3>
          <p className="text-3xl font-bold mt-2">{totalEvents}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Verified Events</h3>
          <p className="text-3xl font-bold mt-2">{verifiedCount}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Pending Events</h3>
          <p className="text-3xl font-bold mt-2">{pendingCount}</p>
        </div>
      </div>

      {/* Search and Post New Event */}
      <div className="flex justify-between mb-4 items-center">
        <input
          type="text"
          placeholder="Search by venue, description, or date..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full md:w-1/2 border rounded-lg p-2"
        />
        <button
          className="bg-[#292511] text-white px-6 py-2 rounded-lg hover:bg-[#1f1b0d] ml-4"
          onClick={() => {
            setEditingEvent(null);
            setEventImage(null);
            setEventPreview(null);
            setEventDate("");
            setEventTime("");
            setEventVenue("");
            setEventDescription("");
            setShowEventPopup(true);
          }}
        >
          Post New Event
        </button>
      </div>

      {/* Tables */}
      {renderTable(filteredAllEvents.filter((e) => e.status !== "verified"), "Pending Events", true)}
      {renderTable(filteredVerifiedEvents, "Verified Events")}

      {/* Event Post / Edit Popup */}
      {showEventPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowEventPopup(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowEventPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {editingEvent ? "Update Event" : "Post Event as Admin"}
            </h2>
            <form onSubmit={handlePostEvent} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setEventImage(file);
                  setEventPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm border rounded p-2"
              />
              {eventPreview && (
                <img
                  src={eventPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
              <input
                type="text"
                placeholder="Venue"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                className="w-full border rounded-lg p-2"
                required
              />
              <textarea
                placeholder="Description"
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full border rounded-lg p-3"
                rows="4"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#292511] text-white py-2 rounded-lg hover:bg-[#1f1b0d]"
              >
                {editingEvent ? "Update Event" : "Post Event"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {renderModal()}
    </div>
  );
};

export default AdminEventsManagement;
