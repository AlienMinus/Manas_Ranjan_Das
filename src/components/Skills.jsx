import React from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";
import * as BsIcons from "react-icons/bs";
import * as MdIcons from "react-icons/md";
import * as RiIcons from "react-icons/ri";
import * as TbIcons from "react-icons/tb";
import * as GiIcons from "react-icons/gi";


function getIconComponent(skill) {
  if (!skill.icon) return null;

  const lib = skill.iconLib === "ri" ? RiIcons : skill.iconLib === "gi" ? GiIcons : skill.iconLib === "tb" ? TbIcons : skill.iconLib ==="fa" ? FaIcons : skill.iconLib === "bs" ? BsIcons : skill.iconLib === "md" ? MdIcons : SiIcons;
  const Icon = lib[skill.icon];
  return Icon || null; // safe fallback
}

function Skills({ skills }) {
  return (
    <section className="section" id="skills">
      <h2 className="section__title">Skills</h2>
      <div className="skills__grid">
        {skills.map((group) => (
          <div className="card" key={group.category}>
            <h3>{group.category}</h3>
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