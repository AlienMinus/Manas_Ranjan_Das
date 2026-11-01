// src/pages/CertificationsPage.jsx
import React, { useState, useMemo } from "react";
import {
  FaAward,
  FaSearch,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimes,
  FaExpand,
  FaCalendarAlt,
  FaIdBadge,
} from "react-icons/fa";
import { usePortfolio } from "../context/usePortfolio";
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";
import "../styles/certifications.css";

// Sample initial fallback certifications if database is empty initially
const INITIAL_SAMPLE_CERTS = [
  {
    _id: "sample_1",
    title: "Google Cloud Certified Associate Cloud Engineer",
    issuer: "Google Cloud",
    issueDate: "2024",
    expiryDate: "2027",
    credentialId: "GCP-ACE-98214",
    credentialUrl: "https://cloud.google.com/certification",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    skills: ["Cloud Architecture", "GCP", "Kubernetes", "DevOps", "IAM"],
    description: "Validated technical capabilities to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.",
    featured: true,
  },
  {
    _id: "sample_2",
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    issueDate: "2024",
    expiryDate: "No Expiration",
    credentialId: "DLAI-DL-55201",
    credentialUrl: "https://www.coursera.org/specializations/deep-learning",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    skills: ["Neural Networks", "TensorFlow", "CNN", "RNN", "Transformers"],
    description: "Comprehensive mastery of foundational deep learning architectures, hyperparameter tuning, and production ML pipelines taught by Andrew Ng.",
    featured: true,
  },
  {
    _id: "sample_3",
    title: "Embedded Systems & IoT Specialization",
    issuer: "Stanford / Coursera",
    issueDate: "2023",
    expiryDate: "No Expiration",
    credentialId: "STF-IOT-33108",
    credentialUrl: "https://www.coursera.org",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    skills: ["Embedded C", "Microcontrollers", "RTOS", "MQTT", "ESP32"],
    description: "Hands-on microarchitectural programming, sensor interfaced networks, and real-time edge processing for smart hardware systems.",
    featured: false,
  },
];

function CertificationsPage() {
  const { certifications, loading, error, refreshData } = usePortfolio();

  const [activeFilter, setActiveFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeModalCert, setActiveModalCert] = useState(null);

  const effectiveCerts = useMemo(() => {
    if (certifications && certifications.length > 0) {
      return certifications;
    }
    return INITIAL_SAMPLE_CERTS;
  }, [certifications]);

  // Extract unique issuers for quick filter chips
  const issuers = useMemo(() => {
    const set = new Set();
    effectiveCerts.forEach((c) => {
      if (c.issuer) set.add(c.issuer.trim());
    });
    return Array.from(set);
  }, [effectiveCerts]);

  // Filter & Search
  const filteredCerts = useMemo(() => {
    return effectiveCerts.filter((cert) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "featured" && cert.featured) ||
        cert.issuer?.toLowerCase() === activeFilter.toLowerCase();

      const term = searchTerm.toLowerCase();
      const matchesSearch =
        !term ||
        cert.title?.toLowerCase().includes(term) ||
        cert.issuer?.toLowerCase().includes(term) ||
        cert.description?.toLowerCase().includes(term) ||
        (cert.skills || []).some((s) => s.toLowerCase().includes(term));

      return matchesFilter && matchesSearch;
    });
  }, [effectiveCerts, activeFilter, searchTerm]);

  if (loading && (!certifications || certifications.length === 0)) {
    return <LoadingSpinner text="FETCHING VERIFIED CERTIFICATIONS..." />;
  }

  if (error && (!certifications || certifications.length === 0)) {
    return <DatabaseErrorState onRetry={refreshData} error={error} />;
  }

  return (
    <div className="page cert-page">
      <section className="section" id="certifications" aria-label="Certifications">
        <div className="section__header">
          <h2 className="section__title">
            <FaAward style={{ color: "var(--accent-neon)", marginRight: "0.5rem" }} />
            <span>Honors &</span> <span className="gradient-text">Certifications</span>
          </h2>
          <p className="section__subtitle">
            Industry credentials, technical accreditations, and engineering honors earned.
          </p>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="cert-controls">
          <div className="cert-filter-group">
            <button
              type="button"
              className={`cert-filter-btn ${activeFilter === "all" ? "cert-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter("all")}
            >
              All ({effectiveCerts.length})
            </button>

            <button
              type="button"
              className={`cert-filter-btn ${activeFilter === "featured" ? "cert-filter-btn--active" : ""}`}
              onClick={() => setActiveFilter("featured")}
            >
              ⭐ Featured
            </button>

            {issuers.map((issuer) => (
              <button
                key={issuer}
                type="button"
                className={`cert-filter-btn ${activeFilter.toLowerCase() === issuer.toLowerCase() ? "cert-filter-btn--active" : ""}`}
                onClick={() => setActiveFilter(issuer)}
              >
                {issuer}
              </button>
            ))}
          </div>

          <div className="cert-search-wrapper">
            <FaSearch className="cert-search-icon" size={13} />
            <input
              type="text"
              className="cert-search-input"
              placeholder="Search by skill, topic, or issuer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Cards Grid */}
        <div className="cert-grid">
          {filteredCerts.map((cert) => {
            const hasPhoto = Boolean(cert.image);

            return (
              <article key={cert._id || cert.title} className="cert-card">
                {/* Photo Media Header */}
                <div
                  className="cert-card__media-box"
                  onClick={() => hasPhoto && setActiveModalCert(cert)}
                  title={hasPhoto ? "Click to view certificate photo" : cert.title}
                >
                  {cert.featured && (
                    <span className="cert-card__featured-tag">
                      <span>⭐ Featured</span>
                    </span>
                  )}

                  {hasPhoto ? (
                    <>
                      <img
                        src={cert.image}
                        alt={`${cert.title} Certificate`}
                        className="cert-card__img"
                        loading="lazy"
                      />
                      <div className="cert-card__media-overlay">
                        <FaExpand size={13} />
                        <span>Preview Certificate</span>
                      </div>
                    </>
                  ) : (
                    <div className="cert-card__placeholder">
                      <FaAward size={48} />
                      <span className="cert-card__placeholder-badge">
                        {cert.issuer || "Verified Credential"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="cert-card__body">
                  <div className="cert-card__issuer-row">
                    <span className="cert-card__issuer">
                      <FaCheckCircle size={12} />
                      <span>{cert.issuer}</span>
                    </span>
                    {cert.issueDate && (
                      <span className="cert-card__date">
                        <FaCalendarAlt size={10} style={{ marginRight: "0.25rem" }} />
                        {cert.issueDate}
                      </span>
                    )}
                  </div>

                  <h3 className="cert-card__title">{cert.title}</h3>

                  {cert.description && (
                    <p className="cert-card__desc">{cert.description}</p>
                  )}

                  {cert.credentialId && (
                    <div className="cert-card__credential">
                      <FaIdBadge size={11} style={{ marginRight: "0.35rem" }} />
                      <span>ID: {cert.credentialId}</span>
                    </div>
                  )}

                  {cert.skills && cert.skills.length > 0 && (
                    <div className="cert-card__skills">
                      {cert.skills.map((skill, sIdx) => (
                        <span key={skill + sIdx} className="cert-skill-chip">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Card Footer / Actions */}
                <div className="cert-card__footer">
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn outline sm"
                      style={{ flex: 1 }}
                    >
                      <FaExternalLinkAlt size={11} />
                      <span>Verify Credential</span>
                    </a>
                  )}

                  {hasPhoto && (
                    <button
                      type="button"
                      className="btn primary sm"
                      onClick={() => setActiveModalCert(cert)}
                      title="View Certificate Image"
                    >
                      <FaExpand size={11} />
                      <span>View Photo</span>
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {filteredCerts.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem 1.5rem", color: "var(--text-muted)" }}>
            <FaAward size={36} style={{ marginBottom: "1rem", opacity: 0.5 }} />
            <p>No certifications matching "{searchTerm}". Try clearing search filters.</p>
          </div>
        )}
      </section>

      {/* Lightbox Preview Modal */}
      {activeModalCert && (
        <div className="cert-lightbox" onClick={() => setActiveModalCert(null)}>
          <div className="cert-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="cert-lightbox__close"
              onClick={() => setActiveModalCert(null)}
              aria-label="Close Preview"
            >
              <FaTimes size={16} />
            </button>

            {activeModalCert.image && (
              <img
                src={activeModalCert.image}
                alt={activeModalCert.title}
                className="cert-lightbox__img"
              />
            )}

            <div className="cert-lightbox__bar">
              <div>
                <h4 style={{ color: "#ffffff", fontSize: "1.1rem", fontWeight: 700 }}>
                  {activeModalCert.title}
                </h4>
                <p style={{ color: "var(--accent-neon)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  Issued by {activeModalCert.issuer} {activeModalCert.issueDate ? `(${activeModalCert.issueDate})` : ""}
                </p>
              </div>

              {activeModalCert.credentialUrl && (
                <a
                  href={activeModalCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn primary sm"
                >
                  <FaExternalLinkAlt size={12} />
                  <span>Verify Online</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CertificationsPage;

