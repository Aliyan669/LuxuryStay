const express = require("express");
const ServiceRequest = require("../models/ServiceRequest");
const Notification = require("../models/Notification");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/my", protect, async (req, res) => {
  const list = await ServiceRequest.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
});

router.get("/", protect, staffOnly, async (req, res) => {
  const list = await ServiceRequest.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(list);
});

router.post("/", protect, async (req, res) => {
  try {
    const { type, details, booking } = req.body;
    const request = await ServiceRequest.create({ user: req.user._id, type, details, booking });
    await Notification.create({ message: `New service request: ${type}`, forRole: "staff" });
    res.status(201).json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    const request = await ServiceRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    if (!request) return res.status(404).json({ message: "Request not found" });
    res.json(request);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
