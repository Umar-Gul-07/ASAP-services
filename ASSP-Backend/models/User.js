const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  Name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  address: { type: String },
  zipCode: { type: String },
  country: { type: String, required: true },
  city: { type: String, required: true },
  heardFrom: { 
    type: String, 
    enum: ["Facebook", "Instagram", "YouTube", "TikTok", "Influencers", "Other"],
    default: "Other"
  },
  referenceName: { type: String, default: "" }, 
  image: { type: String, default: "" },
  userType: { type: String, default: "USER" },
  isDeleted: { type: Boolean, default: false },
  isPaid: { type: Boolean, default: false },
  dateAdded: { type: Date, default: Date.now },
  resetTokens: [
    {
      token: { type: String },
      expires: { type: Date },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
