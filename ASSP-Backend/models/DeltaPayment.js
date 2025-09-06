// models/DeltaPayment.js
const mongoose = require("mongoose");

const DeltaPaymentSchema = new mongoose.Schema({
  sessionId: { type: String, required: true },       // Stripe Checkout session ID
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Link to user
  email: { type: String, required: true },           // User email
  amount: { type: Number, required: true },          // Amount in cents
  currency: { type: String, default: "usd" },        // Currency code
  status: { 
    type: String, 
    enum: ["pending", "completed", "failed"], 
    default: "pending" 
  },                                                 // Payment status
  paymentMethod: { type: String },                  // e.g., card
  dateAdded: { type: Date, default: Date.now },     // Timestamp
});

const DeltaPayment = mongoose.model("DeltaPayment", DeltaPaymentSchema);

module.exports = DeltaPayment;
