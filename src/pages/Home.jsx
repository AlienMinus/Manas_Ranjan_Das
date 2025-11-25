import React from "react";

// Data
import heroData from "../data/hero.json";
import aboutData from "../data/about.json";
import skillsData from "../data/skills.json";
import projectsData from "../data/projects.json";
import experienceData from "../data/experience.json";
import contactData from "../data/contact.json";

// Components
import Hero from "../components/Hero";
import About from "../components/About";
import Skills from "../components/Skills";
import Projects from "../components/Projects";
import Experience from "../components/Experience";
import Contact from "../components/Contact";


import { Link } from "react-router-dom";

function Home() {
  const { name, roles, location, heroTagline, socialLinks} = heroData;
  const { about } = aboutData;

  return (
    <div className="page">

      {/* Full Hero */}
      <Hero
        name={name}
        roles={roles}
        location={location}
        tagline={heroTagline}
        socialLinks={socialLinks}
      />


      {/* About Preview */}
      <About about={about.substring(0, 180) + "..."} />
      <div className="view-more">
        <Link to="/about" className="btn outline">Read More</Link>
      </div>


      {/* Skills Preview */}
      <Skills skills={skillsData.slice(0, 4)} />
      <div className="view-more">
        <Link to="/skills" className="btn outline">See All Skills</Link>
      </div>


      {/* Projects Preview */}
      <Projects projects={projectsData.slice(0, 2)} />
      <div className="view-more">
        <Link to="/projects" className="btn outline">View All Projects</Link>
      </div>


      {/* Experience Preview */}
      <Experience experience={experienceData.slice(0, 1)} />
      <div className="view-more">
        <Link to="/experience" className="btn outline">Full Experience</Link>
      </div>


      {/* Contact CTA */}
      <div className="home-contact">
        <h3>Let’s Work Together!</h3>
        <div className="view-more">
          <Link to="/contact" className="btn primary">Contact Me</Link>
        </div>
      </div>

    </div>
  );
}

export default Home;
