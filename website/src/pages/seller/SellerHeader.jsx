import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const SellerHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("Seller"); // default
  const dropdownRef = useRef();
   const name = localStorage.getItem("name");
  // Fetch seller info on mount
  useEffect(() => {
    const fetchSeller = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(
          "https://asap-nine-pi.vercel.app/seller-profile",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserName(res.data.Name); // or res.data.name depending on API
      } catch (err) {
        console.error("Error fetching seller info:", err);
      }
    };

    fetchSeller();
  }, []);

  // Toggle dropdown
  const toggleDropdown = () => setIsOpen(!isOpen);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login"; // redirect to login
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <div className="font-bold text-lg text-brown-800">ASSOONASPOSSIBLE</div>

      <div className="relative inline-block mr-24 text-left" ref={dropdownRef}>
        <div>
          <button
            onClick={toggleDropdown}
            className="inline-flex justify-between items-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
          >
            Welcome, {name}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {isOpen && (
          <div className="absolute right-0 z-10 mt-2 w-44 bg-white border border-gray-200 rounded-md shadow-lg">
            <a
              href="/Sellerprofile"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Edit Profile
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerHeader;