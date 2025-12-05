// src/pages/AboutPage.jsx
import React from "react";
import aboutData from "../data/about.json";
import About from "../components/About";

function AboutPage() {
  const { about, education } = aboutData;

  return (
    <div className="page">
      <About about={about} education={education} />
    </div>
  );
}

export default AboutPage;