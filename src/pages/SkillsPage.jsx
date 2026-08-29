// src/pages/SkillsPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Skills from "../components/Skills";
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";

function SkillsPage() {
  const { skills, loading, error, refreshData } = usePortfolio();

  if (loading && (!skills || skills.length === 0)) {
    return <LoadingSpinner text="FETCHING TECHNICAL SKILLS FROM MONGODB..." />;
  }

  if (error && (!skills || skills.length === 0)) {
    return <DatabaseErrorState onRetry={refreshData} error={error} />;
  }

  return (
    <div className="page">
      <Skills skills={skills || []} />
    </div>
  );
}

export default SkillsPage;
