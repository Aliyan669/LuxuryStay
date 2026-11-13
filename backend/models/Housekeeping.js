const mongoose = require("mongoose");

const housekeepingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    task: { type: String, required: true, trim: true }, // e.g. "Deep cleaning", "Bathroom cleaning"
    status: { type: String, enum: ["pending", "in-progress", "completed"], default: "pending" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    issue: { type: String, default: "" }, 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Housekeeping", housekeepingSchema);
