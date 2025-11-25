// src/pages/ProjectsPage.jsx
import React from "react";
import projectsData from "../data/projects.json";
import Projects from "../components/Projects";

function ProjectsPage() {
  return (
    <div className="page">
      <Projects projects={projectsData} />
    </div>
  );
}

export default ProjectsPage;
