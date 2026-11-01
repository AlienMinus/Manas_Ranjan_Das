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
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";

function Home() {
  const { hero, about, projects, experience, loading, error, refreshData } = usePortfolio();

  // Filter projects marked as featured for the Home page showcase
  const featuredProjects = React.useMemo(() => {
    if (!projects || projects.length === 0) return [];
    const featured = projects.filter((p) => Boolean(p.featured));
    return featured.length > 0 ? featured : projects.slice(0, 3);
  }, [projects]);

  if (loading && !hero) {
    return <LoadingSpinner text="CONNECTING TO MONGODB & LOADING PORTFOLIO..." />;
  }

  if (error && !hero) {
    return <DatabaseErrorState onRetry={refreshData} error={error} />;
  }

  const { name, primaryRole, statusBadge, roles, location, heroTagline, stats, socialLinks } = hero || {};
  const aboutText = (about?.about || "").trim();

  return (
    <div className="page">
      {/* Hero Section (Left-aligned photo, right-aligned text on large screens) */}
      <Hero
        name={name}
        primaryRole={primaryRole}
        statusBadge={statusBadge}
        roles={roles}
        location={location}
        tagline={heroTagline}
        stats={stats}
        socialLinks={socialLinks}
      />

      {/* Side-by-Side Split Row on Large Screens: About on Left & Resume on Right */}
      <div className="home-split-row">
        {/* Left Column: About Me */}
        <div className="home-split-col home-split-col--about">
          <div className="section__header home-about__header">
            <h2 className="section__title home-about__title">
              <FaUserAstronaut className="home-about__title-icon" />
              <span>About</span> <span className="gradient-text">Me</span>
            </h2>
            <p className="section__subtitle home-about__subtitle">
              Passionate Engineer & Researcher dedicated to building intelligent systems.
            </p>
          </div>

          <div className="about-bio-card">
            <p className="about-bio-text">
              {aboutText || "Loading biography..."}
            </p>

            {/* Quick credentials badges */}
            <div className="home-about__badges">
              <div className="badge badge--emerald home-about__badge">
                🎓 B.Tech ECE
              </div>
              <div className="badge home-about__badge">
                ⚡ GATE AIR 4324
              </div>
              <div className="badge home-about__badge">
                🔬 TIFR Researcher
              </div>
              <div className="badge badge--emerald home-about__badge">
                🤖 AI & IoT Engineer
              </div>
            </div>

            <div className="home-about__action">
              <Link to="/about" className="btn outline sm home-about__btn">
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

      {/* Featured Projects Showcase */}
      <Projects
        projects={featuredProjects}
        showCount={false}
        showFilters={false}
      />
      <div className="view-more">
        <Link to="/projects" className="btn outline">
          <span>View All {projects?.length || ""} Projects</span>
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
          <span>View Full Career Timeline ({experience?.length || ""} Positions)</span>
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
