import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceGrid = ({ services, onExplore }) => {
  const serviceArray = Array.isArray(services)
    ? services
    : services?.products || [];

  if (!Array.isArray(serviceArray)) {
    console.error("Unexpected API response:", services);
    return (
      <p className="text-center text-red-500">
        Failed to load services. Please try again.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 px-4">
      {serviceArray.map((service, index) => (
        <ServiceCard
          key={index}
          title={service.name || "Untitled Service"}
          image={service.image || "/placeholder.jpg"}
          onExplore={() => onExplore(service)}
        />
      ))}
    </div>
  );
};

export default ServiceGrid;
