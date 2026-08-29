// src/components/admin/AdminSkills.jsx
import React, { useState } from "react";
import { FaTools, FaPlus, FaEdit, FaTrash, FaSave, FaTimes } from "react-icons/fa";
import { createSkillApi, updateSkillApi, deleteSkillApi } from "../../services/api";

function AdminSkills({ skills = [], password, onSaveSuccess, onSaveError }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (skillCat) => {
    setEditingItem(skillCat);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill category from MongoDB?")) return;
    try {
      const res = await deleteSkillApi(id, password);
      if (res.success) {
        onSaveSuccess("Skill category deleted successfully.");
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
    const itemsRaw = form.items.value
      .split("\n")
      .map((line) => {
        const [name, icon] = line.split(",").map((s) => s.trim());
        return { name, icon: icon || "SiReact", iconLib: "si" };
      })
      .filter((i) => i.name);

    const skillData = {
      category: form.category.value,
      items: itemsRaw,
    };

    try {
      let res;
      if (editingItem?._id) {
        res = await updateSkillApi(editingItem._id, skillData, password);
      } else {
        res = await createSkillApi(skillData, password);
      }

      if (res.success) {
        onSaveSuccess(`Skill category ${editingItem ? "updated" : "created"} in MongoDB!`);
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
          <FaTools style={{ color: "var(--accent-neon)", fontSize: "1.25rem" }} />
          <h2 className="admin-panel__title">Skill Categories & Items ({skills.length} Categories)</h2>
        </div>

        <button type="button" className="btn primary sm" onClick={handleOpenAdd}>
          <FaPlus size={11} />
          <span>Add Skill Category</span>
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
        {skills.map((cat) => (
          <div key={cat._id || cat.category} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.05rem", color: "var(--accent-neon)", margin: 0 }}>{cat.category}</h3>
              <div style={{ display: "flex", gap: "0.4rem" }}>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn--edit"
                  onClick={() => handleOpenEdit(cat)}
                  title="Edit Category"
                >
                  <FaEdit size={12} />
                </button>
                <button
                  type="button"
                  className="admin-icon-btn admin-icon-btn--delete"
                  onClick={() => handleDelete(cat._id)}
                  title="Delete Category"
                >
                  <FaTrash size={12} />
                </button>
              </div>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
              {(cat.items || []).map((item) => (
                <span key={item.name} className="tag">
                  {item.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Skill Modal */}
      {modalOpen && (
        <div className="admin-modal-backdrop" onClick={() => setModalOpen(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingItem ? "Edit Skill Category" : "Add Skill Category"}</h3>
              <button type="button" className="chatbot-close" onClick={() => setModalOpen(false)}>
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-label">Category Name</label>
                <input
                  type="text"
                  name="category"
                  className="admin-input"
                  placeholder="e.g. Languages & Frameworks"
                  defaultValue={editingItem?.category || ""}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Skills & Icon (Format: Name,IconName per line)</label>
                <textarea
                  name="items"
                  className="admin-textarea"
                  style={{ minHeight: "140px" }}
                  placeholder="JavaScript, SiJavascript&#10;Python, SiPython&#10;React.js, SiReact"
                  defaultValue={(editingItem?.items || []).map((i) => `${i.name}, ${i.icon}`).join("\n")}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className="btn outline sm" onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary sm" disabled={saving}>
                  <FaSave size={12} />
                  <span>{saving ? "Saving..." : editingItem ? "Update Category" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminSkills;

