// src/components/Projects.jsx
import React from "react";

function Projects({ projects = [] }) {
  const projectCount = Array.isArray(projects) ? projects.length : 0;

  return (
    <section className="section" id="projects">
      <h2 className="section__title">
        Projects <span className="projects__count">({projectCount})</span>
      </h2>
      <div className="projects__grid">
        {projects.map((project) => (
          <div className="card project-card" key={project.title}>
            
            {/* Project Image */}
            {project.image && (
              <img 
                src={project.image} 
                alt={project.title}
                className="project-card__image"
              />
            )}

            {/* Content */}
            <div className="project-card__body">
              <h3>{project.title}</h3>
              <p className="project-card__desc">{project.description}</p>

              <div className="project-card__tags">
                {project.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>

              <div className="project-card__links">
                {project.github && (
                  <a href={project.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
                {project.demo && (
                  <a href={project.demo} target="_blank" rel="noreferrer">
                    Live Demo
                  </a>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
}

export default Projects;