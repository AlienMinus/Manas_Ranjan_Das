// src/context/PortfolioContext.jsx
import React, { useState, useEffect, useRef } from "react";
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
  const [currentMode, setCurrentMode] = useState(() => {
    return localStorage.getItem("minus_portfolio_mode") || "dark";
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch((err) => {
        console.warn("Theme audio playback was prevented:", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying((prev) => !prev);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPortfolioData();
      setData(result);
      if (result.settings?.theme) {
        const hasUserLocked = sessionStorage.getItem("minus_theme_preview_locked") === "true";
        if (!hasUserLocked) {
          setCurrentTheme(result.settings.theme);
        }
      }
      if (result.settings?.themeMode) {
        const hasModeLocked = sessionStorage.getItem("minus_mode_preview_locked") === "true";
        if (!hasModeLocked) {
          setCurrentMode(result.settings.themeMode);
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

  // Sync data-mode attribute on root HTML & Body elements (dark or light)
  useEffect(() => {
    if (currentMode) {
      document.documentElement.setAttribute("data-mode", currentMode);
      document.body.setAttribute("data-mode", currentMode);
      localStorage.setItem("minus_portfolio_mode", currentMode);
    }
  }, [currentMode]);

  const changeTheme = (newTheme, isPreview = false) => {
    setCurrentTheme(newTheme);
    if (isPreview) {
      sessionStorage.setItem("minus_theme_preview_locked", "true");
    }
  };

  const changeMode = (newMode, isPreview = false) => {
    setCurrentMode(newMode);
    if (isPreview) {
      sessionStorage.setItem("minus_mode_preview_locked", "true");
    }
  };

  const toggleMode = (isPreview = true) => {
    const nextMode = currentMode === "dark" ? "light" : "dark";
    changeMode(nextMode, isPreview);
  };

  return (
    <PortfolioContext.Provider
      value={{
        ...data,
        theme: currentTheme,
        setTheme: changeTheme,
        mode: currentMode,
        setMode: changeMode,
        toggleMode,
        isPlaying,
        toggleMusic,
        loading,
        error,
        refreshData: loadData,
      }}
    >
      <audio ref={audioRef} src="/MinusTheme.mp3" loop preload="auto" />
      {children}
    </PortfolioContext.Provider>
  );
}
