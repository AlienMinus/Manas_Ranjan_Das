// src/pages/ContactPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Contact from "../components/Contact";

function ContactPage() {
  const { contact } = usePortfolio();

  return (
    <div className="page">
      <Contact contact={contact || {}} />
    </div>
  );
}

export default ContactPage;
