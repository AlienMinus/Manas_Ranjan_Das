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

const statItemSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    label: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const heroSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    primaryRole: { type: String, default: "Electrical & Computer Engineer", trim: true },
    statusBadge: { type: String, default: "Available for Opportunities", trim: true },
    roles: [{ type: String, trim: true }],
    location: { type: String, trim: true },
    heroTagline: { type: String, trim: true },
    stats: [statItemSchema],
    socialLinks: [socialLinkSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Hero", heroSchema);

