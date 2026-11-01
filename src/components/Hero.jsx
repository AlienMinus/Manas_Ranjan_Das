// src/components/Hero.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import profileImage from "../assets/profile_pic.png";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import { FaMapMarkerAlt, FaFileDownload, FaPaperPlane, FaCompass } from "react-icons/fa";

const resumePdf = "/resume.pdf";

const DEFAULT_HERO_ROLES = ["Full-Stack Developer", "Researcher", "AI Engineer", "IoT Enthusiast"];
const DEFAULT_HERO_SOCIALS = [
  { platform: "GitHub", url: "https://github.com/AlienMinus", iconLib: "fa", icon: "FaGithub" },
  { platform: "LinkedIn", url: "https://www.linkedin.com/in/manas-r-das/", iconLib: "fa", icon: "FaLinkedin" },
  { platform: "Instagram", url: "https://www.instagram.com/the_minus_infinity/", iconLib: "fa", icon: "FaInstagram" },
];
const DEFAULT_HERO_STATS = [
  { number: "25+", label: "Projects" },
  { number: "5+", label: "Internships" },
  { number: "2", label: "Research Papers" },
  { number: "GATE", label: "AIR 4324" },
];

function getIconComponent(item) {
  const library = item.iconLib === "si" ? SiIcons : FaIcons;
  return library[item.icon] || null;
}

function Hero({
  name = "Manas Ranjan Das",
  primaryRole = "Electrical & Computer Engineer",
  statusBadge = "Available for Opportunities",
  roles = DEFAULT_HERO_ROLES,
  tagline = "I build intelligent systems that connect hardware, software, and people.",
  location = "Cuttack, India",
  stats = DEFAULT_HERO_STATS,
  socialLinks = DEFAULT_HERO_SOCIALS,
}) {
  const effectiveRoles = roles && roles.length > 0 ? roles : DEFAULT_HERO_ROLES;
  const effectiveSocials = socialLinks && socialLinks.length > 0 ? socialLinks : DEFAULT_HERO_SOCIALS;
  const effectiveStats = stats && stats.length > 0 ? stats : DEFAULT_HERO_STATS;
  const displayName = name || "Manas Ranjan Das";
  const displayPrimaryRole = primaryRole || "Electrical & Computer Engineer";
  const displayStatusBadge = statusBadge || "Available for Opportunities";

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    if (!effectiveRoles.length) return;
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % effectiveRoles.length);
        setFade(true);
      }, 150);
    }, 2800);

    return () => clearInterval(interval);
  }, [effectiveRoles]);

  return (
    <section className="hero" id="home" aria-label="Hero Section">
      <div className="hero__grid">
        {/* Left Column on Large Screens: Photo & Media */}
        <div className="hero__media-col">
          {/* Status Badge */}
          <div className="hero__status-badge">
            <span className="pulse-dot"></span>
            <span>{displayStatusBadge}</span>
          </div>

          {/* Avatar with Ambient Glowing Ring */}
          <div className="hero__avatar-wrapper">
            <div className="hero__avatar-ring"></div>
            <div className="hero__avatar-container">
              <img src={profileImage} alt={displayName} className="hero__avatar" />
            </div>
          </div>

          {/* Social Link Icons */}
          <div className="hero__socials">
            {effectiveSocials.map((item) => {
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
        </div>

        {/* Right Column on Large Screens: Text & Actions */}
        <div className="hero__text-col">
          <p className="hero__greeting">Hello World, I'm</p>
          <h1 className="hero__name glitch" data-text={displayName}>
            {displayName}
          </h1>

          {/* Dynamic Rotating Roles */}
          <div className="hero__role-wrapper">
            <span>{displayPrimaryRole}</span>
            <span style={{ color: "var(--text-muted)", margin: "0 0.25rem" }}>|</span>
            <span className={`hero__role-tag ${fade ? "fade-role" : ""}`}>
              {effectiveRoles[index] || "Full-Stack Developer"}
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
          <p className="hero__tagline">{tagline || "I build intelligent systems that connect hardware, software, and people."}</p>

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
              <span>Download CV</span>
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

          {/* Highlights / Stats Strip */}
          {effectiveStats && effectiveStats.length > 0 && (
            <div className="hero__stats">
              {effectiveStats.map((st, i) => (
                <div className="stat-item" key={st.label + i}>
                  <span className="stat-item__number">{st.number}</span>
                  <span className="stat-item__label">{st.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
