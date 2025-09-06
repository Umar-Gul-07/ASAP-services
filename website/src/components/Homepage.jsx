import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from "react-router-dom";
import RightBoxVerifiedEvents from "./RightBoxVerifiedEvents";
import PaymentForm from "./PaymentmainFrom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import ViewAdLeftBox from "./LeftAdBox";
import SellerDetailCard from "./SellerDetailCard";


const stripePromise = loadStripe("pk_test_1234567890"); // apna publishable Stripe key yahan lagao

export default function Homepage() {
  const backendUrl = "https://asap-nine-pi.vercel.app";

  // Event states
  const [eventImage, setEventImage] = useState(null);
  const [eventPreview, setEventPreview] = useState(null);
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [showEventPopup, setShowEventPopup] = useState(false);
const [subProducts, setSubProducts] = useState([]);
  // Ad states
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [showAdPopup, setShowAdPopup] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
const [selectedSellers, setSelectedSellers] = useState(null);
const [viewingDetailsFor, setViewingDetailsFor] = useState(null);
const [loadingSellers, setLoadingSellers] = useState(false);

  // Payment states
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [paymentFor, setPaymentFor] = useState(null); // "ad" | "event"

  // Common states
  const [categories, setCategories] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
 const [filters, setFilters] = useState({
  zipCode: "",
  mobileNumber: "",
  country: "",
  category: "",
  product: "",
  subProduct: "", // new field
});

  const [filteredProducts, setFilteredProducts] = useState(null);
const [showFilterPopup, setShowFilterPopup] = useState(false);

  const [ads, setAds] = useState([]);
  const [sliderKey, setSliderKey] = useState(0);

  const productsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Stripe Payment Success
  const handlePaymentSuccess = () => {
    setShowPaymentPopup(false);
    if (paymentFor === "ad") {
      setShowAdPopup(true);
      setTimeout(() => setSlideIn(true), 10);
    } else if (paymentFor === "event") {
      setShowEventPopup(true);
    }
  };
  // Helper to get image URLs

  // Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: false,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const getImageUrl = (imagePath) =>
    !imagePath
      ? "https://via.placeholder.com/300x200?text=No+Image"
      : imagePath.startsWith("http")
      ? imagePath
      : `${backendUrl}/${imagePath}`;

  // Fetch Ads
  useEffect(() => {
    fetch(`${backendUrl}/api/post/admin/verified`)
      .then((res) => res.json())
      .then((data) => setAds(Array.isArray(data) ? data : data.data || []))
      .catch((err) => console.error("Error fetching ads:", err));
  }, []);

  // Fetch Categories
  useEffect(() => {
    fetch(`${backendUrl}/Category`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, []);

  // Fetch Products
  useEffect(() => {
    setLoadingProducts(true);
    fetch(`${backendUrl}/product`)
      .then((res) => res.json())
      .then((data) => {
        const productsArray = Array.isArray(data) ? data : data.products || [];
        setAllProducts(productsArray);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // Filter products by category
  useEffect(() => {
    if (!filters.category) {
      setProducts([]);
      setFilters((prev) => ({ ...prev, product: "" }));
      return;
    }
    const filtered = allProducts.filter(
      (p) => p.category === filters.category || p.category?._id === filters.category
    );
    setProducts(filtered);
    setFilters((prev) => ({ ...prev, product: "" }));
  }, [filters.category, allProducts]);
///////////////////
useEffect(() => {
  if (!filters.category || !filters.product) {
    setSubProducts([]);
    setFilters(prev => ({ ...prev, subProduct: "" }));
    return;
  }

  fetch(
    `https://asap-nine-pi.vercel.app/subProduct?categoryId=${filters.category}&productId=${filters.product}`
  )
    .then(res => res.json())
    .then(data => setSubProducts(data.subproducts || [])) // <-- match API key
    .catch(err => console.error("Error fetching subProducts:", err));
}, [filters.category, filters.product]);




  // Handle Filter Change
 const handleChange = (e) => {
  const { name, value } = e.target;

  setFilters((prev) => ({
    ...prev,
    [name]: value,
    ...(name === "category" ? { product: "", subProduct: "" } : {}),
    ...(name === "product" ? { subProduct: "" } : {}),
  }));
};


  // Handle Filter Submit
const handleSubmit = (e) => {
  e.preventDefault();
const sellerId = localStorage.getItem("sellerId");
  // If a subProduct is selected, fetch its verified sellers
if (filters.subProduct) {
  const subProduct = subProducts.find((s) => s._id === filters.subProduct);
  if (subProduct) {
    handleViewDetails(subProduct);
    return;
  }
}

  setShowFilterPopup(true);
};


const handleViewDetails = async (subproduct) => {
  setLoadingSellers(true);
  try {
    // Get sellerId from localStorage (if stored)
    const sellerId = localStorage.getItem("sellerId");
    console.log("Seller ID:", sellerId); // ✅ This will show seller ID in console

    let url = `${backendUrl}/api/services`;
    if (sellerId) url += `?sellerId=${sellerId}`;

    const res = await fetch(url);
    const data = await res.json();

    // Filter verified services
    const filteredServices = data.filter(
      (service) =>
        service.isVerified &&
        (!subproduct._id || service.subProduct?._id === subproduct._id)
    );

    setSelectedSellers(filteredServices);
    setViewingDetailsFor(subproduct); // triggers popup render
  } catch (err) {
    console.error(err);
    setSelectedSellers([]);
    setViewingDetailsFor(subproduct);
  } finally {
    setLoadingSellers(false);
  }
};

  // Post Ad Submit
  const handleAdSubmit = async (e) => {
    e.preventDefault();
    if (!description || !image) return alert("Please add image and description");

    const formData = new FormData();
    formData.append("description", description);
    formData.append("image", image);
    formData.append("userId", localStorage.getItem("userId") || "demo-user-123");

    try {
      const res = await fetch(`${backendUrl}/api/post/add-post`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        alert("Ad posted successfully!");
        setDescription("");
        setImage(null);
        setPreview(null);
        setShowAdPopup(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Post Event Submit
  const handleEventSubmit = async (e) => {
    e.preventDefault();
    if (!eventDescription || !eventImage || !eventVenue || !eventDate || !eventTime) {
      return alert("Please fill all fields and upload an image");
    }

    const formData = new FormData();
    formData.append("description", eventDescription);
    formData.append("image", eventImage);
    formData.append("venue", eventVenue);
    formData.append("date", eventDate);
    formData.append("time", eventTime);
    formData.append("userId", localStorage.getItem("userId") || "demo-user-123");

    try {
      const res = await fetch(`https://asap-nine-pi.vercel.app/api/event/add-event`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Event posted successfully!");
        setEventDescription("");
        setEventImage(null);
        setEventPreview(null);
        setEventVenue("");
        setEventDate("");
        setEventTime("");
        setShowEventPopup(false);
      } else {
        alert("Failed to post event");
      }
    } catch (err) {
      console.error("Error posting event:", err);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-400 dark:from-gray-800 dark:via-gray-700 dark:to-gray-600 h-[300px] mt-10 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative text-center text-white px-6 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Quick & Quality Services for You
          </h1>
          <p className="text-lg md:text-xl font-light">
            Explore top-notch ads and products tailored to your needs
          </p>
        </div>
      </div>

      {/* Filters */}
{/* Filters Section */}
<div className="max-w-6xl mx-auto -mt-20 bg-white/80 dark:bg-gray-800/90 backdrop-blur-md shadow-xl rounded-2xl p-6 mb-10">
  <form
    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
    onSubmit={handleSubmit}
  >
    {/* Zip Code */}
    <input
      type="text"
      name="zipCode"
      placeholder="Zip Code"
      value={filters.zipCode}
      onChange={handleChange}
      className="rounded-lg p-2 border w-full"
    />

    {/* Mobile Number */}
    <input
      type="text"
      name="mobileNumber"
      placeholder="Mobile Number"
      value={filters.mobileNumber}
      onChange={handleChange}
      className="rounded-lg p-2 border w-full"
    />

    {/* Country */}
    <input
      type="text"
      name="country"
      placeholder="Country"
      value={filters.country}
      onChange={handleChange}
      className="rounded-lg p-2 border w-full"
    />

    {/* Category */}
    <select
      name="category"
      value={filters.category}
      onChange={handleChange}
      className="rounded-lg p-2 border w-full"
    >
      <option value="">Select Category</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat._id}>
          {cat.Title}
        </option>
      ))}
    </select>

    {/* Product */}
    <select
      name="product"
      value={filters.product}
      onChange={handleChange}
      className="rounded-lg p-2 border w-full"
      disabled={products.length === 0 || loadingProducts}
    >
      <option value="">Select Product</option>
      {products.map((prod) => (
        <option key={prod._id} value={prod._id}>
          {prod.name || prod.Title}
        </option>
      ))}
    </select>

    {/* SubProduct */}
   <select
  name="subProduct"
  value={filters.subProduct}
  onChange={handleChange}
  className="rounded-lg p-2 border w-full"
  disabled={subProducts.length === 0}
>
  <option value="">Select SubProduct</option>
  {subProducts.map((sub) => (
    <option key={sub._id} value={sub._id}>
      {sub.Title || sub.name}
    </option>
  ))}
</select>


    {/* Apply Button */}
    <div className="col-span-full flex justify-center mt-2">
      <button
        type="submit"
        className="bg-amber-500 text-white px-8 py-2 rounded-lg font-semibold shadow hover:bg-amber-600 transition"
      >
        Apply
      </button>
    </div>
  </form>
</div>

{/* Filter Results Popup */}
{selectedSellers && viewingDetailsFor && (
  <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
    <div className="bg-white rounded-lg p-6 w-[90%] max-w-3xl max-h-[90vh] overflow-y-auto">
      <h3 className="text-2xl font-bold mb-6 text-center">
        Sellers for {viewingDetailsFor.name || viewingDetailsFor.Title}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {selectedSellers.length > 0 ? (
          selectedSellers.map((seller) => (
            <SellerDetailCard
              key={seller._id}
              seller={seller}
              onCheckoutInfo={() => console.log("Checkout Info", seller._id)}
            />
          ))
        ) : (
          <p className="col-span-full text-center">No verified sellers found.</p>
        )}
      </div>
      <div className="text-center mt-6">
        <button
          className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
          onClick={() => setSelectedSellers(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}



      {/* Ads + Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-8xl mx-12 mb-10">
        {/* Left Ads Section */}
<div className="bg-[#292511] rounded-xl h-[400px] shadow-lg p-6 flex flex-col">
<ViewAdLeftBox/>

        </div>

        {/* Right Events Section */}
        <div className="bg-[#292511] rounded-xl shadow-lg p-6">
  <RightBoxVerifiedEvents
    setShowEventPopup={() => {
      setPaymentFor("event");
      setShowPaymentPopup(true);
    }}
  />
</div>

      </div>

      {/* 🔹 Payment Popup */}
      {showPaymentPopup && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-[90%] max-w-md text-center space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {paymentFor === "ad" ? "Post Ad Plan" : "Post Event Plan"}
            </h2>
            <p className="text-gray-600">Pay <b>$20</b> for 1 Month posting limit</p>

            <Elements stripe={stripePromise}>
              <PaymentForm onPaymentSuccess={handlePaymentSuccess} />
            </Elements>

            <button
              onClick={() => setShowPaymentPopup(false)}
              className="w-full mt-4 bg-gray-400 hover:bg-gray-500 text-white py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* 🔹 Post Ad Popup */}
      {showAdPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
          onClick={() => {
            setSlideIn(false);
            setTimeout(() => setShowAdPopup(false), 300);
          }}
        >
          <div
            className={`bg-white rounded-l-xl shadow-lg w-full max-w-md p-6 transform transition-transform duration-300 ease-out
              ${slideIn ? "translate-x-0 scale-100" : "translate-x-full scale-90"}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={() => {
                setSlideIn(false);
                setTimeout(() => setShowAdPopup(false), 300);
              }}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Post Your Ad</h2>
            <form onSubmit={handleAdSubmit} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setImage(file);
                  setPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm border rounded p-2"
              />
              {preview && (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <textarea
                placeholder="Write description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded-lg p-3"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-[#292511] text-white py-2 rounded-lg hover:bg-[#1f1b0d]"
              >
                Submit Ad
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 🔹 Post Event Popup */}
      {showEventPopup && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-end z-50"
          onClick={() => setShowEventPopup(false)}
        >
          <div
            className="bg-white rounded-l-xl shadow-lg w-full max-w-md p-6 transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowEventPopup(false)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Post Your Event</h2>
            <form onSubmit={handleEventSubmit} className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  setEventImage(file);
                  setEventPreview(URL.createObjectURL(file));
                }}
                className="block w-full text-sm border rounded p-2"
              />
              {eventPreview && (
                <img
                  src={eventPreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <input
                type="text"
                placeholder="Venue"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="w-full border rounded-lg p-3"
              />
              <textarea
                placeholder="Event Description..."
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                className="w-full border rounded-lg p-3"
                rows="4"
              />
              <button
                type="submit"
                className="w-full bg-[#292511] text-white py-2 rounded-lg hover:bg-[#1f1b0d]"
              >
                Submit Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
