import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams(); // token from URL
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [expired, setExpired] = useState(false);

  // Fetch token expiration info from backend
  useEffect(() => {
    const fetchTokenInfo = async () => {
      try {
        const res = await axios.get(`https://asap-nine-pi.vercel.app/check-token/${token}`);
        if (res.data.status) {
          const expiryTime = new Date(res.data.expires).getTime();
          const remaining = Math.floor((expiryTime - Date.now()) / 1000);
          if (remaining > 0) setTimeLeft(remaining);
          else setExpired(true);
        } else {
          setExpired(true);
          setErrMsg("Invalid or expired token");
        }
      } catch (error) {
        console.error(error);
        setErrMsg("Error validating token");
      }
    };
    fetchTokenInfo();
  }, [token]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExpired(true);
          setErrMsg("Token expired. Please request a new reset email.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");
    setSuccessMsg("");

    if (expired) {
      setErrMsg("Token has expired. Request a new reset email.");
      return;
    }

    if (!password) {
      setErrMsg("Password is required");
      return;
    }

    try {
      const res = await axios.post(
        `https://asap-nine-pi.vercel.app/reset-password/${token}`,
        { password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (res.data.status) {
        setSuccessMsg(res.data.message || "Password reset successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrMsg(res.data.message || "Invalid or expired token.");
      }
    } catch (error) {
      console.error("Reset password error:", error);
      setErrMsg("An error occurred. Please try again.");
    }
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col bg-white shadow-lg rounded-xl p-10 space-y-6 max-w-md w-full"
      >
        <h2 className="text-3xl font-bold text-center text-brown-800">
          Reset Password
        </h2>

        {timeLeft > 0 && (
          <p className="text-center text-gray-600 font-semibold">
            Link expires in: {formatTime(timeLeft)}
          </p>
        )}

        <input
          type="password"
          placeholder="Enter new password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-4 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brown-400"
          required
          disabled={expired}
        />

        {errMsg && <p className="text-red-600 font-semibold text-center">{errMsg}</p>}
        {successMsg && <p className="text-green-600 font-semibold text-center">{successMsg}</p>}

        <button
          type="submit"
          className={`bg-[#3c3007] text-white py-5 rounded-full text-xl font-bold hover:opacity-90 transition w-2/3 mx-auto ${
            expired ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={expired}
        >
          Reset Password
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
