// src/components/admin/AdminAbout.jsx
import React, { useState, useEffect } from "react";
import { FaSave, FaPlus, FaTrash, FaGraduationCap, FaBookOpen } from "react-icons/fa";
import { updateAboutApi } from "../../services/api";

function AdminAbout({ about, password, onSaveSuccess, onSaveError }) {
  const [form, setForm] = useState({
    about: "",
    education: [],
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (about) {
      setForm({
        about: about.about || "",
        education: about.education || [],
      });
    }
  }, [about]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        about: form.about,
        education: form.education,
        personal_details: about?.personal_details || {},
        achievements: about?.achievements || {},
        posts: about?.posts || {},
      };
      const res = await updateAboutApi(payload, password);
      if (res.success) {
        onSaveSuccess("About biography & Education records updated in MongoDB!");
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
          <span>About Biography & Education Timeline</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
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

        <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
          <FaSave size={13} />
          <span>{saving ? "Saving to MongoDB..." : "Save About & Education"}</span>
        </button>
      </form>
    </div>
  );
}

export default AdminAbout;

