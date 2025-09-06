import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import logo from "../assets/logo.png";

const Footer = ({ onServiceClick }) => {
  const [allServices, setAllServices] = useState([]);
  const [showAllServices, setShowAllServices] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", contact: "", description: "", verify: false });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch("https://asap-nine-pi.vercel.app/Category");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (Array.isArray(data)) setAllServices(data);
        else setAllServices([]);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setAllServices([]);
      }
    };
    fetchServices();
  }, []);

  const displayedServices = showAllServices ? allServices : allServices.slice(0, 8);

  // Form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.verify) {
      setMessage("⚠️ Please verify you're not a robot");
      return;
    }

    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/api/informationBox", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Message sent successfully!");
        setForm({ name: "", email: "", contact: "", description: "", verify: false });
      } else {
        setMessage("❌ " + (data.error || "Something went wrong"));
      }
    } catch (err) {
      setMessage("❌ Server error");
    }
  };

  return (
    <footer className="relative bg-white px-6 md:px-20 py-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Logo and Tagline */}
        <div className="bg-white shadow-lg rounded-2xl p-6 text-center">
          <img src={logo} alt="ASAP Logo" className="h-14 mx-auto mb-4" />
          <p className="text-gray-700 text-sm leading-relaxed">
            Get Quick and Quality <br /> Services Tailored Just For You!
          </p>
          <div className="flex justify-center space-x-3 mt-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="p-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          <Link
            to="/adminlogin"
            className="inline-block mt-4 px-5 py-2 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-amber-400 hover:text-white transition"
          >
            Administrator
          </Link>
        </div>

        {/* Contact Info */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Contact Info</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>📞 +1(240)753-2014</li>
            <li>📧 inquiriesesa@gmail.com</li>
            <li>📍 Maryland, USA</li>
          </ul>
        </div>

        {/* Quick Links */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Links</h3>
          <div className="flex flex-col space-y-2 text-sm text-gray-600">
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-amber-500">Home</Link>
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-amber-500">Features</Link>
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-amber-500">Services</Link>
            <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="hover:text-amber-500">Sign Up to Find Services</Link>
          </div>
        </div>

        {/* Explore Services */}
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Explore Services</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {displayedServices.length > 0 ? (
              displayedServices.map((service) => (
                <li
                  key={service._id}
                  className="cursor-pointer hover:text-blue-600 transition"
                  onClick={() => onServiceClick(service._id, service.Title)}
                >
                  {service.Title}
                </li>
              ))
            ) : (
              <li>No services found.</li>
            )}
          </ul>
          {allServices.length > 8 && (
            <button
              className="mt-3 text-sm text-blue-500 hover:underline"
              onClick={() => setShowAllServices(!showAllServices)}
            >
              {showAllServices ? "See Less" : "See More"}
            </button>
          )}
        </div>
      </div>

      {/* Bottom text */}
      <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-200 pt-4">
        &copy; {new Date().getFullYear()} ASAP. All rights reserved.
      </div>

      {/* Bottom-right moving message button */}
      <div className="fixed bottom-5 right-5 animate-bounce z-50">
        <button
          onClick={() => setShowPopup(true)}
          className="bg-amber-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-amber-600"
        >
          💬 Contact Us
        </button>
      </div>

      {/* Popup form */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-96 p-6">
            <h2 className="text-lg font-bold mb-4 text-gray-700">Contact Admin</h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Your Name" className="w-full p-2 border rounded-md" required />
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Your Email" className="w-full p-2 border rounded-md" required />
              <input type="text" name="contact" value={form.contact} onChange={handleChange} placeholder="Your Contact Number" className="w-full p-2 border rounded-md" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Write your message" className="w-full p-2 border rounded-md" rows="3" required></textarea>

              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" name="verify" checked={form.verify} onChange={handleChange} />
                <span>I am not a robot</span>
              </label>

              <button type="submit" className="w-full bg-amber-500 text-white py-2 rounded-md hover:bg-amber-600">Send</button>
            </form>

            {message && <p className="mt-3 text-sm text-center">{message}</p>}

            <button onClick={() => setShowPopup(false)} className="mt-3 w-full text-center text-gray-600 hover:text-red-500">❌ Close</button>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
