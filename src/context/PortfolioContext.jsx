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
  source: "mongodb",
};

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPortfolioData();
      setData(result);
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
