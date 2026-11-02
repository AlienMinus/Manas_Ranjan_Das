// src/components/tour/TourSpotlight.jsx
import React, { memo } from "react";

function TourSpotlight({ targetRect, isVisible = false }) {
  if (!isVisible || !targetRect) return null;

  const { top, left, width, height } = targetRect;

  // Add slight padding around the highlighted element
  const pad = 6;

  return (
    <div
      className="tour-spotlight"
      style={{
        top: `${Math.max(0, top - pad)}px`,
        left: `${Math.max(0, left - pad)}px`,
        width: `${width + pad * 2}px`,
        height: `${height + pad * 2}px`,
      }}
      aria-hidden="true"
    >
      <div className="tour-spotlight__ring" />
    </div>
  );
}

export default memo(TourSpotlight);
