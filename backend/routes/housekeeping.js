const express = require("express");
const Housekeeping = require("../models/Housekeeping");
const Room = require("../models/Room");
const Notification = require("../models/Notification");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", protect, staffOnly, async (req, res) => {
  const tasks = await Housekeeping.find().populate("room", "roomNumber type").sort({ createdAt: -1 });
  res.json(tasks);
});

router.post("/", protect, staffOnly, async (req, res) => {
  try {
    const task = await Housekeeping.create(req.body);
    const full = await Housekeeping.findById(task._id).populate("room", "roomNumber type");
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    const task = await Housekeeping.findById(req.params.id).populate("room");
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.body.status) task.status = req.body.status;
    if (req.body.assignedTo !== undefined) task.assignedTo = req.body.assignedTo || task.assignedTo;
    if (req.body.issue !== undefined) task.issue = req.body.issue;
    await task.save();

    if (task.status === "completed" && task.room) {
      await Room.findByIdAndUpdate(task.room._id, { status: "available" });
    } else if (task.status === "in-progress" && task.room) {
      await Room.findByIdAndUpdate(task.room._id, { status: "cleaning" });
    }

    await Notification.create({ message: `Housekeeping task "${task.task}" -> ${task.status}`, forRole: "staff" });
    const full = await Housekeeping.findById(task._id).populate("room", "roomNumber type");
    res.json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, staffOnly, async (req, res) => {
  try {
    const task = await Housekeeping.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    await task.deleteOne();
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
