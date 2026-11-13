require("dotenv").config();
const app = require("../app");
const connectDB = require("../config/db");

let dbPromise = null;
const ensureDb = () => {
  if (!dbPromise) {
    dbPromise = connectDB().catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

module.exports = async (req, res) => {
  try {
    await ensureDb();
  } catch (err) {
    console.error("DB connect failed:", err.message);
    return res.status(500).json({ message: "Database connection failed: " + err.message });
  }
  return app(req, res);
};
