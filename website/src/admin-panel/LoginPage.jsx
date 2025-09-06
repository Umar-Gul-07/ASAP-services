import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Hardcoded admin credentials
  const adminEmail = "inquiriesesa@gmail.com";
  const adminPassword = "Sylvie@12345?";

  const handleLogin = () => {
    if (email.trim() === adminEmail && password.trim() === adminPassword) {
      // ✅ Redirect to dashboard
      navigate("/admindashboard");
    } else {
      alert("Invalid email or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="h-[600px] bg-white shadow-lg rounded-xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-serif text-center text-[#292511] mb-2">
          Welcome
        </h2>
        <div className="text-center text-4xl italic text-[#292511] mb-8">
          ASAP
        </div>

        {/* Email Input */}
        <div className="mb-6">
          <label className="block text-sm text-[#6b6459] mb-1">Email</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 bg-[#f8f9ff] border-none rounded-md focus:outline-none shadow-sm"
          />
        </div>

        {/* Password Input */}
        <div className="mb-8">
          <label className="block text-sm text-[#6b6459] mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-3 py-2 bg-[#f8f9ff] border-none rounded-md focus:outline-none shadow-sm"
          />
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full bg-[#292511] text-white font-semibold py-3 rounded-full hover:bg-[#1c1a13] transition duration-300"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
};

export default AdminLoginPage;
