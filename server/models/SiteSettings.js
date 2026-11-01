// server/models/SiteSettings.js
const mongoose = require("mongoose");

const siteSettingsSchema = new mongoose.Schema(
  {
    theme: {
      type: String,
      default: "cyberpunk", // 'cyberpunk' | 'glassmorphism' | 'skeuomorphism' | 'luxury-gold' | 'synthwave'
      trim: true,
    },
    accentColor: {
      type: String,
      default: "",
      trim: true,
    },
    enableSound: {
      type: Boolean,
      default: true,
    },
    terminalIntroEnabled: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true, strict: false }
);

module.exports = mongoose.model("SiteSettings", siteSettingsSchema);

