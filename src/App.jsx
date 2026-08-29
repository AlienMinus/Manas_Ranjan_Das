// src/App.jsx
import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Pages
import Home from "./pages/Home";
import AboutPage from "./pages/AboutPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import ExperiencePage from "./pages/ExperiencePage";
import ContactPage from "./pages/ContactPage";
import AdminPage from "./pages/AdminPage";
import NotFoundPage from "./pages/NotFoundPage";
import ChatBot from "./components/ChatBot";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(() => {
        setIsPlaying(false);
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="app">
      <Navbar />
      <audio ref={audioRef} src="/MinusTheme.mp3" loop />
      
      {/* Visualizer Music Player Toggle */}
      <button
        type="button"
        onClick={toggleMusic}
        className={`music-toggle ${isPlaying ? "music-toggle--playing" : ""}`}
        aria-label={isPlaying ? "Pause theme audio" : "Play theme audio"}
        title={isPlaying ? "Pause Theme Audio" : "Play Theme Audio"}
      >
        {isPlaying ? (
          <>
            <div className="sound-wave">
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
              <span className="sound-bar"></span>
            </div>
            <span>Theme ON</span>
          </>
        ) : (
          <>
            <span>🎵</span>
            <span>Theme Audio</span>
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
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <Footer name="Manas Ranjan Das" />
      <ChatBot />
    </div>
  );
}

export default App;
