// server/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}


const app = express();
const PORT = process.env.PORT || 5000;

// SECURITY
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Minus$ecureAdmin1THz";

// FRONTEND ORIGIN FOR CORS
const FRONTEND_ORIGIN =
  process.env.FRONTEND_ORIGIN || "https://manas-ranjan-das.vercel.app";

// ====== MIDDLEWARE ======
app.use(
  cors({
    origin: [FRONTEND_ORIGIN, "http://localhost:5173"],
    allowedHeaders: ["Content-Type", "x-admin-password"],
    methods: ["GET", "POST", "DELETE"],
  })
);

app.use(express.json());

// ====== MongoDB Connection ======
const MONGODB_URI = process.env.MONGODB_URI;

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ====== Mongo Schema ======
const MessageSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    message: String,
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", MessageSchema);

// =========================
// 📌 ROUTES
// =========================

// Health Check
app.get("/health", (req, res) =>
  res.json({
    status: "OK",
    mongo: mongoose.connection.readyState,
    environment: process.env.NODE_ENV || "development",
  })
);

// 📩 Save contact form message
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ success: false, error: "Missing required fields" });
    }

    const saved = await Message.create({ name, email, message });

    res.json({ success: true, id: saved._id, createdAt: saved.createdAt });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🔐 Admin: Get all messages
app.get("/api/admin/messages", async (req, res) => {
  const password = req.headers["x-admin-password"];

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🗑️ Delete message
app.delete("/api/admin/messages/:id", async (req, res) => {
  const password = req.headers["x-admin-password"];

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, deleted: !!deleted });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// Base Route
app.get("/", (req, res) =>
  res.send("Portfolio Contact API (MongoDB) is running 🚀")
);

app.listen(PORT, () =>
  console.log(`📡 Server running on port ${PORT} (Mode: MongoDB)`)
);
