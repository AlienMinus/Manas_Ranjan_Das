// src/components/admin/AdminMessages.jsx
import React from "react";
import { FaInbox, FaTrash, FaRedo, FaEnvelope } from "react-icons/fa";
import { deleteAdminMessageApi } from "../../services/api";

function AdminMessages({ messages = [], password, loading, onRefresh, onSaveSuccess, onSaveError }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await deleteAdminMessageApi(id, password);
      if (res.success) {
        onSaveSuccess("Message deleted.");
        onRefresh();
      } else {
        throw new Error(res.error || "Failed to delete message");
      }
    } catch (err) {
      onSaveError(err.message);
    }
  };

  return (
    <div className="admin-panel">
      <div className="admin-panel__header">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <FaInbox style={{ color: "var(--accent-neon)", fontSize: "1.25rem" }} />
          <h2 className="admin-panel__title">Contact Form Inquiries ({messages.length} Total)</h2>
        </div>

        <button type="button" className="btn outline sm" onClick={onRefresh} disabled={loading}>
          <FaRedo size={12} />
          <span>{loading ? "Refreshing..." : "Refresh Inbox"}</span>
        </button>
      </div>

      {messages.length === 0 ? (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-secondary)" }}>
          <FaEnvelope size={32} style={{ color: "var(--text-muted)", marginBottom: "0.75rem" }} />
          <p>No contact messages in the database yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {messages.map((msg) => (
            <div key={msg._id} className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1.25rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
                <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "0.6rem" }}>
                  <strong style={{ color: "#ffffff", fontSize: "1rem" }}>{msg.name}</strong>
                  <span style={{ color: "var(--accent-neon)", fontSize: "0.85rem", fontFamily: "var(--font-mono)" }}>
                    &lt;{msg.email}&gt;
                  </span>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.925rem", whiteSpace: "pre-wrap", margin: 0 }}>
                  {msg.message}
                </p>
              </div>

              <button
                type="button"
                className="admin-icon-btn admin-icon-btn--delete"
                onClick={() => handleDelete(msg._id)}
                title="Delete Message"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AdminMessages;

