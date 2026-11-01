// src/components/ResumeEmbed.jsx
import React from "react";
import { FaFileDownload, FaExternalLinkAlt, FaFilePdf, FaGraduationCap, FaFlask, FaLaptopCode, FaAward } from "react-icons/fa";

const resumePdf = "/resume.pdf";

function ResumeEmbed({ compact = false, showHeader = true, showHighlights = true }) {
  return (
    <div className="resume-embed-section" aria-label="Embedded Resume Document">
      {showHeader && (
        <div className={`section__header ${compact ? "resume-header--compact" : ""}`}>
          <h2 className={`section__title ${compact ? "resume-title--compact" : ""}`}>
            <span>Official</span> <span className="gradient-text">Resume</span>
          </h2>
          <p className={`section__subtitle ${compact ? "resume-subtitle--compact" : ""}`}>
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
              <FaFilePdf className="resume-toolbar__icon" />
              <span>Manas_Resume.pdf</span>
            </span>
            <span className="badge badge--emerald resume-toolbar__badge">
              ATS-Verified
            </span>
          </div>

          <div className="resume-toolbar__actions">
            <a
              href={resumePdf}
              target="_blank"
              rel="noopener noreferrer"
              className="btn outline sm resume-toolbar__btn"
              title="Open resume in full window"
            >
              <FaExternalLinkAlt size={11} />
              <span>Open</span>
            </a>

            <a
              href={resumePdf}
              download="Manas_Ranjan_Das_Resume.pdf"
              className="btn primary sm resume-toolbar__btn"
              title="Download PDF copy"
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
