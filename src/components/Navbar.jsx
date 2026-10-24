import React from 'react';

export default function Navbar({ step = 1, onBack, onReset }) {
  return (
    <nav className="navbar">
      <div className="navbar-left-action">
        {step > 1 ? (
          <button
            className="navbar-icon-btn"
            onClick={onBack}
            aria-label="Back"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        ) : (
          <div className="navbar-pill-tag">
            <span className="navbar-pill-dot" />
            <span>Doorstep Care</span>
          </div>
        )}
      </div>

      <div className="navbar-brand-logo" onClick={onReset} style={{ cursor: 'pointer' }} title="Tisna Car Home">
        <img
          src="/assets/tisna-car-logo.png"
          alt="Tisna Car"
          className="navbar-brand-img"
        />
      </div>

      <div className="navbar-right-action">
        {step > 1 ? (
          <button
            className="navbar-icon-btn"
            onClick={onReset}
            aria-label="Close"
            title="Return to Home"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <a
            href="https://wa.me/917042062926?text=Hi%20Tisna%20Car%2C%20I%20have%20a%20query"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-help-pill"
            title="Chat on WhatsApp"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
            </svg>
            <span>Help</span>
          </a>
        )}
      </div>
    </nav>
  );
}
