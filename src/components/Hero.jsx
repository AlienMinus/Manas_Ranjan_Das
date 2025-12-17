// src/components/Hero.jsx
import profileImage from "../assets/profile_pic.png";
import React, { useState, useEffect } from "react";
import * as SiIcons from "react-icons/si";
import * as FaIcons from "react-icons/fa";

function getIconComponent(item) {
  const library = item.iconLib === "si" ? SiIcons : FaIcons;
  return library[item.icon] || null;
}

function Hero({ name, roles, tagline, location, socialLinks }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % roles.length);
    }, 2000); // change role every 2 seconds

    return () => clearInterval(interval);
  }, [roles.length]);

  return (
    <section className="hero" id="home">
      <div className="hero__content">
        <p className="hero__hello">Hi, I'm</p>
        <div className="hero__image-container">
          <img src={profileImage} alt="Profile" className="hero__image" />
        </div>
        <h1 className="hero__name" data-text={name}>{name}</h1>
        <h2 className="hero__role fade-text">
          Electrical & Computer Engineer | {roles[index]}
        </h2>
        <p className="hero__location">{location}</p>
        <p className="hero__tagline">{tagline}</p>

        <div className="hero__socials">
          {socialLinks.map((item) => {
            const Icon = getIconComponent(item);
            return (
              <a
                key={item.platform}
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="social__icon"
              >
                {Icon && <Icon size={26} />}
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Hero;
