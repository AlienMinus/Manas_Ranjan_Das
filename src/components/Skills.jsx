// src/components/Skills.jsx
import React from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";
import * as GiIcons from "react-icons/gi";
import { FaCode, FaMicrochip, FaTools, FaLightbulb } from "react-icons/fa";

function getIconComponent(skill) {
  if (!skill.icon) return null;

  const lib =
    skill.iconLib === "ri"
      ? RiIcons
      : skill.iconLib === "gi"
      ? GiIcons
      : skill.iconLib === "tb"
      ? TbIcons
      : skill.iconLib === "fa"
      ? FaIcons
      : skill.iconLib === "bs"
      ? BsIcons
      : skill.iconLib === "md"
      ? MdIcons
      : SiIcons;

  const Icon = lib[skill.icon];
  return Icon || null;
}

function getCategoryIcon(category) {
  const catLower = category.toLowerCase();
  if (catLower.includes("program") || catLower.includes("software")) return <FaCode />;
  if (catLower.includes("electric") || catLower.includes("electronic") || catLower.includes("iot")) return <FaMicrochip />;
  if (catLower.includes("tool") || catLower.includes("devops")) return <FaTools />;
  return <FaLightbulb />;
}

function Skills({ skills = [] }) {
  const totalSkillsCount = skills.reduce((acc, group) => {
    const itemsLen = Array.isArray(group.items) ? group.items.length : 0;
    return acc + itemsLen;
  }, 0);

  return (
    <section className="section" id="skills" aria-label="Skills">
      <div className="section__header">
        <h2 className="section__title">
          <span>Technical</span> <span className="gradient-text">Skills</span>
          <span className="section__count">{totalSkillsCount} Skills</span>
        </h2>
        <p className="section__subtitle">
          Core technical competencies, developer tooling, hardware architectures, and domain proficiencies.
        </p>
      </div>

      <div className="skills__grid">
        {skills.map((group) => (
          <div className="skills__card" key={group.category}>
            <div className="skills__header">
              <h3 className="skills__category-title">
                <span style={{ color: "var(--accent-cyan)" }}>
                  {getCategoryIcon(group.category)}
                </span>
                <span>{group.category}</span>
              </h3>
              <span className="skills__cat-count">{group.items.length}</span>
            </div>

            <ul className="skills__list">
              {group.items.map((skill) => {
                const Icon = getIconComponent(skill);
                return (
                  <li className="skills__item" key={skill.name}>
                    {Icon && <Icon className="skills__icon" size={18} />}
                    <span>{skill.name}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Skills;