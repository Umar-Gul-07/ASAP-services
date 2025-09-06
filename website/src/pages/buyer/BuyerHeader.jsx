import React, { useState, useEffect } from "react";

const BuyerHeader = () => {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  const logoutUser = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    window.location.href = "/BuyerLogin";
  };

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center ">
      <div className="font-bold text-lg text-brown-800">ASSOONASPOSSIBLE</div>

      <div className="flex items-center gap-4 mr-24">
        {email ? (
          <span className="text-gray-700 font-medium">Welcome {email}</span>
        ) : (
          <span className="text-gray-500">Loading...</span>
        )}
        <button
          onClick={logoutUser}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default BuyerHeader;
