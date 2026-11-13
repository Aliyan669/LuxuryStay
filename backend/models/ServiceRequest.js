const mongoose = require("mongoose");

const serviceRequestSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    type: { type: String, required: true },
    details: { type: String, default: "" },
    status: { type: String, enum: ["pending", "approved", "completed", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ServiceRequest", serviceRequestSchema);
