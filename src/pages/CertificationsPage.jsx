// src/pages/CertificationsPage.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  FaAward,
  FaSearch,
  FaExternalLinkAlt,
  FaCheckCircle,
  FaTimes,
  FaExpand,
  FaCalendarAlt,
  FaIdBadge,
  FaChevronLeft,
  FaChevronRight,
  FaLayerGroup,
  FaGraduationCap,
} from "react-icons/fa";
import { usePortfolio } from "../context/usePortfolio";
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";
import "../styles/certifications.css";

// Sample initial fallback certifications if database is empty initially
const INITIAL_SAMPLE_CERTS = [
  {
    _id: "sample_cidc_1",
    title: "Digital – Certified Intelligent Data Center – O&M",
    issuer: "IITM Pravartak / Swayam Plus / Vertiv",
    specialization: "Intelligent Data Center Engineering",
    issueDate: "Sept 2026",
    expiryDate: "No Expiration",
    credentialId: "DIGITAL-CIDC-O&M",
    credentialUrl: "https://pravartak.org.in",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    skills: ["Data Center Operations", "Critical Infrastructure", "Vertiv Systems", "Digital Management"],
    description: "Completed the Digital - Certified Intelligent Data Center - O&M certification course covering operations and maintenance standards.",
    featured: true,
  },
  {
    _id: "sample_cidc_2",
    title: "Critical Infrastructure Power Distribution & Reliability Architecture",
    issuer: "IITM Pravartak / Swayam Plus / Vertiv",
    specialization: "Intelligent Data Center Engineering",
    issueDate: "Aug 2026",
    expiryDate: "No Expiration",
    credentialId: "DIGITAL-CIDC-PWR",
    credentialUrl: "https://pravartak.org.in",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    skills: ["UPS Topologies", "Redundancy Design", "Power Distribution Units", "Substation Automation"],
    description: "Advanced training on redundant power paths, static transfer switches, battery backup topologies, and electrical safety standards.",
    featured: true,
  },
  {
    _id: "sample_cidc_3",
    title: "Thermal Management & Liquid Cooling Systems for High-Density Racks",
    issuer: "IITM Pravartak / Swayam Plus / Vertiv",
    specialization: "Intelligent Data Center Engineering",
    issueDate: "July 2026",
    expiryDate: "No Expiration",
    credentialId: "DIGITAL-CIDC-COOL",
    credentialUrl: "https://pravartak.org.in",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80",
    skills: ["Precision Cooling", "Chilled Water Loops", "Direct-to-Chip Cooling", "CFD Airflow Modeling"],
    description: "Thermal design, hot/cold aisle containment, economizer modes, and high-efficiency liquid cooling for compute clusters.",
    featured: false,
  },
  {
    _id: "sample_gcp",
    title: "Google Cloud Certified Associate Cloud Engineer",
    issuer: "Google Cloud",
    specialization: "",
    issueDate: "2024",
    expiryDate: "2027",
    credentialId: "GCP-ACE-98214",
    credentialUrl: "https://cloud.google.com/certification",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    skills: ["Cloud Architecture", "GCP", "Kubernetes", "DevOps", "IAM"],
    description: "Validated technical capabilities to deploy applications, monitor operations, and manage enterprise solutions on Google Cloud.",
    featured: true,
  },
  {
    _id: "sample_dl",
    title: "Deep Learning Specialization",
    issuer: "DeepLearning.AI",
    specialization: "Deep Learning & Neural Networks",
    issueDate: "2024",
    expiryDate: "No Expiration",
    credentialId: "DLAI-DL-55201",
    credentialUrl: "https://www.coursera.org/specializations/deep-learning",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    skills: ["Neural Networks", "TensorFlow", "CNN", "RNN", "Transformers"],
    description: "Comprehensive mastery of foundational deep learning architectures, hyperparameter tuning, and production ML pipelines taught by Andrew Ng.",
    featured: true,
  },
];

/**
 * Specialization Carousel Card Component
 * Renders multiple certificates under the same specialization in an interactive carousel
 */
function SpecializationCertCard({ group, onOpenModal }) {
  const { specializationName, certs } = group;
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCert = certs[currentIndex] || certs[0];
  const hasPhoto = Boolean(currentCert?.image);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? certs.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === certs.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx, e) => {
    e.stopPropagation();
    setCurrentIndex(idx);
  };

  const handleCardClick = () => {
    if (hasPhoto) {
      onOpenModal({
        ...currentCert,
        groupCerts: certs,
        groupIndex: currentIndex,
      });
    }
  };

  return (
    <article className="cert-card cert-card--specialization">
      {/* Photo Media Box with Carousel Arrows & Dots */}
      <div
        className="cert-card__media-box"
        onClick={handleCardClick}
        title={`Preview ${currentCert.title} (${currentIndex + 1} of ${certs.length})`}
      >
        {/* Specialization Badge */}
        <span className="cert-card__specialization-tag">
          <FaLayerGroup size={11} />
          <span>Specialization • {certs.length} Courses</span>
        </span>

        {/* Featured Ribbon */}
        {currentCert.featured && (
          <span className="cert-card__featured-tag">
            <span>⭐ Featured</span>
          </span>
        )}

        {/* Carousel Prev/Next Buttons */}
        <button
          type="button"
          className="cert-carousel-arrow cert-carousel-arrow--prev"
          onClick={handlePrev}
          aria-label="Previous Certificate"
          title="Previous Certificate"
        >
          <FaChevronLeft size={11} />
        </button>

        <button
          type="button"
          className="cert-carousel-arrow cert-carousel-arrow--next"
          onClick={handleNext}
          aria-label="Next Certificate"
          title="Next Certificate"
        >
          <FaChevronRight size={11} />
        </button>

        {/* Slide Counter */}
        <span className="cert-carousel-counter">
          {currentIndex + 1} / {certs.length}
        </span>

        {/* Dots */}
        <div className="cert-carousel-dots">
          {certs.map((_, i) => (
            <button
              key={i}
              type="button"
              className={`cert-carousel-dot ${i === currentIndex ? "cert-carousel-dot--active" : ""}`}
              onClick={(e) => handleDotClick(i, e)}
              aria-label={`Jump to certificate ${i + 1}`}
            />
          ))}
        </div>

        {hasPhoto ? (
          <>
            <img
              key={currentCert._id || currentIndex}
              src={currentCert.image}
              alt={`${currentCert.title} Certificate`}
              className="cert-card__img cert-card__img--animated"
              loading="lazy"
            />
            <div className="cert-card__media-overlay">
              <FaExpand size={13} />
              <span>Preview Certificate ({currentIndex + 1}/{certs.length})</span>
            </div>
          </>
        ) : (
          <div className="cert-card__placeholder">
            <FaAward size={48} />
            <span className="cert-card__placeholder-badge">
              {currentCert.issuer || "Verified Credential"}
            </span>
          </div>
        )}
      </div>

      {/* Card Content Body */}
      <div className="cert-card__body">
        <div className="cert-card__spec-header">
          <FaGraduationCap size={12} />
          <span>Track: {specializationName}</span>
          {certs.length > 1 && (
            <span className="cert-card__spec-counter">
              ({currentIndex + 1} of {certs.length})
            </span>
          )}
        </div>

        <div className="cert-card__issuer-row">
          <span className="cert-card__issuer">
            <FaCheckCircle size={12} />
            <span>{currentCert.issuer}</span>
          </span>
          {currentCert.issueDate && (
            <span className="cert-card__date">
              <FaCalendarAlt size={10} style={{ marginRight: "0.25rem" }} />
              {currentCert.issueDate}
            </span>
          )}
        </div>

        <h3 className="cert-card__title">{currentCert.title}</h3>

        {currentCert.description && (
          <p className="cert-card__desc">{currentCert.description}</p>
        )}

        {currentCert.credentialId && (
          <div className="cert-card__credential">
            <FaIdBadge size={11} style={{ marginRight: "0.35rem" }} />
            <span>ID: {currentCert.credentialId}</span>
          </div>
        )}

        {currentCert.skills && currentCert.skills.length > 0 && (
          <div className="cert-card__skills">
            {currentCert.skills.map((skill, sIdx) => (
              <span key={skill + sIdx} className="cert-skill-chip">
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Card Actions */}
      <div className="cert-card__footer">
        {currentCert.credentialUrl && (
          <a
            href={currentCert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn outline sm"
          >
            <FaExternalLinkAlt size={11} />
            <span>Verify Credential</span>
          </a>
        )}

        {hasPhoto && (
          <button
            type="button"
            className="btn primary sm"
            onClick={handleCardClick}
            title="View Certificate Image"
          >
            <FaExpand size={11} />
            <span>View Photo</span>
          </button>
        )}
      </div>
    </article>
  );
}

/**
 * Standard Standalone Certificate Card Component
 */
function SingleCertCard({ cert, onOpenModal }) {
  const hasPhoto = Boolean(cert.image);

  return (
    <article className="cert-card">
      <div
        className="cert-card__media-box"
        onClick={() => hasPhoto && onOpenModal(cert)}
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
        {cert.specialization && (
          <div className="cert-card__spec-header">
            <FaGraduationCap size={12} />
            <span>Track: {cert.specialization}</span>
          </div>
        )}

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

      {/* Card Actions */}
      <div className="cert-card__footer">
        {cert.credentialUrl && (
          <a
            href={cert.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn outline sm"
          >
            <FaExternalLinkAlt size={11} />
            <span>Verify Credential</span>
          </a>
        )}

        {hasPhoto && (
          <button
            type="button"
            className="btn primary sm"
            onClick={() => onOpenModal(cert)}
            title="View Certificate Image"
          >
            <FaExpand size={11} />
            <span>View Photo</span>
          </button>
        )}
      </div>
    </article>
  );
}

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
        cert.specialization?.toLowerCase().includes(term) ||
        cert.description?.toLowerCase().includes(term) ||
        (cert.skills || []).some((s) => s.toLowerCase().includes(term));

      return matchesFilter && matchesSearch;
    });
  }, [effectiveCerts, activeFilter, searchTerm]);

  // Group certificates by specialization for the carousel effect
  const groupedDisplayItems = useMemo(() => {
    const groups = [];
    const specializationMap = new Map();

    filteredCerts.forEach((cert) => {
      // Check if this certificate has multiple images in imagesList
      const multiImages =
        Array.isArray(cert.images) && cert.images.filter(Boolean).length > 1
          ? cert.images.filter(Boolean)
          : null;

      const spec = (cert.specialization || "").trim();

      if (multiImages) {
        // This certificate has multiple images attached directly to it!
        const subCerts = multiImages.map((img, idx) => ({
          ...cert,
          _id: `${cert._id || cert.title}_img_${idx}`,
          title: cert.title,
          image: img,
          slideIndex: idx,
          slideTotal: multiImages.length,
        }));

        groups.push({
          type: "specialization",
          id: `multi_${cert._id || cert.title}`,
          specializationName: spec || cert.title,
          certs: subCerts,
        });
      } else if (spec) {
        const lower = spec.toLowerCase();
        if (!specializationMap.has(lower)) {
          const groupObj = {
            type: "specialization",
            id: `spec_${lower}`,
            specializationName: spec,
            certs: [cert],
          };
          specializationMap.set(lower, groupObj);
          groups.push(groupObj);
        } else {
          specializationMap.get(lower).certs.push(cert);
        }
      } else {
        groups.push({
          type: "single",
          id: cert._id || cert.title,
          cert,
        });
      }
    });

    return groups;
  }, [filteredCerts]);

  // Lightbox keyboard controls (ESC, ArrowLeft, ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeModalCert) return;
      if (e.key === "Escape") {
        setActiveModalCert(null);
      } else if (
        e.key === "ArrowLeft" &&
        activeModalCert.groupCerts &&
        activeModalCert.groupCerts.length > 1
      ) {
        const certs = activeModalCert.groupCerts;
        const newIdx = (activeModalCert.groupIndex - 1 + certs.length) % certs.length;
        setActiveModalCert({
          ...certs[newIdx],
          groupCerts: certs,
          groupIndex: newIdx,
        });
      } else if (
        e.key === "ArrowRight" &&
        activeModalCert.groupCerts &&
        activeModalCert.groupCerts.length > 1
      ) {
        const certs = activeModalCert.groupCerts;
        const newIdx = (activeModalCert.groupIndex + 1) % certs.length;
        setActiveModalCert({
          ...certs[newIdx],
          groupCerts: certs,
          groupIndex: newIdx,
        });
      }
    };

    if (activeModalCert) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeModalCert]);

  const handleModalPrev = (e) => {
    e.stopPropagation();
    if (!activeModalCert?.groupCerts) return;
    const certs = activeModalCert.groupCerts;
    const newIdx = (activeModalCert.groupIndex - 1 + certs.length) % certs.length;
    setActiveModalCert({
      ...certs[newIdx],
      groupCerts: certs,
      groupIndex: newIdx,
    });
  };

  const handleModalNext = (e) => {
    e.stopPropagation();
    if (!activeModalCert?.groupCerts) return;
    const certs = activeModalCert.groupCerts;
    const newIdx = (activeModalCert.groupIndex + 1) % certs.length;
    setActiveModalCert({
      ...certs[newIdx],
      groupCerts: certs,
      groupIndex: newIdx,
    });
  };

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

        {/* Certifications Grid */}
        <div className="cert-grid">
          {groupedDisplayItems.map((item) => {
            if (item.type === "specialization" && item.certs.length > 1) {
              return (
                <SpecializationCertCard
                  key={item.id}
                  group={item}
                  onOpenModal={setActiveModalCert}
                />
              );
            }

            const cert = item.type === "specialization" ? item.certs[0] : item.cert;
            return (
              <SingleCertCard
                key={cert._id || cert.title}
                cert={cert}
                onOpenModal={setActiveModalCert}
              />
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

      {/* Lightbox Preview Modal with Specialization Carousel Navigation */}
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

            {/* Lightbox Prev/Next Carousel Arrows */}
            {activeModalCert.groupCerts && activeModalCert.groupCerts.length > 1 && (
              <>
                <button
                  type="button"
                  className="cert-lightbox__arrow cert-lightbox__arrow--prev"
                  onClick={handleModalPrev}
                  aria-label="Previous Certificate in Specialization"
                  title="Previous Certificate"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  className="cert-lightbox__arrow cert-lightbox__arrow--next"
                  onClick={handleModalNext}
                  aria-label="Next Certificate in Specialization"
                  title="Next Certificate"
                >
                  <FaChevronRight size={16} />
                </button>
              </>
            )}

            {activeModalCert.image && (
              <img
                src={activeModalCert.image}
                alt={activeModalCert.title}
                className="cert-lightbox__img"
              />
            )}

            <div className="cert-lightbox__bar">
              <div>
                <h4 style={{ color: "var(--text-primary)", fontSize: "1.1rem", fontWeight: 700 }}>
                  {activeModalCert.title}
                </h4>
                <p style={{ color: "var(--accent-neon)", fontSize: "0.85rem", marginTop: "0.2rem" }}>
                  Issued by {activeModalCert.issuer} {activeModalCert.issueDate ? `(${activeModalCert.issueDate})` : ""}
                  {activeModalCert.groupCerts && (
                    <span style={{ marginLeft: "0.75rem", color: "var(--text-secondary)" }}>
                      • Certificate {activeModalCert.groupIndex + 1} of {activeModalCert.groupCerts.length}
                    </span>
                  )}
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
