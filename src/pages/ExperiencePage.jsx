// src/pages/ExperiencePage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Experience from "../components/Experience";
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";

function ExperiencePage() {
  const { experience, loading, error, refreshData } = usePortfolio();

  if (loading && (!experience || experience.length === 0)) {
    return <LoadingSpinner text="FETCHING EXPERIENCE TIMELINE FROM MONGODB..." />;
  }

  if (error && (!experience || experience.length === 0)) {
    return <DatabaseErrorState onRetry={refreshData} error={error} />;
  }

  return (
    <div className="page">
      <Experience experience={experience || []} showCount={true} />
    </div>
  );
}

export default ExperiencePage;
