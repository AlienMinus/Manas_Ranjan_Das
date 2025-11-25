// src/components/About.jsx
import React from "react";

function About({ about }) {
  return (
    <section className="section" id="about">
      <h2 className="section__title">About Me</h2>
      <p className="section__text">{about}</p>
    </section>
  );
}

export default About;
