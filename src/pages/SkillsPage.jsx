// src/pages/SkillsPage.jsx
import React from "react";
import skillsData from "../data/skills.json";
import Skills from "../components/Skills";

function SkillsPage() {
  return (
    <div className="page">
      <Skills skills={skillsData} />
    </div>
  );
}

export default SkillsPage;
