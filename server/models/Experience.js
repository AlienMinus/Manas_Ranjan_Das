// server/models/Experience.js
const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    details: [{ type: String, trim: true }],
    icon: { type: String, default: "FaBriefcase" },
    iconLib: { type: String, default: "fa" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Experience", experienceSchema);

