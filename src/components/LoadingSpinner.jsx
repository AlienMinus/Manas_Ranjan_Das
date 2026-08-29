// src/components/LoadingSpinner.jsx
import React from "react";
import { FaDatabase, FaRedo, FaExclamationTriangle } from "react-icons/fa";

export function LoadingSpinner({ text = "FETCHING MONGODB COLLECTIONS..." }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="spinner-wrapper">
        <div className="spinner-ring-outer"></div>
        <div className="spinner-ring-inner"></div>
        <div className="spinner-core-dot"></div>
      </div>
      <div className="loading-title">
        <span>&gt; {text}</span>
      </div>
      <p className="loading-subtitle">
        Connecting to MongoDB database and syncing live portfolio state...
      </p>
    </div>
  );
}

export function DatabaseErrorState({ onRetry, error }) {
  return (
    <div className="loading-container">
      <div className="db-error-card">
        <div className="db-error-icon">
          <FaExclamationTriangle />
        </div>
        <h2 className="db-error-title">Database Connection Error</h2>
        <p className="db-error-message">
          Could not establish connection to the backend MongoDB database. Please ensure your Express backend server is running and `MONGODB_URI` is reachable.
        </p>

        {error && (
          <div className="db-error-hint">
            <strong>Error Diagnostic:</strong> {error.message || String(error)}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
          {onRetry && (
            <button type="button" className="btn primary" onClick={onRetry}>
              <FaRedo size={13} />
              <span>Retry Connection</span>
            </button>
          )}

          <a href="/admin" className="btn outline">
            <FaDatabase size={13} />
            <span>Open Admin Dashboard</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export default LoadingSpinner;

