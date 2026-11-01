// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { FaMusic } from "react-icons/fa";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TerminalIntro from "./components/TerminalIntro";
import { PortfolioProvider } from "./context/PortfolioContext";
import { usePortfolio } from "./context/usePortfolio";

// Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ExperiencePage from "./pages/ExperiencePage";
import CertificationsPage from "./pages/CertificationsPage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatBot from "./components/ChatBot";

function AppContent() {
  const [showTerminalIntro, setShowTerminalIntro] = useState(true);
  const { isPlaying, toggleMusic } = usePortfolio();

  return (
    <div className="app">
      {/* Intro Terminal Animation on Load */}
      {showTerminalIntro && (
        <TerminalIntro onComplete={() => setShowTerminalIntro(false)} />
      )}

      <Navbar onReplayIntro={() => setShowTerminalIntro(true)} />

      {/* Floating Visualizer Music Player Toggle */}
      <button
        type="button"
        onClick={toggleMusic}
        className={`music-toggle ${isPlaying ? "music-toggle--playing" : ""}`}
        aria-label={isPlaying ? "Mute theme audio" : "Play theme audio"}
        title={isPlaying ? "Mute Theme Audio (Playing)" : "Play Theme Audio"}
      >
        {isPlaying ? (
          <>
            <div className="sound-wave">
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
            </div>
            <span className="music-toggle__label">Audio ON</span>
          </>
        ) : (
          <>
            <FaMusic size={13} className="music-toggle__icon" />
            <span className="music-toggle__label">Theme Audio</span>
          </>
        )}
      </button>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer name="Manas Ranjan Das" onReplayIntro={() => setShowTerminalIntro(true)} />
      <ChatBot />
    </div>
  );
}

function App() {
  return (
    <PortfolioProvider>
      <AppContent />
    </PortfolioProvider>
  );
}

export default App;
