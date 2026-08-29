// src/pages/ProjectsPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Projects from "../components/Projects";

function ProjectsPage() {
  const { projects } = usePortfolio();

  return (
    <div className="page">
      <Projects projects={projects || []} showCount={true} showFilters={true} />
    </div>
  );
}

export default ProjectsPage;
