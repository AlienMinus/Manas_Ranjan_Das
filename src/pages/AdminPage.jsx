// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { FaTrash, FaSyncAlt, FaSignOutAlt, FaLock, FaUserShield } from "react-icons/fa";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null); // "error" | null
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const API_BASE = "https://manas-ranjan-das.onrender.com";

  const formatDate = (isoString) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleString();
  };

  const fetchMessages = async (withLoading = false) => {
    if (!authed && !withLoading) return;
    if (withLoading) setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/messages`, {
        headers: {
          "x-admin-password": password,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setMessages(data.messages || []);
        setStatus(null);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error(data.error || "Unauthorized");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      if (withLoading) setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE}/api/admin/messages`, {
        headers: {
          "x-admin-password": password,
        },
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Unauthorized");
      }

      setAuthed(true);
      setMessages(data.messages || []);
      setStatus(null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      console.error(err);
      setStatus("error");
      setAuthed(false);
      setMessages([]);
      setLastUpdated(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (!authed) return;
    fetchMessages(true);
  };

  const handleDelete = async (id) => {
    if (!authed) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to permanently delete this message?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: {
          "x-admin-password": password,
        },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }

      // Optimistically update local state
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setStatus(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh every 5 seconds after login
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => {
      fetchMessages(false);
    }, 5000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, password]);

  return (
    <section className="section" aria-label="Admin Portal">
      <div className="section__header">
        <h2 className="section__title">
          <span>Admin</span> <span className="gradient-text">Portal</span>
        </h2>
        <p className="section__subtitle">
          Manage and review incoming messages from prospective clients and collaborators.
        </p>
      </div>

      {!authed ? (
        <form className="admin-login" onSubmit={handleLogin}>
          <div style={{ textAlign: "center", color: "var(--accent-cyan)", fontSize: "2rem" }}>
            <FaLock />
          </div>
          <h3 className="admin-login__title">Administrator Authentication</h3>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            aria-label="Admin Password"
          />
          <button type="submit" className="btn primary" disabled={loading}>
            <FaUserShield />
            <span>{loading ? "Authenticating..." : "Access Dashboard"}</span>
          </button>
          {status === "error" && (
            <p className="admin-error">
              Invalid credentials or authentication server unreachable.
            </p>
          )}
        </form>
      ) : (
        <>
          <div className="admin-dashboard-bar">
            <div className="admin-dashboard-stats">
              <div>
                <span style={{ fontSize: "0.95rem", fontWeight: "600" }}>
                  Logged in as <strong>Admin</strong>
                </span>
                <span className="badge badge--emerald" style={{ marginLeft: "0.5rem" }}>
                  Active Session
                </span>
              </div>
              <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                Total Messages: <strong style={{ color: "var(--text-primary)" }}>{messages.length}</strong>
                {lastUpdated && ` • Updated at ${lastUpdated}`}
              </div>
            </div>

            <div className="admin-dashboard-actions">
              <button
                type="button"
                className="btn outline sm"
                onClick={handleRefresh}
                disabled={loading}
              >
                <FaSyncAlt className={loading ? "spin" : ""} size={12} />
                <span>{loading ? "Syncing..." : "Refresh"}</span>
              </button>
              <button
                type="button"
                className="btn outline sm"
                onClick={() => {
                  setAuthed(false);
                  setMessages([]);
                  setPassword("");
                  setLastUpdated(null);
                  setStatus(null);
                }}
              >
                <FaSignOutAlt size={12} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {messages.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: "3rem" }}>
              <p style={{ color: "var(--text-secondary)" }}>No messages received yet.</p>
            </div>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table" aria-label="Messages List">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Sender Name</th>
                    <th>Email Address</th>
                    <th>Message Details</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m) => (
                    <tr key={m._id}>
                      <td style={{ whiteSpace: "nowrap", fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--text-muted)" }}>
                        {formatDate(m.createdAt)}
                      </td>
                      <td style={{ fontWeight: "600" }}>{m.name}</td>
                      <td>
                        <a href={`mailto:${m.email}`} style={{ color: "var(--accent-cyan)" }}>
                          {m.email}
                        </a>
                      </td>
                      <td style={{ lineHeight: "1.5" }}>{m.message}</td>
                      <td>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => handleDelete(m._id)}
                          title="Delete message permanently"
                          aria-label="Delete message"
                        >
                          <FaTrash size={13} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default AdminPage;
