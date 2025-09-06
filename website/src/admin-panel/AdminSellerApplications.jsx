import React, { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://asap-nine-pi.vercel.app/api/seller-form";

const AdminApplications = () => {
  const [applications, setApplications] = useState([]);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);

  // fetch all data
  useEffect(() => {
    axios.get(BASE_URL)
      .then((res) => setApplications(res.data))
      .catch(console.error);

    // categories
    fetch("https://asap-nine-pi.vercel.app/Category")
      .then((res) => res.json())
      .then(setCategories);

    // products
    fetch("https://asap-nine-pi.vercel.app/product")
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []));

    // subproducts
    fetch("https://asap-nine-pi.vercel.app/subProduct")
      .then((res) => res.json())
      .then((data) => setSubProducts(data.subproducts || []));
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">All Seller Applications</h2>
      {applications.length === 0 ? (
        <p>No applications found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {applications.map((app) => (
            <div
              key={app._id}
              className="bg-white shadow rounded p-4 border"
            >
              <h3 className="font-bold text-lg mb-2">{app.Name}</h3>
              <p><span className="font-semibold">Email:</span> {app.email}</p>
              <p><span className="font-semibold">Mobile:</span> {app.phoneNumber}</p>
              <p><span className="font-semibold">Experience:</span> {app.experience}</p>
              <p><span className="font-semibold">Country:</span> {app.country}</p>
              <p><span className="font-semibold">City:</span> {app.city}</p>
              <p><span className="font-semibold">Zip Code:</span> {app.zipCode}</p>
              <p>
                <span className="font-semibold">Category:</span>{" "}
                {categories.find((c) => c._id === app.category)?.Title || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Product:</span>{" "}
                {products.find((p) => p._id === app.product)?.name || "N/A"}
              </p>
              <p>
                <span className="font-semibold">Subproduct:</span>{" "}
                {subProducts.find((sp) => sp._id === app.subproduct)?.name || "N/A"}
              </p>
              <p><span className="font-semibold">Details:</span> {app.details}</p>
              <p><span className="font-semibold">Description:</span> {app.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminApplications;
