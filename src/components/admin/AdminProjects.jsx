// src/components/admin/AdminProjects.jsx
import React, { useState } from "react";
import { FaCode, FaPlus, FaEdit, FaTrash, FaSave, FaTimes, FaSearch } from "react-icons/fa";
import { createProjectApi, updateProjectApi, deleteProjectApi } from "../../services/api";

function AdminProjects({ projects = [], password, onSaveSuccess, onSaveError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredProjects = projects.filter((p) => {
    const q = searchFilter.toLowerCase();
    return (
      (p.title || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q) ||
      (p.techStack || []).join(" ").toLowerCase().includes(q) ||
      (p.tags || []).join(" ").toLowerCase().includes(q)
    );
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (project) => {
    setEditingItem(project);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project from MongoDB?")) return;
    try {
      const res = await deleteProjectApi(id, password);
      if (res.success) {
        onSaveSuccess("Project deleted from MongoDB.");
      } else {
        throw new Error(res.error || "Failed to delete project");
      }
    } catch (err) {
      onSaveError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const form = e.target;
    const projectData = {
      title: form.title.value,
      description: form.description.value,
      techStack: form.techStack.value.split(",").map((s) => s.trim()).filter(Boolean),
      tags: form.tags.value.split(",").map((s) => s.trim()).filter(Boolean),
      image: form.image.value,
      github: form.github.value,
      demo: form.demo.value,
      featured: form.featured.checked,
    };

    try {
      let res;
      if (editingItem?._id) {
        res = await updateProjectApi(editingItem._id, projectData, password);
      } else {
        res = await createProjectApi(projectData, password);
      }

      if (res.success) {
        onSaveSuccess(`Project ${editingItem ? "updated" : "created"} in MongoDB!`);
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
          <FaCode style={{ color: "var(--accent-neon)", fontSize: "1.25rem" }} />
          <h2 className="admin-panel__title">Projects Management ({projects.length} Total)</h2>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {/* Search Filter */}
          <div style={{ position: "relative", minWidth: "220px" }}>
            <input
              type="text"
              className="admin-input"
              style={{ paddingLeft: "2.2rem", fontSize: "0.85rem", height: "38px" }}
              placeholder="Search projects..."
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
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Tech Stack</th>
              <th>Tags</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProjects.map((proj) => (
              <tr key={proj._id || proj.title}>
                <td style={{ fontWeight: 600, color: "#ffffff", maxWidth: "220px" }}>{proj.title}</td>
                <td style={{ maxWidth: "240px" }}>{(proj.techStack || []).join(", ")}</td>
                <td>{(proj.tags || []).join(", ")}</td>
                <td>
                  {proj.featured ? (
                    <span className="badge badge--emerald" style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem" }}>
                      ⭐ Featured
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
                      onClick={() => handleOpenEdit(proj)}
                      title="Edit Project"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDelete(proj._id)}
                      title="Delete Project"
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

      {/* Modal Dialog */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingItem ? "Edit Project" : "Add New Project"}</h3>
              <button type="button" className="chatbot-close" onClick={() => setModalOpen(false)}>
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-label">Project Title</label>
                <input
                  type="text"
                  name="title"
                  className="admin-input"
                  defaultValue={editingItem?.title || ""}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Description</label>
                <textarea
                  name="description"
                  className="admin-textarea"
                  defaultValue={editingItem?.description || ""}
                  required
                />
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Tech Stack (comma-separated)</label>
                  <input
                    type="text"
                    name="techStack"
                    className="admin-input"
                    placeholder="Python, React, Node.js"
                    defaultValue={(editingItem?.techStack || []).join(", ")}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Tags (comma-separated)</label>
                  <input
                    type="text"
                    name="tags"
                    className="admin-input"
                    placeholder="AI, FullStack, IoT"
                    defaultValue={(editingItem?.tags || []).join(", ")}
                  />
                </div>
              </div>

              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">GitHub Repository URL</label>
                  <input
                    type="url"
                    name="github"
                    className="admin-input"
                    defaultValue={editingItem?.github || ""}
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Live Demo URL</label>
                  <input
                    type="url"
                    name="demo"
                    className="admin-input"
                    defaultValue={editingItem?.demo || ""}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Image URL / Path</label>
                <input
                  type="text"
                  name="image"
                  className="admin-input"
                  placeholder="/assets/project.png"
                  defaultValue={editingItem?.image || ""}
                />
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="checkbox"
                  name="featured"
                  id="featured-proj-input"
                  defaultChecked={editingItem?.featured || false}
                />
                <label htmlFor="featured-proj-input" className="admin-label">
                  Display as Featured Project on Home Page
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className="btn outline sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary sm" disabled={saving}>
                  <FaSave size={12} />
                  <span>{saving ? "Saving..." : editingItem ? "Update Project" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminProjects;

