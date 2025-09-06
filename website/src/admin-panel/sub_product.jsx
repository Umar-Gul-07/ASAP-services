import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const SubProductPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [subProducts, setSubProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    productId: "",
    image: "",
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    id: "",
    name: "",
    image: "",
  });
  const [deleteSuccess, setDeleteSuccess] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSubProducts();
  }, []);

  useEffect(() => {
    if (formData.categoryId) {
      fetchProducts(formData.categoryId);
    }
  }, [formData.categoryId]);

  const fetchCategories = async () => {
    const res = await axios.get("https://asap-nine-pi.vercel.app/category");
    setCategories(res.data);
  };

  const fetchProducts = async (categoryId) => {
    const res = await axios.get("https://asap-nine-pi.vercel.app/product");
    const filtered = res.data.products.filter(
      (p) => p.category === categoryId
    );
    setProducts(filtered);
  };

  const fetchSubProducts = async () => {
    const res = await axios.get("https://asap-nine-pi.vercel.app/subproduct");
    setSubProducts(res.data.subproducts);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({ name: "", categoryId: "", productId: "", image: "" });
  };

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://asap-nine-pi.vercel.app/subproduct",
        formData
      );
      resetForm();
      fetchSubProducts();
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  const openEditModal = (id, name, image) => {
    setEditData({ id, name, image });
    setEditModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(
        `https://asap-nine-pi.vercel.app/subproduct/${editData.id}`,
        {
          name: editData.name,
          image: editData.image,
        }
      );
      setEditModalOpen(false);
      fetchSubProducts();
    } catch (err) {
      console.error("Edit error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://asap-nine-pi.vercel.app/subproduct/${id}`
      );
      fetchSubProducts();
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 3000);
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Download full table PDF
  const downloadFullPDF = () => {
    const table = document.getElementById("subproducts-table");
    if (!table) return;

    html2canvas(table, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("subproducts.pdf");
    });
  };

  // Download single subproduct PDF
  const downloadSinglePDF = (item) => {
    const element = document.createElement("div");
    element.style.width = "500px";
    element.style.padding = "20px";
    element.style.fontFamily = "Arial";
    element.innerHTML = `
      <h2 style="text-align:center;">Subproduct Details</h2>
      <p><strong>Name:</strong> ${item.name}</p>
      <p><strong>Category:</strong> ${categoryMap[item.category]}</p>
      <img src="${item.image}" alt="${item.name}" style="width:200px; height:auto; margin-top:10px;" />
    `;

    document.body.appendChild(element);

    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${item.name}.pdf`);
      document.body.removeChild(element);
    });
  };

  const categoryMap = categories.reduce((acc, cur) => {
    acc[cur._id] = cur.Title;
    return acc;
  }, {});

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sub-Products</h1>

      {deleteSuccess && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Subproduct deleted successfully!
        </div>
      )}

      {/* Form Section */}
      <div className="bg-white p-4 rounded shadow mb-6 max-w-md">
        <h2 className="text-xl font-semibold mb-4">Add Sub-Product</h2>
        <input
          name="name"
          value={formData.name}
          onChange={handleFormChange}
          placeholder="Name"
          className="w-full mb-2 border border-black p-2 rounded"
        />
        <select
          name="categoryId"
          value={formData.categoryId}
          onChange={handleFormChange}
          className="w-full mb-2 border border-black p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.Title}
            </option>
          ))}
        </select>
        <select
          name="productId"
          value={formData.productId}
          onChange={handleFormChange}
          className="w-full mb-2 border border-black p-2 rounded"
        >
          <option value="">Select Product</option>
          {products.map((prod) => (
            <option key={prod._id} value={prod._id}>
              {prod.name}
            </option>
          ))}
        </select>
        <input
          name="image"
          value={formData.image}
          onChange={handleFormChange}
          placeholder="Image URL"
          className="w-full mb-2 border border-black p-2 rounded"
        />
        <div className="flex gap-2">
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
          <button
            onClick={resetForm}
            className="bg-yellow-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">All Sub-Products</h2>
          <button
            onClick={downloadFullPDF}
            className="bg-purple-600 text-white px-4 py-2 rounded"
          >
            Download All PDF
          </button>
        </div>
        <table
          id="subproducts-table"
          className="min-w-full table-auto border"
        >
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="px-4 py-2 text-left">Index</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Category</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {subProducts.map((item, idx) => (
              <tr key={item._id} className="border-b">
                <td className="px-4 py-2">{idx + 1}</td>
                <td className="px-4 py-2">{item.name}</td>
                <td className="px-4 py-2">{categoryMap[item.category]}</td>
                <td className="px-4 py-2">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover border"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() =>
                      openEditModal(item._id, item.name, item.image)
                    }
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => downloadSinglePDF(item)}
                    className="bg-gray-700 text-white px-3 py-1 rounded"
                  >
                    PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-white p-6 rounded shadow-lg w-full max-w-md">
          <Dialog.Title className="text-xl font-semibold mb-4">
            Edit Subproduct
          </Dialog.Title>
          <input
            value={editData.name}
            onChange={(e) =>
              setEditData({ ...editData, name: e.target.value })
            }
            placeholder="Name"
            className="w-full mb-2 border p-2 rounded"
          />
          <input
            value={editData.image}
            onChange={(e) =>
              setEditData({ ...editData, image: e.target.value })
            }
            placeholder="Image URL"
            className="w-full mb-2 border p-2 rounded"
          />
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={handleEditSubmit}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setEditModalOpen(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default SubProductPage;
