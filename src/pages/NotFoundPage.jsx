// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";

const NotFoundPage = () => {
  return (
    <div className="not-found-page" role="main">
      <div className="not-found-code">404</div>
      <h1 className="not-found-message">Dimension Not Found</h1>
      <p className="not-found-suggestion">
        The coordinates you entered do not match any known route in this portfolio universe. Let's get you back on track.
      </p>
      <Link to="/" className="btn primary">
        <FaHome />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFoundPage;
