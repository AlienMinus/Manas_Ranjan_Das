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
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaCheckCircle,
  FaExclamationCircle,
  FaTimes,
  FaRedo,
  FaSignOutAlt,
} from "react-icons/fa";
import { usePortfolio } from "../context/usePortfolio";
import {
  getHealthStatus,
  updateHeroApi,
  updateAboutApi,
  createSkillApi,
  updateSkillApi,
  deleteSkillApi,
  createProjectApi,
  updateProjectApi,
  deleteProjectApi,
  createExperienceApi,
  updateExperienceApi,
  deleteExperienceApi,
  updateContactInfoApi,
  getAdminMessagesApi,
  deleteAdminMessageApi,
} from "../services/api";

const TABS = [
  { id: "overview", label: "Overview & Health", icon: FaDatabase },
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

  // Modals & Form States
  const [modalType, setModalType] = useState(null); // "project" | "experience" | "skill" | null
  const [editingItem, setEditingItem] = useState(null);

  // Hero Form State
  const [heroForm, setHeroForm] = useState({
    name: "",
    roles: "",
    location: "",
    heroTagline: "",
  });

  // About Form State
  const [aboutForm, setAboutForm] = useState({
    about: "",
    education: [],
  });

  // Contact Info Form State
  const [contactForm, setContactForm] = useState({
    email: "",
    phone: "",
    blog: "",
    message: "",
  });

  // Load health data
  const loadHealth = async () => {
    setHealthLoading(true);
    try {
      const res = await getHealthStatus();
      setHealthData(res);
    } catch {
      setHealthData({ status: "OFFLINE", mongo: { connected: false } });
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

  // Sync forms when portfolio data loads
  useEffect(() => {
    if (hero) {
      setHeroForm({
        name: hero.name || "",
        roles: (hero.roles || []).join(", "),
        location: hero.location || "",
        heroTagline: hero.heroTagline || "",
      });
    }
    if (about) {
      setAboutForm({
        about: about.about || "",
        education: about.education || [],
      });
    }
    if (contact) {
      setContactForm({
        email: contact.email || "",
        phone: contact.phone || "",
        blog: contact.blog || "",
        message: contact.message || "",
      });
    }
  }, [hero, about, contact]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert({ type: "", message: "" }), 4000);
  };

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

  // Save Hero Profile
  const handleSaveHero = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: heroForm.name,
        roles: heroForm.roles.split(",").map((r) => r.trim()).filter(Boolean),
        location: heroForm.location,
        heroTagline: heroForm.heroTagline,
        socialLinks: hero?.socialLinks || [],
      };
      const res = await updateHeroApi(payload, password);
      if (res.success) {
        showAlert("success", "Hero Profile updated successfully in MongoDB!");
        refreshData();
      } else {
        throw new Error(res.error || "Failed to update");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Save About & Education
  const handleSaveAbout = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        about: aboutForm.about,
        education: aboutForm.education,
        personal_details: about?.personal_details || {},
        achievements: about?.achievements || {},
        posts: about?.posts || {},
      };
      const res = await updateAboutApi(payload, password);
      if (res.success) {
        showAlert("success", "About & Education records updated in MongoDB!");
        refreshData();
      } else {
        throw new Error(res.error || "Failed to update");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Add Education Row
  const handleAddEducation = () => {
    setAboutForm((prev) => ({
      ...prev,
      education: [...prev.education, { institution: "", degree: "", year: "" }],
    }));
  };

  // Update Education Row
  const handleUpdateEduRow = (index, field, value) => {
    setAboutForm((prev) => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Delete Education Row
  const handleDeleteEduRow = (index) => {
    setAboutForm((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // Save Contact Info
  const handleSaveContact = async (e) => {
    e.preventDefault();
    try {
      const res = await updateContactInfoApi(contactForm, password);
      if (res.success) {
        showAlert("success", "Contact channels updated in MongoDB!");
        refreshData();
      } else {
        throw new Error(res.error || "Failed to update");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Project CRUD Actions
  const handleSaveProject = async (e) => {
    e.preventDefault();
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
        showAlert("success", `Project ${editingItem ? "updated" : "created"} in MongoDB!`);
        setModalType(null);
        setEditingItem(null);
        refreshData();
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project from MongoDB?")) return;
    try {
      const res = await deleteProjectApi(id, password);
      if (res.success) {
        showAlert("success", "Project deleted successfully.");
        refreshData();
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Experience CRUD Actions
  const handleSaveExperience = async (e) => {
    e.preventDefault();
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
        showAlert("success", `Experience role ${editingItem ? "updated" : "created"} in MongoDB!`);
        setModalType(null);
        setEditingItem(null);
        refreshData();
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!window.confirm("Are you sure you want to delete this experience entry from MongoDB?")) return;
    try {
      const res = await deleteExperienceApi(id, password);
      if (res.success) {
        showAlert("success", "Experience entry deleted successfully.");
        refreshData();
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Skill CRUD Actions
  const handleSaveSkill = async (e) => {
    e.preventDefault();
    const form = e.target;
    const itemsRaw = form.items.value.split("\n").map((line) => {
      const [name, icon] = line.split(",").map((s) => s.trim());
      return { name, icon: icon || "SiReact", iconLib: "si" };
    }).filter((i) => i.name);

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
        showAlert("success", `Skill category ${editingItem ? "updated" : "created"} in MongoDB!`);
        setModalType(null);
        setEditingItem(null);
        refreshData();
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  const handleDeleteSkill = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill category from MongoDB?")) return;
    try {
      const res = await deleteSkillApi(id, password);
      if (res.success) {
        showAlert("success", "Skill category deleted successfully.");
        refreshData();
      } else {
        throw new Error(res.error || "Failed");
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // Message Delete
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      const res = await deleteAdminMessageApi(id, password);
      if (res.success) {
        showAlert("success", "Message deleted.");
        loadMessages();
      }
    } catch (err) {
      showAlert("error", err.message);
    }
  };

  // 1. Render Login Screen if not authenticated
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

  // 2. Render Full Admin Dashboard
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
            <button type="button" className="btn outline sm" onClick={refreshData} title="Refresh All Data">
              <FaRedo size={12} />
              <span>Sync</span>
            </button>
            <button type="button" className="btn outline sm" onClick={handleLogout} title="Lock Admin Session">
              <FaSignOutAlt size={12} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Status Toast Alert */}
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

        {/* Navigation Tabs */}
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
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW & HEALTH */}
        {activeTab === "overview" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">MongoDB Server Health & Status</h2>
              <button type="button" className="btn outline sm" onClick={loadHealth} disabled={healthLoading}>
                <FaRedo size={12} />
                <span>{healthLoading ? "Pinging..." : "Refresh Health"}</span>
              </button>
            </div>

            <div className="health-metrics-grid">
              <div className="metric-card">
                <span className="metric-label">Status</span>
                <span className="metric-value">{healthData?.status || "OK"}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">MongoDB State</span>
                <span className="metric-value" style={{ fontSize: "1.2rem", textTransform: "capitalize" }}>
                  {healthData?.mongo?.status || "Connected"}
                </span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Projects</span>
                <span className="metric-value">{projects?.length || 0}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Experience</span>
                <span className="metric-value">{experience?.length || 0}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Skill Categories</span>
                <span className="metric-value">{skills?.length || 0}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Inbound Messages</span>
                <span className="metric-value">{messages?.length || 0}</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO PROFILE */}
        {activeTab === "hero" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Hero Profile & Branding</h2>
            </div>

            <form onSubmit={handleSaveHero} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Full Name</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={heroForm.name}
                    onChange={(e) => setHeroForm({ ...heroForm, name: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Location</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={heroForm.location}
                    onChange={(e) => setHeroForm({ ...heroForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Dynamic Rotating Roles (comma-separated)</label>
                <input
                  type="text"
                  className="admin-input"
                  value={heroForm.roles}
                  onChange={(e) => setHeroForm({ ...heroForm, roles: e.target.value })}
                  placeholder="e.g. Full-Stack Developer, AI Engineer, Researcher"
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Hero Tagline</label>
                <textarea
                  className="admin-textarea"
                  value={heroForm.heroTagline}
                  onChange={(e) => setHeroForm({ ...heroForm, heroTagline: e.target.value })}
                />
              </div>

              <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }}>
                <FaSave size={13} />
                <span>Save Hero Profile to MongoDB</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: ABOUT & EDUCATION */}
        {activeTab === "about" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">About Biography & Education Timeline</h2>
            </div>

            <form onSubmit={handleSaveAbout} className="admin-form">
              <div className="admin-form-group">
                <label className="admin-label">Full Biography Text</label>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: "150px" }}
                  value={aboutForm.about}
                  onChange={(e) => setAboutForm({ ...aboutForm, about: e.target.value })}
                  required
                />
              </div>

              <div className="admin-form-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                  <label className="admin-label">Education History</label>
                  <button type="button" className="btn outline sm" onClick={handleAddEducation}>
                    <FaPlus size={11} />
                    <span>Add Degree / School</span>
                  </button>
                </div>

                {aboutForm.education.map((edu, idx) => (
                  <div key={idx} className="admin-form-row" style={{ alignItems: "center", marginBottom: "0.5rem" }}>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Degree (e.g. B.Tech in ECE)"
                      value={edu.degree}
                      onChange={(e) => handleUpdateEduRow(idx, "degree", e.target.value)}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Institution (e.g. BPUT)"
                      value={edu.institution}
                      onChange={(e) => handleUpdateEduRow(idx, "institution", e.target.value)}
                    />
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="Year (e.g. 2023 - 2027)"
                      value={edu.year}
                      onChange={(e) => handleUpdateEduRow(idx, "year", e.target.value)}
                    />
                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDeleteEduRow(idx)}
                      title="Remove Row"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>

              <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }}>
                <FaSave size={13} />
                <span>Save About & Education to MongoDB</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: PROJECTS CRUD */}
        {activeTab === "projects" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Projects Database ({projects?.length || 0} Total)</h2>
              <button
                type="button"
                className="btn primary sm"
                onClick={() => {
                  setEditingItem(null);
                  setModalType("project");
                }}
              >
                <FaPlus size={12} />
                <span>Add New Project</span>
              </button>
            </div>

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
                  {(projects || []).map((proj) => (
                    <tr key={proj._id || proj.title}>
                      <td style={{ fontWeight: 600, color: "#ffffff" }}>{proj.title}</td>
                      <td>{(proj.techStack || []).join(", ")}</td>
                      <td>{(proj.tags || []).join(", ")}</td>
                      <td>{proj.featured ? "⭐ Yes" : "No"}</td>
                      <td>
                        <div className="admin-actions-cell">
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn--edit"
                            onClick={() => {
                              setEditingItem(proj);
                              setModalType("project");
                            }}
                            title="Edit Project"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn--delete"
                            onClick={() => handleDeleteProject(proj._id)}
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
          </div>
        )}

        {/* TAB 5: EXPERIENCE CRUD */}
        {activeTab === "experience" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Experience Timeline ({experience?.length || 0} Roles)</h2>
              <button
                type="button"
                className="btn primary sm"
                onClick={() => {
                  setEditingItem(null);
                  setModalType("experience");
                }}
              >
                <FaPlus size={12} />
                <span>Add Experience</span>
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {(experience || []).map((exp) => (
                    <tr key={exp._id || exp.role + exp.company}>
                      <td style={{ fontWeight: 600, color: "#ffffff" }}>{exp.role}</td>
                      <td style={{ color: "var(--accent-neon)" }}>{exp.company}</td>
                      <td>{exp.duration}</td>
                      <td>
                        <div className="admin-actions-cell">
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn--edit"
                            onClick={() => {
                              setEditingItem(exp);
                              setModalType("experience");
                            }}
                            title="Edit Experience"
                          >
                            <FaEdit size={12} />
                          </button>
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn--delete"
                            onClick={() => handleDeleteExperience(exp._id)}
                            title="Delete Experience"
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
          </div>
        )}

        {/* TAB 6: SKILLS CRUD */}
        {activeTab === "skills" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Skill Categories ({skills?.length || 0} Categories)</h2>
              <button
                type="button"
                className="btn primary sm"
                onClick={() => {
                  setEditingItem(null);
                  setModalType("skill");
                }}
              >
                <FaPlus size={12} />
                <span>Add Skill Category</span>
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.25rem" }}>
              {(skills || []).map((cat) => (
                <div key={cat._id || cat.category} className="card" style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "1.05rem", color: "var(--accent-neon)", margin: 0 }}>{cat.category}</h3>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--edit"
                        onClick={() => {
                          setEditingItem(cat);
                          setModalType("skill");
                        }}
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn--delete"
                        onClick={() => handleDeleteSkill(cat._id)}
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
          </div>
        )}

        {/* TAB 7: CONTACT INFO */}
        {activeTab === "contact" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Contact Information & Channels</h2>
            </div>

            <form onSubmit={handleSaveContact} className="admin-form">
              <div className="admin-form-row">
                <div className="admin-form-group">
                  <label className="admin-label">Email Address</label>
                  <input
                    type="email"
                    className="admin-input"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>

                <div className="admin-form-group">
                  <label className="admin-label">Phone / WhatsApp</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Technical Blog URL</label>
                <input
                  type="url"
                  className="admin-input"
                  value={contactForm.blog}
                  onChange={(e) => setContactForm({ ...contactForm, blog: e.target.value })}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-label">Contact Section Subtitle Message</label>
                <textarea
                  className="admin-textarea"
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn primary" style={{ alignSelf: "flex-start" }}>
                <FaSave size={13} />
                <span>Save Contact Information to MongoDB</span>
              </button>
            </form>
          </div>
        )}

        {/* TAB 8: MESSAGES INBOX */}
        {activeTab === "messages" && (
          <div className="admin-panel">
            <div className="admin-panel__header">
              <h2 className="admin-panel__title">Contact Form Inquiries ({messages.length})</h2>
              <button type="button" className="btn outline sm" onClick={loadMessages} disabled={messagesLoading}>
                <FaRedo size={12} />
                <span>Refresh Inbox</span>
              </button>
            </div>

            {messages.length === 0 ? (
              <p style={{ color: "var(--text-secondary)" }}>No messages received yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {messages.map((msg) => (
                  <div key={msg._id} className="card" style={{ display: "flex", justifyContent: "space-between", gap: "1rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                        <strong style={{ color: "#ffffff" }}>{msg.name}</strong>
                        <span style={{ color: "var(--accent-neon)", fontSize: "0.85rem" }}>&lt;{msg.email}&gt;</span>
                        <span style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontFamily: "var(--font-mono)" }}>
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", whiteSpace: "pre-wrap" }}>
                        {msg.message}
                      </p>
                    </div>

                    <button
                      type="button"
                      className="admin-icon-btn admin-icon-btn--delete"
                      onClick={() => handleDeleteMessage(msg._id)}
                      title="Delete Message"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* =====================================================================
          CRUD MODALS (Project, Experience, Skill)
          ===================================================================== */}

      {/* Project Modal */}
      {modalType === "project" && (
        <div className="admin-modal-backdrop" onClick={() => setModalType(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingItem ? "Edit Project" : "Add New Project"}</h3>
              <button type="button" className="chatbot-close" onClick={() => setModalType(null)}>
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="admin-form">
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
                  id="featured-proj"
                  defaultChecked={editingItem?.featured || false}
                />
                <label htmlFor="featured-proj" className="admin-label">
                  Mark as Featured Project on Home Page
                </label>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className="btn outline sm" onClick={() => setModalType(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary sm">
                  <FaSave size={12} />
                  <span>{editingItem ? "Update Project" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Experience Modal */}
      {modalType === "experience" && (
        <div className="admin-modal-backdrop" onClick={() => setModalType(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingItem ? "Edit Experience" : "Add New Experience"}</h3>
              <button type="button" className="chatbot-close" onClick={() => setModalType(null)}>
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="admin-form">
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
                  <label className="admin-label">Icon Name</label>
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
                <label className="admin-label">Responsibilities / Highlights (One per line)</label>
                <textarea
                  name="details"
                  className="admin-textarea"
                  defaultValue={(editingItem?.details || []).join("\n")}
                  placeholder="Bullet point 1&#10;Bullet point 2"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className="btn outline sm" onClick={() => setModalType(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary sm">
                  <FaSave size={12} />
                  <span>{editingItem ? "Update Experience" : "Create Experience"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Skill Category Modal */}
      {modalType === "skill" && (
        <div className="admin-modal-backdrop" onClick={() => setModalType(null)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h3 className="admin-modal__title">{editingItem ? "Edit Skill Category" : "Add Skill Category"}</h3>
              <button type="button" className="chatbot-close" onClick={() => setModalType(null)}>
                <FaTimes size={13} />
              </button>
            </div>

            <form onSubmit={handleSaveSkill} className="admin-form">
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
                  placeholder="JavaScript, SiJavascript&#10;Python, SiPython&#10;React.js, SiReact"
                  defaultValue={(editingItem?.items || []).map((i) => `${i.name}, ${i.icon}`).join("\n")}
                />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "1rem" }}>
                <button type="button" className="btn outline sm" onClick={() => setModalType(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn primary sm">
                  <FaSave size={12} />
                  <span>{editingItem ? "Update Category" : "Create Category"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
