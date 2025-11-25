// src/components/Navbar.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import Logo from "../assets/profile_pic.png"; // if you added a logo

function Navbar() {
  const links = [
    { label: "Home", path: "/" },
    { label: "About", path: "/about" },
    { label: "Skills", path: "/skills" },
    { label: "Projects", path: "/projects" },
    { label: "Experience", path: "/experience" },
    { label: "Contact", path: "/contact" },
    {label: "Admin", path: "/admin" }
  ];

  return (
    <nav className="navbar">
      <div className="navbar__logo">
        {/* Click logo to go home */}
        <NavLink to="/">
        <div className="navbar__logo img">  
        <img src={Logo} alt="Logo" className="navbar__logo-img" />
        Manas Ranjan Das
      </div>
        </NavLink>
      </div>

      <ul className="navbar__links">
        {links.map((link) => (
          <li key={link.path}>
            <NavLink
              to={link.path}
              end={link.path === "/"}
              className={({ isActive }) =>
                "navbar__link" + (isActive ? " navbar__link--active" : "")
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Navbar;
