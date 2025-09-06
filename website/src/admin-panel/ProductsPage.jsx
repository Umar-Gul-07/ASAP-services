import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({ name: "", categoryId: "", image: "" });
  const [editingId, setEditingId] = useState(null); // Track which product is being edited

  const baseUrl = "https://asap-nine-pi.vercel.app";

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${baseUrl}/product`);
      setProducts(res.data.products);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${baseUrl}/category`);
      setCategories(res.data);
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    try {
      if (editingId) {
        // Update existing product
        await axios.put(`${baseUrl}/product/${editingId}`, formData);
        setEditingId(null);
      } else {
        // Add new product
        await axios.post(`${baseUrl}/product`, formData);
      }
      setFormData({ name: "", categoryId: "", image: "" });
      fetchProducts();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`${baseUrl}/product/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      categoryId: product.category,
      image: product.image,
    });
    setEditingId(product._id);
    window.scrollTo({ top: 0, behavior: "smooth" }); // scroll to form
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="text-2xl font-bold text-purple-700 mb-4">Products</div>

      {/* Form */}
      <div className="bg-white p-4 rounded-xl shadow-md mb-6">
        <div className="text-lg font-semibold mb-3">{editingId ? "Edit Product" : "Add Product"}</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Name"
            className="border rounded border-black px-3 py-2"
          />
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="border rounded border-black px-3 py-2"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.Title}
              </option>
            ))}
          </select>
          <input
            name="image"
            value={formData.image}
            onChange={handleChange}
            placeholder="Image URL"
            className="border rounded border-black px-3 py-2"
          />
        </div>
        <div className="mt-4 flex gap-3">
          <button onClick={submitForm} className="bg-green-600 text-white px-4 py-2 rounded shadow">
            {editingId ? "Update" : "Submit"}
          </button>
          <button onClick={() => { setFormData({ name: "", categoryId: "", image: "" }); setEditingId(null); }} className="bg-yellow-500 text-white px-4 py-2 rounded shadow">
            Reset
          </button>
        </div>
      </div>

      {/* Product Table */}
      <div className="bg-white p-4 rounded-xl shadow-md">
        <div className="text-lg font-semibold mb-3">All Products</div>
        <table className="min-w-full border">
          <thead className="bg-purple-100 text-purple-900">
            <tr>
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Category</th>
              <th className="p-2 border">Image</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod, index) => (
              <tr key={prod._id} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{prod.name}</td>
                <td className="border p-2">{categories.find(c => c._id === prod.category)?.Title || "N/A"}</td>
                <td className="border p-2">
                  <img
                    src={prod.image}
                    onError={(e) => (e.target.src = "https://via.placeholder.com/64?text=No+Image")}
                    alt={prod.name}
                    className="w-16 h-16 object-cover mx-auto"
                  />
                </td>
                <td className="border p-2 flex justify-center gap-2">
                  <button onClick={() => handleEdit(prod)} className="bg-blue-600 text-white px-2 py-1 rounded shadow">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(prod._id)} className="bg-red-600 text-white px-2 py-1 rounded shadow">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsPage;
