export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
      keyframes: {
        movel: {
          from: { left: "65%" },
          to: { left: "0" },
        },
        mover: {
          from: { left: "0" },
          to: { left: "65%" },
        },
        slideLeft: {
          from: { marginLeft: "100%", width: "100%" },
          to: { marginLeft: "0%", width: "100%" },
        },
        slideLeft2: {
          from: { left: "100%" },
          to: { left: "50%" },
        },
        slideRight: {
          from: { marginLeft: "0%", width: "100%" },
          to: { marginLeft: "100%", width: "100%" },
        },
        slideRight2: {
          from: { left: "50%" },
          to: { left: "100%" },
        },

        // Add this fadeInScale animation:
        fadeInScale: {
          "0%": { opacity: 0, transform: "scale(0.95)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        movel: "movel 1.2s ease-in-out forwards",
        mover: "mover 1.2s ease-in-out forwards",
        "slide-left": "slideLeft 0.9s ease-in-out forwards",
        "slide-left2": "slideLeft2 0.4s ease-in-out forwards",
        "slide-right": "slideRight 0.9s ease-in-out forwards",
        "slide-right2": "slideRight2 0.4s ease-in-out forwards",

        // Add this line:
        fadeInScale: "fadeInScale 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
