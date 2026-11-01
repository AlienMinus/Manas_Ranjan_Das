// src/components/admin/AdminAbout.jsx
import React, { useState, useEffect } from "react";
import {
  FaSave,
  FaPlus,
  FaTrash,
  FaGraduationCap,
  FaBookOpen,
  FaUserCheck,
  FaTrophy,
  FaBriefcase,
} from "react-icons/fa";
import { updateAboutApi } from "../../services/api";

function AdminAbout({ about, password, onSaveSuccess, onSaveError }) {
  const [form, setForm] = useState({
    about: "",
    education: [],
    details: [],
    achievements: [],
    posts: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (about) {
      const rawDetails =
        about.personal_details instanceof Map
          ? Object.fromEntries(about.personal_details)
          : about.personal_details || {};
      const detailsArr = Object.entries(rawDetails).map(([k, v]) => ({
        key: k,
        value: String(v || ""),
      }));

      const rawAchievements =
        about.achievements instanceof Map
          ? Object.fromEntries(about.achievements)
          : about.achievements || {};
      const achievementsArr = Object.entries(rawAchievements).map(([k, v]) => ({
        title: k,
        desc: String(v || ""),
      }));

      const rawPosts =
        about.posts instanceof Map
          ? Object.fromEntries(about.posts)
          : about.posts || {};
      const postsArr = Object.entries(rawPosts).map(([k, v]) => ({
        role: k,
        desc: String(v || ""),
      }));

      setForm({
        about: about.about || "",
        education: about.education || [],
        details: detailsArr,
        achievements: achievementsArr,
        posts: postsArr,
      });
    }
  }, [about]);

  // Education handlers
  const handleAddEducation = () => {
    setForm((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "" }],
    }));
  };

  const handleUpdateEduRow = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  const handleDeleteEduRow = (index) => {
    setForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Personal Details handlers
  const handleAddDetail = () => {
    setForm((prev) => ({
      ...prev,
      details: [...prev.details, { key: "", value: "" }],
    }));
  };

  const handleUpdateDetail = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.details];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, details: updated };
    });
  };

  const handleDeleteDetail = (index) => {
    setForm((prev) => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index),
    }));
  };

  // Achievements handlers
  const handleAddAchievement = () => {
    setForm((prev) => ({
      ...prev,
      achievements: [...prev.achievements, { title: "", desc: "" }],
    }));
  };

  const handleUpdateAchievement = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.achievements];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, achievements: updated };
    });
  };

  const handleDeleteAchievement = (index) => {
    setForm((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  // Posts handlers
  const handleAddPost = () => {
    setForm((prev) => ({
      ...prev,
      posts: [...prev.posts, { role: "", desc: "" }],
    }));
  };

  const handleUpdatePost = (index, field, value) => {
    setForm((prev) => {
      const updated = [...prev.posts];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, posts: updated };
    });
  };

  const handleDeletePost = (index) => {
    setForm((prev) => ({
      ...prev,
      posts: prev.posts.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const detailsObj = {};
      form.details.forEach((item) => {
        if (item.key.trim()) detailsObj[item.key.trim()] = item.value.trim();
      });

      const achievementsObj = {};
      form.achievements.forEach((item) => {
        if (item.title.trim()) achievementsObj[item.title.trim()] = item.desc.trim();
      });

      const postsObj = {};
      form.posts.forEach((item) => {
        if (item.role.trim()) postsObj[item.role.trim()] = item.desc.trim();
      });

      const payload = {
        about: form.about,
        education: form.education,
        personal_details: detailsObj,
        achievements: achievementsObj,
        posts: postsObj,
      };

      const res = await updateAboutApi(payload, password);
      if (res.success) {
        onSaveSuccess("About biography, Education, Details, Achievements & Posts updated successfully!");
      } else {
        throw new Error(res.error || "Failed to update About section");
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
          <FaBookOpen style={{ color: "var(--accent-neon)" }} />
          <span>About Biography, Education & Profile Milestones</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        {/* 1. Full Biography */}
        <div className="admin-form-group">
          <label className="admin-label">Full Biography Narrative</label>
          <textarea
            className="admin-textarea"
            style={{ minHeight: "140px" }}
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            placeholder="Write your professional bio..."
            required
          />
        </div>

        {/* 2. Education Records */}
        <div className="admin-form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaGraduationCap />
              <span>Education Records ({form.education.length})</span>
            </label>
            <button type="button" className="btn outline sm" onClick={handleAddEducation}>
              <FaPlus size={11} />
              <span>Add Degree / Institution</span>
            </button>
          </div>

          {form.education.map((edu, idx) => (
            <div key={idx} className="admin-edu-row">
              <input
                type="text"
                className="admin-input"
                placeholder="Degree (e.g. B.Tech in ECE)"
                value={edu.degree}
                onChange={(e) => handleUpdateEduRow(idx, "degree", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Institution (e.g. BPUT)"
                value={edu.institution}
                onChange={(e) => handleUpdateEduRow(idx, "institution", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Year (e.g. 2023 - 2027)"
                value={edu.year}
                onChange={(e) => handleUpdateEduRow(idx, "year", e.target.value)}
              />
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDeleteEduRow(idx)}
                title="Delete Row"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* 3. Personal Details (Key-Value) */}
        <div className="admin-form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaUserCheck />
              <span>Personal Details ({form.details.length})</span>
            </label>
            <button type="button" className="btn outline sm" onClick={handleAddDetail}>
              <FaPlus size={11} />
              <span>Add Personal Detail</span>
            </button>
          </div>

          {form.details.map((item, idx) => (
            <div key={idx} className="admin-kv-row">
              <input
                type="text"
                className="admin-input"
                placeholder="Label / Key (e.g. Languages, Nationality, Focus)"
                value={item.key}
                onChange={(e) => handleUpdateDetail(idx, "key", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Value (e.g. English, Odia, Hindi / Indian)"
                value={item.value}
                onChange={(e) => handleUpdateDetail(idx, "value", e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDeleteDetail(idx)}
                title="Delete Detail"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* 4. Key Achievements & Milestones */}
        <div className="admin-form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaTrophy style={{ color: "#facc15" }} />
              <span>Key Achievements & Milestones ({form.achievements.length})</span>
            </label>
            <button type="button" className="btn outline sm" onClick={handleAddAchievement}>
              <FaPlus size={11} />
              <span>Add Milestone / Award</span>
            </button>
          </div>

          {form.achievements.map((item, idx) => (
            <div key={idx} className="admin-kv-row">
              <input
                type="text"
                className="admin-input"
                placeholder="Achievement Title (e.g. GATE 2024, Research Publication)"
                value={item.title}
                onChange={(e) => handleUpdateAchievement(idx, "title", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Description / Details (e.g. AIR 4324 Qualified, Published in IEEE)"
                value={item.desc}
                onChange={(e) => handleUpdateAchievement(idx, "desc", e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDeleteAchievement(idx)}
                title="Delete Achievement"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* 5. Leadership & Positions Held */}
        <div className="admin-form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <FaBriefcase style={{ color: "#818cf8" }} />
              <span>Leadership & Positions Held ({form.posts.length})</span>
            </label>
            <button type="button" className="btn outline sm" onClick={handleAddPost}>
              <FaPlus size={11} />
              <span>Add Leadership Post</span>
            </button>
          </div>

          {form.posts.map((item, idx) => (
            <div key={idx} className="admin-kv-row">
              <input
                type="text"
                className="admin-input"
                placeholder="Position / Role (e.g. Technical Lead, Coordinator)"
                value={item.role}
                onChange={(e) => handleUpdatePost(idx, "role", e.target.value)}
                required
              />
              <input
                type="text"
                className="admin-input"
                placeholder="Organization / Scope (e.g. Robotics Club, Tech Symposium)"
                value={item.desc}
                onChange={(e) => handleUpdatePost(idx, "desc", e.target.value)}
                required
              />
              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDeletePost(idx)}
                title="Delete Post"
              >
                <FaTrash size={13} />
              </button>
            </div>
          ))}
        </div>

        <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
          <FaSave size={13} />
          <span>{saving ? "Saving to MongoDB..." : "Save About, Details & Milestones"}</span>
        </button>
      </form>
    </div>
  );
}

export default AdminAbout;
