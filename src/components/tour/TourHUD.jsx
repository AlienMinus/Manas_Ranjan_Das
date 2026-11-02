// src/components/tour/TourHUD.jsx
import React, { useState } from "react";
import {
  FaPlay,
  FaPause,
  FaStepForward,
  FaStepBackward,
  FaTimes,
  FaCompass,
  FaMapMarkedAlt,
  FaChevronUp,
  FaChevronDown,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { TOUR_PAGES } from "./tourSteps";

function TourHUD({
  currentStepData,
  currentStepIndex,
  totalSteps,
  isPaused,
  isTtsEnabled = true,
  onToggleTts,
  onTogglePause,
  onNext,
  onPrev,
  onExit,
  onJumpToPage,
}) {
  const [showPageMenu, setShowPageMenu] = useState(false);

  if (!currentStepData) return null;

  const progressPercent = Math.round(((currentStepIndex + 1) / totalSteps) * 100);

  return (
    <aside className="tour-hud" role="dialog" aria-label="Interactive Tour Director">
      {/* Top Progress Track */}
      <div className="tour-hud__progress-track" aria-hidden="true">
        <div
          className="tour-hud__progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main HUD Body */}
      <div className="tour-hud__body">
        {/* Header: Page Badge & Quick Page Menu Button */}
        <div className="tour-hud__header">
          <div className="tour-hud__badge-group">
            <span className="tour-hud__live-dot" />
            <span className="tour-hud__page-badge">
              <FaCompass size={11} />
              <span>{currentStepData.pageTitle || "Tour"}</span>
            </span>
            <span className="tour-hud__step-counter">
              {currentStepIndex + 1} / {totalSteps}
            </span>
          </div>

          <div className="tour-hud__top-actions">
            {/* TTS Voice Narration Toggle Button */}
            <button
              type="button"
              className={`tour-hud__btn-icon ${!isTtsEnabled ? "tour-hud__btn-icon--muted" : ""}`}
              onClick={onToggleTts}
              title={isTtsEnabled ? "Mute Voice Narration (TTS)" : "Unmute Voice Narration (TTS)"}
              aria-label={isTtsEnabled ? "Mute Voice Narration" : "Unmute Voice Narration"}
            >
              {isTtsEnabled ? (
                <FaVolumeUp size={12} style={{ color: "var(--accent-neon)" }} />
              ) : (
                <FaVolumeMute size={12} style={{ color: "#94a3b8" }} />
              )}
            </button>

            <button
              type="button"
              className="tour-hud__btn-icon"
              onClick={() => setShowPageMenu((prev) => !prev)}
              title="Jump directly to any page"
              aria-label="Toggle page navigation menu"
            >
              <FaMapMarkedAlt size={12} />
              <span className="tour-hud__btn-label">Pages</span>
              {showPageMenu ? <FaChevronDown size={10} /> : <FaChevronUp size={10} />}
            </button>

            <button
              type="button"
              className="tour-hud__btn-icon tour-hud__btn-icon--exit"
              onClick={onExit}
              title="Exit Tour (Esc)"
              aria-label="Exit Tour"
            >
              <FaTimes size={13} />
            </button>
          </div>
        </div>

        {/* Page Jump Selector Menu Dropup */}
        {showPageMenu && (
          <div className="tour-hud__page-selector" role="menu">
            <div className="tour-hud__page-selector-title">Jump to Page:</div>
            <div className="tour-hud__page-chips">
              {TOUR_PAGES.map((p) => {
                const isActive = currentStepData.page === p.path;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className={`tour-hud__page-chip ${isActive ? "tour-hud__page-chip--active" : ""}`}
                    onClick={() => {
                      onJumpToPage(p.path);
                      setShowPageMenu(false);
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Content: Title & Narration */}
        <div className="tour-hud__content">
          <h4 className="tour-hud__title">{currentStepData.title}</h4>
          <p className="tour-hud__desc">{currentStepData.description}</p>
        </div>

        {/* Footer: Controls & Shortcuts Hint */}
        <div className="tour-hud__footer">
          <span className="tour-hud__hint">
            <kbd>Space</kbd> Pause • <kbd>Esc</kbd> Exit
          </span>

          <div className="tour-hud__controls">
            <button
              type="button"
              className="tour-hud__control-btn"
              onClick={onPrev}
              disabled={currentStepIndex === 0}
              title="Previous Step (Left Arrow)"
              aria-label="Previous Step"
            >
              <FaStepBackward size={10} />
              <span>Back</span>
            </button>

            <button
              type="button"
              className={`tour-hud__control-btn tour-hud__control-btn--play ${
                isPaused ? "tour-hud__control-btn--paused" : ""
              }`}
              onClick={onTogglePause}
              title={isPaused ? "Resume Tour (Space)" : "Pause Tour (Space)"}
              aria-label={isPaused ? "Resume Tour" : "Pause Tour"}
            >
              {isPaused ? <FaPlay size={10} /> : <FaPause size={10} />}
              <span>{isPaused ? "Resume" : "Pause"}</span>
            </button>

            <button
              type="button"
              className="tour-hud__control-btn tour-hud__control-btn--primary"
              onClick={onNext}
              disabled={currentStepIndex >= totalSteps - 1}
              title="Next Step (Right Arrow)"
              aria-label="Next Step"
            >
              <span>Next</span>
              <FaStepForward size={10} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default TourHUD;
