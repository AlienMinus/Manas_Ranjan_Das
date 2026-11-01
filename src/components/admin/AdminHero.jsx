// src/components/admin/AdminHero.jsx
import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaUserAstronaut,
  FaPlus,
  FaTrash,
  FaChartBar,
  FaShareAlt,
} from "react-icons/fa";
import { updateHeroApi } from "../../services/api";

const DEFAULT_STATS = [
  { number: "25+", label: "Projects" },
  { number: "5+", label: "Internships" },
  { number: "2", label: "Research Papers" },
  { number: "GATE", label: "AIR 4324" },
];

const DEFAULT_SOCIALS = [
  { platform: "GitHub", url: "https://github.com/AlienMinus", iconLib: "fa", icon: "FaGithub" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/manas-r-das/", iconLib: "fa", icon: "FaLinkedin" },
  { platform: "Instagram", url: "https://www.instagram.com/the_minus_infinity/", iconLib: "fa", icon: "FaInstagram" },
];

function AdminHero({ hero, password, onSaveSuccess, onSaveError }) {
  const [form, setForm] = useState({
    name: "",
    primaryRole: "",
    statusBadge: "",
    roles: "",
    location: "",
    heroTagline: "",
    stats: DEFAULT_STATS,
    socialLinks: DEFAULT_SOCIALS,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (hero) {
      setForm({
        name: hero.name || "",
        primaryRole: hero.primaryRole || "Electrical & Computer Engineer",
        statusBadge: hero.statusBadge || "Available for Opportunities",
        roles: (hero.roles || []).join(", "),
        location: hero.location || "",
        heroTagline: hero.heroTagline || "",
        stats: hero.stats && hero.stats.length > 0 ? hero.stats : DEFAULT_STATS,
        socialLinks: hero.socialLinks && hero.socialLinks.length > 0 ? hero.socialLinks : DEFAULT_SOCIALS,
      });
    }
  }, [hero]);

  // Stat Handlers
  const handleAddStat = () => {
    setForm((prev) => ({
      ...prev,
      stats: [...prev.stats, { number: "", label: "" }],
    }));
  };

  const handleUpdateStat = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.stats];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, stats: updated };
    });
  };

  const handleDeleteStat = (idx) => {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx),
    }));
  };

  // Social Link Handlers
  const handleAddSocial = () => {
    setForm((prev) => ({
      ...prev,
      socialLinks: [...prev.socialLinks, { platform: "", url: "", icon: "FaLink", iconLib: "fa" }],
    }));
  };

  const handleUpdateSocial = (idx, field, value) => {
    setForm((prev) => {
      const updated = [...prev.socialLinks];
      updated[idx] = { ...updated[idx], [field]: value };
      return { ...prev, socialLinks: updated };
    });
  };

  const handleDeleteSocial = (idx) => {
    setForm((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== idx),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        primaryRole: form.primaryRole,
        statusBadge: form.statusBadge,
        roles: form.roles.split(",").map((r) => r.trim()).filter(Boolean),
        location: form.location,
        heroTagline: form.heroTagline,
        stats: form.stats.filter((st) => st.number.trim() && st.label.trim()),
        socialLinks: form.socialLinks.filter((sl) => sl.platform.trim() && sl.url.trim()),
      };
      const res = await updateHeroApi(payload, password);
      if (res.success) {
        onSaveSuccess("Hero Profile, Headline, Stats & Socials updated in MongoDB!");
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
          <span>Hero Profile, Headline & Quick Stats</span>
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
            <label className="admin-label">Primary Headline / Discipline</label>
            <input
              type="text"
              className="admin-input"
              value={form.primaryRole}
              onChange={(e) => setForm({ ...form, primaryRole: e.target.value })}
              placeholder="Electrical & Computer Engineer"
              required
            />
          </div>
        </div>

        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Status Badge Text</label>
            <input
              type="text"
              className="admin-input"
              value={form.statusBadge}
              onChange={(e) => setForm({ ...form, statusBadge: e.target.value })}
              placeholder="Available for Opportunities"
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

        {/* Quick Stats Strip */}
        <div className="admin-form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaChartBar style={{ color: "var(--accent-neon)" }} />
              <span>Hero Quick Stats Strip ({form.stats.length})</span>
            </label>
            <button type="button" className="btn outline sm" onClick={handleAddStat}>
              <FaPlus size={11} />
              <span>Add Stat Counter</span>
            </button>
          </div>

          {form.stats.map((st, idx) => (
            <div key={idx} className="admin-kv-row">
              <input
                type="text"
                className="admin-input"
                placeholder="Stat Value (e.g. 25+, 5+, GATE)"
                value={st.number}
                onChange={(e) => handleUpdateStat(idx, "number", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Stat Label (e.g. Projects, Internships, AIR 4324)"
                value={st.label}
                onChange={(e) => handleUpdateStat(idx, "label", e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDeleteStat(idx)}
                title="Delete Stat"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="admin-form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaShareAlt style={{ color: "#38bdf8" }} />
              <span>Social Media Channels ({form.socialLinks.length})</span>
            </label>
            <button type="button" className="btn outline sm" onClick={handleAddSocial}>
              <FaPlus size={11} />
              <span>Add Social Channel</span>
            </button>
          </div>

          {form.socialLinks.map((sl, idx) => (
            <div key={idx} className="admin-edu-row">
              <input
                type="text"
                className="admin-input"
                placeholder="Platform (e.g. GitHub, LinkedIn, X)"
                value={sl.platform}
                onChange={(e) => handleUpdateSocial(idx, "platform", e.target.value)}
                required
              />
              <input
                type="url"
                className="admin-input"
                placeholder="Profile URL (e.g. https://github.com/...)"
                value={sl.url}
                onChange={(e) => handleUpdateSocial(idx, "url", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Icon (e.g. FaGithub, FaLinkedin)"
                value={sl.icon}
                onChange={(e) => handleUpdateSocial(idx, "icon", e.target.value)}
              />
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDeleteSocial(idx)}
                title="Delete Social Channel"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
          <FaSave size={13} />
          <span>{saving ? "Saving to MongoDB..." : "Save Hero Profile & Branding"}</span>
        </button>
      </form>
    </div>
  );
}

export default AdminHero;
