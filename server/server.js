// server/server.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

// Load .env from server directory or root directory
const serverEnv = path.join(__dirname, ".env");
const rootEnv = path.join(__dirname, "../.env");
if (fs.existsSync(serverEnv)) {
  require("dotenv").config({ path: serverEnv });
} else if (fs.existsSync(rootEnv)) {
  require("dotenv").config({ path: rootEnv });
} else {
  require("dotenv").config();
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
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

app.use(express.json({ limit: "10mb" }));

// ====== MongoDB Connection ======
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_v1";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB Database successfully"))
  .catch((err) =>
    console.error("❌ MongoDB connection error (Check MONGODB_URI):", err.message)
  );

// Helper middleware for Admin Auth
function requireAdmin(req, res, next) {
  const password = req.headers["x-admin-password"];
  if (!password || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: "Unauthorized: Invalid Admin Password" });
  }
  next();
}

// ==========================================================================
// 🏥 HEALTH & SYSTEM DIAGNOSTIC ROUTES
// ==========================================================================

const getHealthStatus = async (req, res) => {
  const stateMap = {
    0: "disconnected",
    1: "connected",
    2: "connecting",
    3: "disconnecting",
  };

  const state = mongoose.connection.readyState;
  const isConnected = state === 1;

  let counts = {};
  if (isConnected) {
    try {
      const [heroCount, aboutCount, skillCount, projectCount, expCount, contactCount, messageCount] =
        await Promise.all([
          Hero.countDocuments(),
          About.countDocuments(),
          Skill.countDocuments(),
          Project.countDocuments(),
          Experience.countDocuments(),
          ContactInfo.countDocuments(),
          Message.countDocuments(),
        ]);
      counts = {
        hero: heroCount,
        about: aboutCount,
        skills: skillCount,
        projects: projectCount,
        experience: expCount,
        contact: contactCount,
        messages: messageCount,
      };
    } catch {
      // ignore
    }
  }

  res.json({
    status: isConnected ? "OK" : "DEGRADED",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
    mongo: {
      state,
      status: stateMap[state] || "unknown",
      connected: isConnected,
      host: mongoose.connection.host || "unknown",
      name: mongoose.connection.name || "portfolio",
    },
    collections: counts,
  });
};

app.get("/health", getHealthStatus);
app.get("/api/health", getHealthStatus);

// ==========================================================================
// 📌 PUBLIC PORTFOLIO DATA ROUTES
// ==========================================================================

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
// 🔐 ADMIN CRUD ROUTES (PROTECTED)
// ==========================================================================

// --- Hero CRUD ---
app.put("/api/admin/hero", requireAdmin, async (req, res) => {
  try {
    const { name, roles, location, heroTagline, socialLinks } = req.body;
    let hero = await Hero.findOne();
    if (hero) {
      hero.name = name;
      hero.roles = roles;
      hero.location = location;
      hero.heroTagline = heroTagline;
      hero.socialLinks = socialLinks;
      await hero.save();
    } else {
      hero = await Hero.create({ name, roles, location, heroTagline, socialLinks });
    }
    res.json({ success: true, hero });
  } catch (err) {
    console.error("Error updating hero:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- About CRUD ---
app.put("/api/admin/about", requireAdmin, async (req, res) => {
  try {
    const { about, education, personal_details, achievements, posts } = req.body;
    let doc = await About.findOne();
    if (doc) {
      doc.about = about;
      doc.education = education;
      doc.personal_details = personal_details;
      doc.achievements = achievements;
      doc.posts = posts;
      await doc.save();
    } else {
      doc = await About.create({ about, education, personal_details, achievements, posts });
    }
    res.json({ success: true, about: doc });
  } catch (err) {
    console.error("Error updating about:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Skills CRUD ---
app.post("/api/admin/skills", requireAdmin, async (req, res) => {
  try {
    const { category, items } = req.body;
    const skill = await Skill.create({ category, items: items || [] });
    res.json({ success: true, skill });
  } catch (err) {
    console.error("Error creating skill:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/admin/skills/:id", requireAdmin, async (req, res) => {
  try {
    const { category, items } = req.body;
    const skill = await Skill.findByIdAndUpdate(
      req.params.id,
      { category, items },
      { new: true }
    );
    res.json({ success: true, skill });
  } catch (err) {
    console.error("Error updating skill:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/admin/skills/:id", requireAdmin, async (req, res) => {
  try {
    await Skill.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Skill category deleted" });
  } catch (err) {
    console.error("Error deleting skill:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Projects CRUD ---
app.post("/api/admin/projects", requireAdmin, async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.json({ success: true, project });
  } catch (err) {
    console.error("Error creating project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/admin/projects/:id", requireAdmin, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, project });
  } catch (err) {
    console.error("Error updating project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/admin/projects/:id", requireAdmin, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Project deleted" });
  } catch (err) {
    console.error("Error deleting project:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Experience CRUD ---
app.post("/api/admin/experience", requireAdmin, async (req, res) => {
  try {
    const experience = await Experience.create(req.body);
    res.json({ success: true, experience });
  } catch (err) {
    console.error("Error creating experience:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.put("/api/admin/experience/:id", requireAdmin, async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, experience });
  } catch (err) {
    console.error("Error updating experience:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete("/api/admin/experience/:id", requireAdmin, async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Experience deleted" });
  } catch (err) {
    console.error("Error deleting experience:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Contact Info CRUD ---
app.put("/api/admin/contact-info", requireAdmin, async (req, res) => {
  try {
    const { email, phone, blog, message } = req.body;
    let doc = await ContactInfo.findOne();
    if (doc) {
      doc.email = email;
      doc.phone = phone;
      doc.blog = blog;
      doc.message = message;
      await doc.save();
    } else {
      doc = await ContactInfo.create({ email, phone, blog, message });
    }
    res.json({ success: true, contact: doc });
  } catch (err) {
    console.error("Error updating contact info:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// --- Messages Inbox ---
app.get("/api/admin/messages", requireAdmin, async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (err) {
    console.error("Error fetching messages:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

app.delete("/api/admin/messages/:id", requireAdmin, async (req, res) => {
  try {
    const deleted = await Message.findByIdAndDelete(req.params.id);
    res.json({ success: true, deleted: !!deleted });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ success: false, error: "Server error" });
  }
});

// --- Base Route ---
app.get("/", (req, res) =>
  res.send("Portfolio REST API (Express + MongoDB) with Full Admin CRUD is running 🚀")
);

app.listen(PORT, () =>
  console.log(`📡 Portfolio API Server running on port ${PORT} (Mode: MongoDB with CRUD)`)
);
