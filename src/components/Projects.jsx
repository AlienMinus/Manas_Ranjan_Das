// src/components/Projects.jsx
import React, { useState, useMemo } from "react";
import { FaGithub, FaExternalLinkAlt, FaCode } from "react-icons/fa";

const FILTER_CATEGORIES = [
  { id: "all", label: "All Projects" },
  { id: "ai", label: "AI & Machine Learning" },
  { id: "fullstack", label: "Full-Stack & Web" },
  { id: "iot", label: "IoT & Hardware" },
  { id: "tools", label: "Tools & Utilities" },
];

function Projects({ projects = [], showCount = true, showFilters = true }) {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredProjects = useMemo(() => {
    if (activeFilter === "all" || !showFilters) return projects;

    return projects.filter((project) => {
      const tags = (project.tags || []).map((t) => t.toLowerCase());
      const tech = (project.techStack || []).map((t) => t.toLowerCase());
      const title = (project.title || "").toLowerCase();
      const desc = (project.description || "").toLowerCase();

      const combined = [...tags, ...tech, title, desc].join(" ");

      if (activeFilter === "ai") {
        return (
          combined.includes("ai") ||
          combined.includes("machine learning") ||
          combined.includes("deep learning") ||
          combined.includes("nlp") ||
          combined.includes("vision") ||
          combined.includes("opencv") ||
          combined.includes("yolo")
        );
      }
      if (activeFilter === "fullstack") {
        return (
          combined.includes("mern") ||
          combined.includes("react") ||
          combined.includes("node") ||
          combined.includes("full-stack") ||
          combined.includes("javascript") ||
          combined.includes("frontend") ||
          combined.includes("e-commerce")
        );
      }
      if (activeFilter === "iot") {
        return (
          combined.includes("iot") ||
          combined.includes("arduino") ||
          combined.includes("esp32") ||
          combined.includes("embedded") ||
          combined.includes("energy") ||
          combined.includes("robotics")
        );
      }
      if (activeFilter === "tools") {
        return (
          combined.includes("tool") ||
          combined.includes("converter") ||
          combined.includes("ide") ||
          combined.includes("generator") ||
          combined.includes("calculator") ||
          combined.includes("extension") ||
          combined.includes("flask") ||
          combined.includes("python")
        );
      }
      return true;
    });
  }, [projects, activeFilter, showFilters]);

  return (
    <section className="section" id="projects" aria-label="Projects">
      <div className="section__header">
        <h2 className="section__title">
          <span>Featured</span> <span className="gradient-text">Projects</span>
          {showCount && (
            <span className="section__count">{projects.length} Total</span>
          )}
        </h2>
        <p className="section__subtitle">
          A showcase of real-world intelligent systems, full-stack applications, AI models, and IoT architectures.
        </p>
      </div>

      {/* Category Filter Pills */}
      {showFilters && projects.length > 4 && (
        <div className="projects__filters" role="tablist" aria-label="Project category filter">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              role="tab"
              aria-selected={activeFilter === cat.id}
              className={`projects__filter-btn ${
                activeFilter === cat.id ? "projects__filter-btn--active" : ""
              }`}
              onClick={() => setActiveFilter(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Projects Grid */}
      <div className="projects__grid">
        {filteredProjects.map((project) => (
          <article className="project-card" key={project.title}>
            {/* Project Media */}
            <div className="project-card__media">
              {project.image ? (
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  className="project-card__image"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100%",
                    color: "var(--accent-neon)",
                    opacity: 0.5,
                  }}
                >
                  <FaCode size={48} />
                </div>
              )}
              <div className="project-card__media-overlay"></div>
            </div>

            {/* Project Body */}
            <div className="project-card__body">
              <div className="project-card__header">
                <h3 className="project-card__title">{project.title}</h3>
                <p className="project-card__desc">{project.description}</p>

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                  <div className="project-card__tags">
                    {project.tags.slice(0, 4).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Links */}
              <div className="project-card__links">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link project-card__link--github"
                    aria-label={`View GitHub repository for ${project.title}`}
                  >
                    <FaGithub size={15} />
                    <span>Code</span>
                  </a>
                )}
                {project.demo && (
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card__link project-card__link--demo"
                    aria-label={`Open live demo for ${project.title}`}
                  >
                    <FaExternalLinkAlt size={13} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default Projects;