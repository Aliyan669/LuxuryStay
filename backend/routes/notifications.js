const express = require("express");
const Notification = require("../models/Notification");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const list = await Notification.find({
    $or: [{ forRole: "all" }, { forRole: req.user.role }, { user: req.user._id }],
  })
    .sort({ createdAt: -1 })
    .limit(30);
  res.json(list);
});

router.post("/", protect, async (req, res) => {
  try {
    const note = await Notification.create(req.body);
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/read", protect, async (req, res) => {
  await Notification.updateMany({ isRead: false }, { isRead: true });
  res.json({ message: "All marked as read" });
});

module.exports = router;
