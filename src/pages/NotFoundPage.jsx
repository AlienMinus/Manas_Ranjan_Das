import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <main className="app">
      <div className="not-found-page">
        <div className="cyberspace">
          <div className="not-found-code" data-text="404">404</div>
        </div>
        <p className="not-found-message">Page Not Found</p>
        <p className="not-found-suggestion">The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.</p>
        <Link to="/" className="btn outline">Go to Homepage</Link>
      </div>
    </main>
  );
};

export default NotFoundPage;


