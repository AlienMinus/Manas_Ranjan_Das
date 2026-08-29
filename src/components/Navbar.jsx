// src/components/Navbar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/profile_pic.png";

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Skills", path: "/skills" },
    { label: "Projects", path: "/projects" },
    { label: "Experience", path: "/experience" },
    { label: "Contact", path: "/contact" },
    { label: "Admin", path: "/admin" },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="navbar-wrapper">
      <nav className="navbar" aria-label="Main Navigation">
        {/* Brand Logo */}
        <NavLink to="/" className="navbar__brand" onClick={closeMobileMenu}>
          <img src={Logo} alt="Manas Ranjan Das" className="navbar__brand-img" />
          <span className="navbar__brand-text">
            Manas R. Das
            <span className="navbar__brand-tag">DEV</span>
          </span>
        </NavLink>

        {/* Desktop Links */}
        <ul className="navbar__links navbar__links--desktop">
          {links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                end={link.path === "/"}
                className={({ isActive }) =>
                  "navbar__link" + (isActive ? " navbar__link--active" : "")
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className={`navbar__toggle ${isMobileMenuOpen ? "navbar__toggle--active" : ""}`}
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={isMobileMenuOpen}
        >
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
          <span className="navbar__toggle-bar"></span>
        </button>

        {/* Mobile Menu Drawer */}
        <div
          className={`navbar__mobile-drawer ${
            isMobileMenuOpen ? "navbar__mobile-drawer--open" : ""
          }`}
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
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
