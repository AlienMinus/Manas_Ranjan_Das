// Admin page to view data from src/data/response.csv
// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import { FaTrash } from "react-icons/fa";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState(null); // "error" | null
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchMessages = async (withLoading = false) => {
    if (!authed && !withLoading) return;
    if (withLoading) setLoading(true);
    try {
      const res = await fetch("https://manas.up.railway.app/api/admin/messages", {
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
      const res = await fetch("https://manas.up.railway.app/api/admin/messages", {
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

  // 🗑️ Delete single message
  const handleDelete = async (timestamp) => {
    if (!authed) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this message?"
    );
    if (!confirmDelete) return;

    try {
      setLoading(true);
      const res = await fetch(
        `https://manas.up.railway.app/api/admin/messages/${encodeURIComponent(
          timestamp
        )}`,
        {
          method: "DELETE",
          headers: {
            "x-admin-password": password,
          },
        }
      );

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to delete");
      }

      // Optimistically update local state
      setMessages((prev) =>
        prev.filter((m) => m.timestamp !== timestamp)
      );
      setStatus(null);
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Auto-refresh every 2 seconds after login
  useEffect(() => {
    if (!authed) return;
    const id = setInterval(() => {
      fetchMessages(false);
    }, 2000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed, password]);

  return (
    <section className="section">
      <h2 className="section__title">Admin Panel</h2>

      {!authed && (
        <form
          className="admin-login"
          onSubmit={handleLogin}
          style={{
            maxWidth: "320px",
            display: "flex",
            flexDirection: "column",
            gap: "0.6rem",
          }}
        >
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn primary" disabled={loading}>
            {loading ? "Verifying..." : "Login"}
          </button>
          {status === "error" && (
            <p style={{ color: "#ff6b6b", fontSize: "0.9rem" }}>
              ❌ Invalid password or server error.
            </p>
          )}
        </form>
      )}

      {authed && (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div>
              <p style={{ opacity: 0.8, fontSize: "0.9rem" }}>
                Logged in as <strong>admin</strong>. Total messages:{" "}
                <strong>{messages.length}</strong>
              </p>
              <p style={{ opacity: 0.6, fontSize: "0.8rem" }}>
                🟢 Auto-refresh every 2s
                {lastUpdated && ` • Last updated at ${lastUpdated}`}
              </p>
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="btn outline"
                type="button"
                onClick={handleRefresh}
                disabled={loading}
              >
                {loading ? "Refreshing..." : "Refresh"}
              </button>
              <button
                className="btn outline"
                type="button"
                onClick={() => {
                  setAuthed(false);
                  setMessages([]);
                  setPassword("");
                  setLastUpdated(null);
                  setStatus(null);
                }}
              >
                Logout
              </button>
            </div>
          </div>

          {messages.length === 0 ? (
            <p style={{ opacity: 0.8 }}>No messages yet.</p>
          ) : (
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Message</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((m, idx) => (
                    <tr key={idx}>
                      <td>{m.timestamp}</td>
                      <td>{m.name}</td>
                      <td>{m.email}</td>
                      <td>{m.message}</td>
                      <td>
                        <button
                          type="button"
                          className="icon-btn icon-btn--danger"
                          onClick={() => handleDelete(m.timestamp)}
                          title="Delete message"
                        >
                          <FaTrash size={14} />
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
