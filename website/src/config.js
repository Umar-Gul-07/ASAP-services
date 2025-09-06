// src/config.js
const backendUrl =
  process.env.NODE_ENV === "production"
    ? "https://asap-nine-pi.vercel.app/api/post"
    : "http://localhost:8000/api/post";

export default backendUrl;
