// src/context/PortfolioContext.jsx
import React, { useState, useEffect } from "react";
import { PortfolioContext } from "./portfolioContextDef";
import { getPortfolioData } from "../services/api";

const INITIAL_STATE = {
  hero: null,
  about: null,
  skills: [],
  projects: [],
  experience: [],
  contact: null,
  certifications: [],
  settings: { theme: "cyberpunk" },
  source: "mongodb",
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem("minus_portfolio_theme") || "cyberpunk";
  });

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPortfolioData();
      setData(result);
      if (result.settings?.theme) {
        // If the user hasn't specifically locked a local preview, align with admin's master theme
        const hasUserLocked = sessionStorage.getItem("minus_theme_preview_locked") === "true";
        if (!hasUserLocked) {
          setCurrentTheme(result.settings.theme);
        }
      }
    } catch (err) {
      console.error("Error fetching live MongoDB data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Sync data-theme attribute on root HTML & Body elements
  useEffect(() => {
    if (currentTheme) {
      document.documentElement.setAttribute("data-theme", currentTheme);
      document.body.setAttribute("data-theme", currentTheme);
      localStorage.setItem("minus_portfolio_theme", currentTheme);
    }
  }, [currentTheme]);

  const changeTheme = (newTheme, isPreview = false) => {
    setCurrentTheme(newTheme);
    if (isPreview) {
      sessionStorage.setItem("minus_theme_preview_locked", "true");
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        ...data,
        theme: currentTheme,
        setTheme: changeTheme,
        loading,
        error,
        refreshData: loadData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}
