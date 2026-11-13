const mongoose = require("mongoose");

const settingSchema = new mongoose.Schema({
  hotelName: { type: String, default: "LuxuryStay Hospitality" },
  taxPercent: { type: Number, default: 5 },
  currency: { type: String, default: "Rs" },
  checkInTime: { type: String, default: "12:00 PM" },
  checkOutTime: { type: String, default: "11:00 AM" },
  cancellationPolicy: { type: String, default: "Free cancellation up to 24 hours before check-in." },
  logoUrl: { type: String, default: "" },
  faviconUrl: { type: String, default: "" },
});

module.exports = mongoose.model("Setting", settingSchema);
