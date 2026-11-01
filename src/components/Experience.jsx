// src/components/Experience.jsx
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
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
          const expImage =
            exp.image ||
            exp.photo ||
            (Array.isArray(exp.images) && exp.images[0]) ||
            (Array.isArray(exp.photos) && exp.photos[0]);

          return (
            <article
              className="experience-card"
              key={exp._id || exp.role + exp.company + idx}
            >
              <div className="experience-card__header">
                <div
                  className={`experience-card__icon-box ${expImage ? "experience-card__icon-box--clickable" : ""}`}
                  onClick={() => {
                    if (expImage) {
                      setActivePhoto({
                        src: expImage,
                        title: `${exp.role} • ${exp.company}`,
                      });
                    }
                  }}
                  title={expImage ? `Click to preview photo: ${exp.role} at ${exp.company}` : undefined}
                  role={expImage ? "button" : undefined}
                  tabIndex={expImage ? 0 : undefined}
                  onKeyDown={(e) => {
                    if (expImage && (e.key === "Enter" || e.key === " ")) {
                      e.preventDefault();
                      setActivePhoto({
                        src: expImage,
                        title: `${exp.role} • ${exp.company}`,
                      });
                    }
                  }}
                >
                  {expImage ? (
                    <img
                      src={expImage}
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
              {expImage && (
                <div
                  className="experience-card__media-box"
                  onClick={() =>
                    setActivePhoto({
                      src: expImage,
                      title: `${exp.role} • ${exp.company}`,
                    })
                  }
                  title="Click to view full photo"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setActivePhoto({
                        src: expImage,
                        title: `${exp.role} • ${exp.company}`,
                      });
                    }
                  }}
                >
                  <img
                    src={expImage}
                    alt={`${exp.role} at ${exp.company}`}
                    className="experience-card__img"
                    loading="lazy"
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

              {expImage && (
                <div style={{ marginTop: "1rem", display: "flex", justifyContent: "flex-end" }}>
                  <button
                    type="button"
                    className="btn outline sm"
                    onClick={() =>
                      setActivePhoto({
                        src: expImage,
                        title: `${exp.role} • ${exp.company}`,
                      })
                    }
                    title="Click to preview photo"
                  >
                    <FaExpand size={11} />
                    <span>View Photo</span>
                  </button>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Experience Image Lightbox Modal rendered via Portal to document.body */}
      {activePhoto &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="experience-lightbox"
            onClick={() => setActivePhoto(null)}
            role="dialog"
            aria-modal="true"
            aria-label="Experience photo preview"
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
                title="Close (Esc)"
              >
                <FaTimes size={16} />
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
                <button
                  type="button"
                  className="btn outline sm"
                  onClick={() => setActivePhoto(null)}
                >
                  <span>Close</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </section>
  );
}

export default Experience;