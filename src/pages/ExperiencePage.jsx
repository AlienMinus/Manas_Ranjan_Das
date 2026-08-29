// src/pages/ExperiencePage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Experience from "../components/Experience";

function ExperiencePage() {
  const { experience } = usePortfolio();

  return (
    <div className="page">
      <Experience experience={experience || []} showCount={true} />
    </div>
  );
}

export default ExperiencePage;
