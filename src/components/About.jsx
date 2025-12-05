import React from "react";
import profileImage from "../assets/profile_pic.png";


function About({ about, education = [], personal_details = {}, achievements = {}, posts = {} }) {
  return (
    <section className="section" id="about">
      <h2 className="section__title">About Me</h2>
      <p className="section__text">{about}</p>

      {/* Education Table */}
      {education && education.length > 0 && (
        <div style={{ marginTop: "1.5rem" }} className="card">
          <h3 style={{ marginBottom: "0.6rem" }}>Education</h3>
          <div className="admin-table-wrapper">
            <table className="admin-table education-table" aria-label="Education">
              <thead>
                <tr>
                  <th>Institution</th>
                  <th>Degree</th>
                  <th>Year</th>
                </tr>
              </thead>
              <tbody>
                {education.map((edu, idx) => (
                  <tr key={edu.institution + idx}>
                    <td>{edu.institution}</td>
                    <td>{edu.degree}</td>
                    <td>{edu.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Personal Details */}
      {personal_details && Object.keys(personal_details).length > 0 && (
        <div style={{ marginTop: "1.5rem" }} className="card">
          <h3 style={{ marginBottom: "0.6rem" }}>Personal Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "0.8rem" }}>
            {Object.entries(personal_details).map(([key, value]) => (
              <div key={key}>
                <strong style={{ color: "#9fd3ff" }}>{key.replace(/-/g, " ").replace(/_/g, " ")}:</strong>
                <p style={{ margin: "0.3rem 0 0", opacity: 0.9 }}>{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      {achievements && Object.keys(achievements).length > 0 && (
        <div style={{ marginTop: "1.5rem" }} className="card">
          <h3 style={{ marginBottom: "0.6rem" }}>Achievements</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {Object.entries(achievements).map(([key, value]) => (
              <li key={key} style={{ marginBottom: "0.8rem", paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#9fd3ff" }}>•</span>
                <strong style={{ color: "#9fd3ff" }}>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Posts & Positions */}
      {posts && Object.keys(posts).length > 0 && (
        <div style={{ marginTop: "1.5rem" }} className="card">
          <h3 style={{ marginBottom: "0.6rem" }}>Posts & Positions</h3>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {Object.entries(posts).map(([key, value]) => (
              <li key={key} style={{ marginBottom: "0.8rem", paddingLeft: "1.5rem", position: "relative" }}>
                <span style={{ position: "absolute", left: 0, color: "#9fd3ff" }}>•</span>
                <strong style={{ color: "#9fd3ff" }}>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export default About;