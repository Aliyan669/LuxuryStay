const express = require("express");
const mongoose = require("mongoose");
const Invoice = require("../models/Invoice");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/my", protect, async (req, res) => {
  const invoices = await Invoice.find({ user: req.user._id })
    .populate("room", "roomNumber type")
    .sort({ createdAt: -1 });
  res.json(invoices);
});

router.get("/", protect, staffOnly, async (req, res) => {
  const invoices = await Invoice.find()
    .populate("room", "roomNumber type")
    .populate("user", "name email")
    .sort({ createdAt: -1 });
  res.json(invoices);
});

router.get("/:id", protect, async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate("room")
    .populate("user", "name email phone")
    .populate("booking");
  if (!invoice) return res.status(404).json({ message: "Invoice not found" });

  if (req.user.role === "guest" && invoice.user._id.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }
  res.json(invoice);
});

router.put("/:id", protect, staffOnly, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ message: "Invoice not found" });

    if (req.body.item && req.body.amount) {
      invoice.items.push({ item: req.body.item, amount: Number(req.body.amount) });
    }
    if (req.body.status) invoice.status = req.body.status;

    invoice.subTotal = invoice.items.reduce((sum, i) => sum + i.amount, 0);
    invoice.taxAmount = (invoice.subTotal * invoice.taxPercent) / 100;
    invoice.grandTotal = invoice.subTotal + invoice.taxAmount;

    await invoice.save();
    const full = await Invoice.findById(invoice._id).populate("room", "roomNumber type").populate("user", "name email");
    res.json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
