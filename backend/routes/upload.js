const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { protect, staffOnly } = require("../middleware/auth");

const router = express.Router();

// Cloudinary tab use hota hai jab env vars set hon (Vercel / production)
const useCloudinary = !!(
  process.env.CLOUDINARY_URL ||
  (process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET)
);

let cloudinary = null;
if (useCloudinary) {
  cloudinary = require("cloudinary").v2;
  if (!process.env.CLOUDINARY_URL) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });
  }
}

const uploadsDir = path.join(__dirname, "..", "uploads");

// cloud hai to file memory me rakho, warna local disk pe
const storage = useCloudinary
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
        cb(null, uploadsDir);
      },
      filename: (req, file, cb) =>
        cb(null, "img-" + Date.now() + path.extname(file.originalname)),
    });

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// buffer ko Cloudinary pe bhejta hai
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "luxurystay" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

router.post("/", protect, staffOnly, upload.single("image"), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No image file received" });

  try {
    // production (Cloudinary)
    if (useCloudinary) {
      const result = await uploadToCloudinary(req.file.buffer);
      return res.json({ url: result.secure_url });
    }

    // Vercel pe local disk permanent nahi hota
    if (process.env.VERCEL) {
      return res.status(500).json({
        message:
          "Vercel pe image upload ke liye Cloudinary env vars set karo (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET).",
      });
    }

    // local dev
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message || "Upload failed" });
  }
});

module.exports = router;
