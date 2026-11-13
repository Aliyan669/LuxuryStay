require("dotenv").config();
const app = require("./app");
const connectDB = require("./config/db");

// database connect (local dev ke liye)
connectDB().catch((err) => {
  console.error("MongoDB connection error:", err.message);
  if (!process.env.VERCEL) process.exit(1);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on http://localhost:${PORT}`));
