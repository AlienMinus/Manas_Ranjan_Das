// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { FaPalette, FaCheck, FaSun, FaMoon } from "react-icons/fa";
import { usePortfolio } from "../context/usePortfolio";
import Logo from "../assets/profile_pic.png";

const THEME_OPTIONS = [
  { id: "cyberpunk", label: "Cyberpunk", color: "#00ff66", desc: "Matrix Green" },
  { id: "glassmorphism", label: "Glassmorphism", color: "#38bdf8", desc: "Frosted Glass" },
  { id: "skeuomorphism", label: "Skeuomorphism", color: "#f59e0b", desc: "3D Tactile Depth" },
  { id: "corporate", label: "Corporate", color: "#3b82f6", desc: "Blue + White" },
  { id: "retro-bw", label: "Retro (B & W)", color: "#ffffff", desc: "Film Noir Print" },
  { id: "pixelatte", label: "Pixelatte", color: "#facc15", desc: "8-Bit Video Games" },
  { id: "luxury-gold", label: "Luxury Gold", color: "#d4af37", desc: "Obsidian & Gold" },
  { id: "synthwave", label: "Synthwave", color: "#ff2a85", desc: "80s Dusk Sunset" },
];

function Navbar() {
  const { theme, setTheme, mode = "dark", toggleMode } = usePortfolio();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isThemeOpen, setIsThemeOpen] = useState(false);
  const themeDropdownRef = useRef(null);

  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Skills", path: "/skills" },
    { label: "Projects", path: "/projects" },
    { label: "Experience", path: "/experience" },
    { label: "Certifications", path: "/certifications" },
    { label: "Contact", path: "/contact" },
    { label: "Admin", path: "/admin" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (themeDropdownRef.current && !themeDropdownRef.current.contains(e.target)) {
        setIsThemeOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleSelectTheme = (themeId) => {
    setTheme(themeId, true);
    setIsThemeOpen(false);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand Logo */}
        <NavLink
          to="/"
          className="navbar__brand"
          onClick={closeMobileMenu}
          title="Manas R. Das - Portfolio Home"
        >
          <img src={Logo} alt="Manas Ranjan Das" className="navbar__brand-img" />
          <span className="navbar__brand-text">
            Manas R. Das
            <span className="navbar__brand-tag">DEV</span>
          </span>
        </NavLink>

        {/* Desktop Links with Tooltips */}
        <ul className="navbar__links navbar__links--desktop">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  "navbar__link" + (isActive ? " navbar__link--active" : "")
                }
                title={`Go to ${link.label}`}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Actions (Mode Toggle & Theme Switcher - Icons Only) */}
        <div className="navbar__actions">
          {/* Light / Dark Mode Toggle Button (Icon Only with Tooltip) */}
          <button
            type="button"
            className="navbar__mode-btn"
            onClick={() => toggleMode(true)}
            aria-label={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            title={mode === "dark" ? "Switch to Light Mode (☀️)" : "Switch to Dark Mode (🌙)"}
            data-tooltip={mode === "dark" ? "Light Mode" : "Dark Mode"}
          >
            {mode === "dark" ? (
              <FaSun size={15} style={{ color: "#facc15" }} />
            ) : (
              <FaMoon size={15} style={{ color: "var(--accent-neon)" }} />
            )}
          </button>

          {/* Theme Switcher Button (Icon Only with Tooltip) */}
          <div className="navbar__theme-wrapper" ref={themeDropdownRef}>
            <button
              type="button"
              className="navbar__theme-btn"
              onClick={() => setIsThemeOpen((prev) => !prev)}
              aria-label="Change portfolio aesthetic theme"
              title={`Theme: ${theme.charAt(0).toUpperCase() + theme.slice(1)}`}
              data-tooltip="Theme"
            >
              <FaPalette size={15} />
            </button>

            {isThemeOpen && (
              <div className="navbar__theme-dropdown" role="menu">
                <div className="navbar__theme-dropdown-header">
                  <span>Select Theme</span>
                  <button
                    type="button"
                    className="navbar__theme-mode-toggle"
                    onClick={() => toggleMode(true)}
                    title={`Current: ${mode.toUpperCase()} mode. Click to switch.`}
                  >
                    {mode === "dark" ? (
                      <>
                        <FaSun size={10} style={{ color: "#facc15" }} />
                        <span>Light</span>
                      </>
                    ) : (
                      <>
                        <FaMoon size={10} style={{ color: "var(--accent-neon)" }} />
                        <span>Dark</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="navbar__theme-options">
                  {THEME_OPTIONS.map((opt) => {
                    const isSelected = theme === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        className={`navbar__theme-option ${isSelected ? "navbar__theme-option--active" : ""}`}
                        onClick={() => handleSelectTheme(opt.id)}
                        role="menuitem"
                        title={opt.desc}
                      >
                        <span
                          className="navbar__theme-dot"
                          style={{
                            background: opt.color,
                            boxShadow: `0 0 8px ${opt.color}`,
                          }}
                        />
                        <div className="navbar__theme-info">
                          <span className="navbar__theme-name">{opt.label}</span>
                          <span className="navbar__theme-desc">{opt.desc}</span>
                        </div>
                        {isSelected && <FaCheck size={11} className="navbar__theme-check" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            className={`navbar__toggle ${isMobileMenuOpen ? "navbar__toggle--active" : ""}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            title={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
            data-tooltip={isMobileMenuOpen ? "Close" : "Menu"}
          >
            <span className="navbar__toggle-bar"></span>
            <span className="navbar__toggle-bar"></span>
            <span className="navbar__toggle-bar"></span>
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        <div
          className={`navbar__mobile-drawer ${isMobileMenuOpen ? "navbar__mobile-drawer--open" : ""}`}
        >
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                "navbar__mobile-link" +
                (isActive ? " navbar__mobile-link--active" : "")
              }
              onClick={closeMobileMenu}
            >
              <span>{link.label}</span>
              <span style={{ fontSize: "0.8rem", opacity: 0.6 }}>›</span>
            </NavLink>
          ))}

          {/* Mobile Mode Switcher */}
          <div className="navbar__mobile-mode-section">
            <button
              type="button"
              className="navbar__mobile-mode-btn"
              onClick={() => toggleMode(true)}
            >
              {mode === "dark" ? (
                <>
                  <FaSun size={14} style={{ color: "#facc15" }} />
                  <span>Switch to Light Mode ☀️</span>
                </>
              ) : (
                <>
                  <FaMoon size={14} style={{ color: "var(--accent-neon)" }} />
                  <span>Switch to Dark Mode 🌙</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Theme Selector */}
          <div className="navbar__mobile-theme-section">
            <span className="navbar__mobile-theme-title">Aesthetic Theme</span>
            <div className="navbar__mobile-theme-chips">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={`navbar__mobile-theme-chip ${theme === opt.id ? "navbar__mobile-theme-chip--active" : ""}`}
                  onClick={() => {
                    handleSelectTheme(opt.id);
                    closeMobileMenu();
                  }}
                >
                  <span
                    className="navbar__theme-dot"
                    style={{ background: opt.color, boxShadow: `0 0 6px ${opt.color}` }}
                  />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
