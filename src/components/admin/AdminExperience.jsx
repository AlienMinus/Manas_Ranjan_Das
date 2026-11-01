// src/components/admin/AdminExperience.jsx
import React, { useState } from "react";
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaImage, FaUpload } from "react-icons/fa";
import { createExperienceApi, updateExperienceApi, deleteExperienceApi } from "../../services/api";

function AdminExperience({ experience = [], password, onSaveSuccess, onSaveError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setPreviewImage("");
    setModalOpen(true);
  };

  const handleOpenEdit = (exp) => {
    setEditingItem(exp);
    setPreviewImage(exp.image || "");
    setModalOpen(true);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit. Please choose a smaller photo.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
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
    const finalImage = (previewImage || form.image?.value || "").trim();

    const expData = {
      role: form.role.value.trim(),
      company: form.company.value.trim(),
      duration: form.duration.value.trim(),
      details: form.details.value.split("\n").map((s) => s.trim()).filter(Boolean),
      image: finalImage,
      icon: form.icon.value.trim() || "FaBriefcase",
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
        setPreviewImage("");
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
              <th>Photo</th>
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
                <td>
                  {exp.image ? (
                    <img
                      src={exp.image}
                      alt={exp.role}
                      style={{
                        width: "48px",
                        height: "34px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid rgba(0, 255, 102, 0.25)",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>—</span>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: "var(--text-primary)" }}>{exp.role}</td>
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
        <div
          className="admin-modal-backdrop"
          onClick={() => setModalOpen(false)}
          onWheel={(e) => {
            if (e.target === e.currentTarget) {
              window.scrollBy({ top: e.deltaY, behavior: "auto" });
            }
          }}
        >
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
                  <label className="admin-label">Role / Job Title *</label>
                  <input
                    type="text"
                    name="role"
                    className="admin-input"
                    defaultValue={editingItem?.role || ""}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Company / Institution *</label>
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
                  <label className="admin-label">Duration *</label>
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

              {/* Experience Workplace Photo / Image with File Upload + URL */}
              <div className="admin-form-group">
                <label className="admin-label" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                    <FaImage />
                    <span>Workplace Photo / Company Logo URL or File</span>
                  </span>
                  <label className="btn outline sm" style={{ cursor: "pointer", fontSize: "0.75rem", padding: "0.2rem 0.55rem" }}>
                    <FaUpload size={10} style={{ marginRight: "0.3rem" }} />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileUpload}
                    />
                  </label>
                </label>

                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <input
                    type="text"
                    name="image"
                    className="admin-input"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder="https://... or upload image file directly"
                    style={{ flex: 1 }}
                  />
                  {previewImage && (
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                        style={{
                          width: "48px",
                          height: "36px",
                          objectFit: "cover",
                          borderRadius: "4px",
                          border: "1px solid var(--accent-neon)",
                        }}
                      />
                      <button
                        type="button"
                        className="btn outline sm"
                        onClick={() => setPreviewImage("")}
                        title="Remove Image"
                        style={{ padding: "0.3rem 0.5rem", color: "#ef4444" }}
                      >
                        <FaTimes size={11} />
                      </button>
                    </div>
                  )}
                </div>
                <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>
                  Upload a photo from your device or paste any image URL to display on the experience card.
                </small>
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

