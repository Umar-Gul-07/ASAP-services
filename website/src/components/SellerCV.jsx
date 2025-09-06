import React from "react";
import { useLocation } from "react-router-dom";

const SellerCV = () => {
  const { state } = useLocation();
  const seller = state?.sellerProfile;

  if (!seller) return <p>No seller data found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{seller.name}</h1>
      <p className="mb-2"><strong>Email:</strong> {seller.email}</p>
      <p className="mb-2"><strong>Phone:</strong> {seller.phone}</p>
      <p className="mb-2"><strong>Experience:</strong> {seller.experience} years</p>
      <p className="mb-2"><strong>Description:</strong> {seller.description}</p>
      {/* Add more CV fields here */}
    </div>
  );
};

export default SellerCV;
