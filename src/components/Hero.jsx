// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileImage from "../assets/profile_pic.png";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import { FaMapMarkerAlt, FaFileDownload, FaPaperPlane, FaCompass } from "react-icons/fa";
import resumePdf from "../data/resume.pdf";

function getIconComponent(item) {
  const library = item.iconLib === "si" ? SiIcons : FaIcons;
  return library[item.icon] || null;
}

function Hero({ name, roles = [], tagline, location, socialLinks = [] }) {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!roles.length) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % roles.length);
        setFade(true);
      }, 150);
    }, 2800);

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="hero" id="home" aria-label="Hero Section">
      <div className="hero__content">
        {/* Status Badge */}
        <div className="hero__status-badge">
          <span className="pulse-dot"></span>
          <span>Available for Opportunities & Collaborations</span>
        </div>

        {/* Avatar with Ambient Glowing Ring */}
        <div className="hero__avatar-wrapper">
          <div className="hero__avatar-ring"></div>
          <div className="hero__avatar-container">
            <img src={profileImage} alt={name} className="hero__avatar" />
          </div>
        </div>

        {/* Greeting & Name */}
        <p className="hero__greeting">Hello World, I'm</p>
        <h1 className="hero__name">{name}</h1>

        {/* Dynamic Rotating Roles */}
        <div className="hero__role-wrapper">
          <span>Electrical & Computer Engineer</span>
          <span style={{ color: "var(--text-muted)", margin: "0 0.25rem" }}>|</span>
          <span className={`hero__role-tag ${fade ? "fade-role" : ""}`}>
            {roles[index] || "Full-Stack Developer"}
          </span>
        </div>

        {/* Location */}
        {location && (
          <p className="hero__location">
            <FaMapMarkerAlt size={14} />
            <span>{location}</span>
          </p>
        )}

        {/* Tagline */}
        <p className="hero__tagline">{tagline}</p>

        {/* Actions (Resume, Contact, Projects) */}
        <div className="hero__actions">
          <a
            href={resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            download="Manas_Ranjan_Das_Resume.pdf"
            className="btn primary"
          >
            <FaFileDownload size={15} />
            <span>Download CV / Resume</span>
          </a>

          <Link to="/contact" className="btn outline">
            <FaPaperPlane size={14} />
            <span>Let's Connect</span>
          </Link>

          <Link to="/projects" className="btn outline">
            <FaCompass size={14} />
            <span>Explore Projects</span>
          </Link>
        </div>

        {/* Social Link Icons */}
        <div className="hero__socials">
          {socialLinks.map((item) => {
            const Icon = getIconComponent(item);
            return (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="social__icon"
                aria-label={`Visit ${item.platform} Profile`}
                title={item.platform}
              >
                {Icon && <Icon size={20} />}
              </a>
            );
          })}
        </div>

        {/* Highlights / Stats Strip */}
        <div className="hero__stats">
          <div className="stat-item">
            <span className="stat-item__number">25+</span>
            <span className="stat-item__label">Projects</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__number">5+</span>
            <span className="stat-item__label">Internships</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__number">2</span>
            <span className="stat-item__label">Research Papers</span>
          </div>
          <div className="stat-item">
            <span className="stat-item__number">GATE</span>
            <span className="stat-item__label">AIR 4324</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
