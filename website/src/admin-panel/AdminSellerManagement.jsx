import React, { useEffect, useState } from "react";

const AdminSellerManagement = () => {
  const [verifiedSellers, setVerifiedSellers] = useState([]);
  const [allSellers, setAllSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSeller, setSelectedSeller] = useState(null);

  // Fetch verified sellers
  const fetchVerified = async () => {
    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/api/sellerdetailsprofile/verified");
      const data = await res.json();
      setVerifiedSellers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Fetch all sellers
  const fetchAll = async () => {
    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/api/sellerdetailsprofile");
      const data = await res.json();
      setAllSellers(data);
    } catch (err) {
      console.error(err);
    }
  };

  // Verify seller
  const handleVerify = async (id) => {
    try {
      await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetailsprofile/verify/${id}`, {
        method: "PUT",
      });
      fetchAll();
      fetchVerified();
    } catch (err) {
      console.error("Verify error:", err);
    }
  };

  // Delete seller
  const handleDelete = async (id) => {
    try {
      await fetch(`https://asap-nine-pi.vercel.app/api/sellerdetailsprofile/${id}`, {
        method: "DELETE",
      });
      fetchAll();
      fetchVerified();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  useEffect(() => {
    Promise.all([fetchVerified(), fetchAll()]).finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading sellers...</p>;

  const totalProfiles = allSellers.length;
  const verifiedCount = verifiedSellers.length;
  const unverifiedCount = totalProfiles - verifiedCount;

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
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Address</th>
              <th className="p-2 border">Verified</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((seller) => (
              <tr key={seller._id} className="border hover:bg-blue-50 transition">
                <td className="p-2 border">{seller.personal?.name || "-"}</td>
                <td className="p-2 border">{seller.personal?.email || "-"}</td>
                <td className="p-2 border">{seller.personal?.address || "-"}</td>
                <td className="p-2 border text-center">{seller.isVerified ? "✅" : "❌"}</td>
                <td className="p-2 border flex gap-2">
                  {showVerifyBtn && (
                    <button
                      onClick={() => handleVerify(seller._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md shadow"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(seller._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md shadow"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => setSelectedSeller(seller)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md shadow"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  // Modal (same as your code)
  const renderModal = () => {
    if (!selectedSeller) return null;
    const seller = selectedSeller;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl bg-gradient-to-br from-blue-50 to-white p-6">
          <button
            onClick={() => setSelectedSeller(null)}
            className="absolute top-4 right-4 text-gray-700 hover:text-red-500 text-3xl font-bold"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{seller.personal?.name}</h2>
          <p>Email: {seller.personal?.email}</p>
          <p>Address: {seller.personal?.address}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Admin Seller Management</h2>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Total Profiles</h3>
          <p className="text-3xl font-bold mt-2">{totalProfiles}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Verified Profiles</h3>
          <p className="text-3xl font-bold mt-2">{verifiedCount}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white p-6 rounded-xl shadow-lg">
          <h3 className="text-lg font-semibold">Pending Profiles</h3>
          <p className="text-3xl font-bold mt-2">{unverifiedCount}</p>
        </div>
      </div>

      {/* Tables */}
      {renderTable(allSellers.filter(s => !s.isVerified), "Unverified Sellers", true)}
      {renderTable(verifiedSellers, "Verified Sellers")}
      {renderModal()}
    </div>
  );
};

export default AdminSellerManagement;
