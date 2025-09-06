const mongoose = require("mongoose");

const sellerRatingSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, required: true }
});

module.exports = mongoose.model("SellerRating", sellerRatingSchema);
