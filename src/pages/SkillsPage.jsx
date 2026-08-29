// src/pages/SkillsPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Skills from "../components/Skills";

function SkillsPage() {
  const { skills } = usePortfolio();

  return (
    <div className="page">
      <Skills skills={skills || []} />
    </div>
  );
}

export default SkillsPage;
