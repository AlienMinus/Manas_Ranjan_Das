// src/pages/AboutPage.jsx
import React from "react";
import aboutData from "../data/about.json";
import About from "../components/About";

function AboutPage() {
  const { about } = aboutData;

  return (
    <div className="page">
      <About about={about} />
    </div>
  );
}

export default AboutPage;
