// server/models/Skill.js
const mongoose = require("mongoose");

const skillItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: { type: String, required: true },
    iconLib: { type: String, default: "si" },
  },
  { _id: false }
);

const skillSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, trim: true },
    items: [skillItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Skill", skillSchema);

