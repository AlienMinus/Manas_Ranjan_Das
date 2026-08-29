// src/pages/AdminPage.jsx
import React, { useState, useEffect } from "react";
import {
  FaShieldAlt,
  FaDatabase,
  FaUserAstronaut,
  FaBookOpen,
  FaCode,
  FaBriefcase,
  FaTools,
  FaPhoneAlt,
  FaInbox,
  FaCheckCircle,
  FaExclamationCircle,
  FaRedo,
  FaSignOutAlt,
} from "react-icons/fa";

// Context & API
import { usePortfolio } from "../context/usePortfolio";
import {
  getHealthStatus,
  getAdminMessagesApi,
} from "../services/api";

// Modular Admin Subcomponents
import AdminOverview from "../components/admin/AdminOverview";
import AdminHero from "../components/admin/AdminHero";
import AdminAbout from "../components/admin/AdminAbout";
import AdminProjects from "../components/admin/AdminProjects";
import AdminExperience from "../components/admin/AdminExperience";
import AdminSkills from "../components/admin/AdminSkills";
import AdminContact from "../components/admin/AdminContact";
import AdminMessages from "../components/admin/AdminMessages";

const TABS = [
  { id: "overview", label: "Overview & Charts", icon: FaDatabase },
  { id: "hero", label: "Hero Profile", icon: FaUserAstronaut },
  { id: "about", label: "About & Education", icon: FaBookOpen },
  { id: "projects", label: "Projects CRUD", icon: FaCode },
  { id: "experience", label: "Experience CRUD", icon: FaBriefcase },
  { id: "skills", label: "Skills CRUD", icon: FaTools },
  { id: "contact", label: "Contact Info", icon: FaPhoneAlt },
  { id: "messages", label: "Messages Inbox", icon: FaInbox },
];

function AdminPage() {
  const { hero, about, skills, projects, experience, contact, refreshData } = usePortfolio();

  const [password, setPassword] = useState(() => sessionStorage.getItem("minus_admin_pw") || "");
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!sessionStorage.getItem("minus_admin_pw"));
  const [loginError, setLoginError] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // Health State
  const [healthData, setHealthData] = useState(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Inbound Messages
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Status Alerts
  const [alert, setAlert] = useState({ type: "", message: "" });

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4500);
  };

  const handleSaveSuccess = (msg) => {
    showAlert("success", msg);
    refreshData();
  };

  const handleSaveError = (msg) => {
    showAlert("error", msg);
  };

  // Load health data
  const loadHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await getHealthStatus();
      setHealthData(res);
    } catch {
      setHealthData({ status: "OFFLINE", mongo: { connected: false, status: "disconnected" } });
    } finally {
      setHealthLoading(false);
    }
  };

  // Load admin messages
  const loadMessages = async () => {
    if (!password) return;
    setMessagesLoading(true);
    try {
      const res = await getAdminMessagesApi(password);
      if (res.success) {
        setMessages(res.messages || []);
      }
    } catch {
      // ignore
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadHealth();
      loadMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) {
      setLoginError("Please enter the administrator password");
      return;
    }
    sessionStorage.setItem("minus_admin_pw", password);
    setIsAuthenticated(true);
    setLoginError("");
  };

  const handleLogout = () => {
    sessionStorage.removeItem("minus_admin_pw");
    setPassword("");
    setIsAuthenticated(false);
  };

  // 1. Render Login Gate if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-login-wrapper">
        <div className="admin-login-card">
          <div className="admin-login-icon">
            <FaShieldAlt />
          </div>
          <div>
            <h1 style={{ fontFamily: "var(--font-heading)", fontSize: "1.5rem", color: "#ffffff" }}>
              Minus Admin Suite
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
              MongoDB Backend Management & CRUD Operations
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <input
              type="password"
              className="admin-input"
              placeholder="Enter administrator password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />

            {loginError && (
              <div style={{ color: "#ef4444", fontSize: "0.85rem" }}>{loginError}</div>
            )}

            <button type="submit" className="btn primary" style={{ width: "100%" }}>
              <FaShieldAlt size={13} />
              <span>Unlock Admin Suite</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. Render Main Admin Dashboard
  return (
    <div className="page">
      <div className="admin-container">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header__title">
            <FaDatabase style={{ color: "var(--accent-neon)", fontSize: "1.4rem" }} />
            <h1>MongoDB Admin Suite</h1>
            <span className="badge badge--emerald">Connected</span>
          </div>

          <div className="admin-header__actions">
            <button type="button" className="btn outline sm" onClick={refreshData} title="Sync All Collections">
              <FaRedo size={12} />
              <span>Sync All</span>
            </button>
            <button type="button" className="btn outline sm" onClick={handleLogout} title="Lock Admin Session">
              <FaSignOutAlt size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Global Status Toast Alert */}
        {alert.message && (
          <div
            className={`form-alert ${
              alert.type === "success" ? "form-alert--success" : "form-alert--error"
            }`}
          >
            {alert.type === "success" ? <FaCheckCircle /> : <FaExclamationCircle />}
            <span>{alert.message}</span>
          </div>
        )}

        {/* Navigation Tabs - Wrapped Responsive Bubbles (No Horizontal Scroll) */}
        <div className="admin-tabs">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                className={`admin-tab-btn ${activeTab === tab.id ? "admin-tab-btn--active" : ""}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modular Tab Panels */}
        {activeTab === "overview" && (
          <AdminOverview
            healthData={healthData}
            healthLoading={healthLoading}
            onRefreshHealth={loadHealth}
            projects={projects || []}
            experience={experience || []}
            skills={skills || []}
            messages={messages}
            about={about}
          />
        )}

        {activeTab === "hero" && (
          <AdminHero
            hero={hero}
            password={password}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}

        {activeTab === "about" && (
          <AdminAbout
            about={about}
            password={password}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}

        {activeTab === "projects" && (
          <AdminProjects
            projects={projects || []}
            password={password}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}

        {activeTab === "experience" && (
          <AdminExperience
            experience={experience || []}
            password={password}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}

        {activeTab === "skills" && (
          <AdminSkills
            skills={skills || []}
            password={password}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}

        {activeTab === "contact" && (
          <AdminContact
            contact={contact}
            password={password}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}

        {activeTab === "messages" && (
          <AdminMessages
            messages={messages}
            password={password}
            loading={messagesLoading}
            onRefresh={loadMessages}
            onSaveSuccess={handleSaveSuccess}
            onSaveError={handleSaveError}
          />
        )}
      </div>
    </div>
  );
}

export default AdminPage;
