import React, { useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaTrash,
  FaUpload,
  FaCheckCircle,
  FaTimes,
  FaSpinner,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import mongoose from "mongoose"; // for ObjectId validation

const WorkUploadForm = ({ sellerId }) => {
  const [fields, setFields] = useState([{ image: null, description: "" }]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorToast, setErrorToast] = useState("");
  const [loading, setLoading] = useState(false);

  // Add new field
  const handleAddField = () => {
    setFields([...fields, { image: null, description: "" }]);
  };

  // Remove a specific field
  const handleRemoveField = (index) => {
    const values = [...fields];
    values.splice(index, 1);
    setFields(values);
  };

  // Cancel all fields
  const handleCancelAll = () => {
    setFields([{ image: null, description: "" }]);
  };

  // Handle input changes
  const handleChange = (index, e) => {
    const values = [...fields];
    if (e.target.name === "image") {
      values[index].image = e.target.files[0];
    } else {
      values[index][e.target.name] = e.target.value;
    }
    setFields(values);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate sellerId
    if (!sellerId || !mongoose.Types.ObjectId.isValid(sellerId)) {
      setErrorToast("Invalid sellerId!");
      setTimeout(() => setErrorToast(""), 3000);
      return;
    }

    // Validate at least one field
    if (!fields.length || !fields[0].image || !fields[0].description) {
      setErrorToast("Please add at least one image with description");
      setTimeout(() => setErrorToast(""), 3000);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("sellerId", sellerId);

    fields.forEach((field) => {
      formData.append("images", field.image);
      formData.append("descriptions", field.description);
    });

    try {
      const res = await axios.post("http://localhost:8000/api/workupload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("✅ Upload Success:", res.data);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setFields([{ image: null, description: "" }]); // reset form
    } catch (err) {
      console.error("❌ Upload Error:", err.response?.data || err.message);
      setErrorToast(err.response?.data?.message || "Upload failed");
      setTimeout(() => setErrorToast(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-amber-50 min-h-screen flex items-center justify-center p-6 relative">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-3xl border border-amber-200"
      >
        <h2 className="text-3xl font-bold text-amber-800 mb-6 text-center">
          Upload Work Samples
        </h2>

        {fields.map((field, index) => (
          <div
            key={index}
            className="relative mb-6 p-4 border rounded-xl bg-amber-100 shadow-sm"
          >
            <label className="block text-amber-900 font-medium mb-2">
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => handleChange(index, e)}
              className="block w-full mb-3 text-sm text-amber-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brown-600 file:text-white hover:file:bg-brown-700 cursor-pointer"
              required
            />

            <label className="block text-amber-900 font-medium mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter description..."
              value={field.description}
              onChange={(e) => handleChange(index, e)}
              className="w-full p-3 rounded-lg border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />

            {/* Delete button per field */}
            {fields.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                title="Remove this field"
              >
                <FaTrash size={18} />
              </button>
            )}
          </div>
        ))}

        {/* Buttons Row */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleAddField}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-2 rounded-lg shadow-md"
          >
            <FaPlus /> Add More
          </button>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancelAll}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg shadow-md"
            >
              <FaTimes /> Cancel All
            </button>

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-2 ${
                loading ? "bg-brown-400" : "bg-brown-700 hover:bg-brown-800"
              } text-white px-6 py-2 rounded-lg shadow-md`}
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" /> Uploading...
                </>
              ) : (
                <>
                  <FaUpload /> Upload
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Success Toast */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed bottom-6 left-6 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <FaCheckCircle size={20} />
            <span>Work Samples Uploaded Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Toast */}
      <AnimatePresence>
        {errorToast && (
          <motion.div
            className="fixed bottom-6 left-6 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-3 z-50"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <FaTimes size={20} />
            <span>{errorToast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WorkUploadForm;
