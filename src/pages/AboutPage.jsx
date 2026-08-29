// src/pages/AboutPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import About from "../components/About";

function AboutPage() {
  const { about } = usePortfolio();

  const aboutText = about?.about || "";
  const education = about?.education || [];
  const personal_details =
    about?.personal_details instanceof Map
      ? Object.fromEntries(about.personal_details)
      : about?.personal_details || {};
  const achievements =
    about?.achievements instanceof Map
      ? Object.fromEntries(about.achievements)
      : about?.achievements || {};
  const posts =
    about?.posts instanceof Map
      ? Object.fromEntries(about.posts)
      : about?.posts || {};

  return (
    <div className="page">
      <About
        about={aboutText}
        education={education}
        personal_details={personal_details}
        achievements={achievements}
        posts={posts}
      />
    </div>
  );
}

export default AboutPage;