const express = require("express");
const Feedback = require("../models/Feedback");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, staffOnly, async (req, res) => {
  const feedback = await Feedback.find().populate("user", "name email").sort({ createdAt: -1 });
  res.json(feedback);
});

router.post("/", protect, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) return res.status(400).json({ message: "Rating must be 1-5" });
    const fb = await Feedback.create({ user: req.user._id, rating, comment });
    const full = await Feedback.findById(fb._id).populate("user", "name email");
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, staffOnly, async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
