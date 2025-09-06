import React from "react";

const ServiceCard = ({ title, image, onExplore }) => {
  return (
    <div
      className="group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-2 hover:rotate-1 hover:shadow-2xl hover:scale-105 hover:cursor-pointer perspective"
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* Service Image */}
      <div className="h-48 w-full overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Service Title */}
      <div className="p-4 text-center">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>

      {/* Explore Button */}
      <div className="flex justify-center pb-4">
        <button
          onClick={onExplore}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg"
        >
          Explore
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
