const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    items: [
      {
        item: { type: String, required: true },
        amount: { type: Number, required: true },
      },
    ],
    subTotal: { type: Number, default: 0 },
    taxPercent: { type: Number, default: 5 },
    taxAmount: { type: Number, default: 0 },
    grandTotal: { type: Number, default: 0 },
    status: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
