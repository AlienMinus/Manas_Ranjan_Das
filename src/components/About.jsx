// src/components/About.jsx
import React from "react";

function About({ about, education = [] }) {
  return (
    <section className="section" id="about">
      <h2 className="section__title">About Me</h2>
      <p className="section__text">{about}</p>

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
    </section>
  );
}

export default About;