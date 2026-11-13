const express = require("express");
const Room = require("../models/Room");
const Booking = require("../models/Booking");
const Invoice = require("../models/Invoice");
const Feedback = require("../models/Feedback");
const User = require("../models/User");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/dashboard", protect, staffOnly, async (req, res) => {
  try {
    const [rooms, bookings, invoices, users, feedback] = await Promise.all([
      Room.find(),
      Booking.find({ status: { $in: ["booked", "checked-in", "checked-out"] } }),
      Invoice.find(),
      User.find({ role: "guest" }),
      Feedback.find(),
    ]);

    const totalRevenue = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.grandTotal, 0);
    const pendingRevenue = invoices.filter((i) => i.status === "unpaid").reduce((s, i) => s + i.grandTotal, 0);
    const occupied = rooms.filter((r) => r.status === "occupied").length;

    const week = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const next = new Date(day);
      next.setDate(next.getDate() + 1);
      const count = bookings.filter((b) => b.createdAt >= day && b.createdAt < next).length;
      week.push({ day: day.toLocaleDateString("en", { weekday: "short" }), count });
    }

    res.json({
      totalRooms: rooms.length,
      available: rooms.filter((r) => r.status === "available").length,
      occupied,
      cleaning: rooms.filter((r) => r.status === "cleaning").length,
      maintenance: rooms.filter((r) => r.status === "maintenance").length,
      occupancyRate: rooms.length ? Math.round((occupied / rooms.length) * 100) : 0,
      totalBookings: bookings.length,
      activeBookings: bookings.filter((b) => b.status === "checked-in").length,
      totalRevenue,
      pendingRevenue,
      guests: users.length,
      avgRating: feedback.length
        ? (feedback.reduce((s, f) => s + f.rating, 0) / feedback.length).toFixed(1)
        : "No ratings yet",
      week,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
