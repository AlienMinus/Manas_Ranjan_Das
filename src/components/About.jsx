// src/components/About.jsx
import React from "react";
import { FaGraduationCap, FaUserCheck, FaTrophy, FaBriefcase, FaBuilding } from "react-icons/fa";

function About({
  about,
  education = [],
  personal_details = {},
  achievements = {},
  posts = {},
}) {
  const hasEducation = education && education.length > 0;
  const hasDetails = personal_details && Object.keys(personal_details).length > 0;
  const hasAchievements = achievements && Object.keys(achievements).length > 0;
  const hasPosts = posts && Object.keys(posts).length > 0;

  return (
    <section className="section" id="about" aria-label="About Me">
      <div className="section__header">
        <h2 className="section__title">
          <span>About</span> <span className="gradient-text">Me</span>
        </h2>
        <p className="section__subtitle">
          Passionate Engineer, Researcher & Builder dedicated to sustainable technologies.
        </p>
      </div>

      <div className="about-section">
        {/* Bio Card */}
        {about && (
          <div className="about-bio-card">
            <p className="about-bio-text">{about.trim()}</p>
          </div>
        )}

        {/* Education Subsection */}
        {hasEducation && (
          <div>
            <h3 className="about-subsection-title">
              <FaGraduationCap />
              <span>Education</span>
            </h3>
            <div className="education-grid">
              {education.map((edu, idx) => (
                <div className="education-card" key={edu.institution + idx}>
                  <div className="education-card__header">
                    <h4 className="education-card__degree">{edu.degree}</h4>
                    <span className="education-card__year">{edu.year}</span>
                  </div>
                  <p className="education-card__institution">
                    <FaBuilding size={12} style={{ flexShrink: 0 }} />
                    <span>{edu.institution}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal Details Subsection */}
        {hasDetails && (
          <div>
            <h3 className="about-subsection-title">
              <FaUserCheck />
              <span>Personal Details</span>
            </h3>
            <div className="details-grid">
              {Object.entries(personal_details).map(([key, value]) => (
                <div className="detail-item" key={key}>
                  <div className="detail-label">
                    {key.replace(/-/g, " ").replace(/_/g, " ")}
                  </div>
                  <div className="detail-value">{value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements Subsection */}
        {hasAchievements && (
          <div>
            <h3 className="about-subsection-title">
              <FaTrophy style={{ color: "#f59e0b" }} />
              <span>Key Achievements & Milestones</span>
            </h3>
            <div className="achievements-grid">
              {Object.entries(achievements).map(([title, desc]) => (
                <div className="achievement-card" key={title}>
                  <div className="achievement-icon">★</div>
                  <div>
                    <h4 className="achievement-title">{title}</h4>
                    <p className="achievement-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Posts & Positions Subsection */}
        {hasPosts && (
          <div>
            <h3 className="about-subsection-title">
              <FaBriefcase style={{ color: "#818cf8" }} />
              <span>Leadership & Positions Held</span>
            </h3>
            <div className="posts-grid">
              {Object.entries(posts).map(([role, desc]) => (
                <div className="post-card" key={role}>
                  <div className="post-icon">◈</div>
                  <div>
                    <h4 className="post-title">{role}</h4>
                    <p className="post-desc">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default About;