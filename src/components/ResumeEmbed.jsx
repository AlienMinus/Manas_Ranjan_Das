// src/components/ResumeEmbed.jsx
import React from "react";
import { FaFileDownload, FaExternalLinkAlt, FaFilePdf, FaGraduationCap, FaFlask, FaLaptopCode, FaAward } from "react-icons/fa";

const resumePdf = "/resume.pdf";

function ResumeEmbed({ compact = false, showHeader = true, showHighlights = true }) {
  return (
    <div className="resume-embed-section" aria-label="Embedded Resume Document">
      {showHeader && (
        <div className="section__header" style={compact ? { textAlign: "left", marginBottom: "1.25rem" } : {}}>
          <h2 className="section__title" style={compact ? { justifyContent: "flex-start" } : {}}>
            <span>Official</span> <span className="gradient-text">Resume</span>
          </h2>
          <p className="section__subtitle" style={compact ? { margin: 0, textAlign: "left" } : {}}>
            ATS-friendly verified curriculum vitae & credentials.
          </p>
        </div>
      )}

      {/* Document Viewer Container */}
      <div className="resume-container">
        {/* Top Toolbar */}
        <div className="resume-toolbar">
          <div className="resume-toolbar__info">
            <span className="resume-toolbar__title">
              <FaFilePdf style={{ color: "var(--accent-neon)" }} />
              <span>Manas_Resume.pdf</span>
            </span>
            <span className="badge badge--emerald" style={{ fontSize: "0.65rem", padding: "0.15rem 0.45rem" }}>
              ATS-Verified
            </span>
          </div>

          <div className="resume-toolbar__actions">
            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn outline sm"
              title="Open resume in full window"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}
            >
              <FaExternalLinkAlt size={11} />
              <span>Open</span>
            </a>

            <a
              href={resumePdf}
              download="Manas_Ranjan_Das_Resume.pdf"
              className="btn primary sm"
              title="Download PDF copy"
              style={{ fontSize: "0.75rem", padding: "0.35rem 0.7rem" }}
            >
              <FaFileDownload size={11} />
              <span>PDF</span>
            </a>
          </div>
        </div>

        {/* Embedded Full Page Miniature PDF Viewer */}
        <div className="resume-viewer-wrapper">
          <iframe
            src={`${resumePdf}#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit`}
            title="Manas Ranjan Das Official Resume"
            className="resume-iframe"
            loading="lazy"
          />
        </div>
      </div>

      {/* Highlights Grid (shown when not compact or explicitly enabled) */}
      {showHighlights && !compact && (
        <div className="resume-highlights">
          <div className="resume-highlight-card">
            <div className="resume-highlight-icon">
              <FaGraduationCap />
            </div>
            <h3 className="resume-highlight-title">B.Tech ECE</h3>
            <p className="resume-highlight-desc">
              BPUT (2023 - 2027) in Electrical & Computer Engineering.
            </p>
          </div>

          <div className="resume-highlight-card">
            <div className="resume-highlight-icon">
              <FaAward />
            </div>
            <h3 className="resume-highlight-title">GATE EE 2026</h3>
            <p className="resume-highlight-desc">
              Secured All India Rank (AIR) 4324 among 60,000+ candidates.
            </p>
          </div>

          <div className="resume-highlight-card">
            <div className="resume-highlight-icon">
              <FaFlask />
            </div>
            <h3 className="resume-highlight-title">2+ Research Papers</h3>
            <p className="resume-highlight-desc">
              Published at TIFR-HBCSE & IoT National Conclave.
            </p>
          </div>

          <div className="resume-highlight-card">
            <div className="resume-highlight-icon">
              <FaLaptopCode />
            </div>
            <h3 className="resume-highlight-title">5+ Internships</h3>
            <p className="resume-highlight-desc">
              Accenture UK, AWS, CTTC BBSR, OCAC, and ABIT IoT CoE.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResumeEmbed;
