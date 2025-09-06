const mongoose = require("mongoose");

const sellerSchema = new mongoose.Schema({
  image: { type: String, default: "" },
  Name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  experience: { type: String },
  zipCode: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  subproduct: { type: mongoose.Schema.Types.ObjectId, ref: "Subproduct", required: true },
  details: { type: String },
  userType: { type: String, default: "SELLER" },
  isActive: { type: Boolean, default: true },
  country: { type: String, required: true },
  city: { type: String, required: true },
  documentationURL: { type: String },
  demoURL: { type: String },
  isDeleted: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now },
heardFrom: { 
  type: String, 
  enum: ["Facebook", "Instagram", "YouTube", "TikTok", "Influencers", "Other"], 
  default: "Other" 
},
referenceName: { type: String, default: "" }, 
  // ✅ Reset password tokens
  resetTokens: [
    {
      token: { type: String },
      expires: { type: Date },
    },
  ],
});

const Seller = mongoose.model("Seller", sellerSchema);

module.exports = Seller;
