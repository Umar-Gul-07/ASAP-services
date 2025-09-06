import React, { useEffect } from "react";
import "../../public/css/style.css";
import "swiper/css/bundle";
import "font-awesome/css/font-awesome.min.css";

const Product = () => {
  useEffect(() => {
    // Swiper init
    const swiperScript = document.createElement("script");
    swiperScript.src = "https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js";
    swiperScript.async = true;
    document.body.appendChild(swiperScript);

    // Kursor effect
    const kursorScript = document.createElement("script");
    kursorScript.src = "https://cdn.jsdelivr.net/npm/kursor@0.0.14/dist/kursor.js";
    kursorScript.async = true;
    document.body.appendChild(kursorScript);

    return () => {
      document.body.removeChild(swiperScript);
      document.body.removeChild(kursorScript);
    };
  }, []);

  return (
    <div className="product-page">
      {/* Header / Navbar */}
      <header className="bg-white py-4 shadow">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-xl font-bold">ASSP</h1>
          <nav className="space-x-4">
            <a href="/" className="text-gray-600 hover:text-blue-600">Home</a>
            <a href="/product" className="text-blue-600 font-semibold">Products</a>
            <a href="/login" className="text-gray-600 hover:text-blue-600">Login</a>
          </nav>
        </div>
      </header>

      {/* Product Filters */}
      <section className="bg-gray-100 py-6 px-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <input
            type="text"
            placeholder="Search products..."
            className="border px-4 py-2 w-full md:w-1/3 mb-4 md:mb-0 rounded"
          />
          <select className="border px-4 py-2 rounded">
            <option>Sort by</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Newest</option>
          </select>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Card Example */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src="/Images/sample.jpg"
                alt="Product"
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">Product Title {i + 1}</h3>
                <p className="text-sm text-gray-600 mb-2">Short description here.</p>
                <p className="text-blue-600 font-bold">$20</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modal (example static, can be made dynamic with state) */}
      <div className="modal fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/2">
          <h2 className="text-xl font-bold mb-4">Modal Title</h2>
          <p>This is a modal description for the product.</p>
          <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">Close</button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 text-center mt-10">
        <p>© {new Date().getFullYear()} ASSP. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Product;
