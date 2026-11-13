const express = require("express");
const Setting = require("../models/Setting");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  let setting = await Setting.findOne();
  if (!setting) setting = await Setting.create({});
  res.json(setting);
});

router.put("/", protect, adminOnly, async (req, res) => {
  try {
    let setting = await Setting.findOne();
    if (!setting) setting = await Setting.create({});
    setting = await Setting.findByIdAndUpdate(setting._id, req.body, { new: true });
    res.json(setting);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
