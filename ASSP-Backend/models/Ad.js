const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
  message: { type: String, default: "" },
}, { timestamps: true }); // adds createdAt and updatedAt automatically


module.exports = mongoose.model("Ad", adSchema);
