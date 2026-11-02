// src/components/tour/VirtualCursor.jsx
import React, { memo } from "react";

function VirtualCursor({
  x = 0,
  y = 0,
  isVisible = false,
  isClicking = false,
  isHovering = false,
}) {
  if (!isVisible) return null;

  return (
    <div
      className={`virtual-cursor-container ${isClicking ? "virtual-cursor--clicking" : ""} ${
        isHovering ? "virtual-cursor--hovering" : ""
      }`}
      style={{
        transform: `translate3d(${x}px, ${y}px, 0)`,
      }}
      aria-hidden="true"
    >
      {/* Click ripple animation ring */}
      {isClicking && <div className="virtual-cursor__ripple" />}

      {/* Trailing ambient aura */}
      <div className="virtual-cursor__aura" />

      {/* High-Fidelity SVG Cursor Pointer */}
      <svg
        className="virtual-cursor__pointer"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.5 3L11.5 21L14.5 13.5L22 10.5L4.5 3Z"
          fill="var(--accent-neon, #00ff66)"
          stroke="#000000"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <circle cx="6" cy="5" r="1.5" fill="#ffffff" />
      </svg>
    </div>
  );
}

export default memo(VirtualCursor);
