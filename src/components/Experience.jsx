// src/components/Experience.jsx
import React from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";
import * as GiIcons from "react-icons/gi";
import { FaBriefcase, FaCalendarAlt } from "react-icons/fa";

function getIconComponent(exp) {
  if (!exp.icon) return null;

  const lib =
    exp.iconLib === "ri"
      ? RiIcons
      : exp.iconLib === "gi"
      ? GiIcons
      : exp.iconLib === "tb"
      ? TbIcons
      : exp.iconLib === "fa"
      ? FaIcons
      : exp.iconLib === "bs"
      ? BsIcons
      : exp.iconLib === "md"
      ? MdIcons
      : SiIcons;

  const Icon = lib[exp.icon];
  return Icon || null;
}

function Experience({ experience = [], showCount = true }) {
  const count = Array.isArray(experience) ? experience.length : 0;

  return (
    <section className="section" id="experience" aria-label="Experience">
      <div className="section__header">
        <h2 className="section__title">
          <span>Work</span> <span className="gradient-text">Experience</span>
          {showCount && (
            <span className="section__count">{count} Positions</span>
          )}
        </h2>
        <p className="section__subtitle">
          Professional roles, research internships, industry projects, and leadership appointments.
        </p>
      </div>

      <div className="experience__timeline">
        {experience.map((exp, idx) => {
          const Icon = getIconComponent(exp);

          return (
            <article
              className="experience-card"
              key={exp.role + exp.company + idx}
            >
              <div className="experience-card__header">
                <div className="experience-card__icon-box">
                  {Icon ? <Icon /> : <FaBriefcase />}
                </div>

                <div className="experience-card__header-info">
                  <h3 className="experience-card__role">{exp.role}</h3>
                  <p className="experience-card__company">{exp.company}</p>
                  <div className="experience-card__duration">
                    <FaCalendarAlt size={11} />
                    <span>{exp.duration}</span>
                  </div>
                </div>
              </div>

              {exp.details && exp.details.length > 0 && (
                <ul className="experience-card__list">
                  {exp.details.map((item, index) => (
                    <li className="experience-card__list-item" key={index}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Experience;