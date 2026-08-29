// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPaperPlane, FaUserAstronaut } from "react-icons/fa";

// Data
import heroData from "../data/hero.json";
import aboutData from "../data/about.json";
import projectsData from "../data/projects.json";
import experienceData from "../data/experience.json";

// Components
import Hero from "../components/Hero";
import ResumeEmbed from "../components/ResumeEmbed";
import Projects from "../components/Projects";
import Experience from "../components/Experience";

function Home() {
  const { name, roles, location, heroTagline, socialLinks } = heroData;
  const { about } = aboutData;

  return (
    <div className="page">
      {/* Hero Section */}
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
              {about.trim().substring(0, 420)}...
            </p>

            {/* Quick credentials badges to balance vertical height */}
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

        {/* Right Column: Embedded Full-Page Resume */}
        <div className="home-split-col home-split-col--resume">
          <ResumeEmbed compact={true} showHeader={true} showHighlights={false} />
        </div>
      </div>

      {/* Projects Preview */}
      <Projects projects={projectsData.slice(0, 4)} />
      <div className="view-more">
        <Link to="/projects" className="btn outline">
          <span>View All 25+ Projects</span>
          <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Experience Preview */}
      <Experience experience={experienceData.slice(0, 3)} />
      <div className="view-more">
        <Link to="/experience" className="btn outline">
          <span>View Full Career Timeline</span>
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
