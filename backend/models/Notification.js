const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    message: { type: String, required: true },
    forRole: { type: String, enum: ["all", "admin", "staff", "guest"], default: "all" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, 
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
