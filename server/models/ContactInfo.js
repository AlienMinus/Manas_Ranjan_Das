// server/models/ContactInfo.js
const mongoose = require("mongoose");

const contactInfoSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    blog: { type: String, trim: true },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ContactInfo", contactInfoSchema);

