const express = require("express");
const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Room = require("../models/Room");
const Invoice = require("../models/Invoice");
const Setting = require("../models/Setting");
const Notification = require("../models/Notification");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

const countNights = (a, b) => {
  const nights = Math.ceil((new Date(b) - new Date(a)) / (1000 * 60 * 60 * 24));
  return nights > 0 ? nights : 1;
};

router.get("/my", protect, async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate("room")
    .sort({ createdAt: -1 });
  res.json(bookings);
});

router.get("/", protect, staffOnly, async (req, res) => {
  const bookings = await Booking.find().populate("room").populate("user", "name email").sort({ createdAt: -1 });
  res.json(bookings);
});

router.get("/check", async (req, res) => {
  const { room, from, to } = req.query;
  const clash = await Booking.find({
    room,
    status: { $in: ["booked", "checked-in"] },
    checkIn: { $lt: new Date(to) },
    checkOut: { $gt: new Date(from) },
  });
  res.json({ available: clash.length === 0 });
});

router.post("/", protect, async (req, res) => {
  try {
    const { room, checkIn, checkOut, guests, notes } = req.body;

    const foundRoom = await Room.findById(room);
    if (!foundRoom) return res.status(404).json({ message: "Room not found" });
    if (foundRoom.status === "maintenance") return res.status(400).json({ message: "Room is under maintenance" });

    const clash = await Booking.find({
      room,
      status: { $in: ["booked", "checked-in"] },
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
    });
    if (clash.length > 0) return res.status(400).json({ message: "Room is not available for these dates" });

    const total = foundRoom.price * countNights(checkIn, checkOut);
    const booking = await Booking.create({
      user: req.user._id,
      room,
      checkIn,
      checkOut,
      guests,
      notes,
      totalAmount: total,
    });

    await Notification.create({
      message: `New booking: Room ${foundRoom.roomNumber} from ${new Date(checkIn).toDateString()} to ${new Date(checkOut).toDateString()}`,
      forRole: "staff",
    });

    const full = await Booking.findById(booking._id).populate("room");
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/checkin", protect, staffOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "booked") return res.status(400).json({ message: "Only booked rooms can be checked in" });

    booking.status = "checked-in";
    await booking.save();
    await Room.findByIdAndUpdate(booking.room._id, { status: "occupied" });

    const setting = await Setting.findOne();
    await Invoice.create({
      booking: booking._id,
      user: booking.user,
      room: booking.room._id,
      items: [{ item: `Room ${booking.room.roomNumber} charges`, amount: booking.totalAmount }],
      subTotal: booking.totalAmount,
      taxPercent: setting ? setting.taxPercent : 5,
      taxAmount: (booking.totalAmount * (setting ? setting.taxPercent : 5)) / 100,
      grandTotal: booking.totalAmount + (booking.totalAmount * (setting ? setting.taxPercent : 5)) / 100,
    });

    await Notification.create({ message: `Check-in done for Room ${booking.room.roomNumber}`, forRole: "staff" });
    res.json({ message: "Checked in successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/checkout", protect, staffOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room");
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.status !== "checked-in") return res.status(400).json({ message: "Guest is not checked in" });

    booking.status = "checked-out";
    await booking.save();

    await Room.findByIdAndUpdate(booking.room._id, { status: "cleaning" });
    await Notification.create({ message: `Check-out done. Room ${booking.room.roomNumber} needs cleaning`, forRole: "staff" });
    res.json({ message: "Checked out successfully", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (req.user.role === "guest" && booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not allowed" });
    }
    if (booking.status !== "booked") return res.status(400).json({ message: "Only booked rooms can be cancelled" });

    booking.status = "cancelled";
    await booking.save();
    res.json({ message: "Booking cancelled", booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const { room, checkIn, checkOut, guests, status, notes } = req.body;
    if (room) booking.room = room;
    if (checkIn) booking.checkIn = checkIn;
    if (checkOut) booking.checkOut = checkOut;
    if (guests) booking.guests = guests;
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    const roomDoc = await Room.findById(booking.room);
    if (roomDoc) {
      booking.totalAmount = roomDoc.price * countNights(booking.checkIn, booking.checkOut);
    }

    await booking.save();
    const full = await Booking.findById(booking._id)
      .populate("room")
      .populate("user", "name email");
    res.json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, staffOnly, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
