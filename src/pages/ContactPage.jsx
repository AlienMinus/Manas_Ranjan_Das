// src/pages/ContactPage.jsx
import React from "react";
import { usePortfolio } from "../context/usePortfolio";
import Contact from "../components/Contact";
import { LoadingSpinner, DatabaseErrorState } from "../components/LoadingSpinner";

function ContactPage() {
  const { contact, loading, error, refreshData } = usePortfolio();

  if (loading && !contact) {
    return <LoadingSpinner text="FETCHING CONTACT CHANNELS..." />;
  }

  if (error && !contact) {
    return <DatabaseErrorState onRetry={refreshData} error={error} />;
  }

  return (
    <div className="page">
      <Contact contact={contact || {}} />
    </div>
  );
}

export default ContactPage;
