// src/components/admin/AdminCertifications.jsx
import React, { useState } from "react";
import {
  FaAward,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaSearch,
  FaExternalLinkAlt,
  FaImage,
} from "react-icons/fa";
import {
  createCertificationApi,
  updateCertificationApi,
  deleteCertificationApi,
} from "../../services/api";

function AdminCertifications({ certifications = [], password, onSaveSuccess, onSaveError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const handleOpenAdd = () => {
    setEditingItem(null);
    setPreviewImage("");
    setModalOpen(true);
  };

  const handleOpenEdit = (cert) => {
    setEditingItem(cert);
    setPreviewImage(cert.image || "");
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this certification from MongoDB?")) return;
    try {
      const res = await deleteCertificationApi(id, password);
      if (res.success) {
        onSaveSuccess("Certification deleted from MongoDB.");
      } else {
        throw new Error(res.error || "Failed to delete certification");
      }
    } catch (err) {
      onSaveError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;

    const certData = {
      title: form.title.value.trim(),
      issuer: form.issuer.value.trim(),
      issueDate: form.issueDate.value.trim(),
      expiryDate: form.expiryDate.value.trim(),
      credentialId: form.credentialId.value.trim(),
      credentialUrl: form.credentialUrl.value.trim(),
      image: form.image.value.trim(),
      skills: form.skills.value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      description: form.description.value.trim(),
      featured: form.featured.checked,
    };

    try {
      let res;
      if (editingItem?._id) {
        res = await updateCertificationApi(editingItem._id, certData, password);
      } else {
        res = await createCertificationApi(certData, password);
      }

      if (res.success) {
        onSaveSuccess(`Certification ${editingItem ? "updated" : "created"} in MongoDB!`);
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

  const filteredCerts = certifications.filter((c) => {
    const term = searchFilter.toLowerCase();
    return (
      (c.title || "").toLowerCase().includes(term) ||
      (c.issuer || "").toLowerCase().includes(term) ||
      (c.skills || []).some((s) => s.toLowerCase().includes(term))
    );
  });

  return (
    <div className="admin-panel">
      {/* Header and Controls */}
      <div className="admin-panel__header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 className="admin-panel__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaAward style={{ color: "var(--accent-neon)" }} />
            <span>Certifications & Accreditations Manager</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Total Recorded in Database: {certifications.length} Certifications
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              className="admin-input"
              style={{ width: "220px", paddingLeft: "2rem", height: "36px", fontSize: "0.85rem" }}
              placeholder="Search certs or issuer..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
            />
            <FaSearch
              size={12}
              style={{ position: "absolute", left: "0.8rem", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }}
            />
          </div>

          <button type="button" className="btn primary sm" onClick={handleOpenAdd}>
            <FaPlus size={11} />
            <span>Add New Certification</span>
          </button>
        </div>
      </div>

      {/* Certifications Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo Preview</th>
              <th>Certification Title</th>
              <th>Issuer Organization</th>
              <th>Date Issued</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCerts.map((cert) => (
              <tr key={cert._id || cert.title}>
                <td style={{ width: "80px" }}>
                  {cert.image ? (
                    <img
                      src={cert.image}
                      alt={cert.title}
                      style={{
                        width: "60px",
                        height: "40px",
                        objectFit: "cover",
                        borderRadius: "4px",
                        border: "1px solid rgba(0, 255, 102, 0.3)",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "60px",
                        height: "40px",
                        background: "rgba(0, 255, 102, 0.05)",
                        borderRadius: "4px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--text-muted)",
                        border: "1px dashed rgba(255, 255, 255, 0.1)",
                      }}
                    >
                      <FaAward size={16} />
                    </div>
                  )}
                </td>
                <td style={{ fontWeight: 600, color: "#ffffff", maxWidth: "240px" }}>
                  {cert.title}
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ marginLeft: "0.5rem", color: "var(--accent-neon)", fontSize: "0.75rem" }}
                      title="Verify Link"
                    >
                      <FaExternalLinkAlt size={10} />
                    </a>
                  )}
                </td>
                <td style={{ color: "var(--accent-neon)", fontWeight: 500 }}>{cert.issuer}</td>
                <td style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{cert.issueDate || "N/A"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  {cert.featured ? (
                    <span className="badge badge--emerald">
                      <span>⭐</span>
                      <span>Featured</span>
                    </span>
                  ) : (
                    <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Standard</span>
                  )}
                </td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--edit"
                      onClick={() => handleOpenEdit(cert)}
                      title="Edit Certification"
                    >
                      <FaEdit size={13} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDelete(cert._id)}
                      title="Delete Certification"
                    >
                      <FaTrash size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredCerts.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2.5rem", color: "var(--text-muted)" }}>
                  No certifications found. Click "Add New Certification" to register your achievements.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Certification Modal */}
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
              <h3 className="admin-modal__title">
                {editingItem ? "Edit Certification" : "Add New Certification"}
              </h3>
              <button
                type="button"
                className="admin-modal__close"
                onClick={() => setModalOpen(false)}
              >
                <FaTimes size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Certification Title *</label>
                  <input
                    type="text"
                    name="title"
                    className="admin-input"
                    defaultValue={editingItem?.title || ""}
                    placeholder="e.g. Google Cloud Certified Professional"
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Issuing Organization *</label>
                  <input
                    type="text"
                    name="issuer"
                    className="admin-input"
                    defaultValue={editingItem?.issuer || ""}
                    placeholder="e.g. Google, Coursera, Stanford, AWS, IEEE"
                    required
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Issue Date</label>
                  <input
                    type="text"
                    name="issueDate"
                    className="admin-input"
                    defaultValue={editingItem?.issueDate || ""}
                    placeholder="e.g. Oct 2024"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Expiry Date</label>
                  <input
                    type="text"
                    name="expiryDate"
                    className="admin-input"
                    defaultValue={editingItem?.expiryDate || ""}
                    placeholder="e.g. No Expiration / Oct 2027"
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Credential ID / Code</label>
                  <input
                    type="text"
                    name="credentialId"
                    className="admin-input"
                    defaultValue={editingItem?.credentialId || ""}
                    placeholder="e.g. GCC-94827104"
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Verification / Credential URL</label>
                  <input
                    type="url"
                    name="credentialUrl"
                    className="admin-input"
                    defaultValue={editingItem?.credentialUrl || ""}
                    placeholder="https://coursera.org/verify/..."
                  />
                </div>
              </div>

              {/* Certificate Image / Photo URL with Preview */}
              <div className="admin-form-group">
                <label className="admin-label" style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  <FaImage />
                  <span>Certificate Photo / Badge URL</span>
                </label>
                <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
                  <input
                    type="url"
                    name="image"
                    className="admin-input"
                    value={previewImage}
                    onChange={(e) => setPreviewImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or direct image URL"
                    style={{ flex: 1 }}
                  />
                  {previewImage && (
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
                  )}
                </div>
                <small style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "0.25rem", display: "block" }}>
                  Paste a direct link to the certificate image, badge, or accreditation photo.
                </small>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Skills & Competencies (comma-separated)</label>
                <input
                  type="text"
                  name="skills"
                  className="admin-input"
                  defaultValue={(editingItem?.skills || []).join(", ")}
                  placeholder="e.g. Deep Learning, TensorFlow, Computer Vision, Python"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description / Scope</label>
                <textarea
                  name="description"
                  className="admin-textarea"
                  style={{ minHeight: "80px" }}
                  defaultValue={editingItem?.description || ""}
                  placeholder="Key topics, exam score, or course outcomes covered..."
                />
              </div>

              <div className="admin-checkbox-group">
                <input
                  type="checkbox"
                  id="featured-cert"
                  name="featured"
                  className="admin-checkbox"
                  defaultChecked={editingItem?.featured || false}
                />
                <label htmlFor="featured-cert" className="admin-checkbox-label">
                  Highlight as Featured Certification ⭐
                </label>
              </div>

              <div className="admin-modal__actions">
                <button
                  type="button"
                  className="btn outline"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn primary" disabled={saving}>
                  <FaSave size={13} />
                  <span>{saving ? "Saving..." : editingItem ? "Update Certification" : "Create Certification"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCertifications;

