import React, { useEffect, useRef, useState } from "react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Quality Workers",
      imgSrc:
        "https://media.istockphoto.com/id/533961779/photo/african-american-worker-in-print-shop-next-to-forklift.jpg?s=612x612&w=0&k=20&c=4MF0A_X0Uv-KaqlxdRNhtV4kc0fKBPg2Ywf1vyRcRfg=",
    },
    {
      title: "Fast Service",
      imgSrc:
        "https://www.teamais.net/wp-content/uploads/2020/07/driver-hire-min.jpg",
    },
    {
      title: "Easy Payments",
      imgSrc:
        "https://www.shutterstock.com/image-photo/portrait-positive-afro-american-guy-600nw-1749608429.jpg",
    },
  ];

  const cardRefs = useRef([]);
  cardRefs.current = [];

  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const [animatedCards, setAnimatedCards] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(entry.target);
            if (index !== -1 && !animatedCards.includes(index)) {
              setTimeout(() => {
                setAnimatedCards((prev) => [...prev, index]);
              }, 400 + index * 150);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      cardRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [animatedCards]);

  return (
    <div className="bg-gray-100 py-8">
      {/* Section Heading - Ribbon Style */}
      <div className="flex justify-center mb-6">
        <h2 className="text-3xl font-bold flex items-center gap-6">
          <span className="text-[#292511]">Our</span>
          <span className="relative inline-block px-4 py-1 bg-amber-400 text-[#292511]">
            Features
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

      {/* ✅ Full Width Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full px-4 md:px-8">
        {features.map((feature, idx) => (
          <div
            key={idx}
            ref={addToRefs}
            className={`flex flex-col bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 hover:scale-[1.02] hover:shadow-xl cursor-pointer
              opacity-0
              ${animatedCards.includes(idx) ? "animate-slideFadeUp opacity-100" : ""}
            `}
          >
            <div className="bg-[#292511] text-white text-center py-1 px-2 font-semibold text-base">
              {feature.title}
            </div>

            <div className="flex h-36">
              <div className="w-1/2">
                <img
                  src={feature.imgSrc}
                  alt={feature.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="w-1/2 flex items-center justify-center p-2 text-center">
                <p className="text-sm text-gray-600">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Our
                  service ensures the best experience.
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Custom Animation */}
      <style>{`
        @keyframes slideFadeUp {
          0% {
            opacity: 0;
            transform: translateY(30px) rotateZ(-3deg);
          }
          50% {
            transform: translateY(-6px) rotateZ(2deg);
          }
          100% {
            opacity: 1;
            transform: translateY(0) rotateZ(0);
          }
        }
        .animate-slideFadeUp {
          animation-name: slideFadeUp;
          animation-duration: 600ms;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
      `}</style>
    </div>
  );
};

export default FeaturesSection;
