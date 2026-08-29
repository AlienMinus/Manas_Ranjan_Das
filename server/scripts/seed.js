// server/scripts/seed.js
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: path.join(__dirname, "../.env") });
}

// Models
const Hero = require("../models/Hero");
const About = require("../models/About");
const Skill = require("../models/Skill");
const Project = require("../models/Project");
const Experience = require("../models/Experience");
const ContactInfo = require("../models/ContactInfo");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/portfolio_v1";

// Helper to read JSON
function loadJson(relPath) {
  const fullPath = path.join(__dirname, "../../src/data", relPath);
  const data = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(data);
}

async function seedDatabase() {
  try {
    console.log("🔌 Connecting to MongoDB:", MONGODB_URI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Hero
    const heroData = loadJson("hero.json");
    await Hero.deleteMany({});
    const createdHero = await Hero.create(heroData);
    console.log(`✅ Seeded Hero profile: ${createdHero.name}`);

    // 2. About
    const aboutData = loadJson("about.json");
    await About.deleteMany({});
    await About.create(aboutData);
    console.log("✅ Seeded About bio, education & achievements");

    // 3. Skills
    const skillsData = loadJson("skills.json");
    await Skill.deleteMany({});
    const createdSkills = await Skill.insertMany(skillsData);
    console.log(`✅ Seeded ${createdSkills.length} Skill categories`);

    // 4. Projects
    const projectsData = loadJson("projects.json");
    await Project.deleteMany({});
    const projectsWithOrder = projectsData.map((p, idx) => ({
      ...p,
      order: idx,
      featured: idx < 4,
    }));
    const createdProjects = await Project.insertMany(projectsWithOrder);
    console.log(`✅ Seeded ${createdProjects.length} Projects`);

    // 5. Experience
    const experienceData = loadJson("experience.json");
    await Experience.deleteMany({});
    const experienceWithOrder = experienceData.map((e, idx) => ({
      ...e,
      order: idx,
    }));
    const createdExp = await Experience.insertMany(experienceWithOrder);
    console.log(`✅ Seeded ${createdExp.length} Experience roles`);

    // 6. Contact Info
    const contactData = loadJson("contact.json");
    await ContactInfo.deleteMany({});
    await ContactInfo.create(contactData);
    console.log("✅ Seeded Contact Info");

    console.log("\n🎉 Database migration and seeding successfully completed!");
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;

