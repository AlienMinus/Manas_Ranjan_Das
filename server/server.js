// server/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, ".env") });
}

// Models
const Message = require("./models/Message");
const Hero = require("./models/Hero");
const About = require("./models/About");
const Skill = require("./models/Skill");
const Project = require("./models/Project");
const Experience = require("./models/Experience");
const ContactInfo = require("./models/ContactInfo");

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
    origin: [
      FRONTEND_ORIGIN,
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
    ],
    allowedHeaders: ["Content-Type", "x-admin-password"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

// ====== MongoDB Connection ======
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_v1";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Database"))
  .catch((err) =>
    console.error("❌ MongoDB connection error (Verify MONGODB_URI):", err.message)
  );

// ==========================================================================
// 📌 PUBLIC PORTFOLIO DATA ROUTES
// ==========================================================================

// Health Check
app.get("/health", (req, res) =>
  res.json({
    status: "OK",
    mongo: mongoose.connection.readyState,
    environment: process.env.NODE_ENV || "development",
  })
);

// 📦 Aggregated All Portfolio Data
app.get("/api/portfolio-data", async (req, res) => {
  try {
    const [hero, about, skills, projects, experience, contact] =
      await Promise.all([
        Hero.findOne().sort({ updatedAt: -1 }),
        About.findOne().sort({ updatedAt: -1 }),
        Skill.find().sort({ createdAt: 1 }),
        Project.find().sort({ order: 1, createdAt: -1 }),
        Experience.find().sort({ order: 1, createdAt: -1 }),
        ContactInfo.findOne().sort({ updatedAt: -1 }),
      ]);

    res.json({
      success: true,
      data: {
        hero,
        about,
        skills,
        projects,
        experience,
        contact,
      },
    });
  } catch (err) {
    console.error("Error fetching aggregated portfolio data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 👤 Hero Data
app.get("/api/hero", async (req, res) => {
  try {
    const hero = await Hero.findOne().sort({ updatedAt: -1 });
    res.json({ success: true, hero });
  } catch (err) {
    console.error("Error fetching hero data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 📖 About Data
app.get("/api/about", async (req, res) => {
  try {
    const about = await About.findOne().sort({ updatedAt: -1 });
    res.json({ success: true, about });
  } catch (err) {
    console.error("Error fetching about data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// ⚡ Skills Data
app.get("/api/skills", async (req, res) => {
  try {
    const skills = await Skill.find().sort({ createdAt: 1 });
    res.json({ success: true, skills });
  } catch (err) {
    console.error("Error fetching skills data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 🚀 Projects Data
app.get("/api/projects", async (req, res) => {
  try {
    const { category, featured, limit } = req.query;
    const query = {};

    if (featured === "true") {
      query.featured = true;
    }

    let projectQuery = Project.find(query).sort({ order: 1, createdAt: -1 });

    if (limit) {
      projectQuery = projectQuery.limit(parseInt(limit, 10));
    }

    const projects = await projectQuery.exec();
    res.json({ success: true, projects });
  } catch (err) {
    console.error("Error fetching projects data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 💼 Experience Data
app.get("/api/experience", async (req, res) => {
  try {
    const { limit } = req.query;
    let expQuery = Experience.find().sort({ order: 1, createdAt: -1 });

    if (limit) {
      expQuery = expQuery.limit(parseInt(limit, 10));
    }

    const experience = await expQuery.exec();
    res.json({ success: true, experience });
  } catch (err) {
    console.error("Error fetching experience data:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// 📞 Contact Info
app.get("/api/contact-info", async (req, res) => {
  try {
    const contact = await ContactInfo.findOne().sort({ updatedAt: -1 });
    res.json({ success: true, contact });
  } catch (err) {
    console.error("Error fetching contact info:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

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

// ==========================================================================
// 🔐 ADMIN & DATABASE MANAGEMENT ROUTES
// ==========================================================================

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

// 🗑️ Admin: Delete message
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

// ⚡ Admin: Reseed Database
app.post("/api/seed", async (req, res) => {
  const password = req.headers["x-admin-password"];

  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const seedDatabase = require("./scripts/seed");
    await seedDatabase();
    res.json({ success: true, message: "Database reseeded successfully" });
  } catch (err) {
    console.error("Error reseeding database:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Base Route
app.get("/", (req, res) =>
  res.send("Portfolio REST API (Express + MongoDB) is running 🚀")
);

app.listen(PORT, () =>
  console.log(`📡 Portfolio API Server running on port ${PORT} (Mode: MongoDB)`)
);
