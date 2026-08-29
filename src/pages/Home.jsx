// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaPaperPlane } from "react-icons/fa";

// Data
import heroData from "../data/hero.json";
import aboutData from "../data/about.json";
import skillsData from "../data/skills.json";
import projectsData from "../data/projects.json";
import experienceData from "../data/experience.json";

// Components
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";

function Home() {
  const { name, roles, location, heroTagline, socialLinks } = heroData;
  const { about } = aboutData;

  const limitedSkillsData = skillsData.map((group) => ({
    ...group,
    items: group.items.slice(0, 4),
  }));

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

      {/* About Preview */}
      <About about={about.substring(0, 320) + "..."} />
      <div className="view-more">
        <Link to="/about" className="btn outline">
          <span>Read Full Biography & Background</span>
          <FaArrowRight size={12} />
        </Link>
      </div>

      {/* Skills Preview */}
      <Skills skills={limitedSkillsData.slice(0, 4)} />
      <div className="view-more">
        <Link to="/skills" className="btn outline">
          <span>Explore Complete Skill Matrix</span>
          <FaArrowRight size={12} />
        </Link>
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
