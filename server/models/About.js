// server/models/About.js
const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    year: { type: String, required: true },
  },
  { _id: false }
);

const aboutSchema = new mongoose.Schema(
  {
    about: { type: String, required: true },
    education: [educationSchema],
    personal_details: {
      type: Map,
      of: String,
      default: {},
    },
    achievements: {
      type: Map,
      of: String,
      default: {},
    },
    posts: {
      type: Map,
      of: String,
      default: {},
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("About", aboutSchema);

