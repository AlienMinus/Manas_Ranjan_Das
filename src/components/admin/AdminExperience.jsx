// src/components/admin/AdminExperience.jsx
import React, { useState } from "react";
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { createExperienceApi, updateExperienceApi, deleteExperienceApi } from "../../services/api";

function AdminExperience({ experience = [], password, onSaveSuccess, onSaveError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingItem(exp);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience entry from MongoDB?")) return;
    try {
      const res = await deleteExperienceApi(id, password);
      if (res.success) {
        onSaveSuccess("Experience entry deleted from MongoDB.");
      } else {
        throw new Error(res.error || "Failed to delete");
      }
    } catch (err) {
      onSaveError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    const expData = {
      role: form.role.value,
      company: form.company.value,
      duration: form.duration.value,
      details: form.details.value.split("\n").map((s) => s.trim()).filter(Boolean),
      icon: form.icon.value || "FaBriefcase",
    };

    try {
      let res;
      if (editingItem?._id) {
        res = await updateExperienceApi(editingItem._id, expData, password);
      } else {
        res = await createExperienceApi(expData, password);
      }

      if (res.success) {
        onSaveSuccess(`Experience role ${editingItem ? "updated" : "created"} in MongoDB!`);
        setModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(res.error || "Operation failed");
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FaBriefcase style={{ color: "var(--accent-neon)", fontSize: "1.25rem" }} />
          <h2 className="admin-panel__title">Career Timeline & Roles ({experience.length} Total)</h2>
        </div>

        <button type="button" className="btn primary sm" onClick={handleOpenAdd}>
          <FaPlus size={11} />
          <span>Add Experience Role</span>
        </button>
      </div>

      {/* Experience Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Role / Position</th>
              <th>Company / Institution</th>
              <th>Duration</th>
              <th>Key Highlights</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {experience.map((exp) => (
              <tr key={exp._id || exp.role + exp.company}>
                <td style={{ fontWeight: 600, color: "#ffffff" }}>{exp.role}</td>
                <td style={{ color: "var(--accent-neon)" }}>{exp.company}</td>
                <td>{exp.duration}</td>
                <td style={{ maxWidth: "280px" }}>
                  {(exp.details || []).slice(0, 2).join(" • ")}
                </td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--edit"
                      onClick={() => handleOpenEdit(exp)}
                      title="Edit Role"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDelete(exp._id)}
                      title="Delete Role"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Experience Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingItem ? "Edit Experience Role" : "Add New Experience Role"}</h3>
              <button type="button" className="chatbot-close" onClick={() => setModalOpen(false)}>
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Role / Job Title</label>
                  <input
                    type="text"
                    name="role"
                    className="admin-input"
                    defaultValue={editingItem?.role || ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Company / Institution</label>
                  <input
                    type="text"
                    name="company"
                    className="admin-input"
                    defaultValue={editingItem?.company || ""}
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Duration</label>
                  <input
                    type="text"
                    name="duration"
                    className="admin-input"
                    placeholder="2024 - Present"
                    defaultValue={editingItem?.duration || ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Icon Identifier</label>
                  <input
                    type="text"
                    name="icon"
                    className="admin-input"
                    placeholder="FaFlask, FaLaptopCode, FaBriefcase"
                    defaultValue={editingItem?.icon || "FaBriefcase"}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Bullet Point Responsibilities (One per line)</label>
                <textarea
                  name="details"
                  className="admin-textarea"
                  defaultValue={(editingItem?.details || []).join("\n")}
                  placeholder="Key highlight 1&#10;Key highlight 2"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className="btn outline sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary sm" disabled={saving}>
                  <FaSave size={12} />
                  <span>{saving ? "Saving..." : editingItem ? "Update Experience" : "Create Experience"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminExperience;

