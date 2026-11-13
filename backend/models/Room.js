const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, unique: true, trim: true },
    type: {
      type: String,
      enum: ["Standard", "Deluxe", "Executive", "Suite", "Presidential"],
      required: true,
    },
    price: { type: Number, required: true },
    capacity: { type: Number, required: true, default: 2 },
    amenities: [{ type: String }],
    image: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: String, enum: ["available", "occupied", "cleaning", "maintenance"], default: "available" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
