// src/components/TerminalIntro.jsx
import React, { useState, useEffect } from "react";
import { usePortfolio } from "../context/usePortfolio";

const THEME_TERMINAL_CONFIG = {
  cyberpunk: {
    header: "root@alienminus:~# MINUS_OS",
    kernel: "INITIALIZING MINUS_KERNEL v2.4.0-matrix...",
  },
  glassmorphism: {
    header: "guest@aeroglass:~# MINUS_OS",
    kernel: "INITIALIZING MINUS_AERO_KERNEL v2.4.0-glass...",
  },
  skeuomorphism: {
    header: "SYS_CONSOLE://RACK-01# MINUS_OS",
    kernel: "INITIALIZING MINUS_FIRMWARE v2.4.0-tactile...",
  },
  pixelatte: {
    header: "PLAYER1@ARCADE:~# MINUS_8BIT",
    kernel: "INITIALIZING 8-BIT MINUS_BOOT v2.4.0-arcade...",
  },
  synthwave: {
    header: "rider@outrun80s:~# MINUS_WAVE",
    kernel: "INITIALIZING OUTRUN_KERNEL v2.4.0-neon80s...",
  },
  "luxury-gold": {
    header: "vip@prestige:~# MINUS_LUXURY",
    kernel: "INITIALIZING LUXURY_SUITE v2.4.0-gold...",
  },
  corporate: {
    header: "deploy@cloud-engine:~# MINUS_PROD",
    kernel: "INITIALIZING ENTERPRISE_CORE v2.4.0-cloud...",
  },
  "retro-bw": {
    header: "tty1@monochrome:~# MINUS_UNIX",
    kernel: "INITIALIZING MONOCHROME_TTY v2.4.0-noir...",
  },
};

const BASE_TERMINAL_LOGS = [
  { text: "Mounting Virtual Architecture & Hardware Profiles... [OK]", type: "dim", delay: 300 },
  { text: "Loading Core Stacks: MERN | AI/ML | Embedded IoT | Robotics... [SUCCESS]", type: "text", delay: 400 },
  { text: "Identifying Developer Profile: MANAS RANJAN DAS (AlienMinus)...", type: "highlight", delay: 350 },
  { text: "Syncing Neural Network & Project Matrix Database...", type: "text", delay: 300 },
  { text: "Decrypting Portfolio Space: [████████████████████] 100%", type: "progress", delay: 450 },
  { text: "SYSTEM READY >> ACCESS GRANTED. Welcome to my Portfolio Universe.", type: "success", delay: 500 },
];

function TerminalIntro({ onComplete }) {
  const { theme = "cyberpunk", mode = "dark" } = usePortfolio();
  const themeConfig = THEME_TERMINAL_CONFIG[theme] || THEME_TERMINAL_CONFIG.cyberpunk;

  const [lines, setLines] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const fullLogs = [
      { text: themeConfig.kernel, type: "highlight", delay: 350 },
      ...BASE_TERMINAL_LOGS,
    ];

    let currentIdx = 0;
    let timeoutId;

    const showNextLine = () => {
      if (currentIdx < fullLogs.length) {
        const item = fullLogs[currentIdx];
        setLines((prev) => [...prev, item]);
        currentIdx++;
        timeoutId = setTimeout(showNextLine, item.delay);
      } else {
        // All lines displayed, wait briefly and complete
        timeoutId = setTimeout(() => {
          handleClose();
        }, 700);
      }
    };

    timeoutId = setTimeout(showNextLine, 200);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeConfig.kernel]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 450);
  };

  return (
    <div
      className={`terminal-intro-overlay ${isClosing ? "terminal-intro-overlay--closing" : ""}`}
      data-theme={theme}
      data-mode={mode}
    >
      <div
        className="terminal-window"
        role="dialog"
        aria-label="Terminal Intro Animation"
        data-theme={theme}
        data-mode={mode}
      >
        {/* Header */}
        <div className="terminal-header">
          <div className="terminal-header__buttons">
            <span className="terminal-btn terminal-btn--red"></span>
            <span className="terminal-btn terminal-btn--yellow"></span>
            <span className="terminal-btn terminal-btn--green"></span>
          </div>

          <div className="terminal-header__title">
            <span>{themeConfig.header}</span>
          </div>

          <button
            type="button"
            className="terminal-skip-btn"
            onClick={handleClose}
            title="Skip Intro Animation (ESC)"
          >
            SKIP [ESC] ⚡
          </button>
        </div>

        {/* Body */}
        <div className="terminal-body">
          {lines.map((line, index) => (
            <div className="terminal-line" key={index}>
              <span className="terminal-prompt">&gt;</span>
              <span className={`terminal-text terminal-text--${line.type}`}>
                {line.text}
              </span>
            </div>
          ))}
          <div className="terminal-line">
            <span className="terminal-prompt">&gt;</span>
            <span className="terminal-cursor"></span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TerminalIntro;
