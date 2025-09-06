import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BuyerRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match ❌");
      return;
    }

    // Add registration API logic here
    alert("Registration Successful ✅");
    navigate("/buyer/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-4">
          Create Account
        </h1>

        <div className="flex justify-center gap-4 text-xl mb-4 text-gray-600">
          <i className="fab fa-facebook-f cursor-pointer"></i>
          <i className="fab fa-google-plus-g cursor-pointer"></i>
          <i className="fab fa-linkedin-in cursor-pointer"></i>
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">
          or use your E-mail ID to register
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="FULL NAME"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none"
          />

          <input
            type="email"
            name="email"
            placeholder="EMAIL"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="PASSWORD"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="CONFIRM PASSWORD"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full border px-4 py-2 rounded focus:outline-none"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            Register
          </button>

          <p className="text-center text-sm mt-2 text-gray-500">
            Already have an account?{" "}
            <a
              href="/buyerlogin"
              className="text-blue-500 hover:underline"
            >
              Sign In
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default BuyerRegister;
