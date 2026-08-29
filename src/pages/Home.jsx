// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPaperPlane, FaUserAstronaut } from "react-icons/fa";

// Context & API
import { usePortfolio } from "../context/usePortfolio";

// Components
import Hero from "../components/Hero";
import ResumeEmbed from "../components/ResumeEmbed";
import Projects from "../components/Projects";
import Experience from "../components/Experience";

function Home() {
  const { hero, about, projects, experience } = usePortfolio();

  const { name, roles, location, heroTagline, socialLinks } = hero || {};
  const aboutText = (about?.about || "").trim();

  return (
    <div className="page">
      {/* Hero Section (Left-aligned photo, right-aligned text on large screens) */}
      <Hero
        name={name}
        roles={roles}
        location={location}
        tagline={heroTagline}
        socialLinks={socialLinks}
      />

      {/* Side-by-Side Split Row on Large Screens: About on Left & Resume on Right */}
      <div className="home-split-row">
        {/* Left Column: About Me */}
        <div className="home-split-col home-split-col--about">
          <div className="section__header" style={{ textAlign: "left", marginBottom: "1.25rem" }}>
            <h2 className="section__title" style={{ justifyContent: "flex-start" }}>
              <FaUserAstronaut style={{ color: "var(--accent-neon)", fontSize: "1.5rem" }} />
              <span>About</span> <span className="gradient-text">Me</span>
            </h2>
            <p className="section__subtitle" style={{ margin: 0, textAlign: "left" }}>
              Passionate Engineer & Researcher dedicated to building intelligent systems.
            </p>
          </div>

          <div className="about-bio-card">
            <p className="about-bio-text">
              {aboutText.substring(0, 420)}...
            </p>

            {/* Quick credentials badges */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "0.6rem", margin: "1.25rem 0" }}>
              <div className="badge badge--emerald" style={{ padding: "0.4rem 0.6rem", justifyContent: "center" }}>
                🎓 B.Tech ECE
              </div>
              <div className="badge" style={{ padding: "0.4rem 0.6rem", justifyContent: "center" }}>
                ⚡ GATE AIR 4324
              </div>
              <div className="badge" style={{ padding: "0.4rem 0.6rem", justifyContent: "center" }}>
                🔬 TIFR Researcher
              </div>
              <div className="badge badge--emerald" style={{ padding: "0.4rem 0.6rem", justifyContent: "center" }}>
                🤖 AI & IoT Engineer
              </div>
            </div>

            <div style={{ marginTop: "auto" }}>
              <Link to="/about" className="btn outline sm" style={{ width: "100%" }}>
                <span>Read Full Biography & Education</span>
                <FaArrowRight size={11} />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Embedded Full-Page Miniature Resume */}
        <div className="home-split-col home-split-col--resume">
          <ResumeEmbed compact={true} showHeader={true} showHighlights={false} />
        </div>
      </div>

      {/* 3 Featured Projects */}
      <Projects
        projects={(projects || []).slice(0, 3)}
        showCount={false}
        showFilters={false}
      />
      <div className="view-more">
        <Link to="/projects" className="btn outline">
          <span>View All 25+ Projects</span>
          <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Latest Experience Only */}
      <Experience
        experience={(experience || []).slice(0, 1)}
        showCount={false}
      />
      <div className="view-more">
        <Link to="/experience" className="btn outline">
          <span>View Full Career Timeline (5+ Internships)</span>
          <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Home Contact Banner */}
      <div className="home-contact">
        <h3>Let's Create Something Impactful</h3>
        <p>
          Available for innovative engineering roles, AI research, and high-impact technology projects.
        </p>
        <Link to="/contact" className="btn primary">
          <FaPaperPlane size={14} />
          <span>Get in Touch Today</span>
        </Link>
      </div>
    </div>
  );
}

export default Home;
