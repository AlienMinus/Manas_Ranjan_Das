// src/components/Experience.jsx
import React, { useState, useEffect } from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";
import * as GiIcons from "react-icons/gi";
import { FaBriefcase, FaCalendarAlt, FaExpand, FaTimes } from "react-icons/fa";

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
  const [activePhoto, setActivePhoto] = useState(null);

  // Close lightbox on Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActivePhoto(null);
    };
    if (activePhoto) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activePhoto]);

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
                  {exp.image ? (
                    <img
                      src={exp.image}
                      alt={exp.company}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "inherit",
                      }}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : Icon ? (
                    <Icon />
                  ) : (
                    <FaBriefcase />
                  )}
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

              {/* Experience Photo / Workplace Banner */}
              {exp.image && (
                <div
                  className="experience-card__media-box"
                  onClick={() =>
                    setActivePhoto({
                      src: exp.image,
                      title: `${exp.role} • ${exp.company}`,
                    })
                  }
                  title="Click to view full photo"
                >
                  <img
                    src={exp.image}
                    alt={`${exp.role} at ${exp.company}`}
                    className="experience-card__img"
                    loading="lazy"
                    onError={(e) => {
                      if (e.target.parentElement) {
                        e.target.parentElement.style.display = "none";
                      }
                    }}
                  />
                  <div className="experience-card__media-overlay">
                    <FaExpand size={13} />
                    <span>View Photo</span>
                  </div>
                </div>
              )}

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

      {/* Experience Image Lightbox Modal */}
      {activePhoto && (
        <div
          className="experience-lightbox"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="experience-lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="experience-lightbox__close"
              onClick={() => setActivePhoto(null)}
              aria-label="Close Preview"
            >
              <FaTimes size={15} />
            </button>
            <img
              src={activePhoto.src}
              alt={activePhoto.title}
              className="experience-lightbox__img"
            />
            <div className="experience-lightbox__bar">
              <span style={{ color: "var(--accent-neon)", fontWeight: 600, fontSize: "0.95rem" }}>
                {activePhoto.title}
              </span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Experience;