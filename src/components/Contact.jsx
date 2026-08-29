// src/components/Contact.jsx
import React, { useState } from "react";
import { FaEnvelope, FaPhoneAlt, FaBlog, FaMapMarkerAlt, FaPaperPlane, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

function Contact({ contact = {} }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState(null); // "success" | "error" | null
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("https://manas-ranjan-das.onrender.com/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to send message");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section" id="contact" aria-label="Contact Me">
      <div className="section__header">
        <h2 className="section__title">
          <span>Get in</span> <span className="gradient-text">Touch</span>
        </h2>
        <p className="section__subtitle">
          {contact.message || "Have a project in mind, research collaboration, or question? Feel free to reach out!"}
        </p>
      </div>

      <div className="contact__container">
        {/* Left Column: Contact Channels */}
        <div className="contact__info-col">
          <div className="contact__info-header">
            <h3>Let's build something extraordinary.</h3>
            <p>
              I am open to full-time opportunities, freelance engineering, research collaborations, and open-source projects.
            </p>
          </div>

          <div className="contact__cards-list">
            {contact.email && (
              <a
                href={`mailto:${contact.email}`}
                className="contact-channel-card"
                title="Send an email"
              >
                <div className="contact-channel-icon">
                  <FaEnvelope />
                </div>
                <div>
                  <div className="contact-channel-label">Email Address</div>
                  <div className="contact-channel-value">{contact.email}</div>
                </div>
              </a>
            )}

            {contact.phone && (
              <a
                href={`tel:${contact.phone}`}
                className="contact-channel-card"
                title="Call phone number"
              >
                <div className="contact-channel-icon">
                  <FaPhoneAlt />
                </div>
                <div>
                  <div className="contact-channel-label">Phone / WhatsApp</div>
                  <div className="contact-channel-value">{contact.phone}</div>
                </div>
              </a>
            )}

            {contact.blog && (
              <a
                href="https://spectacularminus.blogspot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-channel-card"
                title="Visit Blog"
              >
                <div className="contact-channel-icon">
                  <FaBlog />
                </div>
                <div>
                  <div className="contact-channel-label">Technical Blog</div>
                  <div className="contact-channel-value">Spectacular Minus</div>
                </div>
              </a>
            )}

            <div className="contact-channel-card">
              <div className="contact-channel-icon">
                <FaMapMarkerAlt />
              </div>
              <div>
                <div className="contact-channel-label">Location</div>
                <div className="contact-channel-value">Cuttack, Odisha, India</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="contact__form-col">
          <form className="contact__form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="contact-name" className="form-label">
                Your Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                className="form-input"
                placeholder="e.g. John Doe"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-email" className="form-label">
                Your Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                className="form-input"
                placeholder="e.g. john@example.com"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-message" className="form-label">
                Your Message
              </label>
              <textarea
                id="contact-message"
                className="form-textarea"
                rows="4"
                placeholder="Tell me about your project, idea, or inquiry..."
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="btn primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              <FaPaperPlane size={14} />
              <span>{loading ? "Transmitting Message..." : "Send Message"}</span>
            </button>

            {status === "success" && (
              <div className="form-alert form-alert--success">
                <FaCheckCircle />
                <span>Message sent successfully! I will reply as soon as possible.</span>
              </div>
            )}

            {status === "error" && (
              <div className="form-alert form-alert--error">
                <FaExclamationCircle />
                <span>Unable to send message right now. Please email directly!</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}

export default Contact;
