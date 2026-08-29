// src/components/admin/AdminHero.jsx
import React, { useState, useEffect } from "react";
import { FaSave, FaUserAstronaut } from "react-icons/fa";
import { updateHeroApi } from "../../services/api";

function AdminHero({ hero, password, onSaveSuccess, onSaveError }) {
  const [form, setForm] = useState({
    name: "",
    roles: "",
    location: "",
    heroTagline: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        name: hero.name || "",
        roles: (hero.roles || []).join(", "),
        location: hero.location || "",
        heroTagline: hero.heroTagline || "",
      });
    }
  }, [hero]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        roles: form.roles.split(",").map((r) => r.trim()).filter(Boolean),
        location: form.location,
        heroTagline: form.heroTagline,
        socialLinks: hero?.socialLinks || [],
      };
      const res = await updateHeroApi(payload, password);
      if (res.success) {
        onSaveSuccess("Hero Profile updated successfully in MongoDB!");
      } else {
        throw new Error(res.error || "Failed to update Hero profile");
      }
    } catch (err) {
      onSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <h2 className="admin-panel__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <FaUserAstronaut style={{ color: "var(--accent-neon)" }} />
          <span>Hero Profile & Header Branding</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Full Name</label>
            <input
              type="text"
              className="admin-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Manas Ranjan Das"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Location</label>
            <input
              type="text"
              className="admin-input"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Cuttack, India"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Dynamic Rotating Roles (comma-separated)</label>
          <input
            type="text"
            className="admin-input"
            value={form.roles}
            onChange={(e) => setForm({ ...form, roles: e.target.value })}
            placeholder="Full-Stack Developer, Researcher, AI Engineer, IoT Enthusiast"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Hero Tagline</label>
          <textarea
            className="admin-textarea"
            value={form.heroTagline}
            onChange={(e) => setForm({ ...form, heroTagline: e.target.value })}
            placeholder="I build intelligent systems that connect hardware, software, and people."
          />
        </div>

        <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
          <FaSave size={13} />
          <span>{saving ? "Saving to MongoDB..." : "Save Hero Profile"}</span>
        </button>
      </form>
    </div>
  );
}

export default AdminHero;

