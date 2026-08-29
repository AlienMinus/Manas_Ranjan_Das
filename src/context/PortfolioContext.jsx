// src/context/PortfolioContext.jsx
import React, { useState, useEffect } from "react";
import { PortfolioContext } from "./portfolioContextDef";
import { getPortfolioData } from "../services/api";

const INITIAL_HERO = {
  name: "Manas Ranjan Das",
  roles: ["Full-Stack Developer", "Researcher", "AI Engineer", "IoT Enthusiast"],
  location: "Cuttack, India",
  heroTagline: "I build intelligent systems that connect hardware, software, and people.",
  socialLinks: [
    { platform: "GitHub", url: "https://github.com/AlienMinus", iconLib: "fa", icon: "FaGithub" },
    { platform: "LinkedIn", url: "https://www.linkedin.com/in/manas-r-das/", iconLib: "fa", icon: "FaLinkedin" },
    { platform: "Instagram", url: "https://www.instagram.com/the_minus_infinity/", iconLib: "fa", icon: "FaInstagram" },
  ],
};

const INITIAL_DATA = {
  hero: INITIAL_HERO,
  about: null,
  skills: [],
  projects: [],
  experience: [],
  contact: {},
  source: "initial",
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getPortfolioData();
      setData(result);
      setError(null);
    } catch (err) {
      console.warn("Error loading live portfolio data from MongoDB:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <PortfolioContext.Provider
      value={{
        ...data,
        loading,
        error,
        refreshData: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
