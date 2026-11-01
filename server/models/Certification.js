// server/models/Certification.js
const mongoose = require("mongoose");

const certificationSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String, trim: true },
    expiryDate: { type: String, trim: true },
    credentialId: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
    image: { type: String, trim: true },
    skills: [{ type: String, trim: true }],
    description: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Certification", certificationSchema);

