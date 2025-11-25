// src/pages/ExperiencePage.jsx
import React from "react";
import experienceData from "../data/experience.json";
import Experience from "../components/Experience";

function ExperiencePage() {
  return (
    <div className="page">
      <Experience experience={experienceData} />
    </div>
  );
}

export default ExperiencePage;
