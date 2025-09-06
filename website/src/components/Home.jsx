import React, { useEffect, useState } from "react";
import Footer from "./Footer";
import ServicesSection from "./ServicesSection";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);       // products under category
  const [subproducts, setSubproducts] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch categories once on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("https://asap-nine-pi.vercel.app/Category");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when category clicked
  const handleServiceClick = async (categoryId, title) => {
    setLoading(true);
    setSelectedService(title);

    try {
      const res = await fetch("https://asap-nine-pi.vercel.app/product");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      console.log("Products response:", data);

      // Adjust if API returns array or object containing array
      const productsArray = Array.isArray(data) ? data : data.products;
      if (!Array.isArray(productsArray)) {
        console.error("Products data is not an array");
        setServices([]);
        return;
      }

      // Filter products by category
      const filteredProducts = productsArray.filter(
        (p) => p.category === categoryId
      );
      console.log("Filtered products:", filteredProducts);

      setServices(filteredProducts);
      setSubproducts([]);
    } catch (error) {
      console.error("Error fetching products:", error);
      setServices([]);
    }

    setLoading(false);
  };

  // Fetch subproducts when product "Explore" clicked
  const handleExploreClick = async (productId, categoryId) => {
    setLoading(true);
    try {
      const res = await fetch(
        `https://asap-nine-pi.vercel.app/subProduct?categoryId=${categoryId}&productId=${productId}`
      );
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      const subs = Array.isArray(data) ? data : data.subproducts;
      setSubproducts(Array.isArray(subs) ? subs : []);
    } catch (err) {
      console.error("Error fetching subproducts:", err);
      setSubproducts([]);
    }
    setLoading(false);
  };

  // Back from subproducts to products
  const handleBackToProducts = () => {
    setSubproducts([]);
  };

  // Back from products to categories
  const handleBackToCategories = () => {
    setSelectedService(null);
    setServices([]);
    setSubproducts([]);
  };

  return (
    <div>
      <ServicesSection
        categories={categories}
        services={services}
        selectedService={selectedService}
        onCategoryClick={handleServiceClick}
        onExploreClick={handleExploreClick}
        loading={loading}
        subproducts={subproducts}
        onBackToProducts={handleBackToProducts}
        onBackToCategories={handleBackToCategories}
      />

      <Footer onServiceClick={handleServiceClick} />
    </div>
  );
};

export default Home;
