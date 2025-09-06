import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./App";
import logo from "./assets/logo.png";

const Headerpage = () => {
  const { user, setUser } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true); // 🔹 loading state
  const navigate = useNavigate();

  // Get name and role from localStorage on mount or when user changes
  useEffect(() => {
    const storedName = localStorage.getItem("name") || "";
    const storedRole = localStorage.getItem("role") || "";

    setName(storedName);
    setRole(storedRole);

    // Simulate a small delay for smoother loading effect
    setTimeout(() => setLoading(false), 500);
  }, [user]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUser(null);
    setName("");
    setRole("");
    setIsDropdownOpen(false);
    navigate("/"); // redirect to homepage
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white border-b border-gray-300 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-24 px-5 md:px-2">
        {/* Logo */}
        <div className="flex-shrink-0 ml-2 mr-24 md:ml-0">
          <img src={logo} alt="ASAP logo" className="h-16 w-auto object-contain" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 justify-center space-x-10 text-lg font-semibold text-gray-900">
          <Link to="/" className="hover:text-amber-500">Home</Link>
          <Link to="/about" className="hover:text-amber-500">About Us</Link>
          <Link to="/service" className="hover:text-amber-500">Services</Link>
          <Link to="/viewallAd" className="hover:text-amber-500">View All Ads</Link>
          <Link to="/viewallEvent" className="hover:text-amber-500">Upcoming Events</Link>

          {/* Loading state */}
          {loading ? (
            <span className="text-gray-500">Loading...</span>
          ) : !user ? (
            // Show login options if not logged in
            <div className="relative">
              <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="hover:text-amber-500">Login</button>
              {isDropdownOpen && (
                <div className="absolute mt-2 w-52 bg-white border rounded shadow-lg py-2 z-10">
                  <Link to="/BuyerLogin" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Buyer</Link>
                  <Link to="/login" className="block px-4 py-2 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Seller</Link>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Show dashboard link based on role */}
              {role === "buyer" && (
                <Link to="/buyerdashboard" className="hover:text-amber-500">Dashboard</Link>
              )}
              {role === "seller" && (
                <Link to="/sellerdashboard" className="hover:text-amber-500">Dashboard</Link>
              )}

              {/* User dropdown */}
              <div className="relative">
                <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="flex items-center space-x-2 hover:text-amber-500">
                  <span>{name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg py-2 z-10">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                  </div>
                )}
              </div>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Headerpage;
