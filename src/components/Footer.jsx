// src/components/Footer.jsx
import React from "react";
import { FaArrowUp } from "react-icons/fa";

function Footer({ name = "Manas Ranjan Das" }) {
  const year = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="footer" aria-label="Footer">
      <div className="footer__container">
        <div className="footer__left">
          <p className="footer__copyright">
            © {year} <strong>{name}</strong>. All rights reserved.
          </p>
          <p className="footer__attribution">
            Designed & Engineered with React 19, Vite & Modular CSS
          </p>
        </div>

        <div className="footer__right">
          <button
            type="button"
            className="footer__back-to-top"
            onClick={scrollToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <FaArrowUp size={12} />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
