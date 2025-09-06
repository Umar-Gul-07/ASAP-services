import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaTachometerAlt,
  FaUser,
  FaEnvelope,
  FaPlusSquare,
  FaIdCard,
  FaLayerGroup,
} from "react-icons/fa";

export default function SellerServiceForm() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Single state object for form data
  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    description: "",
    categoryId: "",
    productId: "",
    subProductId: "",
    image: null,
    editId: null,
  });

  const links = [
    { href: "/sellerdashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/Sellerprofile", label: "Profile", icon: <FaUser /> },
    { href: "/Sellermsg", label: "Messages", icon: <FaEnvelope /> },
    { href: "/userAd", label: "Post Ad", icon: <FaPlusSquare /> },
    { href: "/sellerdetails", label: "Personal details", icon: <FaIdCard /> },
    { href: "/sellerservice", label: "Multi service", icon: <FaLayerGroup /> },
  ];

  // Fetch categories
  useEffect(() => {
    axios
      .get("https://asap-nine-pi.vercel.app/Category")
      .then((res) => setCategories(res.data))
      .catch(console.error);
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    if (!formData.categoryId) return setProducts([]);
    axios
      .get(`https://asap-nine-pi.vercel.app/product?categoryId=${formData.categoryId}`)
      .then((res) => setProducts(res.data.products || []))
      .catch(console.error);
  }, [formData.categoryId]);

  // Fetch subProducts when product changes
  useEffect(() => {
    if (!formData.categoryId || !formData.productId) return setSubProducts([]);
    axios
      .get(
        `https://asap-nine-pi.vercel.app/subProduct?categoryId=${formData.categoryId}&productId=${formData.productId}`
      )
      .then((res) => setSubProducts(res.data.subproducts || []))
      .catch(console.error);
  }, [formData.categoryId, formData.productId]);

  // Fetch seller services
  const fetchServices = async () => {
    const sellerId = localStorage.getItem("sellerId");
    if (!sellerId) return console.error("❌ Seller not logged in");
    try {
      const res = await axios.get(
        `https://asap-nine-pi.vercel.app/api/services?sellerId=${sellerId}`
      );
      setServices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit service
  const handleSubmit = async (e) => {
  e.preventDefault();
  const sellerId = localStorage.getItem("sellerId");
  if (!sellerId) return alert("❌ You are not logged in!");

  const data = new FormData();
  // Append all form fields
  Object.entries(formData).forEach(([key, value]) => {
    if (value !== null) data.append(key === "editId" ? "_id" : key, value);
  });

  // ✅ Append sellerId explicitly
  data.append("sId", sellerId);

  try {
    if (formData.editId) {
      await axios.put(
        `https://asap-nine-pi.vercel.app/api/services/${formData.editId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    } else {
      await axios.post(
        "https://asap-nine-pi.vercel.app/api/services/",
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
    }
    alert("✅ Service saved!");
    setFormData({
      name: "",
      experience: "",
      description: "",
      categoryId: "",
      productId: "",
      subProductId: "",
      image: null,
      editId: null,
    });
    fetchServices();
  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("❌ " + (err.response?.data?.error || "Error submitting service"));
  }
};


  // Edit Service
  const handleEdit = (service) => {
    setFormData({
      name: service.name,
      experience: service.experience,
      description: service.description,
      categoryId: service.category?._id || "",
      productId: service.product?._id || "",
      subProductId: service.subProduct?._id || "",
      image: null,
      editId: service._id,
    });
  };

  // Delete Service
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await axios.delete(`https://asap-nine-pi.vercel.app/api/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-[#292511] flex flex-col shadow-xl z-30 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:relative md:flex`}
      >
        <div className="bg-gradient-to-r from-[#1f1b0d] to-[#3b3620] p-6 text-center">
          <h2 className="text-2xl font-bold text-white">Seller Panel</h2>
          <p className="text-sm text-gray-300 opacity-80">Manage your services</p>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4">
          <ul className="space-y-1 px-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-[#1f1b0d] transition-all"
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="text-lg">{link.icon}</span>
                  <span className="font-medium">{link.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-[#3d3822] text-gray-400 text-sm text-center">
          &copy; 2025 ASAP
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6 md:ml-72 overflow-y-auto">
        {/* Service Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-gradient-to-r from-amber-300 to-amber-500 shadow-xl rounded-2xl mb-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">
            {formData.editId ? "Edit Service" : "Provide Your Service"}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
              required
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black md:col-span-2"
              required
            />
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.Title || cat.name}
                </option>
              ))}
            </select>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
              required
              disabled={!formData.categoryId}
            >
              <option value="">Select Product</option>
              {products.map((prod) => (
                <option key={prod._id} value={prod._id}>
                  {prod.name || prod.Title}
                </option>
              ))}
            </select>
            <select
              name="subProductId"
              value={formData.subProductId}
              onChange={handleChange}
              className="w-full p-3 rounded-lg text-black"
              required
              disabled={!formData.productId}
            >
              <option value="">Select SubProduct</option>
              {subProducts.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white text-black md:col-span-2"
            />
          </div>
          <button
            type="submit"
            className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
          >
            {formData.editId ? "Update Service" : "Submit Service"}
          </button>
        </form>

        {/* Services Grid */}
        <h3 className="text-xl font-bold mb-4">Your Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <div
              key={s._id}
              className="bg-white p-4 rounded-xl shadow-md border border-gray-200 flex flex-col justify-between"
            >
              <div>
                {s.image && (
                  <img
                    src={s.image}
                    alt={s.name}
                    className="w-full h-40 object-cover rounded-md mb-3"
                  />
                )}
                <h4 className="text-lg font-semibold">{s.name}</h4>
                <p className="text-sm text-gray-600">{s.description}</p>
                <p className="mt-1 text-sm">
                  <strong>Experience:</strong> {s.experience}
                </p>
                <p className="text-sm">
                  <strong>Category:</strong> {s.category?.name}
                </p>
                <p className="text-sm">
                  <strong>Product:</strong> {s.product?.name}
                </p>
                <p className="text-sm">
                  <strong>SubProduct:</strong> {s.subProduct?.name}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(s)}
                  className="flex-1 bg-yellow-500 text-white py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
