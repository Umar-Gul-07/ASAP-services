import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");

    if (!email) {
      setErrMsg("Email is required");
      return;
    }

    try {
      const res = await axios.post(
        "https://asap-nine-pi.vercel.app/forgot-password", // ✅ Correct backend URL
        { email },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status) {
        setSuccessMsg(res.data.message || "Reset instructions sent! Check your email.");
      } else {
        setErrMsg(res.data.message || "User not found or email error.");
      }
    } catch (error) {
      console.error("Forgot password error:", error);
      setErrMsg("An error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white shadow-lg rounded-xl p-10 space-y-6 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-brown-800">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-400"
          required
        />

        {errMsg && (
          <p className="text-red-600 font-semibold text-center">{errMsg}</p>
        )}
        {successMsg && (
          <p className="text-green-600 font-semibold text-center">{successMsg}</p>
        )}

        <button
          type="submit"
          className="bg-[#3c3007] text-white py-5 rounded-full text-xl font-bold hover:opacity-90 transition w-2/3 mx-auto"
        >
          Send Reset Email
        </button>

        <div className="text-center">
          <a href="/register" className="text-brown-600 hover:underline text-lg">
            Register
          </a>
          <br />
          <a href="/Buyerlogin" className="text-brown-600 hover:underline text-lg">
            Join as a Professional?
          </a>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
