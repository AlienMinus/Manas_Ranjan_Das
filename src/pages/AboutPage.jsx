import React from "react";
import aboutData from "../data/about.json";
import About from "../components/About";

function AboutPage() {
  const { about, education, personal_details, achievements, posts } = aboutData;

  return (
    <div className="page">
      <About 
        about={about} 
        education={education}
        personal_details={personal_details}
        achievements={achievements}
        posts={posts}
      />
    </div>
  );
}

export default AboutPage;