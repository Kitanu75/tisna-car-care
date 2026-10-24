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
          <div style={{ width: 32 }} />
        )}
      </div>

      <div className="navbar-logo" onClick={onReset} style={{ cursor: 'pointer' }}>
        <div className="navbar-logo-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C2.1 10.9 2 11.2 2 11.5V16c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>
        <div className="navbar-logo-text">
          <h1>TISNA</h1>
          <span>CAR CARE</span>
        </div>
      </div>

      <div className="navbar-right-action">
        {step > 1 ? (
          <button
            className="navbar-icon-btn"
            onClick={onReset}
            aria-label="Close"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <div style={{ width: 32 }} />
        )}
      </div>
    </nav>
  );
}
