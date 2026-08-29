// src/components/TerminalIntro.jsx
import React, { useState, useEffect } from "react";

const TERMINAL_LOGS = [
  { text: "INITIALIZING MINUS_KERNEL v2.4.0-matrix...", type: "highlight", delay: 350 },
  { text: "Mounting Virtual Architecture & Hardware Profiles... [OK]", type: "dim", delay: 300 },
  { text: "Loading Core Stacks: MERN | AI/ML | Embedded IoT | Robotics... [SUCCESS]", type: "text", delay: 400 },
  { text: "Identifying Developer Profile: MANAS RANJAN DAS (AlienMinus)...", type: "highlight", delay: 350 },
  { text: "Syncing Neural Network & Project Matrix Database...", type: "text", delay: 300 },
  { text: "Decrypting Portfolio Space: [████████████████████] 100%", type: "progress", delay: 450 },
  { text: "SYSTEM READY >> ACCESS GRANTED. Welcome to my Portfolio Universe.", type: "success", delay: 500 },
];

function TerminalIntro({ onComplete }) {
  const [lines, setLines] = useState([]);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    let currentIdx = 0;
    let timeoutId;

    const showNextLine = () => {
      if (currentIdx < TERMINAL_LOGS.length) {
        const item = TERMINAL_LOGS[currentIdx];
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
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 450);
  };

  return (
    <div className={`terminal-intro-overlay ${isClosing ? "terminal-intro-overlay--closing" : ""}`}>
      <div className="terminal-window" role="dialog" aria-label="Terminal Intro Animation">
        {/* Header */}
        <div className="terminal-header">
          <div className="terminal-header__buttons">
            <span className="terminal-btn terminal-btn--red"></span>
            <span className="terminal-btn terminal-btn--yellow"></span>
            <span className="terminal-btn terminal-btn--green"></span>
          </div>

          <div className="terminal-header__title">
            <span>root@alienminus:~# MINUS_OS</span>
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

