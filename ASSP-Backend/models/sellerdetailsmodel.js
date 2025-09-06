// sellerdetailsmodel.js
const mongoose = require("mongoose");

// Sub-schemas
const educationSchema = new mongoose.Schema({
  degree: { type: String, required: true },
  university: { type: String, required: true },
});

const skillSchema = new mongoose.Schema({
  hobby: { type: String, required: true },
  skill: { type: String, required: true },
  experience: { type: String, required: true },
});

const adSchema = new mongoose.Schema({
  image: {
    url: String,
    public_id: String,
  },
  description: String,
});

const personalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String },
  profileImage: {
    url: String,
    public_id: String,
  },
});

// Main seller schema
const sellerDetailsSchema = new mongoose.Schema(
  {
    personal: { type: personalSchema, required: true },
    education: [educationSchema],
    skills: [skillSchema],
    about: { description: String },
    ads: [adSchema],
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Export the model with the requested name
module.exports =
  mongoose.models.SellerModelProfile ||
  mongoose.model("SellerModelProfile", sellerDetailsSchema);
