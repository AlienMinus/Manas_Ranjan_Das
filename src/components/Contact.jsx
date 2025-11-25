// src/components/Contact.jsx
import React, { useState } from "react";

function Contact({ contact }) {
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
      const res = await fetch("https://manas.up.railway.app/api/contact", {
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
    <section className="section" id="contact">
      <h2 className="section__title">Contact</h2>
      <p className="section__text">{contact.message}</p>

      <div className="contact__info">
        <p>
          Email: <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </p>
        {contact.phone && <p>Phone: {contact.phone}</p>}
      </div>

      <form className="contact__form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="Your Email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          rows="4"
          placeholder="Your Message"
          name="message"
          required
          value={formData.message}
          onChange={handleChange}
        />
        <button type="submit" className="btn primary" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      {status === "success" && (
        <p style={{ marginTop: "0.7rem", color: "#7fdc9e" }}>
          ✅ Message sent successfully!
        </p>
      )}
      {status === "error" && (
        <p style={{ marginTop: "0.7rem", color: "#ff6b6b" }}>
          ❌ Something went wrong. Please try again.
        </p>
      )}
    </section>
  );
}

export default Contact;
