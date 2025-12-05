// src/components/Experience.jsx
import React from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";
import * as GiIcons from "react-icons/gi";

function getIconComponent(exp) {
  if (!exp.icon) return null;

  const lib = exp.iconLib === "ri" ? RiIcons : exp.iconLib === "gi" ? GiIcons : exp.iconLib === "tb" ? TbIcons : exp.iconLib ==="fa" ? FaIcons : exp.iconLib === "bs" ? BsIcons : exp.iconLib === "md" ? MdIcons : SiIcons;
    const Icon = lib[exp.icon];
    return Icon || null; // safe fallback
}

function Experience({ experience }) {
  return (
    <section className="section" id="experience">
      <h2 className="section__title">Experience</h2>
      <div className="experience__timeline">
        {experience.map((exp) => {
          const Icon = getIconComponent(exp);

          return (
            <div className="card experience-card" key={exp.role + exp.company}>
              <div className="experience-card__header">
                {Icon && <Icon className="experience-card__icon" />}
                <div>
                  <h3>{exp.role}</h3>
                  <p className="experience-card__company">{exp.company}</p>
                  <p className="experience-card__duration">{exp.duration}</p>
                </div>
              </div>

              <ul className="experience-card__list">
                {exp.details.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Experience;
