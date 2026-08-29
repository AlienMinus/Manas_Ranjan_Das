// server/models/Hero.js
const mongoose = require("mongoose");

const socialLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, required: true },
    url: { type: String, required: true },
    iconLib: { type: String, default: "fa" },
    icon: { type: String, required: true },
  },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    roles: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    heroTagline: { type: String, trim: true },
    socialLinks: [socialLinkSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);

