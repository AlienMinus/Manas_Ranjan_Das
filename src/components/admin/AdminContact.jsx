// src/components/admin/AdminContact.jsx
import React, { useState, useEffect } from "react";
import { FaSave, FaPhoneAlt } from "react-icons/fa";
import { updateContactInfoApi } from "../../services/api";

function AdminContact({ contact, password, onSaveSuccess, onSaveError }) {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    blog: "",
    message: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email || "",
        phone: contact.phone || "",
        blog: contact.blog || "",
        message: contact.message || "",
      });
    }
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateContactInfoApi(form, password);
      if (res.success) {
        onSaveSuccess("Contact info and channels updated in MongoDB!");
      } else {
        throw new Error(res.error || "Failed to update contact info");
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
          <FaPhoneAlt style={{ color: "var(--accent-neon)" }} />
          <span>Contact Information & Channels</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-row">
          <div className="admin-form-group">
            <label className="admin-label">Official Email Address</label>
            <input
              type="email"
              className="admin-input"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="dasmanasranjan2005@gmail.com"
              required
            />
          </div>

          <div className="admin-form-group">
            <label className="admin-label">Phone / WhatsApp Number</label>
            <input
              type="text"
              className="admin-input"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+91-8249709981"
            />
          </div>
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Technical Blog / Medium URL</label>
          <input
            type="url"
            className="admin-input"
            value={form.blog}
            onChange={(e) => setForm({ ...form, blog: e.target.value })}
            placeholder="https://spectacularminus.blogspot.com"
          />
        </div>

        <div className="admin-form-group">
          <label className="admin-label">Contact Section Invitation Message</label>
          <textarea
            className="admin-textarea"
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            placeholder="Have an innovative idea, project, or research collaboration in mind? Let’s build it together."
          />
        </div>

        <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }} disabled={saving}>
          <FaSave size={13} />
          <span>{saving ? "Saving to MongoDB..." : "Save Contact Info"}</span>
        </button>
      </form>
    </div>
  );
}

export default AdminContact;

