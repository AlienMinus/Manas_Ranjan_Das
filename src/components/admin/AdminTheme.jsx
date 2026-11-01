// src/components/admin/AdminTheme.jsx
import React, { useState } from "react";
import {
  FaPalette,
  FaCheck,
  FaEye,
  FaSave,
  FaCube,
  FaGem,
  FaTerminal,
  FaCrown,
  FaSun,
  FaBuilding,
  FaAdjust,
  FaGamepad,
} from "react-icons/fa";
import { usePortfolio } from "../../context/usePortfolio";
import { updateSettingsApi } from "../../services/api";

const THEMES_CONFIG = [
  {
    id: "cyberpunk",
    name: "Cyberpunk Matrix",
    tagline: "High-tech terminal HUD with neon matrix green, scanlines, and emerald glass.",
    icon: FaTerminal,
    badge: "Matrix Green",
    accentColor: "#00ff66",
    surfaceColor: "#08130a",
    borderColor: "rgba(0, 255, 102, 0.4)",
    buttonGradient: "linear-gradient(135deg, #00ff66 0%, #10b981 100%)",
    buttonTextColor: "#022c14",
    vibe: "Neon Cybernetic HUD",
  },
  {
    id: "glassmorphism",
    name: "Glassmorphism",
    tagline: "Ultra frosted glass, cosmic indigo aura, prismatic cyan & violet refraction.",
    icon: FaGem,
    badge: "Frosted Glass & Aura",
    accentColor: "#38bdf8",
    surfaceColor: "rgba(255, 255, 255, 0.08)",
    borderColor: "rgba(255, 255, 255, 0.28)",
    buttonGradient: "linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)",
    buttonTextColor: "#030712",
    vibe: "Translucent Refraction",
  },
  {
    id: "skeuomorphism",
    name: "Skeuomorphism",
    tagline: "Tactile physical 3D depth, embossed push buttons, brushed graphite, & warm tungsten amber.",
    icon: FaCube,
    badge: "Tactile 3D Depth",
    accentColor: "#f59e0b",
    surfaceColor: "#22262d",
    borderColor: "#363c46",
    buttonGradient: "linear-gradient(180deg, #fbbf24 0%, #d97706 100%)",
    buttonTextColor: "#171100",
    vibe: "Machined Bevels & Depth",
  },
  {
    id: "luxury-gold",
    name: "Luxury Dark Gold",
    tagline: "Velvet obsidian black with 24K royal champagne gold accents and warm candle-light glow.",
    icon: FaCrown,
    badge: "Obsidian & Gold",
    accentColor: "#d4af37",
    surfaceColor: "#121218",
    borderColor: "rgba(212, 175, 55, 0.35)",
    buttonGradient: "linear-gradient(135deg, #d4af37 0%, #aa771c 100%)",
    buttonTextColor: "#070709",
    vibe: "Prestige Elegance",
  },
  {
    id: "synthwave",
    name: "Synthwave 80s",
    tagline: "Retro 80s dusk sunset with laser cyan and hot neon magenta cyber glow.",
    icon: FaSun,
    badge: "Neon Dusk Sunset",
    accentColor: "#ff2a85",
    surfaceColor: "#1b0c38",
    borderColor: "rgba(255, 42, 133, 0.4)",
    buttonGradient: "linear-gradient(135deg, #ff2a85 0%, #a855f7 100%)",
    buttonTextColor: "#ffffff",
    vibe: "Retro Horizon Sunset",
  },
  {
    id: "corporate",
    name: "Corporate (Blue + White)",
    tagline: "Executive enterprise aesthetic with clean navy, royal blue, ice white, and high-trust clarity.",
    icon: FaBuilding,
    badge: "Executive Blue",
    accentColor: "#3b82f6",
    surfaceColor: "#0d1733",
    borderColor: "rgba(96, 165, 250, 0.4)",
    buttonGradient: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    buttonTextColor: "#ffffff",
    vibe: "Enterprise High-Trust",
  },
  {
    id: "retro-bw",
    name: "Retro Theme (B & W)",
    tagline: "Monochrome film noir print with pure black, stark white, and newspaper-style high contrast.",
    icon: FaAdjust,
    badge: "Monochrome Noir",
    accentColor: "#ffffff",
    surfaceColor: "#171717",
    borderColor: "#525252",
    buttonGradient: "linear-gradient(135deg, #ffffff 0%, #a3a3a3 100%)",
    buttonTextColor: "#000000",
    vibe: "Stark Monochrome Print",
  },
  {
    id: "pixelatte",
    name: "Pixelatte (Retro Arcade)",
    tagline: "8-bit/16-bit retro arcade video game console with gold coins, 1-up cyan, and chunky pixel bevels.",
    icon: FaGamepad,
    badge: "8-Bit Video Game",
    accentColor: "#facc15",
    surfaceColor: "#1b0e45",
    borderColor: "#facc15",
    buttonGradient: "#facc15",
    buttonTextColor: "#0f0728",
    vibe: "Chunky 8-Bit Arcade",
  },
];

function AdminTheme({ password, onSaveSuccess, onSaveError }) {
  const { theme: currentTheme, setTheme, settings, refreshData } = usePortfolio();
  const [savingThemeId, setSavingThemeId] = useState(null);

  const activeMasterTheme = settings?.theme || "cyberpunk";

  // Quick preview locally
  const handlePreview = (themeId) => {
    setTheme(themeId, true);
  };

  // Save to MongoDB site-wide for all visitors
  const handleSaveMasterTheme = async (themeId) => {
    setSavingThemeId(themeId);
    try {
      const res = await updateSettingsApi({ theme: themeId }, password);
      if (res.success) {
        setTheme(themeId, false);
        sessionStorage.removeItem("minus_theme_preview_locked");
        onSaveSuccess(`Theme "${themeId}" saved as portfolio master theme in MongoDB!`);
        refreshData();
      } else {
        throw new Error(res.error || "Failed to update theme");
      }
    } catch (err) {
      onSaveError(err.message);
    } finally {
      setSavingThemeId(null);
    }
  };

  return (
    <div className="admin-panel">
      {/* Header */}
      <div className="admin-panel__header" style={{ flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 className="admin-panel__title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FaPalette style={{ color: "var(--accent-neon)" }} />
            <span>Theme & Visual Aesthetics Engine</span>
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
            Select your master portfolio aesthetic. Changes dynamically update background lighting, cards, buttons, fonts, and borders across the entire site.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              fontSize: "0.8rem",
              padding: "0.35rem 0.75rem",
              borderRadius: "var(--radius-full)",
              background: "rgba(0, 255, 102, 0.08)",
              border: "1px solid var(--accent-neon)",
              color: "var(--accent-neon)",
              fontFamily: "var(--font-mono)",
            }}
          >
            Live Master Theme: <strong>{activeMasterTheme.toUpperCase()}</strong>
          </span>
        </div>
      </div>

      {/* Themes Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
          gap: "1.5rem",
          marginTop: "1.5rem",
        }}
      >
        {THEMES_CONFIG.map((t) => {
          const Icon = t.icon;
          const isMaster = activeMasterTheme === t.id;
          const isCurrentlyViewing = currentTheme === t.id;

          return (
            <div
              key={t.id}
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(16px)",
                border: isCurrentlyViewing
                  ? `2px solid ${t.accentColor}`
                  : "1px solid var(--glass-border)",
                borderRadius: "var(--radius-lg)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "all var(--transition-normal)",
                boxShadow: isCurrentlyViewing ? `0 0 25px ${t.accentColor}33` : "var(--shadow-sm)",
              }}
            >
              {/* Badges */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span
                  style={{
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    padding: "0.2rem 0.6rem",
                    borderRadius: "var(--radius-full)",
                    background: `${t.accentColor}1a`,
                    color: t.accentColor,
                    border: `1px solid ${t.accentColor}44`,
                  }}
                >
                  {t.badge}
                </span>

                {isMaster ? (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(0, 255, 102, 0.15)",
                      color: "#86efac",
                      border: "1px solid #10b981",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.3rem",
                    }}
                  >
                    <FaCheck size={9} />
                    <span>Master Default</span>
                  </span>
                ) : isCurrentlyViewing ? (
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "var(--radius-full)",
                      background: "rgba(56, 189, 248, 0.15)",
                      color: "#38bdf8",
                      border: "1px solid #38bdf8",
                    }}
                  >
                    Previewing Now
                  </span>
                ) : null}
              </div>

              {/* Title & Description */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "var(--radius-md)",
                    background: `${t.accentColor}18`,
                    border: `1px solid ${t.accentColor}44`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: t.accentColor,
                  }}
                >
                  <Icon size={16} />
                </div>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#ffffff", margin: 0 }}>
                  {t.name}
                </h3>
              </div>

              <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", lineHeight: 1.5, marginBottom: "1.25rem", flex: 1 }}>
                {t.tagline}
              </p>

              {/* Mini UI Sample Box */}
              <div
                style={{
                  background: t.surfaceColor,
                  border: `1px solid ${t.borderColor}`,
                  borderRadius: "var(--radius-md)",
                  padding: "0.9rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.6rem",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "var(--font-mono)" }}>
                    {t.vibe}
                  </span>
                  <span
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      background: t.accentColor,
                      boxShadow: `0 0 10px ${t.accentColor}`,
                    }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  <button
                    type="button"
                    style={{
                      background: t.buttonGradient,
                      color: t.buttonTextColor,
                      border: "none",
                      padding: "0.35rem 0.75rem",
                      borderRadius: t.id === "skeuomorphism" ? "4px" : "9999px",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: t.id === "skeuomorphism"
                        ? "0 3px 6px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.3)"
                        : `0 2px 10px ${t.accentColor}55`,
                    }}
                  >
                    Sample Button
                  </button>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      padding: "0.2rem 0.5rem",
                      borderRadius: "4px",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: `1px solid ${t.accentColor}33`,
                      color: t.accentColor,
                    }}
                  >
                    Sample Badge
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  className="btn outline sm"
                  style={{
                    flex: 1,
                    borderColor: isCurrentlyViewing ? t.accentColor : "var(--glass-border)",
                    color: isCurrentlyViewing ? t.accentColor : "var(--text-secondary)",
                    justifyContent: "center",
                  }}
                  onClick={() => handlePreview(t.id)}
                  title="Test preview in your browser"
                >
                  <FaEye size={11} />
                  <span>{isCurrentlyViewing ? "Viewing Now" : "Preview"}</span>
                </button>

                <button
                  type="button"
                  className="btn primary sm"
                  style={{
                    flex: 1.3,
                    background: t.buttonGradient,
                    color: t.buttonTextColor,
                    border: "none",
                    justifyContent: "center",
                    fontWeight: 700,
                  }}
                  onClick={() => handleSaveMasterTheme(t.id)}
                  disabled={savingThemeId === t.id || isMaster}
                  title="Save as portfolio theme for all visitors"
                >
                  <FaSave size={11} />
                  <span>
                    {savingThemeId === t.id
                      ? "Saving..."
                      : isMaster
                      ? "Master Theme"
                      : "Set as Master"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AdminTheme;

