// src/pages/ProjectsPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Projects from "../components/Projects";
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";

function ProjectsPage() {
  const { projects, loading, error, refreshData } = usePortfolio();

  if (loading && (!projects || projects.length === 0)) {
    return <LoadingSpinner text="FETCHING PROJECTS FROM MONGODB..." />;
  }

  if (error && (!projects || projects.length === 0)) {
    return <DatabaseErrorState onRetry={refreshData} error={error} />;
  }

  return (
    <div className="page">
      <Projects projects={projects || []} showCount={true} showFilters={true} />
    </div>
  );
}

export default ProjectsPage;
