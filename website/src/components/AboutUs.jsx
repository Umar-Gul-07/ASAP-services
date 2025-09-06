import React from "react";
import { motion } from "framer-motion";

const AboutUs = () => {
  const services = [
    {
      title: "Global Marketplace",
      description:
        "ASAP Services connects freelancers and clients across the world, enabling seamless access to services both online and offline.",
      imageUrl:
        "https://www.reginaldchan.net/wp-content/uploads/2021/02/Global-Market-For-Business.jpg",
    },
    {
      title: "Secure Payments",
      description:
        "Our trusted payment system ensures that all transactions are safe, fair, and transparent for both buyers and sellers.",
      imageUrl:
        "https://cdn.prod.website-files.com/627bcc3621084c83da56b474/64073555a29b620d9cf82315_secure-payments.jpg",
    },
    {
      title: "Real-Time Connections",
      description:
        "Instantly find and hire skilled professionals or list your services with powerful tools to connect and communicate on the go.",
      imageUrl:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Diverse Services",
      description:
        "From graphic design and IT support to legal consulting and local handyman jobs – ASAP Services covers it all.",
      imageUrl:
        "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "For Everyone",
      description:
        "Whether you're a freelancer, business, or just someone needing a quick job done — our platform is built to serve all needs.",
      imageUrl:
        "https://lh5.googleusercontent.com/proxy/yCS8I1Imn32mr0CWkWLOfr9VZVnVEp_Rmi398n8GE5mhrAexFNmBUCjwuIT4lldSZsKO7YPqHmrUhQ_nniFOQwCpa46ZqOB1zCICfNAvlYg94NOQ7baG8mBDEUZ5hVPILiPfMg738CsJEnsuIYbx6ZA",
    },
    {
      title: "Grow Your Business",
      description:
        "Reach new clients, showcase your work, and grow your brand – ASAP Services makes professional growth easy and accessible.",
      imageUrl: "https://smeda.org/images/joomlart/blog/business%20grow.jpg",
    },
  ];

  return (
    <div className="bg-gray-100 py-10 w-full px-4 md:px-8">
      {/* Section Heading - Ribbon Style */}
      <div className="flex justify-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-6">
          <span className="relative inline-block px-5 py-2 bg-[#292511] text-white">
            About Us
            {/* Left angled cut */}
            <span className="absolute left-[-18px] top-0 w-0 h-0 
              border-t-[32px] border-t-transparent 
              border-r-[18px] border-r-amber-400 
              border-b-[32px] border-b-transparent"></span>
            {/* Right angled cut */}
            <span className="absolute right-[-18px] top-0 w-0 h-0 
              border-t-[32px] border-t-transparent 
              border-l-[18px] border-l-amber-400 
              border-b-[32px] border-b-transparent"></span>
          </span>
        </h2>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {services.map((service, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40, scale: 0.9, rotateZ: -2 }}
            whileInView={{ opacity: 1, y: 0, scale: 1, rotateZ: 0 }}
            transition={{ duration: 0.7, delay: idx * 0.2, ease: "easeOut" }}
            viewport={{ once: true, amount: 0.3 }}
            className="flex flex-col bg-white rounded-xl shadow-md overflow-hidden transform hover:scale-[1.02] hover:shadow-xl cursor-pointer"
          >
            {/* Heading inside a box */}
            <div className="bg-[#292511] text-white text-center py-2 px-3 font-semibold text-base">
              {service.title}
            </div>

            {/* Image + Text side by side */}
            <div className="flex h-44">
              <div className="w-1/2">
                <img
                  src={service.imageUrl}
                  alt={service.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="w-1/2 flex items-center justify-center p-2 text-center">
                <p className="text-sm text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AboutUs;
