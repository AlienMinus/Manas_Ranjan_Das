// src/components/admin/AdminOverview.jsx
import React, { useState } from "react";
import {
  FaDatabase,
  FaRedo,
  FaChartPie,
  FaLayerGroup,
  FaServer,
  FaCode,
  FaCheckCircle,
  FaMicrochip,
  FaRobot,
} from "react-icons/fa";

function AdminOverview({
  healthData,
  healthLoading,
  onRefreshHealth,
  projects = [],
  experience = [],
  skills = [],
  messages = [],
  about = null,
}) {
  const [pingLatency, setPingLatency] = useState(null);
  const [isPinging, setIsPinging] = useState(false);

  const educationCount = about?.education?.length || 0;
  const projectCount = projects?.length || 0;
  const expCount = experience?.length || 0;
  const skillItemsCount = skills.reduce((acc, cat) => acc + (cat.items?.length || 0), 0);
  const messageCount = messages?.length || 0;

  const totalDocuments =
    projectCount + expCount + skillItemsCount + educationCount + messageCount || 1;

  // Percentage distribution calculations
  const pctProjects = Math.round((projectCount / totalDocuments) * 100) || 0;
  const pctSkills = Math.round((skillItemsCount / totalDocuments) * 100) || 0;
  const pctExp = Math.round((expCount / totalDocuments) * 100) || 0;
  const pctEdu = Math.round((educationCount / totalDocuments) * 100) || 0;
  const pctMsg = Math.round((messageCount / totalDocuments) * 100) || 0;

  // Project domain breakdowns
  const aiProjects = projects.filter((p) =>
    (p.tags || []).concat(p.techStack || []).some((t) => /ai|ml|vision|python|pytorch|yolo/i.test(t))
  ).length;

  const iotProjects = projects.filter((p) =>
    (p.tags || []).concat(p.techStack || []).some((t) => /iot|embedded|esp32|arduino|hardware|energy/i.test(t))
  ).length;

  const webProjects = projects.filter((p) =>
    (p.tags || []).concat(p.techStack || []).some((t) => /react|node|web|fullstack|javascript/i.test(t))
  ).length;

  // Ping Latency Tester
  const handleTestLatency = async () => {
    setIsPinging(true);
    const start = performance.now();
    try {
      await onRefreshHealth();
      const end = performance.now();
      setPingLatency(Math.round(end - start));
    } catch {
      setPingLatency("Error");
    } finally {
      setIsPinging(false);
    }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-panel__header">
        <h2 className="admin-panel__title">
          <span>Database Overview & Graphical Metrics</span>
        </h2>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            className="btn outline sm"
            onClick={handleTestLatency}
            disabled={isPinging}
            title="Ping API and measure latency"
          >
            <FaServer size={12} />
            <span>{isPinging ? "Pinging..." : pingLatency ? `${pingLatency}ms` : "Ping Latency"}</span>
          </button>

          <button
            type="button"
            className="btn primary sm"
            onClick={onRefreshHealth}
            disabled={healthLoading}
          >
            <FaRedo size={12} />
            <span>{healthLoading ? "Syncing..." : "Sync Metrics"}</span>
          </button>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="health-metrics-grid">
        <div className="metric-card">
          <span className="metric-label">MongoDB State</span>
          <span className="metric-value" style={{ fontSize: "1.25rem", color: "var(--accent-neon)" }}>
            {healthData?.mongo?.status?.toUpperCase() || "CONNECTED"}
          </span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Total Projects</span>
          <span className="metric-value">{projectCount}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Skills Indexed</span>
          <span className="metric-value">{skillItemsCount}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Career Roles</span>
          <span className="metric-value">{expCount}</span>
        </div>

        <div className="metric-card">
          <span className="metric-label">Inbound Messages</span>
          <span className="metric-value">{messageCount}</span>
        </div>
      </div>

      {/* Graphical Data Visualizations Grid */}
      <div className="charts-grid">
        {/* Chart 1: Multi-Segment Collection Distribution */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <FaChartPie />
            <span>Database Collection Volume Distribution</span>
          </h3>

          <div className="chart-dist-bar-wrapper">
            <div className="chart-dist-bar">
              <div
                className="chart-segment chart-segment--projects"
                style={{ width: `${pctProjects}%` }}
                title={`Projects: ${projectCount} (${pctProjects}%)`}
              />
              <div
                className="chart-segment chart-segment--skills"
                style={{ width: `${pctSkills}%` }}
                title={`Skills: ${skillItemsCount} (${pctSkills}%)`}
              />
              <div
                className="chart-segment chart-segment--experience"
                style={{ width: `${pctExp}%` }}
                title={`Experience: ${expCount} (${pctExp}%)`}
              />
              <div
                className="chart-segment chart-segment--education"
                style={{ width: `${pctEdu}%` }}
                title={`Education: ${educationCount} (${pctEdu}%)`}
              />
              <div
                className="chart-segment chart-segment--messages"
                style={{ width: `${pctMsg}%` }}
                title={`Messages: ${messageCount} (${pctMsg}%)`}
              />
            </div>

            {/* Legends */}
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#00ff66" }}></span>
                <span>Projects ({pctProjects}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#38bdf8" }}></span>
                <span>Skills ({pctSkills}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#a855f7" }}></span>
                <span>Experience ({pctExp}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#facc15" }}></span>
                <span>Education ({pctEdu}%)</span>
              </div>
              <div className="legend-item">
                <span className="legend-dot" style={{ background: "#f43f5e" }}></span>
                <span>Messages ({pctMsg}%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart 2: Project Domain Focus Breakdown */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <FaCode />
            <span>Engineering Project Domains</span>
          </h3>

          <div className="progress-meters-list">
            <div className="progress-meter-row">
              <div className="progress-meter-info">
                <span className="progress-meter-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FaRobot style={{ color: "#38bdf8" }} />
                  <span>AI, Machine Learning & Vision</span>
                </span>
                <span className="progress-meter-count">
                  {aiProjects} projects ({projectCount ? Math.round((aiProjects / projectCount) * 100) : 0}%)
                </span>
              </div>
              <div className="progress-meter-track">
                <div
                  className="progress-meter-fill"
                  style={{
                    width: `${projectCount ? (aiProjects / projectCount) * 100 : 0}%`,
                    background: "linear-gradient(90deg, #38bdf8, #00ff66)",
                  }}
                />
              </div>
            </div>

            <div className="progress-meter-row">
              <div className="progress-meter-info">
                <span className="progress-meter-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FaMicrochip style={{ color: "#a855f7" }} />
                  <span>IoT, Telemetry & Embedded Systems</span>
                </span>
                <span className="progress-meter-count">
                  {iotProjects} projects ({projectCount ? Math.round((iotProjects / projectCount) * 100) : 0}%)
                </span>
              </div>
              <div className="progress-meter-track">
                <div
                  className="progress-meter-fill"
                  style={{
                    width: `${projectCount ? (iotProjects / projectCount) * 100 : 0}%`,
                    background: "linear-gradient(90deg, #a855f7, #ec4899)",
                  }}
                />
              </div>
            </div>

            <div className="progress-meter-row">
              <div className="progress-meter-info">
                <span className="progress-meter-label" style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
                  <FaCode style={{ color: "#00ff66" }} />
                  <span>Full-Stack & Web Architecture</span>
                </span>
                <span className="progress-meter-count">
                  {webProjects} projects ({projectCount ? Math.round((webProjects / projectCount) * 100) : 0}%)
                </span>
              </div>
              <div className="progress-meter-track">
                <div
                  className="progress-meter-fill"
                  style={{
                    width: `${projectCount ? (webProjects / projectCount) * 100 : 0}%`,
                    background: "var(--gradient-primary)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Chart 3: Skills Categories Breakdown */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <FaLayerGroup />
            <span>Technical Skills by Category</span>
          </h3>

          <div className="progress-meters-list">
            {skills.map((cat) => {
              const count = cat.items?.length || 0;
              const pct = skillItemsCount ? Math.round((count / skillItemsCount) * 100) : 0;
              return (
                <div key={cat._id || cat.category} className="progress-meter-row">
                  <div className="progress-meter-info">
                    <span className="progress-meter-label">{cat.category}</span>
                    <span className="progress-meter-count">{count} skills ({pct}%)</span>
                  </div>
                  <div className="progress-meter-track">
                    <div className="progress-meter-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 4: System & Database Live Details */}
        <div className="chart-card">
          <h3 className="chart-card__title">
            <FaDatabase />
            <span>MongoDB Connection Diagnostics</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.35rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Database Server</span>
              <span style={{ color: "#ffffff", fontFamily: "var(--font-mono)" }}>
                {healthData?.mongo?.host || "localhost:27017"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.35rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Database Name</span>
              <span style={{ color: "#ffffff", fontFamily: "var(--font-mono)" }}>
                {healthData?.mongo?.name || "portfolio_v1"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.05)", paddingBottom: "0.35rem" }}>
              <span style={{ color: "var(--text-muted)" }}>Server Environment</span>
              <span style={{ color: "var(--accent-neon)", fontFamily: "var(--font-mono)" }}>
                {healthData?.environment || "development"}
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ color: "var(--text-muted)" }}>Connection Integrity</span>
              <span style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#00ff66", fontWeight: 700 }}>
                <FaCheckCircle size={12} />
                <span>Active & Synced</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminOverview;

