const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    image: { type: String, required: false },
    startDate: { type: Date, required: true },   // new field
    endDate: { type: Date, required: true },     // new field
    time: { type: String, required: true },
    venue: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["pending", "verified", "rejected"], default: "pending" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
