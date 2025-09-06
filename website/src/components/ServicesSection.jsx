import React, { forwardRef, useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import SellerDetailCard from "./SellerDetailCard";

const ServicesSection = forwardRef((props, ref) => {
  const {
    services = [],
    selectedService,
    onExploreClick,
    subproducts = [],
    onBackToProducts,
    categories = [],
    onCategoryClick,
    loading,
    onBackToCategories,
  } = props;

  const [selectedSellerProfile, setSelectedSellerProfile] = useState(null);
  const [providers, setProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);

  const [selectedSellers, setSelectedSellers] = useState(null);
  const [viewingDetailsFor, setViewingDetailsFor] = useState(null);
  const [loadingSellers, setLoadingSellers] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 12;

  const showSubproductsOnly = subproducts.length > 0;
  const noCategorySelected = !selectedService && !showSubproductsOnly;

  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      try {
        const res = await fetch("https://asap-nine-pi.vercel.app/bookings");
        const data = await res.json();
        setProviders(data);
      } catch (err) {
        console.error("Error fetching providers:", err);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, []);
const handleViewDetails = async (subproduct) => {
  setLoadingSellers(true);
  try {
    const sellerId = localStorage.getItem("sellerId");
    if (!sellerId) {
      alert("Seller ID not found in localStorage.");
      setLoadingSellers(false);
      return;
    }

    const res = await fetch(
      `https://asap-nine-pi.vercel.app/api/services?sellerId=${sellerId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // if your API requires token
        },
      }
    );

    const data = await res.json();
    console.log("All services:", data);

    if (!Array.isArray(data)) {
      alert(data.message || "Failed to fetch services.");
      setSelectedSellers([]);
      setViewingDetailsFor(subproduct);
      setLoadingSellers(false);
      return;
    }

    const filteredServices = data.filter((service) => {
  const serviceSubId = service.subProduct?._id || service.subProduct;
  return String(serviceSubId) === String(subproduct._id) && service.isVerified;
});


    setSelectedSellers(filteredServices);
    setViewingDetailsFor(subproduct);
  } catch (err) {
    console.error("Error fetching services:", err);
    alert("Failed to fetch services. Try again later.");
  } finally {
    setLoadingSellers(false);
  }
};


  const paginate = (data) => {
    const start = (currentPage - 1) * cardsPerPage;
    return data.slice(start, start + cardsPerPage);
  };

  const totalPages = noCategorySelected
    ? Math.ceil(categories.length / cardsPerPage)
    : selectedService && !showSubproductsOnly
    ? Math.ceil(services.length / cardsPerPage)
    : showSubproductsOnly && !selectedSellers
    ? Math.ceil(subproducts.length / cardsPerPage)
    : selectedSellers
    ? Math.ceil(selectedSellers.length / cardsPerPage)
    : 1;

const handleCheckoutInfo = async (sellerId) => {
    try {
      const res = await fetch(
        `https://asap-nine-pi.vercel.app/api/sellerdetailsprofile/${sellerId}`
      );
      const data = await res.json();
      setSelectedSellerProfile(data);
    } catch (err) {
      console.error("Error fetching seller profile:", err);
      alert("Failed to fetch seller profile.");
    }
  };

  if (loading || loadingProviders) {
    return (
      <div className="text-center py-20">

        <div className="animate-spin h-10 w-10 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-purple-600 font-semibold">Loading...</p>
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="bg-gray-100 py-10 transition-opacity duration-500 ease-in-out opacity-100"
    >
      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-6">
          <span className="text-[#292511]">Our</span>
          <span className="relative inline-block px-4 py-1 bg-amber-400 text-[#292511]">
            Services
            <span className="absolute left-[-16px] top-0 w-0 h-0 
              border-t-[28px] border-t-transparent 
              border-r-[16px] border-r-[#292511] 
              border-b-[28px] border-b-transparent"></span>
            <span className="absolute right-[-16px] top-0 w-0 h-0 
              border-t-[28px] border-t-transparent 
              border-l-[16px] border-l-[#292511] 
              border-b-[28px] border-b-transparent"></span>
          </span>
        </h2>
      </div>
      {/* Categories */}
      {noCategorySelected && (
        <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
          {paginate(categories).map((cat) => (
            <ServiceCard
              key={cat._id}
              title={cat.Title}
              image={cat.image}
              onExplore={() => onCategoryClick(cat._id, cat.Title)}
            />
          ))}
        </div>
      )}

      {/* Products */}
      {selectedService && !showSubproductsOnly && (
        <>
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {paginate(services).map((service) => (
              <div
                key={service._id}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name || service.Title || "Service"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-base font-semibold">
                    {service.name || service.Title}
                  </h4>
                </div>
                <div className="flex justify-center pb-3">
                  <button
                    onClick={() =>
                      onExploreClick(service._id, service.category)
                    }
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-1.5 rounded-full shadow-md hover:scale-105 transition"
                  >
                    Explore
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={onBackToCategories}
              className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              ← Back to Categories
            </button>
          </div>
        </>
      )}

      {/* Subproducts */}
      {showSubproductsOnly && !selectedSellers && (
        <>
          <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
            {paginate(subproducts).map((sub) => (
              <div
                key={sub._id}
                className="group relative bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="h-36 w-full overflow-hidden">
                  <img
                    src={sub.image}
                    alt={sub.name || "Subproduct"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-3 text-center">
                  <h4 className="text-base font-semibold">{sub.name}</h4>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {sub.description}
                  </p>
                </div>
                <div className="flex justify-center pb-3">
                  <button
                    onClick={() => handleViewDetails(sub)}
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <button
              onClick={onBackToProducts}
              className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              ← Back to Products
            </button>
          </div>
        </>
      )}

      {/* Sellers */}
   {/* Sellers */}
{loadingSellers ? (
  <div className="text-center py-10">
    <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
    <p className="text-blue-500 font-semibold">Loading seller details...</p>
  </div>
) : selectedSellers && viewingDetailsFor ? (
  <>
    <h3 className="text-2xl font-bold mb-6 text-center">
      {viewingDetailsFor.name}
    </h3>

    {selectedSellers.length > 0 ? (
      <>
        {/* Sellers grid */}
        <div className="container mx-auto flex flex-wrap gap-4 px-4">
          {paginate(selectedSellers).map((service, index) => (
            <div
              className="w-full sm:w-1/2 lg:w-1/4"
              key={`${service._id}-${index}`} // unique key
            >
              <SellerDetailCard
                seller={service}
                onCheckoutInfo={() =>
                  handleCheckoutInfo(service.sellerId || service._id)
                }
              />
            </div>
          ))}
        </div>

        {/* Pagination controls */}
        {Math.ceil(selectedSellers.length / cardsPerPage) > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            {[...Array(Math.ceil(selectedSellers.length / cardsPerPage))].map(
              (_, i) => (
                <button
                  key={i}
                  className={`px-4 py-2 rounded ${
                    currentPage === i + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              )
            )}
            <button
              className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === Math.ceil(selectedSellers.length / cardsPerPage)}
            >
              Next
            </button>
          </div>
        )}
      </>
    ) : (
      <p className="text-center text-gray-600">
        No verified sellers available for this subproduct.
      </p>
    )}

    {/* Back button */}
    <div className="text-center mt-6">
      <button
        onClick={() => setSelectedSellers(null)}
        className="px-5 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        ← Back to Subproducts
      </button>
    </div>
  </>
) : null}


      {/* Seller Profile Modal */}
      {selectedSellerProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden relative">
            <button
              onClick={() => setSelectedSellerProfile(null)}
              className="absolute top-4 right-4 text-gray-600 hover:text-red-500 text-2xl font-bold"
            >
              &times;
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3">
              {/* Left - Image */}
              <div className="bg-gray-100 flex flex-col items-center justify-center p-6">
                <img
                  src={
                    selectedSellerProfile.personal?.image ||
                    "/default-avatar.png"
                  }
                  alt={selectedSellerProfile.personal?.name}
                  className="w-40 h-40 object-cover rounded-full shadow-lg border-4 border-white"
                />
                <h2 className="mt-4 text-xl font-bold text-gray-800">
                  {selectedSellerProfile.personal?.name}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedSellerProfile.personal?.email}
                </p>
                {selectedSellerProfile.isVerified && (
                  <span className="mt-2 inline-block bg-green-100 text-green-700 px-3 py-1 text-xs rounded-full">
                    ✅ Verified Seller
                  </span>
                )}
              </div>

              {/* Right - Details */}
              <div className="col-span-2 p-6">
                <h3 className="text-lg font-semibold mb-2 text-gray-700">
                  Personal Information
                </h3>
                <p>
                  <strong>Phone:</strong>{" "}
                  {selectedSellerProfile.personal?.phone || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>{" "}
                  {selectedSellerProfile.personal?.address || "N/A"}
                </p>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
                  Experience
                </h3>
                <p>{selectedSellerProfile.experience || "Not provided"}</p>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
                  Education
                </h3>
                <p>{selectedSellerProfile.education || "Not provided"}</p>

                <h3 className="text-lg font-semibold mt-4 mb-2 text-gray-700">
                  Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedSellerProfile.skills?.length > 0 ? (
                    selectedSellerProfile.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p>No skills listed</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p - 1)}
            disabled={currentPage === 1}
          >
            Prev
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
});

export default ServicesSection;
