// src/pages/ContactPage.jsx
import React from "react";
import contactData from "../data/contact.json";
import Contact from "../components/Contact";

function ContactPage() {
  return (
    <div className="page">
      <Contact contact={contactData} />
    </div>
  );
}

export default ContactPage;
