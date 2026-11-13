const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// uploads folder sirf local pe banate hain (Vercel pe filesystem read-only hota hai)
const uploadsDir = path.join(__dirname, "uploads");
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// middleware
app.use(cors());
app.use(express.json());

// local uploads (production me Cloudinary use hota hai)
app.use("/uploads", express.static(uploadsDir));

// basic logger (helps in monitoring / debugging)
app.use((req, res, next) => {
  console.log(`${new Date().toLocaleTimeString()} -> ${req.method} ${req.url}`);
  next();
});

// routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/rooms", require("./routes/rooms"));
app.use("/api/bookings", require("./routes/bookings"));
app.use("/api/invoices", require("./routes/invoices"));
app.use("/api/housekeeping", require("./routes/housekeeping"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/services", require("./routes/services"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/settings", require("./routes/settings"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/upload", require("./routes/upload"));

// health check
app.get("/", (req, res) => {
  res.send("LuxuryStay HMS API is running...");
});

// common error handler (upload errors ke liye bhi)
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ message: err.message || "Server error" });
});

module.exports = app;
